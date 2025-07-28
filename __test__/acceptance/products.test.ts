import { getUserProducts, createProduct, ProductErrors } from '@/lib/services/productService';
import { prisma } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('Product Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProducts', () => {
    it('should return products and pagination info', async () => {
      const mockProducts = [{ id: 1, name: 'Prod', price: 10, userId: 1 }];
      const mockCount = 1;

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
      (prisma.product.count as jest.Mock).mockResolvedValue(mockCount);

      const result = await getUserProducts(1, 1, 10);

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(prisma.product.count).toHaveBeenCalled();
      expect(result).toEqual({
        products: mockProducts,
        total: mockCount,
        page: 1,
        totalPages: 1,
      });
    });

    it('should throw INTERNAL_ERROR on db failure', async () => {
      (prisma.product.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(getUserProducts(1, 1, 10)).rejects.toEqual(ProductErrors.INTERNAL_ERROR);
    });
  });

  describe('createProduct', () => {
    it('should create and return new product', async () => {
      const newProduct = { id: 5, name: 'NewProd', price: 50, userId: 2 };
      (prisma.product.create as jest.Mock).mockResolvedValue(newProduct);

      const data = { name: 'NewProd', price: 50 };

      const result = await createProduct(data, 2);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          name: 'NewProd',
          description: undefined,
          price: 50,
          userId: 2,
        },
      });
      expect(result).toEqual(newProduct);
    });

    it('should throw MISSING_FIELDS if name or price missing', async () => {
      await expect(createProduct({ name: '', price: 10 }, 1)).rejects.toEqual(ProductErrors.MISSING_FIELDS);
    });

    it('should throw INVALID_PRICE if price is <= 0', async () => {
      await expect(createProduct({ name: 'Name', price: 0 }, 1)).rejects.toEqual(ProductErrors.INVALID_PRICE);
      await expect(createProduct({ name: 'Name', price: -5 }, 1)).rejects.toEqual(ProductErrors.INVALID_PRICE);
    });

    it('should throw INTERNAL_ERROR on db failure', async () => {
      (prisma.product.create as jest.Mock).mockRejectedValue(new Error('DB error'));
      await expect(createProduct({ name: 'Name', price: 10 }, 1)).rejects.toEqual(ProductErrors.INTERNAL_ERROR);
    });
  });
});

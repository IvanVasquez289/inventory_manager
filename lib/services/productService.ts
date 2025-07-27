import { prisma } from "@/lib/db";
import { ProductInput } from "@/types";
import { Prisma } from "@prisma/client";

export const ProductErrors = {
  MISSING_FIELDS: { message: "Name and price are required", status: 400 },
  INVALID_PRICE: { message: "Price must be greater than 0", status: 400 },
  PRODUCT_NOT_FOUND: { message: "Product not found", status: 404 },
  INTERNAL_ERROR: { message: "Internal Server Error", status: 500 },
};

export async function getUserProducts(
  userId: number,
  page: number,
  limit: number,
  search = "",
  minPrice?: number,
  maxPrice?: number,
  startDate?: string,
  endDate?: string
) {
  const skip = (page - 1) * limit;
  try {
    const where: Prisma.ProductWhereInput = {
      userId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          }
        : {}),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          }
        : {}),
    };
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch {
    throw ProductErrors.INTERNAL_ERROR;
  }
}

export async function createProduct(data: ProductInput, userId: number) {
  const { name, description, price } = data;

  if (!name || name.trim() === "" || price == null) {
    throw ProductErrors.MISSING_FIELDS;
  }

  if (price <= 0) {
    throw ProductErrors.INVALID_PRICE;
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        userId,
      },
    });
    return newProduct;
  } catch {
    throw ProductErrors.INTERNAL_ERROR;
  }
}

export async function getProductById(id: number) {
  if (isNaN(id)) {
    throw ProductErrors.MISSING_FIELDS;
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw ProductErrors.PRODUCT_NOT_FOUND;

  return product;
}

export async function updateProduct(id: number, data: ProductInput) {
  if (isNaN(id)) {
    throw ProductErrors.MISSING_FIELDS;
  }

  const { name, description, price } = data;

  if (!name || name.trim() === "" || price == null) {
    throw ProductErrors.MISSING_FIELDS;
  }

  if (price <= 0) {
    throw ProductErrors.INVALID_PRICE;
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw ProductErrors.PRODUCT_NOT_FOUND;
  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price,
      },
    });
    return updated;
  } catch {
    throw ProductErrors.INTERNAL_ERROR;
  }
}

export async function deleteProduct(id: number) {
  if (isNaN(id)) {
    throw ProductErrors.MISSING_FIELDS;
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw ProductErrors.PRODUCT_NOT_FOUND;
  try {
    const deleted = await prisma.product.delete({ where: { id } });
    return deleted;
  } catch {
    throw ProductErrors.INTERNAL_ERROR;
  }
}

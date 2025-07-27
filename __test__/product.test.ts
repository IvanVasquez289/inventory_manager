// __tests__/productIdRoute.test.ts
import { GET, PUT, DELETE } from '../app/api/products/[productId]/route';
import { authenticate } from '../middlewares/auth';
import { getProductById, updateProduct, deleteProduct } from '../lib/services/productService';
import { handleApiError } from '../lib/handleApiError';
import { NextRequest } from 'next/server';

jest.mock('../middlewares/auth');
jest.mock('../lib/services/productService');
jest.mock('../lib/handleApiError');

describe('Product API route', () => {
  const params = Promise.resolve({ productId: '1' });
  const reqGet = new NextRequest('http://localhost/api/products/1', { method: 'GET' });
  const reqPut = new NextRequest('http://localhost/api/products/1', {
    method: 'PUT',
    body: JSON.stringify({ name: 'Product', price: 100 }),
    headers: { 'content-type': 'application/json' },
  });
  const reqDelete = new NextRequest('http://localhost/api/products/1', { method: 'DELETE' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET returns product when authenticated', async () => {
    (authenticate as jest.Mock).mockResolvedValue({ valid: true, user: { id: 1 } });
    (getProductById as jest.Mock).mockResolvedValue({ id: 1, name: 'Product' });

    const res = await GET(reqGet, { params });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveProperty('id', 1);
  });

  it('PUT updates product when authenticated', async () => {
    (authenticate as jest.Mock).mockResolvedValue({ valid: true, user: { id: 1 } });
    (updateProduct as jest.Mock).mockResolvedValue({ id: 1, name: 'Product', price: 100 });

    const res = await PUT(reqPut, { params });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveProperty('name', 'Product');
  });

  it('DELETE deletes product when authenticated', async () => {
    (authenticate as jest.Mock).mockResolvedValue({ valid: true, user: { id: 1 } });
    (deleteProduct as jest.Mock).mockResolvedValue({});

    const res = await DELETE(reqDelete, { params });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ message: 'Product deleted' });
  });
});

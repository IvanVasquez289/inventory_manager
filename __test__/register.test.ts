// __tests__/register.test.ts
import { POST } from '../app/api/auth/register/route';
import { registerUser } from '../lib/services/authService';
import { NextRequest } from 'next/server';

jest.mock('../lib/services/authService');

describe('POST /api/register', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should respond with a token when registration is successful', async () => {
    (registerUser as jest.Mock).mockResolvedValue('token123');

    const mockRequest = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'John Doe', email: 'john@example.com', password: '123456' }),
      headers: { 'content-type': 'application/json' },
    });

    const res = await POST(mockRequest);
    const json = await res.json();

    expect(registerUser).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    expect(res.status).toBe(201);
    expect(json.token).toBe('token123');
  });

  it('should handle error when registerUser throws an exception', async () => {
    const error = { message: 'Email is already in use', status: 409 };
    (registerUser as jest.Mock).mockRejectedValue(error);

    const mockRequest = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Jane Doe', email: 'jane@example.com', password: 'password' }),
      headers: { 'content-type': 'application/json' },
    });

    const res = await POST(mockRequest);
    const json = await res.json();

    expect(registerUser).toHaveBeenCalled();
    expect(res.status).toBe(error.status);
    expect(json.error).toBe(error.message);
  });
});

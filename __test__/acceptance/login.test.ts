// __tests__/login.test.ts
import { POST } from '@/app/api/auth/login/route';
import { loginUser } from '@/lib/services/authService';
import { NextRequest } from 'next/server';

jest.mock('@/lib/services/authService');

describe('POST /api/login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should respond with a token when login is successful', async () => {
    // Mock loginUser to simulate successful response
    (loginUser as jest.Mock).mockResolvedValue('token123');

    // Mock request with JSON body
    const mockRequest = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: '123456' }),
      headers: { 'content-type': 'application/json' },
    });

    const res = await POST(mockRequest);
    const json = await res.json();

    expect(loginUser).toHaveBeenCalledWith({ email: 'test@test.com', password: '123456' });
    expect(res.status).toBe(200);
    expect(json.token).toBe('token123');
  });

  it('should handle error when loginUser throws an exception', async () => {
    const error = { message: 'Invalid credentials', status: 401 };
    (loginUser as jest.Mock).mockRejectedValue(error);

    const mockRequest = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'wrong@test.com', password: 'badpass' }),
      headers: { 'content-type': 'application/json' },
    });

    const res = await POST(mockRequest);
    const json = await res.json();

    expect(loginUser).toHaveBeenCalled();
    expect(res.status).toBe(error.status);
    expect(json.error).toBe(error.message);
  });
});

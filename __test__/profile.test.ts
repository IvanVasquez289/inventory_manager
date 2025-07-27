// __test__/profile.test.ts
import { GET, PUT } from '../app/api/profile/route';
import { authenticate } from '../middlewares/auth';
import { updateUserProfile } from '../lib/services/profileService';
import { prisma } from '../lib/db';
import { NextRequest } from 'next/server';

jest.mock('../middlewares/auth');
jest.mock('../lib/services/profileService');
jest.mock('../lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Profile API', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (authenticate as jest.Mock).mockResolvedValue({ valid: true, user: { id: 1 } });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Name',
      email: 'email@example.com',
      password: 'hashedpassword',
    });
  });

  describe('GET', () => {
    it('returns user profile without password', async () => {
      const req = new NextRequest('http://localhost/api/profile', { method: 'GET' });

      const res = await GET(req);
      const json = await res.json();

      expect(authenticate).toHaveBeenCalledWith(req);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toBe(200);
      expect(json).toEqual({
        id: 1,
        name: 'Name',
        email: 'email@example.com',
      });
      expect(json.password).toBeUndefined();
    });

    it('returns 404 if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest('http://localhost/api/profile', { method: 'GET' });

      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error).toBe('User not found');
    });
  });

  describe('PUT', () => {
    it('updates user profile', async () => {
      (updateUserProfile as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Updated Name',
        email: 'updated@example.com',
      });

      const body = JSON.stringify({ name: 'Updated Name', email: 'updated@example.com' });
      const req = new NextRequest('http://localhost/api/profile', {
        method: 'PUT',
        body,
        headers: { 'content-type': 'application/json' },
      });

      const res = await PUT(req);
      const json = await res.json();

      expect(authenticate).toHaveBeenCalledWith(req);
      expect(updateUserProfile).toHaveBeenCalledWith(1, { name: 'Updated Name', email: 'updated@example.com' });
      expect(res.status).toBe(200);
      expect(json.name).toBe('Updated Name');
    });

    it('returns auth response if not authenticated', async () => {
      (authenticate as jest.Mock).mockResolvedValue({ valid: false, response: new Response(null, { status: 401 }) });
      const req = new NextRequest('http://localhost/api/profile', { method: 'PUT' });

      const res = await PUT(req);

      expect(res.status).toBe(401);
    });

    it('returns error response if updateUserProfile throws', async () => {
      const error = { message: 'Invalid email format', status: 400 };
      (updateUserProfile as jest.Mock).mockRejectedValue(error);

      const body = JSON.stringify({ name: 'Name', email: 'bad-email' });
      const req = new NextRequest('http://localhost/api/profile', {
        method: 'PUT',
        body,
        headers: { 'content-type': 'application/json' },
      });

      const res = await PUT(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Invalid email format');
    });
  });
});

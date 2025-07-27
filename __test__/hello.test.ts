// __tests__/hello.test.ts
import { GET } from '../app/api/hello/route'

describe('GET /api/hello', () => {
  it('debe responder con mensaje', async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe('Hola mundo');
  });
});

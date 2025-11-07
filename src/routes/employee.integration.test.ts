import request from 'supertest';
import app from '../app';
import { clearEmployees } from '../models/employee';

describe('employee routes (integration)', () => {
  beforeEach(() => {
    clearEmployees();
  });

  it('should create an employee and list it', async () => {
    const payload = {
      name: 'Integration User',
      pixKey: 'int@pix.com',
      wallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    };

    const postRes = await request(app)
      .post('/employees')
      .send(payload)
      .set('Accept', 'application/json');

    expect(postRes.status).toBe(201);
    expect(postRes.body).toHaveProperty('id');
    expect(postRes.body.name).toBe(payload.name);

    const getRes = await request(app).get('/employees');
    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body)).toBe(true);
    const found = getRes.body.find((e: any) => e.id === postRes.body.id);
    expect(found).toBeDefined();
    expect(found.pixKey).toBe(payload.pixKey);
  });
});

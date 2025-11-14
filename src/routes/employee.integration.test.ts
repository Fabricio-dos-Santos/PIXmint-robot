import request from 'supertest';
import app from '../app';
import { clearEmployees } from '../models/employee';

describe('employee routes (integration)', () => {
  beforeEach(async () => {
    await clearEmployees();
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

  describe('search functionality', () => {
    beforeEach(async () => {
      await clearEmployees();
      
      // Create test employees with different data
      await request(app).post('/employees').send({
        name: 'Maria Silva',
        pixKey: 'maria@example.com',
        wallet: '0x1234567890abcdef1234567890abcdef12345678',
        network: 'sepolia',
      });

      await request(app).post('/employees').send({
        name: 'João Santos',
        pixKey: '11987654321',
        wallet: '0xabcdef1234567890abcdef1234567890abcdef12',
        network: 'ethereum',
      });

      await request(app).post('/employees').send({
        name: 'Ana Costa',
        pixKey: '12345678901',
        wallet: '0xfedcba0987654321fedcba0987654321fedcba09',
        network: 'polygon',
      });
    });

    it('should search by name (case-insensitive)', async () => {
      const res = await request(app).get('/employees?search=maria');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Maria Silva');
    });

    it('should search by name with different case', async () => {
      const res = await request(app).get('/employees?search=JOÃO');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('João Santos');
    });

    it('should search by partial name', async () => {
      const res = await request(app).get('/employees?search=silva');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Maria Silva');
    });

    it('should search by pixKey (email)', async () => {
      const res = await request(app).get('/employees?search=maria@example');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].pixKey).toBe('maria@example.com');
    });

    it('should search by pixKey (phone)', async () => {
      const res = await request(app).get('/employees?search=11987654321');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('João Santos');
    });

    it('should search by wallet address', async () => {
      const res = await request(app).get('/employees?search=0x1234567890');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Maria Silva');
    });

    it('should search by network', async () => {
      const res = await request(app).get('/employees?search=polygon');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].network).toBe('polygon');
    });

    it('should return all employees when no search param', async () => {
      const res = await request(app).get('/employees');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
    });

    it('should return empty array when no match found', async () => {
      const res = await request(app).get('/employees?search=nonexistent');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it('should handle special characters in search', async () => {
      const res = await request(app).get('/employees?search=@example');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].pixKey).toContain('@example');
    });
  });
});

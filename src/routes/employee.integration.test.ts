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
      network: 'sepolia',
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

  describe('update employee (PUT)', () => {
    it('should update an employee with valid data', async () => {
      // Create employee
      const createRes = await request(app).post('/employees').send({
        name: 'Carlos Pereira',
        pixKey: 'carlos@example.com',
        wallet: '0x1234567890abcdef1234567890abcdef12345678',
        network: 'sepolia',
      });
      expect(createRes.status).toBe(201);
      const employeeId = createRes.body.id;

      // Update employee
      const updateRes = await request(app)
        .put(`/employees/${employeeId}`)
        .send({
          name: 'Carlos Alberto Pereira',
          network: 'ethereum',
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.name).toBe('Carlos Alberto Pereira');
      expect(updateRes.body.network).toBe('ethereum');
      expect(updateRes.body.pixKey).toBe('carlos@example.com'); // unchanged
      expect(updateRes.body.wallet).toBe('0x1234567890abcdef1234567890abcdef12345678'); // unchanged
    });

    it('should reject update with invalid name (no surname)', async () => {
      // Create employee
      const createRes = await request(app).post('/employees').send({
        name: 'Diana Costa',
        pixKey: 'diana@example.com',
        wallet: '0xabcdef1234567890abcdef1234567890abcdef12',
        network: 'polygon',
      });
      expect(createRes.status).toBe(201);
      const employeeId = createRes.body.id;

      // Try to update with invalid name (single name, no surname)
      const updateRes = await request(app)
        .put(`/employees/${employeeId}`)
        .send({
          name: 'Diana', // Invalid: no surname
        });

      expect(updateRes.status).toBe(400);
      expect(updateRes.body).toHaveProperty('errors');
      expect(updateRes.body.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('first name and last name')
        ])
      );
    });

    it('should reject update with invalid wallet format', async () => {
      // Create employee
      const createRes = await request(app).post('/employees').send({
        name: 'Eduardo Silva',
        pixKey: 'eduardo@example.com',
        wallet: '0x1234567890abcdef1234567890abcdef12345678',
        network: 'arbitrum',
      });
      expect(createRes.status).toBe(201);
      const employeeId = createRes.body.id;

      // Try to update with invalid wallet
      const updateRes = await request(app)
        .put(`/employees/${employeeId}`)
        .send({
          wallet: '0xinvalid', // Invalid: wrong length
        });

      expect(updateRes.status).toBe(400);
      expect(updateRes.body).toHaveProperty('errors');
      expect(updateRes.body.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('valid EVM address')
        ])
      );
    });

    it('should reject update with invalid network', async () => {
      // Create employee
      const createRes = await request(app).post('/employees').send({
        name: 'Fernanda Lima',
        pixKey: 'fernanda@example.com',
        wallet: '0xfedcba0987654321fedcba0987654321fedcba09',
        network: 'base',
      });
      expect(createRes.status).toBe(201);
      const employeeId = createRes.body.id;

      // Try to update with invalid network
      const updateRes = await request(app)
        .put(`/employees/${employeeId}`)
        .send({
          network: 'invalid-network',
        });

      expect(updateRes.status).toBe(400);
      expect(updateRes.body).toHaveProperty('errors');
      expect(updateRes.body.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('must be one of')
        ])
      );
    });

    it('should reject update with name ending in preposition', async () => {
      // Create employee
      const createRes = await request(app).post('/employees').send({
        name: 'Gabriel Santos',
        pixKey: 'gabriel@example.com',
        wallet: '0x1111111111111111111111111111111111111111',
        network: 'bnb',
      });
      expect(createRes.status).toBe(201);
      const employeeId = createRes.body.id;

      // Try to update with name ending in preposition
      const updateRes = await request(app)
        .put(`/employees/${employeeId}`)
        .send({
          name: 'Gabriel dos', // Invalid: ends with preposition
        });

      expect(updateRes.status).toBe(400);
      expect(updateRes.body).toHaveProperty('errors');
      expect(updateRes.body.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('preposition or article')
        ])
      );
    });

    it('should return 404 when updating non-existent employee', async () => {
      const updateRes = await request(app)
        .put('/employees/non-existent-id')
        .send({
          name: 'Helena Rocha',
        });

      expect(updateRes.status).toBe(404);
    });
  });
});

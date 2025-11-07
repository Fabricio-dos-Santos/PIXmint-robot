import { employeeModel } from './employee';

describe('employeeModel', () => {
  it('creates and retrieves employees', () => {
    const input = {
      name: 'Test User',
      pixKey: 'test@pix.com',
      wallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    };

    const created = employeeModel.create(input);
    expect(created).toHaveProperty('id');
    expect(created.name).toBe('Test User');

    const all = employeeModel.findAll();
    const found = all.find(e => e.id === created.id);
    expect(found).toBeDefined();
    expect(found!.pixKey).toBe('test@pix.com');
  });
});

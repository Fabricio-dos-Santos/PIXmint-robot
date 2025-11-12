import { employeeModel, clearEmployees } from './employee';

describe('employeeModel', () => {
  beforeEach(async () => {
    await clearEmployees();
  });

  it('creates and retrieves employees', async () => {
    // seed mass data: create 6 employees with different networks
    const seed = [
      { name: 'User A', pixKey: 'a@pix', wallet: '0x' + '1'.repeat(40), network: 'sepolia' },
      { name: 'User B', pixKey: 'b@pix', wallet: '0x' + '2'.repeat(40), network: 'ethereum' },
      { name: 'User C', pixKey: 'c@pix', wallet: '0x' + '3'.repeat(40), network: 'polygon' },
      { name: 'User D', pixKey: 'd@pix', wallet: '0x' + '4'.repeat(40), network: 'arbitrum' },
      { name: 'User E', pixKey: 'e@pix', wallet: '0x' + '5'.repeat(40), network: 'bnb' },
      { name: 'User F', pixKey: 'f@pix', wallet: '0x' + '6'.repeat(40), network: 'base' },
    ];

    const created = [] as any[];
    for (const s of seed) {
      // create should accept network (or fallback to default)
      const c = await employeeModel.create(s as any);
      created.push(c);
      expect(c).toHaveProperty('id');
    }

    const all = await employeeModel.findAll();
    // ensure seeded employees are present
    for (const c of created) {
      const found = all.find(e => e.id === c.id);
      expect(found).toBeDefined();
      expect(found!.network).toBe(c.network);
    }
  });
});

import employeeService from './employeeService';

jest.mock('../models/employee', () => ({
  employeeModel: {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const { employeeModel } = require('../models/employee');

describe('employeeService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createEmployee - success', async () => {
    const input = { name: 'Alice Silva', pixKey: 'pix123', wallet: '0x' + 'a'.repeat(40), network: 'sepolia' as const };
  const created = { id: '1', ...input, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    employeeModel.create.mockResolvedValue(created);

    const res = await employeeService.createEmployee(input);

    expect(employeeModel.create).toHaveBeenCalledWith(input);
    expect(res).toEqual(created);
  });

  test('createEmployee - validation error', async () => {
    const bad = { name: 'Al', pixKey: '', wallet: 'bad', network: 'sepolia' };
    await expect(employeeService.createEmployee(bad as any)).rejects.toMatchObject({ name: 'ValidationError', errors: expect.any(Array) });
    expect(employeeModel.create).not.toHaveBeenCalled();
  });

  test('getEmployee - not found throws NotFoundError', async () => {
    employeeModel.findById.mockResolvedValue(null);
    await expect(employeeService.getEmployee('missing')).rejects.toMatchObject({ name: 'NotFoundError' });
  });

  test('listEmployees - returns array', async () => {
  const list = [{ id: '1', name: 'Ana Silva', pixKey: 'p', wallet: '0x' + 'b'.repeat(40), network: 'sepolia', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
    employeeModel.findAll.mockResolvedValue(list);
    const res = await employeeService.listEmployees();
    expect(res).toEqual(list);
  });

  test('updateEmployee - success', async () => {
  const existing = { id: '1', name: 'Alice Silva', pixKey: 'pix123', wallet: '0x' + 'b'.repeat(40), network: 'sepolia', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    employeeModel.findById.mockResolvedValue(existing);
  const updated = { ...existing, name: 'Bob Santos' };
  employeeModel.update.mockResolvedValue(updated);

  const res = await employeeService.updateEmployee('1', { name: 'Bob Santos' });

  expect(employeeModel.update).toHaveBeenCalledWith('1', { name: 'Bob Santos' });
    expect(res).toEqual(updated);
  });

  test('deleteEmployee - not found throws', async () => {
    employeeModel.delete.mockResolvedValue(false);
    await expect(employeeService.deleteEmployee('1')).rejects.toMatchObject({ name: 'NotFoundError' });
  });

  test('deleteEmployee - success resolves', async () => {
    employeeModel.delete.mockResolvedValue(true);
    await expect(employeeService.deleteEmployee('1')).resolves.toBeUndefined();
  });
});

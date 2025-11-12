import { CreateEmployeeInput, Employee } from '../types/employee';
import { employeeModel } from '../models/employee';
import { validateEmployeeInput } from '../utils/validation';
import { NotFoundError } from '../errors/NotFoundError';
import { ValidationError } from '../errors/ValidationError';

export const employeeService = {
  async createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    const errors = validateEmployeeInput(input);
    if (errors.length) {
      throw new ValidationError(errors);
    }
    return employeeModel.create(input);
  },

  async listEmployees(): Promise<Employee[]> {
    return employeeModel.findAll();
  },

  async getEmployee(id: string): Promise<Employee> {
    const emp = await employeeModel.findById(id);
    if (!emp) throw new NotFoundError('employee not found');
    return emp;
  },

  async updateEmployee(id: string, input: Partial<CreateEmployeeInput>): Promise<Employee> {
    const existing = await employeeModel.findById(id);
    if (!existing) throw new NotFoundError('employee not found');

    const merged = {
      name: input.name ?? existing.name,
      pixKey: input.pixKey ?? existing.pixKey,
      wallet: input.wallet ?? existing.wallet,
      network: input.network ?? existing.network,
    } as CreateEmployeeInput;

    const errors = validateEmployeeInput(merged);
    if (errors.length) throw new ValidationError(errors);

    return employeeModel.update(id, input);
  },

  async deleteEmployee(id: string): Promise<void> {
    const deleted = await employeeModel.delete(id);
    if (!deleted) throw new NotFoundError('employee not found');
  },
};

export default employeeService;

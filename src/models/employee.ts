import crypto from 'crypto';
import { Employee, CreateEmployeeInput } from '../types/employee';
import { config } from '../config/env';
import { nowISO } from '../utils/date';

// Armazenamento em memória (substituir por DB em produção)
const employees = new Map<string, Employee>();

export const employeeModel = {
  create: (input: CreateEmployeeInput): Employee => {
    const employee: Employee = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      pixKey: input.pixKey.trim(),
      wallet: input.wallet.trim(),
      network: input.network || config.defaultNetwork,
      createdAt: nowISO(),
    };
    employees.set(employee.id, employee);
    return employee;
  },

  findAll: (): Employee[] => {
    return Array.from(employees.values());
  },

  findById: (id: string): Employee | undefined => {
    return employees.get(id);
  },

  update: (id: string, input: Partial<CreateEmployeeInput>): Employee => {
    const employee = employees.get(id)!;
    if (input.name) employee.name = input.name.trim();
    if (input.pixKey) employee.pixKey = input.pixKey.trim();
    if (input.wallet) employee.wallet = input.wallet.trim();
    if (input.network) employee.network = input.network;
    employee.updatedAt = nowISO();
    employees.set(id, employee);
    return employee;
  },

  delete: (id: string): boolean => {
    return employees.delete(id);
  },
};
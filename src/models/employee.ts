import { Employee, CreateEmployeeInput } from '../types/employee';
import prisma from '../db/prismaClient';

function toDTO(record: any): Employee {
  return {
    id: record.id,
    name: record.name,
    pixKey: record.pixKey,
    wallet: record.wallet,
    network: record.network,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt ? record.updatedAt.toISOString() : undefined,
  };
}

export const employeeModel = {
  create: async (input: CreateEmployeeInput): Promise<Employee> => {
    const record = await prisma.employee.create({
      data: {
        name: input.name.trim(),
        pixKey: input.pixKey.trim(),
        wallet: input.wallet.trim(),
        network: input.network,
      },
    });
    return toDTO(record);
  },

  findAll: async (search?: string): Promise<Employee[]> => {
    if (!search) {
      const list = await prisma.employee.findMany({ orderBy: { createdAt: 'desc' } });
      return list.map(toDTO);
    }

    const searchPattern = `%${search.toLowerCase()}%`;
    const searchExact = search.toLowerCase();

    const results = await prisma.$queryRaw`
      SELECT * FROM Employee 
      WHERE 
        LOWER(name) LIKE ${searchPattern} OR
        LOWER(pixKey) LIKE ${searchPattern} OR
        LOWER(wallet) LIKE ${searchPattern} OR
        LOWER(network) = ${searchExact}
      ORDER BY createdAt DESC
    `;

    return (results as any[]).map(toDTO);
  },

  findById: async (id: string): Promise<Employee | null> => {
    const rec = await prisma.employee.findUnique({ where: { id } });
    return rec ? toDTO(rec) : null;
  },

  update: async (id: string, input: Partial<CreateEmployeeInput>): Promise<Employee> => {
    const data: any = {};
    if (input.name) data.name = input.name.trim();
    if (input.pixKey) data.pixKey = input.pixKey.trim();
    if (input.wallet) data.wallet = input.wallet.trim();
    if (input.network) data.network = input.network;
    data.updatedAt = new Date();

    const rec = await prisma.employee.update({ where: { id }, data });
    return toDTO(rec);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.employee.delete({ where: { id } });
      return true;
    } catch (e) {
      return false;
    }
  },
};

export async function clearEmployees(): Promise<void> {
  await prisma.employee.deleteMany();
}

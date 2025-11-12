import { Request, Response, NextFunction } from 'express';
import { CreateEmployeeInput } from '../types/employee';
import employeeService from '../services/employeeService';

export const employeeController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: CreateEmployeeInput = req.body || {};
      const employee = await employeeService.createEmployee(input);
      res.status(201).json(employee);
    } catch (err) {
      next(err);
    }
  },

  list: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employees = await employeeService.listEmployees();
      res.json(employees);
    } catch (err) {
      next(err);
    }
  },

  get: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employee = await employeeService.getEmployee(req.params.id);
      res.json(employee);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: Partial<CreateEmployeeInput> = req.body || {};
      const updated = await employeeService.updateEmployee(req.params.id, input);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await employeeService.deleteEmployee(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
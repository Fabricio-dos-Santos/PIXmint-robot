import { Request, Response } from 'express';
import { Employee, CreateEmployeeInput } from '../types/employee';
import { employeeModel } from '../models/employee';
import { validateEmployeeInput } from '../utils/validation';

export const employeeController = {
  create: (req: Request, res: Response): void => {
    const input: CreateEmployeeInput = req.body || {};
    const errors = validateEmployeeInput(input);
    if (errors.length) {
      res.status(400).json({ errors });
      return;
    }

    const employee = employeeModel.create(input);
    res.status(201).json(employee);
  },

  list: (_req: Request, res: Response): void => {
    const employees = employeeModel.findAll();
    res.json(employees);
  },

  get: (req: Request, res: Response): void => {
    const employee = employeeModel.findById(req.params.id);
    if (!employee) {
      res.status(404).json({ error: 'employee not found' });
      return;
    }
    res.json(employee);
  },

  update: (req: Request, res: Response): void => {
    const existing = employeeModel.findById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'employee not found' });
      return;
    }

    const input: Partial<CreateEmployeeInput> = req.body || {};
    const errors = validateEmployeeInput({
      name: input.name ?? existing.name,
      pixKey: input.pixKey ?? existing.pixKey,
      wallet: input.wallet ?? existing.wallet,
    });
    if (errors.length) {
      res.status(400).json({ errors });
      return;
    }

    const updated = employeeModel.update(req.params.id, input);
    res.json(updated);
  },

  delete: (req: Request, res: Response): void => {
    const existed = employeeModel.delete(req.params.id);
    if (!existed) {
      res.status(404).json({ error: 'employee not found' });
      return;
    }
    res.status(204).send();
  },
};
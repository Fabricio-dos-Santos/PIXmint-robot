import { Router } from 'express';
import { employeeController } from '../controllers/employee';

const router = Router();

// Create employee
router.post('/', employeeController.create);

// List employees
router.get('/', employeeController.list);

// Get employee by id
router.get('/:id', employeeController.get);

// Update employee
router.put('/:id', employeeController.update);

// Delete employee
router.delete('/:id', employeeController.delete);

export const employeeRoutes = router;
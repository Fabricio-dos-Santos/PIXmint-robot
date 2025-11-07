import express, { Application } from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import swaggerUi from 'swagger-ui-express';
import { Employee, CreateEmployeeInput, ValidationError, HealthCheck } from './types/employee';
import { corsMiddleware, errorHandler } from './middleware';
import openapi from './openapi.json';

// Carrega variáveis de ambiente
dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(corsMiddleware);

const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Armazenamento em memória (substituir por DB em produção)
const employees = new Map<string, Employee>();

// Helpers
function nowISO(): string {
  return new Date().toISOString();
}

function isValidWallet(addr: string): boolean {
  return typeof addr === 'string' && /^0x[a-fA-F0-9]{40}$/.test(addr);
}

function validateEmployeeInput({ name, pixKey, wallet }: CreateEmployeeInput): string[] {
  const errors: string[] = [];
  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    errors.push('name must be at least 3 characters');
  }
  if (!pixKey || typeof pixKey !== 'string' || pixKey.trim().length === 0) {
    errors.push('pixKey is required');
  }
  if (!wallet || !isValidWallet(wallet)) {
    errors.push('wallet must be a valid EVM address (0x...)');
  }
  return errors;
}

// Serve Swagger UI at /docs (mount before routes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

// Create employee
app.post('/employees', (req, res) => {
  const input: CreateEmployeeInput = req.body || {};
  const errors = validateEmployeeInput(input);
  if (errors.length) {
    return res.status(400).json({ errors } as ValidationError);
  }

  const employee: Employee = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    pixKey: input.pixKey.trim(),
    wallet: input.wallet.trim(),
    network: input.network || 'sepolia',
    createdAt: nowISO(),
  };
  employees.set(employee.id, employee);
  return res.status(201).json(employee);
});

// List employees
app.get('/employees', (req, res) => {
  const list: Employee[] = Array.from(employees.values());
  res.json(list);
});

// Get employee by id
app.get('/employees/:id', (req, res) => {
  const emp = employees.get(req.params.id);
  if (!emp) {
    return res.status(404).json({ error: 'employee not found' });
  }
  res.json(emp);
});

// Update employee
app.put('/employees/:id', (req, res) => {
  const emp = employees.get(req.params.id);
  if (!emp) {
    return res.status(404).json({ error: 'employee not found' });
  }

  const input: Partial<CreateEmployeeInput> = req.body || {};
  const errors = validateEmployeeInput({
    name: input.name ?? emp.name,
    pixKey: input.pixKey ?? emp.pixKey,
    wallet: input.wallet ?? emp.wallet,
  });
  if (errors.length) {
    return res.status(400).json({ errors } as ValidationError);
  }

  if (input.name) emp.name = input.name.trim();
  if (input.pixKey) emp.pixKey = input.pixKey.trim();
  if (input.wallet) emp.wallet = input.wallet.trim();
  if (input.network) emp.network = input.network;
  emp.updatedAt = nowISO();
  employees.set(emp.id, emp);
  res.json(emp);
});

// Delete employee
app.delete('/employees/:id', (req, res) => {
  const existed = employees.delete(req.params.id);
  if (!existed) {
    return res.status(404).json({ error: 'employee not found' });
  }
  res.status(204).send();
});

// Health check
app.get('/health', (req, res) => {
  const health: HealthCheck = {
    status: 'ok',
    uptime: process.uptime(),
  };
  res.json(health);
});

// Error handler
app.use(errorHandler);

// Start server with graceful shutdown
const server = app.listen(PORT, () => {
  console.log(`Employee server listening on port ${PORT}`);
});

function shutdown(): void {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export { app, server };

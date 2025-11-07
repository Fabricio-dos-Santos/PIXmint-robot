const express = require('express');
const dotenv = require('dotenv');
const crypto = require('crypto');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');

// Carrega variáveis de ambiente de .env (se existir)
dotenv.config();

const app = express();
app.use(express.json());

// Simple CORS for local development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const PORT = process.env.PORT || 3000;

// Armazenamento em memória (substituir por DB em produção)
const employees = new Map();

/**
 * Employee shape:
 * {
 *   id: string,
 *   name: string,
 *   pixKey: string,
 *   wallet: string,
 *   network: string,
 *   createdAt: ISOString,
 *   updatedAt?: ISOString
 * }
 */

// Helpers
function nowISO() {
  return new Date().toISOString();
}

function isValidWallet(addr) {
  return typeof addr === 'string' && /^0x[a-fA-F0-9]{40}$/.test(addr);
}

function validateEmployeeInput({ name, pixKey, wallet }) {
  const errors = [];
  if (!name || typeof name !== 'string' || name.trim().length < 3) errors.push('name must be at least 3 characters');
  if (!pixKey || typeof pixKey !== 'string' || pixKey.trim().length === 0) errors.push('pixKey is required');
  if (!wallet || !isValidWallet(wallet)) errors.push('wallet must be a valid EVM address (0x...)');
  return errors;
}

// Create employee
app.post('/employees', (req, res) => {
  const { name, pixKey, wallet, network } = req.body || {};
  const errors = validateEmployeeInput({ name, pixKey, wallet });
  if (errors.length) return res.status(400).json({ errors });

  const id = crypto.randomUUID();
  const emp = {
    id,
    name: name.trim(),
    pixKey: pixKey.trim(),
    wallet: wallet.trim(),
    network: network || 'sepolia',
    createdAt: nowISO(),
  };
  employees.set(id, emp);
  return res.status(201).json(emp);
});

// List employees
app.get('/employees', (req, res) => {
  const list = Array.from(employees.values());
  res.json(list);
});

// Get employee by id
app.get('/employees/:id', (req, res) => {
  const emp = employees.get(req.params.id);
  if (!emp) return res.status(404).json({ error: 'employee not found' });
  res.json(emp);
});

// Update employee
app.put('/employees/:id', (req, res) => {
  const emp = employees.get(req.params.id);
  if (!emp) return res.status(404).json({ error: 'employee not found' });

  const { name, pixKey, wallet, network } = req.body || {};
  // partial update allowed but validate when fields present
  const errors = validateEmployeeInput({ name: name ?? emp.name, pixKey: pixKey ?? emp.pixKey, wallet: wallet ?? emp.wallet });
  if (errors.length) return res.status(400).json({ errors });

  if (name) emp.name = name.trim();
  if (pixKey) emp.pixKey = pixKey.trim();
  if (wallet) emp.wallet = wallet.trim();
  if (network) emp.network = network;
  emp.updatedAt = nowISO();
  employees.set(emp.id, emp);
  res.json(emp);
});

// Delete employee
app.delete('/employees/:id', (req, res) => {
  const existed = employees.delete(req.params.id);
  if (!existed) return res.status(404).json({ error: 'employee not found' });
  res.status(204).send();
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Serve Swagger UI at /docs (mount before starting)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal_server_error' });
});

// Start server with graceful shutdown
const server = app.listen(PORT, () => {
  console.log(`Employee server listening on port ${PORT}`);
});

function shutdown() {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = { app, server };

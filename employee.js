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

const PORT = process.env.PORT || 3000;

// Armazenamento em memória (substituir por DB em produção)
const employees = new Map();

// Helpers
function nowISO() {
  return new Date().toISOString();
}

// Create employee
app.post('/employees', (req, res) => {
  const { name, pixKey, wallet, network } = req.body || {};
  if (!name || !pixKey || !wallet) {
    return res.status(400).json({ error: 'name, pixKey and wallet are required' });
  }

  const id = crypto.randomUUID();
  const emp = {
    id,
    name,
    pixKey,
    wallet,
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
  if (name) emp.name = name;
  if (pixKey) emp.pixKey = pixKey;
  if (wallet) emp.wallet = wallet;
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

// Serve Swagger UI at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

// Start server
app.listen(PORT, () => {
  console.log(`Employee server listening on port ${PORT}`);
});

module.exports = app;

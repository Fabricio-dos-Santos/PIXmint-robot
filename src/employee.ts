import express from 'express';
import { config } from './config/env';
import { swaggerConfig } from './config/swagger';
import { corsMiddleware, errorHandler } from './middleware';
import { employeeRoutes } from './routes/employee';

const app = express();

// Middlewares
app.use(express.json());
app.use(corsMiddleware);

// Swagger docs (mount before routes)
app.use('/docs', swaggerConfig.serve, swaggerConfig.setup);

// Routes
app.use('/employees', employeeRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
  });
});

// Error handler
app.use(errorHandler);

// Start server with graceful shutdown
const server = app.listen(config.port, () => {
  console.log(`Employee server listening on port ${config.port}`);
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
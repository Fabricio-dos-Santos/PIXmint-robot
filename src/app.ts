import express from 'express';
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

export default app;

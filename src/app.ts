import express from 'express';
import { swaggerConfig } from './config/swagger';
import { corsMiddleware, errorHandler, rateLimitMiddleware } from './middleware';
import { employeeRoutes } from './routes/employee';

const app = express();

// Middlewares
app.use(express.json());
app.use(corsMiddleware);
// apply rate limiting globally (adjust position and scope if you want per-route rules)
app.use(rateLimitMiddleware);

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

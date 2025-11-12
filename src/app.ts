import express from 'express';
import { swaggerConfig } from './config/swagger';
import { corsMiddleware, errorHandler, rateLimitMiddleware } from './middleware';
import helmet from 'helmet';
import { employeeRoutes } from './routes/employee';

const app = express();

// Middlewares
app.use(express.json());
app.use(corsMiddleware);
// apply rate limiting globally (adjust position and scope if you want per-route rules)
app.use(rateLimitMiddleware);

// Security headers (Helmet)
// Disable contentSecurityPolicy initially to avoid breaking front-end assets; enable later with a proper CSP.
app.use(helmet({ contentSecurityPolicy: false }));

// Apply HSTS only in production
if (process.env.NODE_ENV === 'production') {
  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    helmet.hsts({
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    })
  );
}

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

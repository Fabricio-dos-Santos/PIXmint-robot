import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/NotFoundError';
import { ValidationError } from '../errors/ValidationError';

export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Prefer structured logging in real projects; keep console for now
  console.error(err);

  if ((err as any).statusCode && typeof (err as any).statusCode === 'number') {
    const status = (err as any).statusCode as number;
    if (err instanceof ValidationError) {
      res.status(status).json({ error: err.message, errors: err.errors });
      return;
    }
    res.status(status).json({ error: err.message });
    return;
  }

  if (err instanceof SyntaxError) {
    res.status(400).json({ error: 'invalid_json' });
    return;
  }

  res.status(500).json({ error: 'internal_server_error' });
};

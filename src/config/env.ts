import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  defaultNetwork: process.env.DEFAULT_NETWORK || 'sepolia',
  // Rate limit defaults: window in milliseconds and max requests per window
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || String(60 * 1000), 10), // 1 minute
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '60', 10), // 60 requests per window
} as const;
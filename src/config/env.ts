import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  defaultNetwork: process.env.DEFAULT_NETWORK || 'sepolia',
} as const;
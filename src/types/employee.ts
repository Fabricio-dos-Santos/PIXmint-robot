export type Network =
  | 'sepolia'
  | 'ethereum'
  | 'polygon'
  | 'arbitrum'
  | 'bnb'
  | 'base';

export interface Employee {
  id: string;
  name: string;
  pixKey: string;
  wallet: string;
  network: Network;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeInput {
  name: string;
  pixKey: string;
  wallet: string;
  network?: Network;
}

export interface ValidationError {
  errors: string[];
}

export interface HealthCheck {
  status: string;
  uptime: number;
}

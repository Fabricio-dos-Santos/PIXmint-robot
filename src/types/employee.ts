export interface Employee {
  id: string;
  name: string;
  pixKey: string;
  wallet: string;
  network: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeInput {
  name: string;
  pixKey: string;
  wallet: string;
  network: string;
}

export interface ValidationError {
  errors: string[];
}

export interface HealthCheck {
  status: string;
  uptime: number;
}

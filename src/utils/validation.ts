import { CreateEmployeeInput } from '../types/employee';

export function isValidWallet(addr: string): boolean {
  return typeof addr === 'string' && /^0x[a-fA-F0-9]{40}$/.test(addr);
}

export function validateEmployeeInput({ name, pixKey, wallet }: CreateEmployeeInput): string[] {
  const errors: string[] = [];
  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    errors.push('name must be at least 3 characters');
  }
  if (!pixKey || typeof pixKey !== 'string' || pixKey.trim().length === 0) {
    errors.push('pixKey is required');
  }
  if (!wallet || !isValidWallet(wallet)) {
    errors.push('wallet must be a valid EVM address (0x...)');
  }
  return errors;
}
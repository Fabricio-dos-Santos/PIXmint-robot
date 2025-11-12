import { CreateEmployeeInput, Network } from '../types/employee';

const allowedNetworks: Network[] = [
  'sepolia',
  'ethereum',
  'polygon',
  'arbitrum',
  'bnb',
  'base',
];

export function isValidWallet(addr: string): boolean {
  return typeof addr === 'string' && /^0x[a-fA-F0-9]{40}$/.test(addr);
}

export function validateEmployeeInput({ name, pixKey, wallet, network }: CreateEmployeeInput): string[] {
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
  // network: optional incoming, but if present must be one of allowed networks and not empty
  if (typeof network !== 'undefined') {
    if (!network || typeof network !== 'string' || !allowedNetworks.includes(network as Network)) {
      errors.push(`network must be one of: ${allowedNetworks.join(', ')}`);
    }
  }
  return errors;
}
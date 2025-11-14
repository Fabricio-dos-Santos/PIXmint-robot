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

// Validate name with business rules
function validateName(name: string): string[] {
  const errors: string[] = [];
  
  if (!name || typeof name !== 'string') {
    errors.push('name is required and must be a string');
    return errors;
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 3) {
    errors.push('name must be at least 3 characters');
  }
  
  if (trimmed.length > 100) {
    errors.push('name must be at most 100 characters');
  }
  
  // Only letters (including accents), spaces, hyphens and apostrophes
  if (!/^[a-záàâãéèêíïóôõöúçñA-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s'-]+$/i.test(trimmed)) {
    errors.push('name must contain only letters, spaces, hyphens and apostrophes');
  }
  
  // No consecutive spaces
  if (/\s{2,}/.test(trimmed)) {
    errors.push('name cannot contain consecutive spaces');
  }
  
  // Must have at least first name and last name
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 2) {
    errors.push('name must include first name and last name');
  }
  
  // Articles and prepositions allowed with 2 characters
  const smallWords = ['de', 'da', 'do', 'dos', 'das', 'e'];
  
  // Each word must have at least 3 characters (except articles/prepositions)
  const hasInvalidWord = words.some(word => {
    const lowerWord = word.toLowerCase();
    return word.length < 3 && !smallWords.includes(lowerWord);
  });
  
  if (hasInvalidWord) {
    errors.push('each name part must be at least 3 characters (except prepositions: de, da, do, dos, das, e)');
  }
  
  // Last word cannot be a common preposition or article
  if (words.length > 0) {
    const lastWord = words[words.length - 1].toLowerCase();
    const invalidLastWords = ['dos', 'das', 'de', 'da', 'do', 'e'];
    if (invalidLastWords.includes(lastWord)) {
      errors.push('name cannot end with preposition or article (dos, das, de, da, do, e)');
    }
  }
  
  return errors;
}

// Validate PIX key format
function validatePixKey(pixKey: string): string[] {
  const errors: string[] = [];
  
  if (!pixKey || typeof pixKey !== 'string' || pixKey.trim().length === 0) {
    errors.push('pixKey is required');
  }
  
  // Backend accepts any non-empty string as pixKey
  // Detailed format validation can be added here if needed
  
  return errors;
}

export function validateEmployeeInput({ name, pixKey, wallet, network }: CreateEmployeeInput): string[] {
  const errors: string[] = [];
  
  // Validate name with business rules
  errors.push(...validateName(name));
  
  // Validate pixKey
  errors.push(...validatePixKey(pixKey));
  
  // Validate wallet
  if (!wallet || !isValidWallet(wallet)) {
    errors.push('wallet must be a valid EVM address (0x followed by 40 hexadecimal characters)');
  }
  
  // Validate network
  if (!network || typeof network !== 'string' || !allowedNetworks.includes(network as Network)) {
    errors.push(`network is required and must be one of: ${allowedNetworks.join(', ')}`);
  }
  
  return errors;
}
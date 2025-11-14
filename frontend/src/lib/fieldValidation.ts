// Field-level validation utilities for UX feedback only
// Backend remains the authoritative source for business rules

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Basic name validation (UX only - backend validates business rules)
export const validateName = (value: string): ValidationResult => {
  const trimmed = value.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Nome é obrigatório' };
  }
  
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Nome deve ter pelo menos 3 caracteres' };
  }
  
  return { isValid: true };
};

// Basic PIX key validation (UX only - backend validates format)
export const validatePixKey = (value: string): ValidationResult => {
  const trimmed = value.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Chave PIX é obrigatória' };
  }
  
  return { isValid: true };
};

// Basic wallet validation (UX only - backend validates EVM format)
export const validateWallet = (value: string): ValidationResult => {
  const trimmed = value.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Wallet é obrigatória' };
  }
  
  // Basic format check for UX feedback
  if (!trimmed.startsWith('0x')) {
    return { 
      isValid: false, 
      error: 'Wallet deve começar com 0x' 
    };
  }
  
  if (trimmed.length !== 42) {
    return { 
      isValid: false, 
      error: 'Wallet deve ter 42 caracteres (0x + 40 caracteres)' 
    };
  }
  
  return { isValid: true };
};

// Basic network validation (UX only)
export const validateNetwork = (value: string): ValidationResult => {
  if (!value) {
    return { isValid: false, error: 'Network é obrigatória' };
  }
  
  return { isValid: true };
};

// Field-level validation utilities with specific error messages
import { onlyDigits } from './inputMasks';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Validate name field
export const validateName = (value: string): ValidationResult => {
  const trimmed = value.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Nome é obrigatório' };
  }
  
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Nome deve ter pelo menos 3 caracteres' };
  }
  
  if (trimmed.length > 100) {
    return { isValid: false, error: 'Nome deve ter no máximo 100 caracteres' };
  }
  
  // Only letters (including accents), spaces, hyphens and apostrophes
  if (!/^[a-záàâãéèêíïóôõöúçñA-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s'-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Nome deve conter apenas letras, espaços, hífens e apóstrofos' };
  }
  
  // No consecutive spaces
  if (/\s{2,}/.test(trimmed)) {
    return { isValid: false, error: 'Nome não pode conter espaços consecutivos' };
  }
  
  // Must have at least first name and last name
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 2) {
    return { isValid: false, error: 'Informe nome e sobrenome' };
  }
  
  // Articles and prepositions allowed with 2 characters
  const smallWords = ['de', 'da', 'do', 'dos', 'das', 'e'];
  
  // Each word must have at least 3 characters (except articles/prepositions)
  const hasInvalidWord = words.some(word => {
    const lowerWord = word.toLowerCase();
    return word.length < 3 && !smallWords.includes(lowerWord);
  });
  
  if (hasInvalidWord) {
    return { isValid: false, error: 'Cada nome deve ter pelo menos 3 caracteres' };
  }
  
  // Last word cannot be a common preposition or article
  const lastWord = words[words.length - 1].toLowerCase();
  const invalidLastWords = ['dos', 'das', 'de', 'da', 'do', 'e'];
  if (invalidLastWords.includes(lastWord)) {
    return { isValid: false, error: 'Nome incompleto. Informe o sobrenome completo' };
  }
  
  return { isValid: true };
};

// Validate CPF (11 digits)
const validateCPF = (cpf: string): boolean => {
  const digits = onlyDigits(cpf);
  
  if (digits.length !== 11) return false;
  
  // Check for all same digits (invalid CPF)
  if (/^(\d)\1+$/.test(digits)) return false;
  
  // Basic validation (simplified - real validation would check digit verification)
  return true;
};

// Validate phone (10 or 11 digits with valid DDD)
const validatePhone = (phone: string): boolean => {
  const digits = onlyDigits(phone);
  
  if (digits.length !== 10 && digits.length !== 11) return false;
  
  const ddd = parseInt(digits.slice(0, 2));
  
  // Valid DDD range: 11-99
  if (ddd < 11 || ddd > 99) return false;
  
  // If 11 digits, third digit must be 9
  if (digits.length === 11 && digits.charAt(2) !== '9') return false;
  
  // If 10 digits, third digit cannot be 9 (would be 11 digits phone)
  if (digits.length === 10 && digits.charAt(2) === '9') return false;
  
  return true;
};

// Validate email
const validateEmail = (email: string): boolean => {
  const trimmed = email.trim();
  
  // Must have @ and at least one dot after @
  if (!trimmed.includes('@')) return false;
  
  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;
  
  const [localPart, domain] = parts;
  
  // Local part validation
  if (!localPart || localPart.length === 0) return false;
  
  // Domain must have at least one dot and valid structure
  if (!domain || !domain.includes('.')) return false;
  
  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;
  
  // Check if domain parts are not empty
  if (domainParts.some(part => part.length === 0)) return false;
  
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
};

// Validate random PIX key (UUID format)
const validateRandomKey = (key: string): boolean => {
  const trimmed = key.trim();
  
  // Random key should be at least 32 characters (typical UUID without dashes)
  if (trimmed.length < 32) return false;
  
  // Can only contain letters, numbers, and dashes (no special chars like @!#$)
  if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) return false;
  
  return true;
};

// Detect PIX key type (same logic as inputMasks)
const detectPixKeyType = (value: string): 'cpf' | 'phone' | 'email' | 'random' => {
  const digits = onlyDigits(value);
  
  if (value.includes('@')) return 'email';
  
  if (digits.length === 10) return 'phone';
  
  if (digits.length === 11) {
    const ddd = parseInt(digits.slice(0, 2));
    const thirdDigit = digits.charAt(2);
    if (ddd >= 11 && ddd <= 99 && thirdDigit === '9') {
      return 'phone';
    }
    return 'cpf';
  }
  
  return 'random';
};

// Validate PIX key based on detected type
export const validatePixKey = (value: string): ValidationResult => {
  const trimmed = value.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Chave PIX é obrigatória' };
  }
  
  const type = detectPixKeyType(trimmed);
  
  switch (type) {
    case 'cpf':
      if (!validateCPF(trimmed)) {
        return { 
          isValid: false, 
          error: 'CPF inválido. Deve conter 11 dígitos válidos' 
        };
      }
      break;
      
    case 'phone':
      if (!validatePhone(trimmed)) {
        return { 
          isValid: false, 
          error: 'Telefone inválido. Use formato (DD) 9XXXX-XXXX ou (DD) XXXX-XXXX' 
        };
      }
      break;
      
    case 'email':
      if (!validateEmail(trimmed)) {
        return { 
          isValid: false, 
          error: 'Email inválido. Deve conter @ e pelo menos um ponto após o @' 
        };
      }
      break;
      
    case 'random':
      if (!validateRandomKey(trimmed)) {
        return { 
          isValid: false, 
          error: 'Chave aleatória inválida. Deve ter pelo menos 32 caracteres' 
        };
      }
      break;
  }
  
  return { isValid: true };
};

// Validate wallet address (Ethereum/EVM format)
export const validateWallet = (value: string): ValidationResult => {
  const trimmed = value.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Wallet é obrigatória' };
  }
  
  if (!trimmed.startsWith('0x')) {
    return { 
      isValid: false, 
      error: 'Wallet deve começar com 0x' 
    };
  }
  
  if (trimmed.length !== 42) {
    return { 
      isValid: false, 
      error: 'Wallet deve ter exatamente 42 caracteres (0x + 40 caracteres hexadecimais)' 
    };
  }
  
  const hexPart = trimmed.slice(2);
  if (!/^[a-fA-F0-9]{40}$/.test(hexPart)) {
    return { 
      isValid: false, 
      error: 'Wallet deve conter apenas caracteres hexadecimais (0-9, a-f) após 0x' 
    };
  }
  
  return { isValid: true };
};

// Validate network field
export const validateNetwork = (value: string): ValidationResult => {
  const validNetworks = ['sepolia', 'ethereum', 'polygon', 'arbitrum', 'bnb', 'base'];
  
  if (!value) {
    return { isValid: false, error: 'Network é obrigatória' };
  }
  
  if (!validNetworks.includes(value)) {
    return { 
      isValid: false, 
      error: `Network deve ser uma das opções: ${validNetworks.join(', ')}` 
    };
  }
  
  return { isValid: true };
};

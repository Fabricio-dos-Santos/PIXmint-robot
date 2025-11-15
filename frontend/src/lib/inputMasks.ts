// Input masking utilities for form fields
// These preserve the raw value but format display

export const onlyDigits = (s = '') => s.replace(/\D/g, '');
export const onlyHex = (s = '') => s.toLowerCase().replace(/[^0-9a-f]/g, '');

// CPF Input Mask: 000.000.000-00
export const formatCPFInput = (value: string): string => {
  const digits = onlyDigits(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

// CNPJ Input Mask: 00.000.000/0000-00
export const formatCNPJInput = (value: string): string => {
  const digits = onlyDigits(value);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
};

// Phone Input Mask: (00) 00000-0000 or (00) 0000-0000
export const formatPhoneInput = (value: string): string => {
  const digits = onlyDigits(value);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length === 7) {
    // 7 digits: don't add dash yet
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    // 8-10 digits: (00) 0000-0000
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  // 11 digits: (00) 90000-0000
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

// Wallet Input Mask: ensure 0x prefix and hex chars
export const formatWalletInput = (value: string): string => {
  let cleaned = value.trim();
  
  // Always ensure 0x prefix
  if (!cleaned.startsWith('0x')) {
    if (cleaned.startsWith('x')) {
      cleaned = '0' + cleaned;
    } else {
      cleaned = '0x' + cleaned.replace(/^0x/i, '');
    }
  }
  
  // Remove invalid characters after 0x
  const prefix = '0x';
  const hex = onlyHex(cleaned.slice(2));
  
  // Limit to 40 hex chars (Ethereum address)
  return prefix + hex.slice(0, 40);
};

// Detect PIX key type
export const detectPixKeyType = (value: string): 'cpf' | 'cnpj' | 'phone' | 'email' | 'random' => {
  const digits = onlyDigits(value);
  
  // Check email pattern
  if (value.includes('@') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value)) {
    return 'email';
  }
  
  // Check CNPJ (exactly 14 digits)
  if (digits.length === 14) {
    return 'cnpj';
  }
  
  // Check phone (10 or 11 digits)
  if (digits.length === 10) {
    return 'phone';
  }
  
  if (digits.length === 11) {
    // If starts with common DDD (11-99) and third digit is 9, it's likely a phone
    const ddd = parseInt(digits.slice(0, 2));
    const thirdDigit = digits.charAt(2);
    if (ddd >= 11 && ddd <= 99 && thirdDigit === '9') {
      return 'phone';
    }
    // Otherwise, treat as CPF (exactly 11 digits)
    return 'cpf';
  }
  
  // Default to random for any other length
  return 'random';
};

// Smart PIX Key formatting - detects type and applies mask
export const formatPixKeyInput = (value: string): string => {
  if (!value) return '';
  
  const type = detectPixKeyType(value);
  
  switch (type) {
    case 'cpf':
      return formatCPFInput(value);
    case 'cnpj':
      return formatCNPJInput(value);
    case 'phone':
      return formatPhoneInput(value);
    case 'email':
      // Email não precisa de máscara, retorna como está
      return value.trim();
    case 'random':
      // Random key não precisa de máscara
      return value.trim();
    default:
      return value.trim();
  }
};

// Get raw value (remove formatting) for submission
export const getRawPixKey = (formatted: string): string => {
  const type = detectPixKeyType(formatted);
  
  if (type === 'cpf' || type === 'cnpj' || type === 'phone') {
    return onlyDigits(formatted);
  }
  
  return formatted.trim();
};

export const getRawWallet = (formatted: string): string => {
  // Keep 0x prefix and hex chars only
  if (!formatted.startsWith('0x')) return formatted;
  return '0x' + onlyHex(formatted.slice(2));
};

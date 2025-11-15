export const onlyDigits = (s = '') => s.replace(/\D/g, '');

export const isWallet = (val?: string) => {
  if (!val) return false;
  if (val.startsWith('0x') && val.length >= 10) return true;
  // heuristic: long string without digits likely a wallet
  if (onlyDigits(val).length === 0 && val.length >= 20) return true;
  return false;
};

export const maskWallet = (val = '') => {
  if (!val) return '';
  const prefix = val.startsWith('0x') ? '0x' : '';
  const raw = prefix ? val.slice(2) : val;
  if (raw.length <= 10) return val;
  const first = raw.slice(0, 5);
  const last = raw.slice(-5);
  return `${prefix}${first}...${last}`;
};

// Email helpers
export const isEmail = (val?: string) => !!val && /^[^\s@]+@[^\s@]+\.(com|com\.br)$/i.test(val);

export const maskEmail = (val = '') => {
  if (!val) return '';
  const parts = val.split('@');
  const local = parts[0] || '';
  const domain = parts[1] || '';
  const visible = local.length <= 2 ? local : local.slice(0, 2);
  const stars = '*'.repeat(Math.max(0, Math.min(6, local.length - visible.length)));
  if (!domain) return `${visible}${stars}`;
  return `${visible}${stars}@${domain}`;
};

// CPF helpers (display mask: show first 3 and last 2)
export const isCPF = (val?: string) => {
  if (!val) return false;
  const d = onlyDigits(val);
  return d.length === 11;
};

export const maskCPFDisplay = (val = '') => {
  const d = onlyDigits(val);
  if (d.length !== 11) return '***.***.***-**';
  const first3 = d.slice(0, 3);
  const last2 = d.slice(9, 11);
  return `${first3}.***.***-${last2}`;
};

// CNPJ helpers (display mask: show first 2 and last 2)
export const isCNPJ = (val?: string) => {
  if (!val) return false;
  const d = onlyDigits(val);
  return d.length === 14;
};

export const maskCNPJDisplay = (val = '') => {
  const d = onlyDigits(val);
  if (d.length !== 14) return '**.***.***/****-**';
  const first2 = d.slice(0, 2);
  const last2 = d.slice(12, 14);
  return `${first2}.***.***/****-${last2}`;
};

// Phone masking
export const maskPhone = (val = '') => {
  const d = onlyDigits(val);
  if (!d) return val;
  const last4 = d.slice(-4);
  if (d.length === 10) {
    const ddd = d.slice(0, 2);
    return `(${ddd}) ****-${last4}`;
  }
  if (d.length === 11) {
    const ddd = d.slice(0, 2);
    return `(${ddd}) 9****-${last4}`;
  }
  return `****${last4}`;
};

// Random/generic mask used for unknown keys
export const maskRandom = (val = '') => {
  if (!val) return '';
  if (val.length <= 8) return `${val.slice(0, 2)}...${val.slice(-2)}`;
  return `${val.slice(0, 4)}...${val.slice(-4)}`;
};

export default {
  onlyDigits,
  isWallet,
  maskWallet,
  isEmail,
  maskEmail,
  isCPF,
  maskCPFDisplay,
  isCNPJ,
  maskCNPJDisplay,
};

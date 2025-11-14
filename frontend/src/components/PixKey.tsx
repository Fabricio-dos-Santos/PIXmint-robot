import React from 'react';
import CopyButton from './CopyButton';
import { isWallet, maskWallet, isEmail, maskEmail, isCPF, maskCPFDisplay, maskPhone, maskRandom } from '../lib/pixKeyUtils';

const onlyDigits = (s = '') => s.replace(/\D/g, '');

const isPhone = (val?: string) => {
  if (!val) return false;
  const digits = onlyDigits(val);
  if (digits.length === 10) return true;
  if (digits.length === 11) return digits.charAt(2) === '9';
  return false;
};

// use isCPF from shared utils

// use maskEmail / isEmail, maskPhone, maskRandom, isCPF from shared utils

type Props = { value?: string; showLabel?: boolean };

export default function PixKey({ value, showLabel = true }: Props) {
  if (!value) return null;

  const labelInfo = () => {
    if (isEmail(value)) return { label: 'email', color: '#2b6cb0', text: maskEmail(value) };
    if (isPhone(value)) return { label: 'telefone', color: '#2f855a', text: maskPhone(value) };
    if (isCPF(value)) return { label: 'CPF', color: '#b58900', text: maskCPFDisplay(value) };
    if (isWallet(value)) return { label: 'wallet', color: '#7c3aed', text: maskWallet(value) };
    return { label: 'random', color: '#9b2c2c', text: maskRandom(value) };
  };

  const info = labelInfo();

  return (
    <div style={{ display: 'flex', alignItems: 'center' }} title={value}>
      <CopyButton text={value} />
      <span style={{ maxWidth: 420, display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginLeft: 4 }}>{info.text}</span>
      {showLabel ? <span style={{ marginLeft: 8, fontSize: 12, color: info.color }}>{info.label}</span> : null}
    </div>
  );
}

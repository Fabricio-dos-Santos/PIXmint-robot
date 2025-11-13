import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

type Employee = {
  id: string;
  name: string;
  pixKey: string;
  wallet: string;
  network?: string;
  createdAt?: string;
};

// --- PIX key helpers: detect type, format and validate ---
const isEmail = (val?: string) => !!val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

const onlyDigits = (s = '') => s.replace(/\D/g, '');

const isPhone = (val?: string) => {
  if (!val) return false;
  const digits = onlyDigits(val);
  return digits.length === 10 || digits.length === 11;
};

const formatPhone = (val = '') => {
  const d = onlyDigits(val);
  if (d.length === 10) {
    // (XX) XXXX-XXXX
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  if (d.length === 11) {
    // (XX) 9XXXX-XXXX
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }
  return val;
};

// Basic CPF validation (checks length and verification digits)
const isCPF = (val?: string) => {
  if (!val) return false;
  const cpf = onlyDigits(val).padStart(11, '0');
  if (cpf.length !== 11 || /^([0-9])\1{10}$/.test(cpf)) return false;

  const calc = (t: number) => {
    let sum = 0;
    for (let i = 0; i < t - 1; i++) sum += parseInt(cpf.charAt(i)) * (t - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };

  return calc(10) === parseInt(cpf.charAt(9)) && calc(11) === parseInt(cpf.charAt(10));
};

const formatCPF = (val = '') => {
  const d = onlyDigits(val);
  if (d.length !== 11) return val;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const isHexWallet = (val?: string) => !!val && /^0x[0-9a-fA-F]{40}$/.test(val);

const isRandom = (val?: string) => {
  if (!val) return false;
  // treat as random when it's not email/phone/cpf and not a hex wallet
  return !isEmail(val) && !isPhone(val) && !isCPF(val) && !isHexWallet(val);
};

const renderPixKey = (val?: string) => {
  if (!val) return '';

  const styleBadge: React.CSSProperties = { marginLeft: 8, padding: '2px 6px', borderRadius: 4, fontSize: 12 };

  if (isEmail(val)) return (
    <span>
      {val}
      <span style={{ ...styleBadge, background: '#bee3f8', color: '#2b6cb0' }}>email</span>
    </span>
  );

  if (isPhone(val)) return (
    <span>
      {formatPhone(val)}
      <span style={{ ...styleBadge, background: '#c6f6d5', color: '#2f855a' }}>telefone</span>
    </span>
  );

  if (isCPF(val)) return (
    <span>
      {formatCPF(val)}
      <span style={{ ...styleBadge, background: '#fff5bf', color: '#b58900' }}>CPF</span>
    </span>
  );

  if (isHexWallet(val)) return (
    <span>
      {val}
      <span style={{ ...styleBadge, background: '#f0f7ff', color: '#0a317b' }}>wallet</span>
    </span>
  );

  // random/other
  return (
    <span>
      {val}
      <span style={{ ...styleBadge, background: '#fed7e2', color: '#9b2c2c' }}>random</span>
    </span>
  );
};

export default function Employees() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await api.get<Employee[]>('/employees');
      return res.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading employees</div>;

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <div>
      <h2>Employees</h2>
      <div style={{ marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => {}}
          style={{
            background: '#2f855a',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Novo
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
  <table style={{ width: 'auto', borderCollapse: 'collapse', border: '1px solid #ddd', tableLayout: 'auto' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>PixKey</th>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Wallet</th>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Network</th>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Created At</th>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((e) => (
              <tr key={e.id}>
                <td style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>{e.name}</td>
                <td style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>{e.pixKey}</td>
                <td style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>{e.wallet}</td>
                <td style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>{e.network}</td>
                <td style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>{e.createdAt ? formatDate(e.createdAt) : ''}</td>
                <td style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>
                  <button
                    type="button"
                    onClick={() => {}}
                    style={{
                      background: '#3182ce',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      marginRight: 8
                    }}
                    aria-label={`Editar ${e.name || e.id}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {}}
                    style={{
                      background: '#e53e3e',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: 4,
                      cursor: 'pointer'
                    }}
                    aria-label={`Excluir ${e.name || e.id}`}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

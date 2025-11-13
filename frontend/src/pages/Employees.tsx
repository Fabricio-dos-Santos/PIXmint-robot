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
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>PixKey</th>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Wallet</th>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Network</th>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Created At</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

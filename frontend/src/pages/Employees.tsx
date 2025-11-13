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

  return (
    <div>
      <h2>Employees</h2>
      <ul>
        {(data || []).map((e) => (
          <li key={e.id} style={{ marginBottom: 8 }}>
            <strong>{e.name}</strong> — {e.pixKey} — {e.wallet}
          </li>
        ))}
      </ul>
    </div>
  );
}

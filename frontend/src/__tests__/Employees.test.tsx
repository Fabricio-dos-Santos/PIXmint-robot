import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Employees from '../pages/Employees';
import api from '../lib/api';

vi.mock('../lib/api');

const createQueryClient = () => new QueryClient();

test('renders employees list', async () => {
  (api.get as unknown as any).mockResolvedValue({ data: [{ id: '1', name: 'Alice', pixKey: 'pix123', wallet: '0x0' }] });
  const qc = createQueryClient();
  render(
    <QueryClientProvider client={qc}>
      <Employees />
    </QueryClientProvider>
  );
  await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
});

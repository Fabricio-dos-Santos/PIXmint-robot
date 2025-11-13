import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock useQuery from react-query so Employees renders predictable data
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: [
    {
      id: '1',
      name: 'Test User',
      pixKey: 'user@local', // contains '@' but no .com/.com.br -> should be 'email inválido'
      wallet: '0x' + 'a'.repeat(40),
      network: 'sepolia',
      createdAt: new Date().toISOString(),
    }
  ], error: null, isLoading: false })
}));

import Employees from './Employees';

describe('Employees component', () => {
  it("shows 'email inválido' when pixKey contains '@' but not .com/.com.br", () => {
    render(<Employees />);
    expect(screen.getByText(/email inválido/i)).toBeTruthy();
  });
});

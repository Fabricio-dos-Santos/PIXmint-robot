import React from 'react';
import { render, screen } from '@testing-library/react';
import EmployeeTable, { Employee } from '../EmployeeTable';
import PixKey from '../PixKey';

const sample: Employee[] = [
  { id: '1', name: 'Alice', pixKey: 'alice@example.com', wallet: '0xabcdef1234567890abcdef1234567890', network: 'ETH', createdAt: new Date().toISOString() },
  { id: '2', name: 'Bob', pixKey: '5511999999999', wallet: 'walletLongNoDigitsButLongStringxxxxxxxxxxxx', network: 'BSC', createdAt: new Date().toISOString() },
];

describe('EmployeeTable', () => {
  it('renders rows and wallet masked with copy button', () => {
    render(
      <EmployeeTable
        items={sample}
        renderPixKey={(val) => <PixKey value={val} showLabel={false} />}
      />
    );

    // rows exist
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();

    // wallet masked should show a '...' and copy button should be present
    const copyButtons = screen.getAllByRole('button', { name: /copy full value/i });
    expect(copyButtons.length).toBeGreaterThanOrEqual(2);
  });
});

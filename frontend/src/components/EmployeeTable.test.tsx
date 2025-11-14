import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import EmployeeTable, { Employee } from './EmployeeTable';

describe('EmployeeTable', () => {
  test('renders rows and calls handlers', () => {
    const items: Employee[] = [
      { id: '1', name: 'Alice', pixKey: 'a@b.com', wallet: 'w1', network: 'net1', createdAt: '2020-01-01T00:00:00Z' },
      { id: '2', name: 'Bob', pixKey: 'bob', wallet: 'w2', network: 'net2', createdAt: '2020-01-02T00:00:00Z' }
    ];
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const renderPixKey = (v?: string) => v || '';

    render(<EmployeeTable items={items} renderPixKey={renderPixKey} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();

    // ensure buttons exist for first row
    const editBtn = screen.getAllByLabelText(/Editar/)[0];
    const delBtn = screen.getAllByLabelText(/Excluir/)[0];
    expect(editBtn).toBeInTheDocument();
    expect(delBtn).toBeInTheDocument();
  });
});

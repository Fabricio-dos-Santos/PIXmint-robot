import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination', () => {
  test('renders summary and buttons, triggers callbacks', async () => {
  const onPageChange = vi.fn();
  render(<Pagination currentPage={2} perPage={5} totalItems={18} onPageChange={onPageChange} />);

  // summary
  expect(screen.getByText(/Mostrando 6-10 de 18/)).toBeInTheDocument();

  // click prev
  fireEvent.click(screen.getByLabelText('prev'));
  expect(onPageChange).toHaveBeenLastCalledWith(1);

  // click next
  fireEvent.click(screen.getByLabelText('next'));
  expect(onPageChange).toHaveBeenLastCalledWith(3);

  // click first
  fireEvent.click(screen.getByLabelText('first'));
  expect(onPageChange).toHaveBeenLastCalledWith(1);

  // click last
  fireEvent.click(screen.getByLabelText('last'));
  expect(onPageChange).toHaveBeenLastCalledWith(4);
  });

  test('disables prev/first on first page and next/last on last page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} perPage={10} totalItems={10} onPageChange={onPageChange} />);

    expect(screen.getByLabelText('first')).toBeDisabled();
    expect(screen.getByLabelText('prev')).toBeDisabled();
    expect(screen.getByLabelText('next')).toBeDisabled();
    expect(screen.getByLabelText('last')).toBeDisabled();
  });
});

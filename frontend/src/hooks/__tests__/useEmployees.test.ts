import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useEmployees from '../useEmployees';
import api from '../../lib/api';
import React from 'react';

// Mock the api module
vi.mock('../../lib/api', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useEmployees - delete operation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );

  it('should delete an employee by id', async () => {
    const mockEmployees = [
      { id: '1', name: 'Alice Silva', pixKey: 'alice@test.com', wallet: '0xabc123', network: 'ethereum' },
      { id: '2', name: 'Bob Costa', pixKey: '11987654321', wallet: '0xdef456', network: 'polygon' },
    ];

    // Mock initial GET
    vi.mocked(api.get).mockResolvedValue({ data: mockEmployees });
    // Mock DELETE
    vi.mocked(api.delete).mockResolvedValue({ data: null, status: 204 });

    const { result } = renderHook(() => useEmployees(), { wrapper });

    // Wait for initial load
    await waitFor(() => expect(result.current.data).toEqual(mockEmployees));

    // Call removeEmployee
    await result.current.removeEmployee('1');

    // Verify DELETE was called with correct ID
    expect(api.delete).toHaveBeenCalledWith('/employees/1');
    expect(api.delete).toHaveBeenCalledTimes(1);
  });

  it('should invalidate cache after successful delete', async () => {
    const mockEmployees = [
      { id: '1', name: 'Alice Silva', pixKey: 'alice@test.com', wallet: '0xabc123' },
    ];

    const mockEmployeesAfterDelete: any[] = [];

    // Mock initial GET
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockEmployees });
    // Mock DELETE
    vi.mocked(api.delete).mockResolvedValue({ data: null, status: 204 });
    // Mock GET after invalidation
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockEmployeesAfterDelete });

    const { result } = renderHook(() => useEmployees(), { wrapper });

    // Wait for initial load
    await waitFor(() => expect(result.current.data).toEqual(mockEmployees));

    // Delete employee
    await result.current.removeEmployee('1');

    // Wait for cache invalidation and refetch
    await waitFor(() => expect(result.current.data).toEqual(mockEmployeesAfterDelete));

    // Verify GET was called twice (initial + after delete)
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('should handle delete errors gracefully', async () => {
    const mockEmployees = [
      { id: '1', name: 'Alice Silva', pixKey: 'alice@test.com', wallet: '0xabc123' },
    ];

    // Mock initial GET
    vi.mocked(api.get).mockResolvedValue({ data: mockEmployees });
    // Mock DELETE failure
    vi.mocked(api.delete).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useEmployees(), { wrapper });

    // Wait for initial load
    await waitFor(() => expect(result.current.data).toEqual(mockEmployees));

    // Attempt to delete (should throw)
    await expect(result.current.removeEmployee('1')).rejects.toThrow('Network error');

    // Verify DELETE was called
    expect(api.delete).toHaveBeenCalledWith('/employees/1');
  });

  it('should set deleteStatus to success after successful delete', async () => {
    const mockEmployees = [
      { id: '1', name: 'Alice Silva', pixKey: 'alice@test.com', wallet: '0xabc123' },
    ];

    // Mock initial GET
    vi.mocked(api.get).mockResolvedValue({ data: mockEmployees });
    // Mock DELETE
    vi.mocked(api.delete).mockResolvedValue({ data: null, status: 204 });

    const { result } = renderHook(() => useEmployees(), { wrapper });

    // Wait for initial load
    await waitFor(() => expect(result.current.data).toEqual(mockEmployees));

    // Initial status should be idle
    expect(result.current.deleteStatus).toBe('idle');

    // Delete employee
    await result.current.removeEmployee('1');

    // Status should be success
    await waitFor(() => expect(result.current.deleteStatus).toBe('success'));
  });
});

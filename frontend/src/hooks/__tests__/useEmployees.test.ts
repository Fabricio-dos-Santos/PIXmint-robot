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
    post: vi.fn(),
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

  it('should fetch employees with search param', async () => {
    const mockEmployees = [
      { id: '1', name: 'Maria Silva', pixKey: 'maria@test.com', wallet: '0xabc123', network: 'ethereum' },
    ];

    vi.mocked(api.get).mockResolvedValue({ data: mockEmployees });

    const { result } = renderHook(() => useEmployees('maria'), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockEmployees));

    // Verify GET was called with search param
    expect(api.get).toHaveBeenCalledWith('/employees', { params: { search: 'maria' } });
  });

  it('should fetch all employees when no search param', async () => {
    const mockEmployees = [
      { id: '1', name: 'Alice Silva', pixKey: 'alice@test.com', wallet: '0xabc123', network: 'ethereum' },
      { id: '2', name: 'Bob Costa', pixKey: '11987654321', wallet: '0xdef456', network: 'polygon' },
    ];

    vi.mocked(api.get).mockResolvedValue({ data: mockEmployees });

    const { result } = renderHook(() => useEmployees(), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockEmployees));

    // Verify GET was called without params
    expect(api.get).toHaveBeenCalledWith('/employees', { params: {} });
  });

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

  it('should create a new employee', async () => {
    const mockEmployees = [
      { id: '1', name: 'Alice Silva', pixKey: 'alice@test.com', wallet: '0xabc123', network: 'ethereum' },
    ];

    const newEmployee = {
      name: 'Bob Costa',
      pixKey: 'bob@test.com',
      wallet: '0xdef456',
      network: 'polygon',
    };

    const createdEmployee = {
      id: '2',
      ...newEmployee,
      createdAt: '2024-11-14T10:00:00Z',
    };

    // Mock initial GET
    vi.mocked(api.get).mockResolvedValue({ data: mockEmployees });
    // Mock POST
    vi.mocked(api.post).mockResolvedValue({ data: createdEmployee });

    const { result } = renderHook(() => useEmployees(), { wrapper });

    // Wait for initial load
    await waitFor(() => expect(result.current.data).toEqual(mockEmployees));

    // Create employee
    await result.current.createEmployee(newEmployee);

    // Verify POST was called with correct data
    expect(api.post).toHaveBeenCalledWith('/employees', newEmployee);
    expect(api.post).toHaveBeenCalledTimes(1);
  });

  it('should invalidate cache after successful create', async () => {
    const mockEmployees = [
      { id: '1', name: 'Alice Silva', pixKey: 'alice@test.com', wallet: '0xabc123', network: 'ethereum' },
    ];

    const newEmployee = {
      name: 'Bob Costa',
      pixKey: 'bob@test.com',
      wallet: '0xdef456',
      network: 'polygon',
    };

    const createdEmployee = { id: '2', ...newEmployee };

    const mockEmployeesAfterCreate = [...mockEmployees, createdEmployee];

    // Mock initial GET
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockEmployees });
    // Mock POST
    vi.mocked(api.post).mockResolvedValue({ data: createdEmployee });
    // Mock GET after invalidation
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockEmployeesAfterCreate });

    const { result } = renderHook(() => useEmployees(), { wrapper });

    // Wait for initial load
    await waitFor(() => expect(result.current.data).toEqual(mockEmployees));

    // Create employee
    await result.current.createEmployee(newEmployee);

    // Wait for cache invalidation and refetch
    await waitFor(() => expect(result.current.data).toEqual(mockEmployeesAfterCreate));

    // Verify GET was called twice (initial + after create)
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('should handle create errors gracefully', async () => {
    const mockEmployees = [
      { id: '1', name: 'Alice Silva', pixKey: 'alice@test.com', wallet: '0xabc123' },
    ];

    const newEmployee = {
      name: 'Bob',
      pixKey: 'bob@test.com',
      wallet: '0xdef456',
      network: 'polygon',
    };

    // Mock initial GET
    vi.mocked(api.get).mockResolvedValue({ data: mockEmployees });
    // Mock POST failure
    vi.mocked(api.post).mockRejectedValue(new Error('Validation error'));

    const { result } = renderHook(() => useEmployees(), { wrapper });

    // Wait for initial load
    await waitFor(() => expect(result.current.data).toEqual(mockEmployees));

    // Attempt to create (should throw)
    await expect(result.current.createEmployee(newEmployee)).rejects.toThrow('Validation error');

    // Verify POST was called
    expect(api.post).toHaveBeenCalledWith('/employees', newEmployee);
  });
});

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export type Employee = {
  id: string;
  name: string;
  pixKey: string;
  wallet: string;
  network?: string;
  createdAt?: string;
};

export type CreateEmployeeInput = {
  name: string;
  pixKey: string;
  wallet: string;
  network: string;
};

export default function useEmployees(search?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<Employee[]>({
    queryKey: ['employees', search],
    queryFn: async () => {
      const params = search ? { search } : {};
      const res = await api.get<Employee[]>('/employees', { params });
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateEmployeeInput) => {
      const res = await api.post<Employee>('/employees', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/employees/${id}`);
      return id;
    },
    onSuccess: (_, id) => {
      // invalidate or update cache
      // react-query v4 expects the query key typed as readonly
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  const removeEmployee = async (id: string) => {
    return deleteMutation.mutateAsync(id);
  };

  const createEmployee = async (data: CreateEmployeeInput) => {
    return createMutation.mutateAsync(data);
  };

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    removeEmployee,
    deleteStatus: deleteMutation.status,
    createEmployee,
    createStatus: createMutation.status,
    createError: createMutation.error,
    isCreating: createMutation.isPending
  };
}

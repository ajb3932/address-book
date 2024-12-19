import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      try {
        const response = await api.get('/auth/verify');
        return { isAuthenticated: true, user: response.data };
      } catch (error) {
        return { isAuthenticated: false, user: null };
      }
    },
    initialData: { isAuthenticated: false, user: null }
  });

  return {
    isAuthenticated: data.isAuthenticated,
    user: data.user,
    loading: isLoading
  };
}
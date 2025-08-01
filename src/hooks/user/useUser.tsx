import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/entries/user/api';

export function useUser() {
  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
  });

  return { user: data, isLoadingUser: isLoading };
}

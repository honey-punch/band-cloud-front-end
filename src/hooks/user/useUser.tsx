import { useQuery } from '@tanstack/react-query';
import { getUserSearch, getUserById } from '@/entries/user/api';

export function useUserSearch() {
  const { data, isPending } = useQuery<User[]>({
    queryKey: ['user', 'search'],
    queryFn: () => getUserSearch(),
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
  });

  return { userList: data, isLoadingUserList: isPending };
}

export function useUserById(id: string) {
  const { data, isPending } = useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
  });

  return { user: data, isLoadingUser: isPending };
}

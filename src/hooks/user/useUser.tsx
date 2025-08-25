import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserSearch, getUserById, updateUserAvatar } from '@/entries/user/api';

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

export function useUpdateUserAvatar(onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<User, Error, AvatarUploadBody>({
    mutationKey: ['user', 'update', 'avatar'],
    mutationFn: (body: AvatarUploadBody) => updateUserAvatar(body),
    onSuccess: () => {
      onSuccess && onSuccess();
    },
    onError: () => {
      onError && onError();
    },
  });

  return { updateUserAvatar: mutate, isLoadingUpdateUserAvatar: isPending };
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserSearch, getUserById, updateUserAvatar, updateUser } from '@/entries/user/api';
import { parseParams } from '@/utils/util';

export function useUserSearch(searchParams: SearchParams) {
  const { data, isPending } = useQuery<ApiResponse<User[]>>({
    queryKey: ['user', 'search', JSON.stringify(searchParams)],
    queryFn: () => getUserSearch(parseParams(searchParams)),
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

export function useUpdateUser(id: string, onSuccess?: (data: User) => void, onError?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<User, Error, UpdateUserBody>({
    mutationKey: ['user', 'update', id],
    mutationFn: (body: UpdateUserBody) => updateUser(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      onSuccess && onSuccess(data);
    },
    onError: () => {
      onError && onError();
    },
  });

  return { updateUser: mutate, isLoadingUpdateUser: isPending };
}

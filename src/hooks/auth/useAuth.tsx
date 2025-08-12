import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, login, logout } from '@/entries/auth/api';

export function useLogin(onSuccess?: (data: User) => void, onError?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<User, Error, LoginBody>({
    mutationKey: ['auth', 'login'],
    mutationFn: (body: LoginBody) => login(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      onSuccess && onSuccess(data);
    },
    onError: () => {
      onError && onError();
    },
  });

  return { login: mutate, isLoadingLogin: isPending };
}

export function useLogout(onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<string>({
    mutationKey: ['auth', 'logout'],
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      onSuccess && onSuccess();
    },
    onError: (err) => {
      console.log(err);
      onError && onError();
    },
  });

  return { logout: mutate, isLoadingLogout: isPending };
}

export function useMe() {
  const { data, isPending } = useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: () => getMe(),
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
  });

  return { me: data, isLoadingMe: isPending };
}

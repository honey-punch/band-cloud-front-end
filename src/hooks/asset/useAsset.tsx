import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAsset, getAssetById, getAssetSearch } from '@/entries/asset/api';

export function useAssetSearch() {
  const { data, isPending } = useQuery<Asset[]>({
    queryKey: ['asset', 'search'],
    queryFn: () => getAssetSearch(),
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
  });

  return { assetList: data, isLoadingAssetList: isPending };
}

export function useAssetById(id: string) {
  const { data, isPending } = useQuery<Asset>({
    queryKey: ['asset', id],
    queryFn: () => getAssetById(id),
    enabled: !!id,
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
  });

  return { asset: data, isLoadingAsset: isPending };
}

export function useCreateAsset(onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<Asset, Error, CreateAssetBody>({
    mutationKey: ['asset', 'create'],
    mutationFn: (body: CreateAssetBody) => createAsset(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      onSuccess && onSuccess();
    },
    onError: () => {
      onError && onError();
    },
  });

  return { createAsset: mutate, isLoadingCreateAsset: isPending };
}

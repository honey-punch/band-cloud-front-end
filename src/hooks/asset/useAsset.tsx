import { useQuery } from '@tanstack/react-query';
import { getAssetSearch } from '@/entries/asset/api';

export function useAssetSearch() {
  const { data, isLoading } = useQuery<Asset[]>({
    queryKey: ['asset', 'search'],
    queryFn: () => getAssetSearch(),
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
  });

  return { assetList: data, isLoadingAssetList: isLoading };
}

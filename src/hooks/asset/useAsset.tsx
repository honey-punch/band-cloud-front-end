import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import {
  createAsset,
  getAssetById,
  getAssetSearch,
  updateAsset,
  updateAssetThumbnail,
} from '@/entries/asset/api';
import { parseParamsPage } from '@/utils/util';

export function useInfiniteAssetSearch(searchParams: SearchParams) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, isRefetching } =
    useInfiniteQuery<ApiResponse<Asset[]>>({
      queryKey: ['asset', 'search', JSON.stringify(searchParams)],
      queryFn: ({ pageParam = 0 }) =>
        getAssetSearch(parseParamsPage(pageParam as number, searchParams)),
      getNextPageParam: (lastPage: ApiResponse<Asset[]>) => {
        if (lastPage.page && lastPage.page.currentPage < lastPage.page.totalPage - 1) {
          return lastPage.page.currentPage + 1;
        }
        return undefined;
      },
      initialPageParam: 0,
      staleTime: 60 * 1_000,
      gcTime: 120 * 1_000,
      placeholderData: keepPreviousData,
    });

  return {
    assetList: data,
    isLoadingAssetList: isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isRefetching,
  };
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

export function useUpdateAsset(id: string, onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<Asset, Error, UpdateAssetBody>({
    mutationKey: ['asset', 'update', id],
    mutationFn: (body: UpdateAssetBody) => updateAsset(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', 'search'] });
      queryClient.invalidateQueries({ queryKey: ['asset', id] });

      onSuccess && onSuccess();
    },
    onError: () => {
      onError && onError();
    },
  });

  return { updateAsset: mutate, isLoadingUpdateAsset: isPending };
}

export function useUpdateAssetThumbnail(onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<Asset, Error, UploadBody>({
    mutationKey: ['asset', 'update', 'thumbnail'],
    mutationFn: (body: UploadBody) => updateAssetThumbnail(body),
    onSuccess: () => {
      onSuccess && onSuccess();
    },
    onError: () => {
      onError && onError();
    },
  });

  return { updateAssetThumbnail: mutate, isLoadingUpdateAssetThumbnail: isPending };
}

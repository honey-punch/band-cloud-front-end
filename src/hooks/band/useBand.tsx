import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBand, getBandById, getBandSearch } from '@/entries/band/api';
import { parseParams } from '@/utils/util';

export function useBandById(id: string) {
  const { data } = useQuery<Band>({
    queryKey: ['band', id],
    queryFn: () => getBandById(id),
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
  });

  return { band: data };
}

export function useInfiniteBandSearch(searchParams: SearchParams) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, isRefetching } =
    useInfiniteQuery<ApiResponse<Band[]>>({
      queryKey: ['band', 'search', JSON.stringify(searchParams)],
      queryFn: ({ pageParam = 0 }) => getBandSearch(parseParams(pageParam as number, searchParams)),
      getNextPageParam: (lastPage: ApiResponse<Band[]>) => {
        if (lastPage.page && lastPage.page.currentPage < lastPage.page.totalPage - 1) {
          return lastPage.page.currentPage + 1;
        }
        return undefined;
      },
      initialPageParam: 0,
      staleTime: 60 * 1_000,
      gcTime: 120 * 1_000,
    });

  return {
    bandList: data,
    isLoadingBandList: isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isRefetching,
  };
}

export function useCreateBand(onSuccess?: (data: Band) => void, onError?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<Band, Error, CreateBandBody>({
    mutationKey: ['band', 'create'],
    mutationFn: (body: CreateBandBody) => createBand(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['band', 'search'] });
      onSuccess && onSuccess(data);
    },
    onError: () => {
      onError && onError();
    },
  });

  return { createBand: mutate, isLoadingCreateBand: isPending };
}

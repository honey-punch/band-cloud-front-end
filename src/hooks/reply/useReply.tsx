import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createReply, deleteReply, getReplyByAssetId, updateReply } from '@/entries/reply/api';
import { parseParams } from '@/utils/util';

export function useReplyByAssetId(assetId: string, SearchParams: SearchParams) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, isRefetching } =
    useInfiniteQuery<ApiResponse<Reply[]>>({
      queryKey: ['reply', assetId, JSON.stringify(SearchParams)],
      queryFn: ({ pageParam = 0 }) =>
        getReplyByAssetId(assetId, parseParams(pageParam as number, SearchParams)),
      getNextPageParam: (lastPage: ApiResponse<Reply[]>) => {
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
    replyList: data,
    isLoadingReplyList: isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isRefetching,
  };
}

export function useCreateReply(assetId: string, onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<Reply, Error, CreateReplyBody>({
    mutationKey: ['reply', 'create'],
    mutationFn: (body: CreateReplyBody) => createReply(assetId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reply', assetId] });
      onSuccess && onSuccess();
    },
    onError: () => {
      onError && onError();
    },
  });

  return { createReply: mutate, isLoadingCreateReply: isPending };
}

export function useUpdateReply(
  assetId: string,
  replyId: string,
  onSuccess?: () => void,
  onError?: () => void,
) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<Reply, Error, UpdateReplyBody>({
    mutationKey: ['reply', 'update', replyId],
    mutationFn: (body: UpdateReplyBody) => updateReply(replyId, body),
    onSuccess: (data) => {
      queryClient.setQueryData<Reply[]>(['reply', assetId], (prevData) => {
        if (!prevData) {
          return prevData;
        }
        return prevData.map((reply) => (reply.id === data.id ? data : reply));
      });

      onSuccess && onSuccess();
    },
    onError: () => {
      onError && onError();
    },
  });

  return { updateReply: mutate, isLoadingUpdateReply: isPending };
}

export function useDeleteReply(
  assetId: string,
  replyId: string,
  onSuccess?: () => void,
  onError?: () => void,
) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<Reply>({
    mutationKey: ['reply', 'delete'],
    mutationFn: () => deleteReply(replyId),
    onSuccess: (data) => {
      queryClient.setQueryData<Reply[]>(['reply', assetId], (prevData) => {
        if (!prevData) {
          return prevData;
        }
        return prevData.filter((reply) => reply.id !== data.id);
      });

      onSuccess && onSuccess();
    },
    onError: () => {
      onError && onError();
    },
  });

  return { deleteReply: mutate, isLoadingDeleteReply: isPending };
}

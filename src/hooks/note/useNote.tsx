import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, deleteNote, getNoteByBandId, updateNote } from '@/entries/note/api';
import { parseParamsPage } from '@/utils/util';

export function useNoteByBandId(bandId: string, searchParams: SearchParams) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, isRefetching } =
    useInfiniteQuery<ApiResponse<Note[]>>({
      queryKey: ['note', bandId, JSON.stringify(searchParams)],
      queryFn: ({ pageParam = 0 }) =>
        getNoteByBandId(bandId, parseParamsPage(pageParam as number, searchParams)),
      getNextPageParam: (lastPage: ApiResponse<Note[]>) => {
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
    noteList: data,
    isLoadingNoteList: isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isRefetching,
  };
}

export function useCreateNote(bandId: string, onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<Note, Error, CreateNoteBody>({
    mutationKey: ['note', 'create'],
    mutationFn: (body: CreateNoteBody) => createNote(bandId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note', bandId] });
      onSuccess && onSuccess();
    },
    onError: () => {
      onError && onError();
    },
  });

  return { createNote: mutate, isLoadingCreateNote: isPending };
}

export function useUpdateNote(
  bandId: string,
  noteId: string,
  onSuccess?: () => void,
  onError?: () => void,
) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<Note, Error, UpdateNoteBody>({
    mutationKey: ['note', 'update', noteId],
    mutationFn: (body: UpdateNoteBody) => updateNote(noteId, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['note', bandId] });

      onSuccess && onSuccess();
    },
    onError: () => {
      onError && onError();
    },
  });

  return { updateNote: mutate, isLoadingUpdateNote: isPending };
}

export function useDeleteNote(
  bandId: string,
  noteId: string,
  onSuccess?: () => void,
  onError?: () => void,
) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<Note>({
    mutationKey: ['note', 'delete'],
    mutationFn: () => deleteNote(noteId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['note', bandId] });

      onSuccess && onSuccess();
    },
    onError: () => {
      onError && onError();
    },
  });

  return { deleteNote: mutate, isLoadingDeleteNote: isPending };
}

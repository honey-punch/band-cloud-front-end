import { useQuery } from '@tanstack/react-query';
import { getBandById } from '@/entries/band/api';

export function useBandById(id: string) {
  const { data } = useQuery<Band>({
    queryKey: ['band', id],
    queryFn: () => getBandById(id),
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
  });

  return { band: data };
}

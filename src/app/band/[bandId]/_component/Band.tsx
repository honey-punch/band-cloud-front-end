'use client';

import { useBandById } from '@/hooks/band/useBand';

interface BandProps {
  bandId: string;
}

export default function Band({ bandId }: BandProps) {
  const { band } = useBandById(bandId);

  return <div>{band?.name}</div>;
}

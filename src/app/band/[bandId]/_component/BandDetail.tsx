'use client';

import { useBandById } from '@/hooks/band/useBand';

interface BandDetailProps {
  bandId: string;
}

export default function BandDetail({ bandId }: BandDetailProps) {
  const { band } = useBandById(bandId);

  return <div>{band?.name}</div>;
}

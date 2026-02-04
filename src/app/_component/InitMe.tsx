'use client';

import { useEffect } from 'react';
import { useStore } from '@/shared/rootStore';

export default function StoreInit({ initMe }: { initMe: User | null }) {
  const setMe = useStore((s) => s.setMe);

  useEffect(() => {
    setMe(initMe);
  }, [initMe, setMe]);

  return null;
}

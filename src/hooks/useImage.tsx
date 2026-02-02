'use client';

import { useEffect, useState } from 'react';

interface Options {
  defaultSrc: string;
  type: 'avatar' | 'thumbnail';
  id?: string;
}

export function useImage({ defaultSrc, type, id }: Options) {
  const [src, setSrc] = useState<string>(defaultSrc);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setSrc(`/file/${type}/${id}?t=${Date.now()}`);
    }
  }, [id]);

  function handleImageError() {
    setSrc(defaultSrc);
    setIsError(true);
  }

  function handleImageLoadStart() {
    setIsLoading(true);
  }

  function handleImageLoad() {
    setIsLoading(false);
  }

  return {
    src,
    setSrc,
    isError,
    handleImageError,
    isLoading,
    handleImageLoadStart,
    handleImageLoad,
  };
}

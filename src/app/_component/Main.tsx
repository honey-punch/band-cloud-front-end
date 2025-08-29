'use client';

import { useInfiniteAssetSearch } from '@/hooks/asset/useAsset';
import AssetListItem from '@/app/_component/AssetListItem';
import { useLayoutEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

export default function Main() {
  // states
  const [searchAssetParams, setSearchAssetParams] = useState<SearchParams>({
    userId: [],
    title: '',
    page: 0,
    size: 25,
    sort: 'createdDate,desc',
    limit: 9999,
  });

  // hooks
  const {
    assetList,
    isLoadingAssetList,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isRefetching,
  } = useInfiniteAssetSearch(searchAssetParams);

  const assetResultList = assetList?.pages.flatMap((page) => page.result) ?? [];

  // effects
  useLayoutEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1,
    });
    const observerTarget = document.getElementById('main-page-observer');

    if (observerTarget) {
      observer.observe(observerTarget);
    }
    return () => {
      observer.disconnect();
    };
  }, [isLoadingAssetList]);

  // functions
  function handleObserver(entries: IntersectionObserverEntry[]) {
    const target = entries[0];

    if (target.isIntersecting && !isLoadingAssetList && hasNextPage) {
      fetchNextPage();
    }
  }

  return (
    <div>
      <div></div>

      <div className="flex flex-col gap-10">
        {assetResultList &&
          assetResultList.map((asset) => (
            <AssetListItem key={`asset-list-item-key-${asset.id}`} asset={asset} />
          ))}
      </div>

      {isFetchingNextPage ? (
        <div className="flex h-60 w-full items-center justify-center">
          <ClipLoader color={'#ffffff'} />
        </div>
      ) : (
        <div id="main-page-observer" className="h-2"></div>
      )}
    </div>
  );
}

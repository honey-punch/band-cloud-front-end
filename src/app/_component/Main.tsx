'use client';

import { useInfiniteAssetSearch } from '@/hooks/asset/useAsset';
import AssetListItem from '@/app/_component/AssetListItem';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import SearchInput from '@/components/SearchInput';
import { MeContext } from '@/app/_component/MeProvider';

export default function Main() {
  // context
  const { me } = useContext(MeContext);

  // states
  const [searchAssetParams, setSearchAssetParams] = useState<SearchParams>({
    currentUserId: '',
    userId: [],
    title: '',
    page: 0,
    size: 25,
    sort: 'createdDate,desc',
    limit: 9999,
  });
  const [title, setTitle] = useState<string>('');

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

  // 검색 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchAssetParams((prev) => ({
        ...prev,
        title,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [title]);

  useEffect(() => {
    setSearchAssetParams((prev) => ({
      ...prev,
      currentUserId: me ? me.id : '',
    }));
  }, [me]);

  // functions
  function handleObserver(entries: IntersectionObserverEntry[]) {
    const target = entries[0];

    if (target.isIntersecting && !isLoadingAssetList && hasNextPage) {
      fetchNextPage();
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center">
        <SearchInput
          value={title}
          placeholder="Find music."
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-10">
        {assetResultList &&
          assetResultList.map((asset) => (
            <AssetListItem
              key={`asset-list-item-key-${asset.id}`}
              asset={asset}
              searchParams={searchAssetParams}
            />
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

import { useInfiniteAssetSearch } from '@/hooks/asset/useAsset';
import { useLayoutEffect, useState } from 'react';
import AssetListItem from '@/app/_component/AssetListItem';
import { ClipLoader } from 'react-spinners';

interface AudioProps {
  userId: string;
}

export default function Audio({ userId }: AudioProps) {
  const [searchAssetParams, setSearchAssetParams] = useState<SearchAssetParams>({
    userId: userId,
    title: '',
    page: 0,
    size: 25,
    sort: 'createdDate,desc',
    limit: 25,
  });

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
    const observerTarget = document.getElementById('user-page-observer');

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
      <div className="flex flex-col gap-10">
        {assetResultList.map((asset) => (
          <AssetListItem key={`user-page-asset-${asset.id}`} asset={asset} />
        ))}
      </div>

      {isFetchingNextPage ? (
        <div className="flex h-60 w-full items-center justify-center">
          <ClipLoader color={'#ffffff'} />
        </div>
      ) : (
        <div id="user-page-observer" className="h-2"></div>
      )}
    </div>
  );
}

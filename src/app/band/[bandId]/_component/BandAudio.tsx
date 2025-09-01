import { useLayoutEffect, useState } from 'react';
import { useInfiniteAssetSearch } from '@/hooks/asset/useAsset';
import { ClipLoader } from 'react-spinners';
import AssetListItem from '@/app/_component/AssetListItem';

interface BandAudioProps {
  bandId: string;
}

export default function BandAudio({ bandId }: BandAudioProps) {
  // states
  const [searchAssetParams, setSearchAssetParams] = useState<SearchParams>({
    isPublic: false,
    belongBandId: bandId,
    page: 0,
    size: 25,
    sort: 'createdDate,desc',
    limit: 25,
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

  const assetListResult = assetList?.pages.flatMap((page) => page.result) ?? [];

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
      {assetListResult.length === 0 && (
        <div className="text-lg font-semibold">No your Audio. Just drag & drop your music.</div>
      )}
      {assetListResult.map((v) => (
        <AssetListItem
          key={`band-audio-asset-key-${v.id}`}
          asset={v}
          searchParams={searchAssetParams}
        />
      ))}
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

'use client';

// interface MainProps {
//
// }

import { useAssetSearch } from '@/hooks/asset/useAsset';
import AssetListItem from '@/app/_component/AssetListItem';
import { useState } from 'react';

export default function Main() {
  // useState
  const [currentPlayingAssetId, setCurrentPlayingAssetId] = useState<string | null>(null);

  // hooks
  const { assetList } = useAssetSearch();

  // functions
  function hadndleCurrentPlayingAssetId(assetId: string | null) {
    setCurrentPlayingAssetId(assetId);
  }

  return (
    <div className="flex flex-col gap-10">
      {assetList &&
        assetList.map((asset) => (
          <AssetListItem
            key={`asset-list-item-key-${asset.id}`}
            asset={asset}
            currentPlayingAssetId={currentPlayingAssetId}
            hadndleCurrentPlayingAssetId={hadndleCurrentPlayingAssetId}
          />
        ))}
    </div>
  );
}

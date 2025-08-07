'use client';

// interface MainProps {
//
// }

import { useAssetSearch } from '@/hooks/asset/useAsset';
import AssetListItem from '@/app/_component/AssetListItem';

export default function Main() {
  // hooks
  const { assetList } = useAssetSearch();

  return (
    <div className="flex flex-col gap-10">
      {assetList &&
        assetList.map((asset) => (
          <AssetListItem key={`asset-list-item-key-${asset.id}`} asset={asset} />
        ))}
    </div>
  );
}

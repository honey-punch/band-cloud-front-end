import WaveAudioPlayer from '@/app/_component/WaveAudioPlayer';
import { useState } from 'react';

interface AssetListItemProps {
  asset: Asset;
  currentPlayingAssetId: string | null;

  hadndleCurrentPlayingAssetId(assetId: string | null): void;
}

export default function AssetListItem({
  asset,
  currentPlayingAssetId,
  hadndleCurrentPlayingAssetId,
}: AssetListItemProps) {
  const [thumbnailSrc, setThumbnailSrc] = useState<string>(`/file/thumbnail/${asset.id}`);
  return (
    <div className="flex gap-6">
      <img
        src={thumbnailSrc}
        onError={() => {
          setThumbnailSrc('/default-thumbnail.jpg');
        }}
        alt="thumbnail"
        className="w-48 h-48 object-cover"
      />
      <WaveAudioPlayer
        title={asset.title}
        assetId={asset.id}
        userId={asset.userId}
        src={`/file/audio/${asset.id}`}
        currentPlayingAssetId={currentPlayingAssetId}
        hadndleCurrentPlayingAssetId={hadndleCurrentPlayingAssetId}
      />
    </div>
  );
}

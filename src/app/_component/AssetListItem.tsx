import WaveAudioPlayer from '@/app/_component/WaveAudioPlayer';

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
  return (
    <div>
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

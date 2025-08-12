import WaveAudioPlayer from '@/app/_component/WaveAudioPlayer';
import { useState } from 'react';

interface AssetListItemProps {
  asset: Asset;
}

export default function AssetListItem({ asset }: AssetListItemProps) {
  const [thumbnailSrc, setThumbnailSrc] = useState<string>(`/file/thumbnail/${asset.id}`);
  const [audioSrc, setAudioSrc] = useState<string>(`/file/audio/${asset.id}`);

  function handleChangeAudioSrc(audioSrc: string) {
    setAudioSrc(audioSrc);
  }

  return (
    <div className="flex gap-6">
      <img
        src={thumbnailSrc}
        onError={() => {
          setThumbnailSrc('/default-thumbnail.jpg');
        }}
        alt="thumbnail"
        className="w-44 h-44 object-cover"
      />
      <WaveAudioPlayer
        title={asset.title}
        assetId={asset.id}
        userId={asset.userId}
        src={audioSrc}
        handleChangeAudioSrc={handleChangeAudioSrc}
      />
    </div>
  );
}

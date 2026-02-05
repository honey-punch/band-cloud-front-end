import { useState, useEffect } from 'react';
import { useUserById } from '@/hooks/user/useUser';
import { IoMdPlay, IoMdPause } from 'react-icons/io';
import { useStore } from '@/shared/rootStore';
import { useRouter } from 'next/navigation';
import { useUpdateAsset } from '@/hooks/asset/useAsset';
import WaveformCanvas from '@/app/_component/WaveformCanvas';

interface WaveAudioPlayerProps {
  title: string;
  assetId: string;
  userId: string;
  src: string;
  isMe: boolean;
}

export default function WaveAudioPlayer({
  title,
  assetId,
  userId,
  src,
  isMe,
}: WaveAudioPlayerProps) {
  // zustand
  const currentAssetId = useStore((state) => state.currentAssetId);
  const isPlaying = useStore((state) => state.isPlaying);
  const currentTime = useStore((state) => state.currentTime);

  const togglePlayPause = useStore((state) => state.togglePlayPause);
  const seekTo = useStore((state) => state.seekTo);

  // constants
  const isCurrent = currentAssetId === assetId;

  // hooks
  const { user } = useUserById(userId);
  const router = useRouter();
  const { updateAsset } = useUpdateAsset(assetId);

  // states
  const [titleValue, setTitleValue] = useState<string>(title);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (titleValue !== title) {
        updateAsset({ title: titleValue });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [titleValue]);

  function onPlayPause() {
    togglePlayPause(assetId);
  }

  return (
    <div className="flex flex-col justify-between pt-2 pb-2">
      <div className="flex gap-4 items-center">
        <button
          onClick={onPlayPause}
          className="w-14 h-14 rounded-full cursor-pointer hover:bg-zinc-200 active:bg-zinc-300 transition-colors bg-white text-black flex items-center pl-1 text-3xl justify-center"
        >
          {isCurrent && isPlaying ? <IoMdPause /> : <IoMdPlay />}
        </button>

        <div>
          {isMe ? (
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              className="font-bold text-2xl focus:outline-none hover:text-zinc-300 border border-zinc-300/0 hover:border-zinc-300 transition-[color,border] px-2 py-1 rounded"
            />
          ) : (
            <div className="font-bold text-2xl cursor-default">{title}</div>
          )}

          <div
            onClick={() => router.push(`/user/${userId}`)}
            className="font-bold text-2xl text-zinc-500 cursor-pointer hover:text-zinc-300 active:text-zinc-400 transition-colors"
          >
            {user?.name}
          </div>
        </div>
      </div>

      <div className="relative w-[500px]">
        <WaveformCanvas
          src={src}
          currentTime={isCurrent ? currentTime : 0}
          onSeek={(t) => {
            seekTo(assetId, t);
          }}
        />
      </div>
    </div>
  );
}

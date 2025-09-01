import React, { useEffect, useRef, useState } from 'react';
import { useUserById } from '@/hooks/user/useUser';
import { IoMdPlay, IoMdPause } from 'react-icons/io';
import { useStore } from '@/shared/rootStore';
import Progress from '@/app/_component/Progress';
import { useRouter } from 'next/navigation';
import { useUpdateAsset } from '@/hooks/asset/useAsset';

interface WaveAudioPlayerProps {
  title: string;
  assetId: string;
  userId: string;
  src: string;
  searchParams: SearchParams;
  isMe: boolean;
}

export default function WaveAudioPlayer({
  title,
  assetId,
  userId,
  src,
  searchParams,
  isMe,
}: WaveAudioPlayerProps) {
  // useRef
  const audioRef = useRef<HTMLAudioElement>(null);

  // zustand
  const currentAssetId = useStore((state) => state.currentAssetId);
  const setCurrentAssetId = useStore((state) => state.setCurrentAssetId);
  const isPlaying = useStore((state) => state.isPlaying);
  const audioEl = useStore((state) => state.audioEl);
  const currentTime = useStore((state) => state.currentTime);
  const setCurrentTime = useStore((state) => state.setCurrentTime);

  // constants
  const isCurrent = currentAssetId === assetId;

  // hooks
  const { user } = useUserById(userId);
  const router = useRouter();
  const { updateAsset } = useUpdateAsset(assetId, searchParams);

  // states
  const [itemDuration, setItemDuration] = useState<number>(0);
  const [titleValue, setTitleValue] = useState<string>(title);

  // effects
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    const audio = audioRef.current;

    function handleLoadedMetadata() {
      setItemDuration(audio.duration);
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioRef.current]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateAsset({ title: titleValue });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [titleValue]);

  // functions
  function onPlayPause() {
    if (!audioEl) {
      return;
    }

    setCurrentAssetId(assetId);

    audioEl.onloadedmetadata = () => {
      audioEl.currentTime = 0;
      audioEl.play();
    };

    if (currentAssetId === assetId) {
      audioEl.paused ? audioEl.play() : audioEl.pause();
    }
  }

  const handleChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (!isCurrent) {
      setCurrentAssetId(assetId);
      setCurrentTime(value);

      if (audioEl) {
        audioEl.onloadedmetadata = () => {
          audioEl.currentTime = value;
          audioEl.play();
        };
      }
    } else {
      setCurrentTime(value);
      if (audioEl) {
        audioEl.currentTime = value;
      }
    }
  };

  return (
    <div className="flex flex-col justify-between pt-2 pb-2">
      <audio src={src} ref={audioRef} className="hidden" />

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
              onChange={(e) => {
                setTitleValue(e.target.value);
              }}
              className="font-bold text-2xl focus:outline-none"
            />
          ) : (
            <div className="font-bold text-2xl">{title}</div>
          )}
          <div
            onClick={() => {
              router.push(`/user/${userId}`);
            }}
            className="font-bold text-2xl text-zinc-500 cursor-pointer hover:text-zinc-300 active:text-zinc-400 transition-colors"
          >
            {user?.name}
          </div>
        </div>
      </div>

      <div className="relative w-[500px]">
        <Progress
          duration={itemDuration}
          currentTime={isCurrent ? currentTime : audioRef.current?.currentTime || 0}
          handleChangeProgress={handleChangeProgress}
        />
      </div>
    </div>
  );
}

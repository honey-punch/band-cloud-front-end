'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AudioContext } from '@/app/_component/CurrentAudioProvider';
import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi';
import { IoMdPlay, IoMdPause } from 'react-icons/io';
import { useAssetById } from '@/hooks/asset/useAsset';
import { useUserById } from '@/hooks/user/useUser';
import Progress from '@/app/_component/Progress';

export default function BottomPlayer() {
  // context
  const {
    volume,
    setVolume,
    prevVolume,
    setPrevVolume,
    isMuted,
    setIsMuted,
    currentWavesurferRef,
    isPlaying,
    currentPlayingAssetId,
  } = useContext(AudioContext);

  // hooks
  const { asset } = useAssetById(currentPlayingAssetId || '');
  const { user } = useUserById(asset?.userId || '');

  // useState
  const [thumbnailSrc, setThumbnailSrc] = useState<string>(
    currentPlayingAssetId ? `/file/thumbnail/${currentPlayingAssetId}` : '/default-thumbnail.jpg',
  );

  // useEffect
  useEffect(() => {
    currentPlayingAssetId
      ? setThumbnailSrc(`/file/thumbnail/${currentPlayingAssetId}`)
      : setThumbnailSrc('/default-thumbnail.jpg');
  }, [currentPlayingAssetId]);

  // functions
  function handleChangeVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const newVolume = parseFloat(e.target.value);

    currentWavesurferRef.current && currentWavesurferRef.current.setVolume(newVolume);

    if (newVolume === 0) {
      currentWavesurferRef.current && currentWavesurferRef.current.setMuted(true);
      setIsMuted(true);
      setVolume(newVolume);
    } else {
      currentWavesurferRef.current && currentWavesurferRef.current.setMuted(false);
      setIsMuted(false);
      setVolume(newVolume);
    }
  }

  function handleChangePrevVolume() {
    if (volume === 0) {
      return;
    }
    setPrevVolume(volume);
  }

  function handleClickMute() {
    setIsMuted(!isMuted);
    setVolume(isMuted ? prevVolume : 0);

    if (currentWavesurferRef.current) {
      currentWavesurferRef.current.setMuted(!isMuted);
      currentWavesurferRef.current.setVolume(isMuted ? prevVolume : 0);
    }
  }

  function handleClickPlay() {
    currentWavesurferRef.current && currentWavesurferRef.current.playPause();
  }

  return (
    <div className="h-20 bg-zinc-800 px-8 flex items-center gap-8">
      {/* 재생 */}
      <button
        onClick={handleClickPlay}
        className="w-12 h-12 rounded-full cursor-pointer hover:bg-zinc-200 active:bg-zinc-300 transition-colors bg-white text-black flex items-center pl-1 text-xl justify-center"
      >
        {isPlaying ? <IoMdPause /> : <IoMdPlay />}
      </button>

      {/*프로그레스*/}
      <Progress />

      {/* 볼륨 */}
      <div className="relative group">
        <button
          onClick={handleClickMute}
          className="cursor-pointer hover:text-zinc-500 active:bg-zinc-600 transition-colors text-3xl p-6 box-border"
        >
          {isMuted ? <PiSpeakerSimpleSlashFill /> : <PiSpeakerSimpleHighFill />}
        </button>

        <div className="hidden group-hover:flex justify-center items-center absolute left-1/2 -translate-x-1/2 rotate-270 -top-[110px] rounded-lg border-zinc-500 bg-black border p-6">
          <input
            type="range"
            value={volume}
            step={0.01}
            min={0}
            max={1}
            onChange={handleChangeVolume}
            onMouseUp={handleChangePrevVolume}
            className="h-1 bg-zinc-200 appearance-none cursor-pointer range-lg accent-white"
          />
        </div>
      </div>

      {/* 에셋 정보 */}
      <div className="flex items-center gap-3">
        <img
          src={thumbnailSrc}
          alt="thumbnail"
          onError={() => {
            setThumbnailSrc('/default-thumbnail.jpg');
          }}
          className="w-12 h-12 object-cover"
        />

        <div>
          <div className="font-bold">{asset?.title || '선택된 오디오 없음'}</div>
          <div className="font-bold text-zinc-500">{user?.name || '알 수 없는 사용자'}</div>
        </div>
      </div>
    </div>
  );
}

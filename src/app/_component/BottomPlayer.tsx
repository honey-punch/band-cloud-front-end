'use client';

import React, { useEffect, useState } from 'react';

import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi';
import { IoMdPlay, IoMdPause } from 'react-icons/io';
import { useAssetById } from '@/hooks/asset/useAsset';
import { useUserById } from '@/hooks/user/useUser';
import Progress from '@/app/_component/Progress';
import { useStore } from '@/shared/rootStore';

export default function BottomPlayer() {
  // zustand
  const audioEl = useStore((state) => state.audioEl);
  const setAudioEl = useStore((state) => state.setAudioEl);
  const currentAssetId = useStore((state) => state.currentAssetId);
  const isPlaying = useStore((state) => state.isPlaying);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const duration = useStore((state) => state.duration);
  const setDuration = useStore((state) => state.setDuration);
  const currentTime = useStore((state) => state.currentTime);
  const setCurrentTime = useStore((state) => state.setCurrentTime);

  // hooks
  const { asset } = useAssetById(currentAssetId || '');
  const { user } = useUserById(asset?.userId || '');

  // states
  const [volume, setVolume] = useState<number>(1);
  const [prevVolume, setPrevVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [thumbnailSrc, setThumbnailSrc] = useState<string>(
    currentAssetId ? `/file/thumbnail/${currentAssetId}` : '/default-thumbnail.jpg',
  );

  // effects
  useEffect(() => {
    if (!audioEl) return;

    if (currentAssetId) {
      setThumbnailSrc(`/file/thumbnail/${currentAssetId}`);
      audioEl.src = `/file/audio/${currentAssetId}`;
      audioEl.load();
    } else {
      setThumbnailSrc('/default-thumbnail.jpg');
      audioEl.src = '/default.mp3';
      audioEl.load();
    }
  }, [currentAssetId, audioEl]);

  // functions
  function handleChangeVolume(e: React.ChangeEvent<HTMLInputElement>) {
    if (!audioEl) {
      return;
    }

    const newVolume = Number(e.target.value);

    audioEl.volume = newVolume;
    setVolume(newVolume);

    if (newVolume === 0) {
      setIsMuted(true);
      audioEl.muted = true;
    } else {
      setIsMuted(false);
      audioEl.muted = false;
    }
  }

  function handleChangePrevVolume() {
    if (volume === 0) {
      return;
    }

    setPrevVolume(volume);
  }

  function handleClickMute() {
    if (!audioEl) {
      return;
    }

    audioEl.muted = !isMuted;
    audioEl.volume = isMuted ? prevVolume : 0;

    setIsMuted(!isMuted);
    setVolume(isMuted ? prevVolume : 0);
  }

  function handleClickPlay() {
    if (!audioEl) {
      return;
    }

    audioEl.paused ? audioEl.play() : audioEl.pause();
  }

  const handleChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setCurrentTime(value);

    if (audioEl) {
      audioEl.currentTime = value;
    }
  };

  return (
    <div className="h-20 bg-zinc-900 px-8 flex items-center gap-8 w-full">
      {/* 재생 */}
      <button
        onClick={handleClickPlay}
        className="w-12 h-12 shrink-0 grow-0 rounded-full cursor-pointer hover:bg-zinc-200 active:bg-zinc-300 transition-colors bg-white text-black flex items-center pl-1 text-xl justify-center"
      >
        {isPlaying ? <IoMdPause /> : <IoMdPlay />}
      </button>

      {/*프로그레스*/}
      <Progress
        duration={duration}
        currentTime={currentTime}
        handleChangeProgress={handleChangeProgress}
      />

      <audio
        ref={(el) => setAudioEl(el)}
        controls
        // autoPlay={!!currentAssetId}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime);
        }}
        onDurationChange={(e) => {
          setDuration(e.currentTarget.duration);
        }}
        src={currentAssetId ? `/file/audio/${currentAssetId}` : '/default.mp3'}
        className="hidden"
      ></audio>

      {/* 볼륨 */}
      <div className="relative group z-20">
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
            step="0.01"
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
          <div className="font-bold whitespace-nowrap">{asset?.title || '선택된 오디오 없음'}</div>
          <div className="font-bold whitespace-nowrap text-zinc-500">
            {user?.name || '알 수 없는 사용자'}
          </div>
        </div>
      </div>
    </div>
  );
}

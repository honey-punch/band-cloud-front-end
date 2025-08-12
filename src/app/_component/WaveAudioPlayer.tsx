import React, { useContext, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover.esm.js';
import { useUserById } from '@/hooks/user/useUser';
import { secWithMsTohhmmss } from '@/utils/util';
import { IoMdPlay, IoMdPause } from 'react-icons/io';

import { AudioContext } from '@/app/_component/CurrentAudioProvider';

interface WaveAudioPlayerProps {
  title: string;
  assetId: string;
  userId: string;
  src: string;

  handleChangeAudioSrc(audioSrc: string): void;
}

export default function WaveAudioPlayer({
  title,
  assetId,
  userId,
  src,
  handleChangeAudioSrc,
}: WaveAudioPlayerProps) {
  // useRef
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  // useContext
  const {
    currentPlayingAssetId,
    setCurrentPlayingAssetId,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    volume,
    currentWavesurferRef,
  } = useContext(AudioContext);

  const isCurrent = currentPlayingAssetId === assetId;

  // hooks
  const { user } = useUserById(userId);

  // useEffect
  useEffect(() => {
    if (!containerRef.current) return;

    // WaveSurfer 인스턴스 생성
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'white',
      progressColor: '#ff6900',
      cursorColor: 'black',
      height: 80,
      width: 500,
      barWidth: 3,
      barGap: 2,
      plugins: [
        HoverPlugin.create({
          lineColor: '#ff6900',
          lineWidth: 4,
          labelBackground: 'rgba(16, 24, 40, 0.8)',
          labelColor: '#fff',
          labelSize: '12px',
          labelPreferLeft: false,
        }),
      ],
    });

    wavesurferRef.current = ws;

    ws.load(src);

    ws.on('ready', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    ws.on('error', () => {
      handleChangeAudioSrc('/default.mp3');
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));

    ws.on('audioprocess', () => {
      if (!ws) return;
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on('finish', () => {
      setIsPlaying(false);
    });

    return () => {
      ws.destroy();
      wavesurferRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    if (!wavesurferRef.current) {
      return;
    }

    const ws = wavesurferRef.current;

    if (!isCurrent) {
      ws.pause();
      ws.setTime(0);
      setCurrentTime(0);
    } else {
      currentWavesurferRef.current = ws;
    }
  }, [currentPlayingAssetId]);

  // current 오디오가 변경되면 재생
  useEffect(() => {
    if (!wavesurferRef.current) return;

    const ws = wavesurferRef.current;

    if (isCurrent && !ws.isPlaying()) {
      ws.play();
    }
  }, [isCurrent]);

  useEffect(() => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.setVolume(volume);
  }, [volume, wavesurferRef.current]);

  // functions
  function onPlayPause() {
    const ws = wavesurferRef.current;
    if (!ws) return;

    // 이미 현재 재생 중인 오디오인 경우: 재생/정지 토글
    if (currentPlayingAssetId === assetId) {
      ws.playPause();
      return;
    }

    // 다른 오디오가 재생 중이면 정지하고 초기화
    if (currentWavesurferRef.current && currentWavesurferRef.current !== ws) {
      currentWavesurferRef.current.pause();
      currentWavesurferRef.current.setTime(0);
    }

    // 새로운 오디오 재생
    currentWavesurferRef.current = ws;
    setCurrentPlayingAssetId(assetId);
    ws.play();
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex gap-4 items-center">
        <button
          onClick={onPlayPause}
          className="w-14 h-14 rounded-full cursor-pointer hover:bg-zinc-200 active:bg-zinc-300 transition-colors bg-white text-black flex items-center pl-1 text-3xl justify-center"
        >
          {isCurrent && isPlaying ? <IoMdPause /> : <IoMdPlay />}
        </button>
        <div>
          <div className="font-bold text-2xl">{title}</div>
          <div className="font-bold text-2xl text-zinc-500">{user?.name}</div>
        </div>
      </div>

      <div className="relative w-full">
        <div ref={containerRef} className="cursor-pointer" style={{ width: '100%' }} />

        <div className="absolute bottom-0 left-0 bg-zinc-900/80 z-10 text-sm px-1">
          {secWithMsTohhmmss(isCurrent ? currentTime : 0)}
        </div>
        <div className="absolute bottom-0 right-0 bg-zinc-900/80 z-10 text-sm px-1">
          {secWithMsTohhmmss(wavesurferRef.current?.getDuration() || 0)}
        </div>
      </div>
    </div>
  );
}

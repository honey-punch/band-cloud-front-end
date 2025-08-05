import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover.esm.js';
import { useUserById } from '@/hooks/user/useUser';
import { secWithMsTohhmmss } from '@/utils/util';
import { IoMdPlay, IoMdPause } from 'react-icons/io';

interface WaveAudioPlayerProps {
  title: string;
  assetId: string;
  userId: string;
  src: string;
  currentPlayingAssetId: string | null;

  hadndleCurrentPlayingAssetId(assetId: string | null): void;
}

export default function WaveAudioPlayer({
  title,
  assetId,
  userId,
  src,
  currentPlayingAssetId,
  hadndleCurrentPlayingAssetId,
}: WaveAudioPlayerProps) {
  // useRef
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  // hooks
  const { user } = useUserById(userId);

  // useState
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // useEffect
  useEffect(() => {
    if (!containerRef.current) return;

    // WaveSurfer 인스턴스 생성
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'white',
      progressColor: 'orange',
      cursorColor: 'black',
      height: 80,
      barWidth: 4,
      barGap: 2,
      barRadius: 9999,
      plugins: [
        HoverPlugin.create({
          lineColor: '#ff6600',
          lineWidth: 4,
          labelBackground: '#555',
          labelColor: '#fff',
          labelSize: '11px',
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

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));

    ws.on('audioprocess', () => {
      if (!ws) return;
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on('finish', () => {
      setIsPlaying(false);
      hadndleCurrentPlayingAssetId(null);
    });

    return () => {
      ws.destroy();
      wavesurferRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    if (!wavesurferRef.current) return;

    const ws = wavesurferRef.current;

    if (ws.isPlaying() && currentPlayingAssetId !== assetId) {
      ws.pause();
    }
  }, [currentPlayingAssetId]);

  // functions
  function onPlayPause() {
    if (!wavesurferRef.current) {
      return;
    }

    wavesurferRef.current.playPause();

    wavesurferRef.current.isPlaying()
      ? hadndleCurrentPlayingAssetId(assetId)
      : hadndleCurrentPlayingAssetId(null);
  }

  console.log(isPlaying);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 items-center">
        <button
          onClick={onPlayPause}
          className="w-14 h-14 rounded-full cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition-colors bg-white text-black flex items-center pl-1 text-3xl justify-center"
        >
          {isPlaying ? <IoMdPause /> : <IoMdPlay />}
        </button>
        <div>
          <div className="font-bold text-2xl">{title}</div>
          <div className="font-bold text-2xl text-gray-500">{user?.name}</div>
        </div>
      </div>

      <div>
        {secWithMsTohhmmss(currentTime)}/
        {secWithMsTohhmmss(wavesurferRef.current?.getDuration() || 0)}
      </div>

      <div ref={containerRef} className="relative cursor-pointer" style={{ width: '100%' }} />
    </div>
  );
}

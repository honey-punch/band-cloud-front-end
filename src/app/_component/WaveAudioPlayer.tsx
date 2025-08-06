import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover.esm.js';
import { useUserById } from '@/hooks/user/useUser';
import { secWithMsTohhmmss } from '@/utils/util';
import { IoMdPlay, IoMdPause } from 'react-icons/io';
import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi';

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
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [prevVolume, setPrevVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

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

  function handleChangeVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const newVolume = parseFloat(e.target.value);

    wavesurferRef.current?.setVolume(newVolume);

    if (newVolume === 0) {
      wavesurferRef.current?.setMuted(true);
      setIsMuted(true);
      setVolume(newVolume);
    } else {
      wavesurferRef.current?.setMuted(false);
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

  function handleChangeMute() {
    setIsMuted(!isMuted);
    setVolume(isMuted ? prevVolume : 0);
    wavesurferRef.current?.setMuted(!isMuted);
    wavesurferRef.current?.setVolume(isMuted ? prevVolume : 0);
  }

  return (
    <div className="flex flex-col gap-2">
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

      <div className="flex items-center gap-2">
        <button
          onClick={handleChangeMute}
          className="cursor-pointer hover:bg-white hover:text-black active:bg-gray-300 active:text-black transition-colors p-2 rounded-full"
        >
          {isMuted ? <PiSpeakerSimpleSlashFill /> : <PiSpeakerSimpleHighFill />}
        </button>

        <input
          type="range"
          value={volume}
          step={0.01}
          min={0}
          max={1}
          onChange={handleChangeVolume}
          onMouseUp={handleChangePrevVolume}
          className="h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-orange-500"
        />
      </div>

      <div className="relative w-full">
        <div ref={containerRef} className="cursor-pointer" style={{ width: '100%' }} />
        <div className="absolute bottom-0 left-0 bg-gray-900/80 z-10 text-sm px-1">
          {secWithMsTohhmmss(currentTime)}
        </div>
        <div className="absolute bottom-0 right-0 bg-gray-900/80 z-10 text-sm px-1">
          {secWithMsTohhmmss(wavesurferRef.current?.getDuration() || 0)}
        </div>
      </div>
    </div>
  );
}

'use client';

import { createContext, ReactNode, RefObject, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

type AudioContextType = {
  currentPlayingAssetId: string | null;
  setCurrentPlayingAssetId(id: string | null): void;
  isPlaying: boolean;
  setIsPlaying(isPlaying: boolean): void;
  currentTime: number;
  setCurrentTime(currentTime: number): void;
  volume: number;
  setVolume(volume: number): void;
  prevVolume: number;
  setPrevVolume(prevVolume: number): void;
  isMuted: boolean;
  setIsMuted(isMuted: boolean): void;
  currentWavesurferRef: RefObject<WaveSurfer | null>;
};

export const AudioContext = createContext<AudioContextType>({
  currentPlayingAssetId: null,
  setCurrentPlayingAssetId: (id: string | null) => {},
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => {},
  currentTime: 0,
  setCurrentTime: (currentTime: number) => {},
  volume: 1,
  setVolume: (volume: number) => {},
  prevVolume: 1,
  setPrevVolume: (prevVolume: number) => {},
  isMuted: false,
  setIsMuted: (isMuted: boolean) => {},
  currentWavesurferRef: { current: null },
});

type Props = { children: ReactNode };

export default function CurrentAudioProvider({ children }: Props) {
  const currentWavesurferRef = useRef<WaveSurfer | null>(null);

  const [currentPlayingAssetId, setCurrentPlayingAssetId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [prevVolume, setPrevVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  return (
    <AudioContext.Provider
      value={{
        currentPlayingAssetId,
        setCurrentPlayingAssetId,
        isPlaying,
        setIsPlaying,
        currentTime,
        setCurrentTime,
        volume,
        setVolume,
        prevVolume,
        setPrevVolume,
        isMuted,
        setIsMuted,
        currentWavesurferRef,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

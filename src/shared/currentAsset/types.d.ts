interface CurrentAssetState {
  audioEl: HTMLAudioElement | null;
  setAudioEl: (ref: HTMLAudioElement | null) => void;

  currentAssetId: string | null;
  setCurrentAssetId: (id: string) => void;

  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;

  duration: number;
  setDuration: (duration: number) => void;

  currentTime: number;
  setCurrentTime: (currentTime: number) => void;
}

a;

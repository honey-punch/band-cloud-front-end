import { BoundState } from '@/shared/rootStore';

import { SlicePattern } from 'zustand';

export const createCurrentAssetSlice: SlicePattern<CurrentAssetState, BoundState> = (set) => ({
  audioEl: null,
  setAudioEl: (el) => set({ audioEl: el }, false, { type: 'currentAsset/setAudioEl' }),

  currentAssetId: null,
  setCurrentAssetId: (id: string) =>
    set(
      (state) => {
        state.currentAssetId = id;
      },
      false,
      { type: 'currentAsset/setCurrentAssetId' },
    ),

  isPlaying: false,
  setIsPlaying: (isPlaying) =>
    set(
      (state) => {
        state.isPlaying = isPlaying;
      },
      false,
      { type: 'currentAsset/setIsPlaying' },
    ),

  // 초단위
  duration: 0,
  setDuration: (duration) =>
    set(
      (state) => {
        state.duration = duration;
      },
      false,
      { type: 'currentAsset/setDuration' },
    ),

  // 초단위
  currentTime: 0,
  setCurrentTime: (currentTime) =>
    set(
      (state) => {
        state.currentTime = currentTime;
      },
      false,
      { type: 'currentAsset/setCurrentTime' },
    ),
});

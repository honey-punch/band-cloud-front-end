import { BoundState } from '@/shared/rootStore';
import { SlicePattern } from 'zustand';

export const createCurrentAssetSlice: SlicePattern<CurrentAssetState, BoundState> = (set, get) => ({
  audioEl: null,
  setAudioEl: (el) => set({ audioEl: el }, false, { type: 'currentAsset/setAudioEl' }),

  currentAssetId: null,
  setCurrentAssetId: (id: string | null) =>
    set(
      (state) => {
        state.currentAssetId = id;
      },
      false,
      { type: 'currentAsset/setCurrentAssetId' },
    ),

  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) =>
    set(
      (state) => {
        state.isPlaying = isPlaying;
      },
      false,
      { type: 'currentAsset/setIsPlaying' },
    ),

  duration: 0,
  setDuration: (duration: number) =>
    set(
      (state) => {
        state.duration = duration;
      },
      false,
      { type: 'currentAsset/setDuration' },
    ),

  currentTime: 0,
  setCurrentTime: (currentTime: number) =>
    set(
      (state) => {
        state.currentTime = currentTime;
      },
      false,
      { type: 'currentAsset/setCurrentTime' },
    ),

  thumbnailUrl: null,
  setThumbnailUrl: (url: string | null) =>
    set(
      (state) => {
        state.thumbnailUrl = url;
      },
      false,
      { type: 'currentAsset/setThumbnail' },
    ),

  isLoadingThumbnail: false,
  setIsLoadingThumbnail: (isLoadingThumbnail: boolean) =>
    set(
      (state) => {
        state.isLoadingThumbnail = isLoadingThumbnail;
      },
      false,
      { type: 'currentAsset/isLoadingThumbnail' },
    ),

  /** ⭐ 추가: 특정 asset 재생 시작 */
  playAsset: async (assetId: string, startTime = 0) => {
    const { audioEl } = get();
    if (!audioEl) return;

    // 상태 업데이트
    set(
      (state) => {
        state.currentAssetId = assetId;
        state.currentTime = startTime;
        state.thumbnailUrl = `/file/thumbnail/${assetId}?t=${Date.now()}`;
        state.isLoadingThumbnail = true;
      },
      false,
      { type: 'currentAsset/playAsset' },
    );

    // audio 세팅
    audioEl.src = `/file/audio/${assetId}`;
    audioEl.load();

    // 메타 로드 후 재생
    audioEl.onloadedmetadata = () => {
      audioEl.currentTime = startTime;
      audioEl.play();
    };
  },

  /** ⭐ 추가: 현재 재생중이면 pause / 아니면 play */
  togglePlayPause: async (assetId: string) => {
    const { audioEl, currentAssetId } = get();
    if (!audioEl) return;

    // 같은 곡이면 토글
    if (currentAssetId === assetId) {
      audioEl.paused ? audioEl.play() : audioEl.pause();
      return;
    }

    // 다른 곡이면 새로 재생
    get().playAsset(assetId, 0);
  },

  /** ⭐ 추가: seek (WaveAudioPlayer에서 드래그/클릭 대응) */
  seekTo: (assetId: string, time: number) => {
    const { audioEl, currentAssetId } = get();
    if (!audioEl) return;

    // 다른 아이템 seek이면 그 아이템으로 바꾸고 해당 위치에서 재생
    if (currentAssetId !== assetId) {
      get().playAsset(assetId, time);
      return;
    }

    // 같은 아이템이면 그냥 seek
    set(
      (state) => {
        state.currentTime = time;
      },
      false,
      { type: 'currentAsset/seekTo' },
    );

    audioEl.currentTime = time;
  },
});

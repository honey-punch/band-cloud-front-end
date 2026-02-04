import { BoundState } from '@/shared/rootStore';

import { SlicePattern } from 'zustand';

export const createCurrentUserSlice: SlicePattern<CurrentUserState, BoundState> = (set) => ({
  isOpenLoginModal: false,
  setIsOpenLoginModal: (isOpenLoginModal) =>
    set(
      (state) => {
        state.isOpenLoginModal = isOpenLoginModal;
      },
      false,
      { type: 'currentUser/setIsOpenLoginModal' },
    ),

  me: null,
  setMe: (me) =>
    set(
      (state) => {
        state.me = me;
      },
      false,
      { type: 'currentUser/setMe' },
    ),

  avatarUrl: null,
  setAvatarUrl: (avatarUrl) =>
    set(
      (state) => {
        state.avatarUrl = avatarUrl;
      },
      false,
      { type: 'currentUser/setAvatarUrl' },
    ),

  isAvatarLoading: false,
  setIsAvatarLoading: (isAvatarLoading) =>
    set(
      (state) => {
        state.isAvatarLoading = isAvatarLoading;
      },
      false,
      { type: 'currentUser/setIsAvatarLoading' },
    ),
});

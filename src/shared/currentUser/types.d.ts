interface CurrentUserState {
  isOpenLoginModal: boolean;
  setIsOpenLoginModal: (value: boolean) => void;

  me: User | null;
  setMe: (me: User | null) => void;

  avatarUrl: string | null;
  setAvatarUrl: (avatarUrl: string | null) => void;

  isAvatarLoading: boolean;
  setIsAvatarLoading: (isAvatarLoading: boolean) => void;
}

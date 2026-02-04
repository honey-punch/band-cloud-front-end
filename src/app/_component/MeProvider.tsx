'use client';

import { createContext, ReactNode, useState } from 'react';

type Props = { children: ReactNode; initMe: User | null };

type MeContextType = {
  isOpenLoginModal: boolean;
  setIsOpenLoginModal(value: boolean): void;
  me: User | null;
  setMe(me: User | null): void;
  avatarUrl: string | null;
  setAvatarUrl(avatarUrl: string | null): void;
  isAvatarLoading: boolean;
  setIsAvatarLoading(isAvatarLoading: boolean): void;
};

export const MeContext = createContext<MeContextType>({
  isOpenLoginModal: false,
  setIsOpenLoginModal: (value: boolean) => {},
  me: null,
  setMe: (me: User | null) => {},
  avatarUrl: null,
  setAvatarUrl: (avatarUrl: string | null) => {},
  isAvatarLoading: false,
  setIsAvatarLoading: (isAvatarLoading: boolean) => {},
});

export default function MeProvider({ children, initMe }: Props) {
  // states
  const [isOpenLoginModal, setIsOpenLoginModal] = useState<boolean>(false);
  const [me, setMe] = useState<User | null>(initMe);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState<boolean>(false);

  return (
    <MeContext.Provider
      value={{
        isOpenLoginModal,
        setIsOpenLoginModal,
        me,
        setMe,
        avatarUrl,
        setAvatarUrl,
        isAvatarLoading,
        setIsAvatarLoading,
      }}
    >
      {children}
    </MeContext.Provider>
  );
}

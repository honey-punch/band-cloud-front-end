'use client';

import { createContext, ReactNode, useState } from 'react';

type Props = { children: ReactNode; initMe: User | null };

type MeContextType = {
  isOpenLoginModal: boolean;
  setIsOpenLoginModal(value: boolean): void;
  me: User | null;
  setMe(me: User | null): void;
};

export const MeContext = createContext<MeContextType>({
  isOpenLoginModal: false,
  setIsOpenLoginModal: (value: boolean) => {},
  me: null,
  setMe: (me: User | null) => {},
});

export default function MeProvider({ children, initMe }: Props) {
  // states
  const [isOpenLoginModal, setIsOpenLoginModal] = useState<boolean>(false);
  const [me, setMe] = useState<User | null>(initMe);

  return (
    <MeContext.Provider
      value={{
        isOpenLoginModal,
        setIsOpenLoginModal,
        me,
        setMe,
      }}
    >
      {children}
    </MeContext.Provider>
  );
}

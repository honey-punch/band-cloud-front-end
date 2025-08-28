'use client';

import { useState, useRef, useContext } from 'react';
import LoginModal from '@/app/_component/LoginModal';
import { usePathname, useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa6';
import { UploadContext } from '@/app/_component/UploadProvider';
import { MeContext } from '@/app/_component/MeProvider';
import { useLogout } from '@/hooks/auth/useAuth';
import PopupMenu from '@/components/PopupMenu';
import BackDrop from '@/components/BackDrop';

export default function NavBar() {
  // refs
  const userMenuRef = useRef<HTMLDivElement>(null);

  // hooks
  const router = useRouter();
  const { logout } = useLogout(() => {
    closeUserMenu();
    handleChangeMe(null);
  });
  const pathname = usePathname();

  // context
  const { me, setMe, isOpenLoginModal, setIsOpenLoginModal, avatarSrc, setAvatarSrc } =
    useContext(MeContext);
  const { setIsDrawerOpen } = useContext(UploadContext);

  // states
  const [isOpenUserMenu, setIsOpenUserMenu] = useState<boolean>(false);

  // constants
  const contentArray = [
    {
      text: 'Profile',
      onClick: () => {
        if (!me) {
          setIsOpenLoginModal(true);
          return;
        }
        router.push(`/user/${me?.id}`);
        setIsOpenUserMenu(false);
      },
    },
    {
      text: 'Sign out',
      onClick: () => {
        logout();
      },
    },
  ];

  // functions
  function closeUserMenu() {
    setIsOpenUserMenu(false);
  }

  function closeLoginModal() {
    setIsOpenLoginModal(false);
  }

  function handleChangeMe(me: User | null) {
    setMe(me);
    setAvatarSrc(`/file/avatar/${me?.id}?t=${Date.now()}`);
  }

  return (
    <nav className="flex h-20 items-center justify-between px-8">
      <div
        onClick={() => {
          router.push('/');
        }}
        className="font-bold text-3xl cursor-pointer hover:text-zinc-300 active:text-zinc-400 transition-colors"
      >
        BAND CLOUD
      </div>

      <div className="flex gap-10">
        <NavButton text="Music" isCurrent={pathname === '/'} onClick={() => router.push('/')} />
        <NavButton
          text="Band"
          isCurrent={pathname.startsWith('/band')}
          onClick={() => router.push('/band')}
        />
      </div>

      {me ? (
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsDrawerOpen(true);
            }}
            className="font-semibold text-lg p-3 flex items-center justify-center cursor-pointer hover:text-zinc-300 active:text-zinc-400 transition-colors"
          >
            <FaPlus />
          </button>
          <button
            onClick={() => {
              setIsOpenUserMenu(true);
            }}
            className="flex items-center gap-4 hover:opacity-70 active:opacity-60 transition-opacity cursor-pointer"
          >
            <img src={avatarSrc} alt="avatar" className="object-cover w-10 h-10 rounded-full" />
            <div className="font-bold text-lg">{me.name}</div>
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsOpenLoginModal(true);
          }}
          className="cursor-pointer font-semibold text-lg hover:text-zinc-300 active:text-zinc-400 transition-colors"
        >
          Sign in
        </button>
      )}

      {/* 모달 */}
      {isOpenLoginModal && (
        <BackDrop
          onClick={() => {
            setIsOpenLoginModal(false);
          }}
        >
          <LoginModal closeLoginModal={closeLoginModal} handleChangeMe={handleChangeMe} />
        </BackDrop>
      )}

      {isOpenUserMenu && (
        <div className="absolute right-8 top-18 z-40">
          <PopupMenu
            isOpen={isOpenUserMenu}
            ref={userMenuRef}
            contentArray={contentArray}
            closeMenu={closeUserMenu}
          />
        </div>
      )}
    </nav>
  );
}

interface NavButtonProps {
  text: string;
  isCurrent: boolean;
  onClick: () => void;
}

function NavButton({ text, isCurrent, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${isCurrent ? 'bg-zinc-500' : 'hover:bg-zinc-800 active:bg-zinc-900'} rounded-full font-semibold text-lg cursor-pointer transition-colors py-2 px-5`}
    >
      {text}
    </button>
  );
}

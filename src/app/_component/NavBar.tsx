'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import LoginModal from '@/app/_component/LoginModal';
import UserMenu from '@/app/_component/UserMenu';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa6';
import { UploadContext } from '@/app/_component/UploadProvider';
import { MeContext } from '@/app/_component/MeProvider';

export default function NavBar() {
  // refs
  const userMenuRef = useRef<HTMLDivElement>(null);

  // hooks
  const router = useRouter();

  // context
  const { me, setMe, isOpenLoginModal, setIsOpenLoginModal } = useContext(MeContext);

  // context
  const { setIsDrawerOpen } = useContext(UploadContext);

  // states
  const [isOpenUserMenu, setIsOpenUserMenu] = useState<boolean>(false);
  const [avatarSrc, setAvatarSrc] = useState<string>(
    me ? `/file/avatar/${me.id}` : '/default-avatar.jpg',
  );

  // effects
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        closeUserMenu();
      }
    }

    if (isOpenUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenUserMenu]);

  useEffect(() => {
    if (me) {
      setAvatarSrc(`/file/avatar/${me.id}`);
    }
  }, [me]);

  // functions
  function closeUserMenu() {
    setIsOpenUserMenu(false);
  }

  function closeLoginModal() {
    setIsOpenLoginModal(false);
  }

  function handleChangeMe(me: User | null) {
    setMe(me);
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
            <img
              src={avatarSrc}
              alt="avatar"
              onError={() => {
                setAvatarSrc('/default-avatar.jpg');
              }}
              className="object-cover w-10 h-10 rounded-full"
            />
            <div className="font-semibold text-lg">{me.name}</div>
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
        <div
          onClick={() => {
            setIsOpenLoginModal(false);
          }}
          className="absolute flex justify-center items-center top-0 left-0 w-screen h-screen bg-white/60 z-50"
        >
          <LoginModal closeLoginModal={closeLoginModal} handleChangeMe={handleChangeMe} />
        </div>
      )}

      {isOpenUserMenu && (
        <div className="absolute right-8 top-18">
          <UserMenu
            userMenuRef={userMenuRef}
            closeUserMenu={closeUserMenu}
            handleChangeMe={handleChangeMe}
          />
        </div>
      )}
    </nav>
  );
}

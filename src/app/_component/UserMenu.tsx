import { useLogout } from '@/hooks/auth/useAuth';
import { RefObject } from 'react';
import { useRouter } from 'next/navigation';

interface UserMenuProps {
  userMenuRef: RefObject<HTMLDivElement | null>;

  closeUserMenu(): void;
}

export default function UserMenu({ userMenuRef, closeUserMenu }: UserMenuProps) {
  // hooks
  const { logout } = useLogout(() => {
    closeUserMenu();
  });
  const router = useRouter();

  return (
    <div
      ref={userMenuRef}
      className="flex flex-col  bg-zinc-800 rounded-lg p-3 border z-10 border-zinc-500 gap-2"
    >
      <button
        onClick={() => {
          router.push('/user');
        }}
        className="cursor-pointer rounded font-semibold py-2 px-4 hover:bg-zinc-500 active:bg-zinc-600 transition-colors"
      >
        Profile
      </button>

      <div className="w-full h-[1px] bg-zinc-500"></div>

      <button
        onClick={() => {
          logout();
        }}
        className="cursor-pointer rounded font-semibold py-2 px-4 hover:bg-zinc-500 active:bg-zinc-600 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}

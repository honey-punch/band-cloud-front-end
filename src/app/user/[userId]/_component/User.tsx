'use client';

import { useUpdateUserAvatar, useUserById } from '@/hooks/user/useUser';
import { ChangeEvent, useContext, useRef, useState } from 'react';
import Audio from './Audio';
import Band from './Band';
import { MeContext } from '@/app/_component/MeProvider';
import { FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface UserProps {
  userId: string;
}

interface TabProps {
  isCurrent: boolean;
  text: string;

  onClick(): void;
}

type TabMenu = 'audio' | 'band' | 'info';

export default function User({ userId }: UserProps) {
  // refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // states
  const [avatarSrc, setAvatarSrc] = useState<string>(`/file/avatar/${userId}?t=${Date.now()}`);

  // context
  const { me, setIsOpenLoginModal, setAvatarSrc: setMeAvatarSrc } = useContext(MeContext);
  const isMe = me?.id === userId;

  // hooks
  const { user } = useUserById(userId);
  const { updateUserAvatar } = useUpdateUserAvatar(() => {
    setAvatarSrc(`/file/avatar/${userId}?t=${Date.now()}`);
    setMeAvatarSrc(`/file/avatar/${userId}?t=${Date.now()}`);
  });

  // states
  const [tabMenu, setTabMenu] = useState<TabMenu>('audio');

  // functions
  function handleClickAvatar() {
    if (!me || !fileInputRef.current) {
      setIsOpenLoginModal(true);
      return;
    }

    if (!isMe) {
      toast('Not your avatar.');
      return;
    }

    fileInputRef.current.click();
  }

  function handleChageFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null;

    if (!file) {
      return;
    }

    updateUserAvatar({ userId, multipartFile: file });
  }

  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${avatarSrc})`,
          backgroundSize: 'cover',
        }}
        className="w-full h-[250px] object-cover relative bg-no-repeat bg-center"
      >
        <div className="w-full h-full bg-black/30 backdrop-blur-2xl"></div>

        <div className="absolute -bottom-[90px] left-8 flex gap-4 items-center right-0">
          <div onClick={handleClickAvatar} className={`${isMe && 'cursor-pointer group'} relative`}>
            <img
              src={avatarSrc}
              alt="avatar"
              className={`w-[180px] h-[180px] object-cover rounded-full`}
            />
            <div className="group-hover:flex justify-center text-6xl items-center hidden w-full h-full absolute top-0 left-0 rounded-full bg-zinc-500 opacity-70">
              <FaImage />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={handleChageFileInput}
            />
          </div>

          <div className="font-bold text-4xl flex gap-1 pt-16">
            <div className="whitespace-nowrap">{user?.name}</div>
            <div className="text-zinc-500 whitespace-nowrap">({user?.userId})</div>
          </div>
        </div>
      </div>

      <div className="pt-[100px] w-full">
        <div className="flex">
          <Tab isCurrent={tabMenu === 'audio'} text="Audio" onClick={() => setTabMenu('audio')} />
          <Tab isCurrent={tabMenu === 'band'} text="Band" onClick={() => setTabMenu('band')} />
          <Tab isCurrent={tabMenu === 'info'} text="Info" onClick={() => setTabMenu('info')} />
        </div>

        <div className="p-8">
          {tabMenu === 'audio' && <Audio userId={userId} />}
          {tabMenu === 'band' && <Band bandIds={user?.bandIds || []} />}
          {tabMenu === 'info' && <div>user</div>}
        </div>
      </div>
    </div>
  );
}

function Tab({ isCurrent, text, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`${isCurrent ? 'text-white' : 'text-zinc-500 hover:text-zinc-300 active:text-zinc-400'} py-4 focus:outline-0 transition-colors text-lg relative group w-1/3 flex justify-center items-center font-bold cursor-pointer`}
    >
      {text}
      <div
        className={`${isCurrent ? 'w-full bg-white' : 'w-0'} transition-[width] absolute bottom-0 h-[2px]`}
      ></div>
    </button>
  );
}

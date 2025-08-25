'use client';

import { useUserById } from '@/hooks/user/useUser';
import { useState } from 'react';
import Audio from './Audio';
import Band from './Band';

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
  // hooks
  const { user } = useUserById(userId);

  // states
  const [tabMenu, setTabMenu] = useState<TabMenu>('audio');

  return (
    <div>
      <div
        style={{
          backgroundImage: `url(/file/avatar/${userId})`,
          backgroundSize: 'cover',
        }}
        className="w-full h-[250px] object-cover relative bg-no-repeat bg-center"
      >
        <div className="w-full h-full bg-black/30 backdrop-blur-2xl"></div>

        <div className="absolute -bottom-[90px] left-8 flex gap-4 items-center right-0">
          <img
            src={`/file/avatar/${userId}`}
            alt="avatar"
            className="w-[180px] h-[180px] object-fit rounded-full"
          />

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

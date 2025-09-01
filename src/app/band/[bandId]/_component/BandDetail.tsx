'use client';

import { useBandById } from '@/hooks/band/useBand';
import { useContext, useState } from 'react';
import { MeContext } from '@/app/_component/MeProvider';
import FilledTextButton from '@/components/FilledTextButton';
import { toast } from 'react-toastify';
import { Tab } from '@/components/Tab';
import BandAudio from '@/app/band/[bandId]/_component/BandAudio';
import { useUserSearch } from '@/hooks/user/useUser';

interface BandDetailProps {
  bandId: string;
}

type TabMenu = 'audio' | 'chat' | 'user';

export default function BandDetail({ bandId }: BandDetailProps) {
  // context
  const { me, setIsOpenLoginModal } = useContext(MeContext);

  // states
  const [tabMenu, setTabMenu] = useState<TabMenu>('audio');
  const [searchUserParams, setSearchUserParams] = useState<SearchParams>({
    bandId,
    page: 0,
    size: 9999,
    sort: 'createdDate,desc',
    limit: 9999,
  });

  // hooks
  const { band } = useBandById(bandId);
  const { userList } = useUserSearch(searchUserParams);
  const userListResult = userList?.result;

  // functions
  function handleClickAddMember() {}

  function handleClickJoin() {
    if (!me) {
      setIsOpenLoginModal(true);
      return;
    }

    toast('Request success');
  }

  return (
    <div>
      <div className="p-8 flex items-center gap-6">
        <div className="font-bold text-4xl">{band?.name}</div>
        {me?.id === band?.leaderId ? (
          <FilledTextButton text="Add Member" onClick={handleClickAddMember} />
        ) : (
          <FilledTextButton text="Join" onClick={handleClickJoin} />
        )}
      </div>

      {/*<div>*/}
      {/*  {userListResult &&*/}
      {/*    userListResult.map((v) => <div key={`band-audio-user-key-${v.id}`}>{v.name}</div>)}*/}
      {/*</div>*/}

      <div className="flex">
        <Tab isCurrent={tabMenu === 'audio'} text="Audio" onClick={() => setTabMenu('audio')} />
        <Tab isCurrent={tabMenu === 'chat'} text="Chat" onClick={() => setTabMenu('chat')} />
        <Tab isCurrent={tabMenu === 'user'} text="User" onClick={() => setTabMenu('user')} />
      </div>

      <div className="p-8">
        {tabMenu === 'audio' && <BandAudio bandId={bandId} />}
        {tabMenu === 'chat' && <div>chat</div>}
        {tabMenu === 'user' && <div>user</div>}
      </div>
    </div>
  );
}

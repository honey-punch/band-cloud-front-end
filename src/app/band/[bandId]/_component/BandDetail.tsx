'use client';

import { useBandById } from '@/hooks/band/useBand';
import { useContext, useState } from 'react';
import { MeContext } from '@/app/_component/MeProvider';
import FilledTextButton from '@/components/FilledTextButton';
import { toast } from 'react-toastify';
import { Tab } from '@/components/Tab';
import BandAudio from '@/app/band/[bandId]/_component/BandAudio';

interface BandDetailProps {
  bandId: string;
}

type TabMenu = 'audio' | 'chat';

export default function BandDetail({ bandId }: BandDetailProps) {
  // context
  const { me, setIsOpenLoginModal } = useContext(MeContext);

  // hooks
  const { band } = useBandById(bandId);

  // states
  const [tabMenu, setTabMenu] = useState<TabMenu>('audio');

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

      <div className="flex">
        <Tab isCurrent={tabMenu === 'audio'} text="Audio" onClick={() => setTabMenu('audio')} />
        <Tab isCurrent={tabMenu === 'chat'} text="Chat" onClick={() => setTabMenu('chat')} />
      </div>

      <div className="p-8">
        {tabMenu === 'audio' && <BandAudio bandId={bandId} band={band} />}
        {tabMenu === 'chat' && <div>chat</div>}
      </div>
    </div>
  );
}

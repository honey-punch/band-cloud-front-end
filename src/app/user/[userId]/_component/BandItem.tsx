import { useBandById } from '@/hooks/band/useBand';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { MeContext } from '@/app/_component/MeProvider';
import { toast } from 'react-toastify';
import { useUserSearch } from '@/hooks/user/useUser';
import { BsThreeDots } from 'react-icons/bs';

interface BandItemProps {
  id: string;
}

export default function BandItem({ id }: BandItemProps) {
  // hooks
  const { band } = useBandById(id);
  const { userList } = useUserSearch();
  const bandMemberIds =
    userList
      ?.filter((user) => user.bandIds.includes(id))
      .map((user) => user.id)
      .sort((a, b) => (a === band?.leaderId ? -1 : b === band?.leaderId ? 1 : 0)) || [];
  const slicedBandMemberIds = bandMemberIds.slice(0, 5);

  const router = useRouter();

  // context
  const { me, setIsOpenLoginModal } = useContext(MeContext);

  // functions
  function handleClickBand() {
    if (!me) {
      setIsOpenLoginModal(true);
      return;
    }

    if (bandMemberIds.includes(me.id)) {
      router.push(`/band/${id}`);
    } else {
      toast('You are not a member of this band');
    }
  }

  return (
    <div
      onClick={handleClickBand}
      className="w-[360px] h-[290px] p-8 rounded-lg bg-zinc-800 cursor-pointer hover:bg-zinc-600 active:bg-zinc-700 active:scale-[1.01] hover:scale-[1.02] transition-[scale,background-color] flex flex-col gap-6"
    >
      <div className="font-bold text-xl whitespace-nowrap truncate h-6 grow-0 shrink-0">
        {band?.name}
      </div>
      <div className="text-lg h-28 line-clamp-4">{band?.description}</div>
      <div className="flex relative w-full">
        {slicedBandMemberIds.map((id, i) => (
          <img
            key={`band-member-avatar-${id}`}
            src={`/file/avatar/${id}`}
            alt="band-member-avatar"
            style={{ left: `${i * 24}px`, zIndex: 10 - i }}
            className="w-10 h-10 rounded-full object-fit absolute"
          ></img>
        ))}
        {bandMemberIds.length > 5 && (
          <div className="w-10 h-10 rounded-full absolute left-[120px] flex items-center justify-center border border-zinc-500 bg-zinc-700">
            <BsThreeDots />
          </div>
        )}
      </div>
    </div>
  );
}

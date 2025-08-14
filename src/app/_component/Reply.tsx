import { useContext, useEffect, useRef, useState } from 'react';
import { useUserById } from '@/hooks/user/useUser';
import TimeAgo from 'timeago-react';
import { useDeleteReply, useUpdateReply } from '@/hooks/reply/useReply';
import { MeContext } from '@/app/_component/MeProvider';
import { BsThreeDotsVertical } from 'react-icons/bs';
import PopupMenu from '@/components/PopupMenu';
import TextButton from '@/components/TextButton';
import FilledTextButton from '@/components/FilledTextButton';
import { toast } from 'react-toastify';

interface ReplyProps {
  reply: Reply;
}

export default function Reply({ reply }: ReplyProps) {
  // refs
  const popupMenuRef = useRef<HTMLDivElement>(null);

  // state
  const [avatarSrc, setAvatarSrc] = useState<string>(`/file/avatar/${reply.userId}`);
  const [replyValue, setReplyValue] = useState<string>(reply.content);
  const [isOpenReplyMenu, setIsOpenReplyMenu] = useState<boolean>(false);
  const [isUpdateReply, setIsUpdateReply] = useState<boolean>(false);

  // hooks
  const { user } = useUserById(reply.userId);
  const { updateReply } = useUpdateReply(reply.assetId, reply.id);
  const { deleteReply } = useDeleteReply(reply.assetId, reply.id);

  // context
  const { me } = useContext(MeContext);

  // constants
  const canUpdateOrDeleteReply = !!me && !!user && me.id === user.id;
  const contentArray = [
    {
      text: 'Edit',
      onClick: () => {
        setIsUpdateReply(!isUpdateReply);
        setIsOpenReplyMenu(false);
      },
    },
    {
      text: 'Delete',
      onClick: () => {
        deleteReply();
        setIsOpenReplyMenu(false);
      },
    },
  ];

  // functions
  function handleSubmitUpdateReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (replyValue === reply.content) {
      toast('No changes have been updated.');
      return;
    }

    updateReply({ content: replyValue });
    setIsUpdateReply(false);
    setIsOpenReplyMenu(false);
  }

  return (
    <div className="flex gap-4 flex-grow relative">
      <img
        src={avatarSrc}
        alt="avatar"
        onError={() => {
          setAvatarSrc('/default-avatar.jpg');
        }}
        className="object-cover w-10 h-10 rounded-full"
      />

      <div className="w-full">
        <div className="flex gap-4">
          <div className="font-semibold">{user?.name || '알 수 없는 사용자'}</div>

          <TimeAgo datetime={reply.createdDate} locale="kr" className="text-zinc-500" />
        </div>

        <form className="flex flex-col" onSubmit={handleSubmitUpdateReply}>
          <label className="mt-1 group relative">
            <input
              type="text"
              value={replyValue}
              disabled={!isUpdateReply}
              onChange={(e) => {
                setReplyValue(e.target.value);
              }}
              className={`${!isUpdateReply ? 'border-zinc-500/0' : 'cursor-text border-zinc-500/100'} transition-colors border-b py-1 w-full focus:outline-0`}
            />

            <div className="group-focus-within:w-full w-0 transition-[width] duration-500 h-[1px] left-0 absolute bottom-[0px] bg-white"></div>
          </label>

          {isUpdateReply && (
            <div className="flex gap-2 self-end mt-4">
              <TextButton
                text="Cancel"
                onClick={() => {
                  setIsUpdateReply(false);
                  setReplyValue(reply.content);
                }}
              />
              <FilledTextButton text="Edit" type="submit" />
            </div>
          )}
        </form>
      </div>

      {canUpdateOrDeleteReply && (
        <button
          onClick={() => {
            setIsOpenReplyMenu(true);
          }}
          className="cursor-pointer w-8 h-8 text-white hover:bg-zinc-500 active:bg-zinc-600 transition-colors rounded-full flex justify-center items-center"
        >
          <BsThreeDotsVertical />
        </button>
      )}

      {isOpenReplyMenu && (
        <div className="absolute top-10 right-0 z-10">
          <PopupMenu
            ref={popupMenuRef}
            isOpen={isOpenReplyMenu}
            contentArray={contentArray}
            closeMenu={() => {
              setIsOpenReplyMenu(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

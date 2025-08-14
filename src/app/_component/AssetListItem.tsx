import WaveAudioPlayer from '@/app/_component/WaveAudioPlayer';
import { useContext, useState, FormEvent } from 'react';
import { FaMessage } from 'react-icons/fa6';
import { MeContext } from '@/app/_component/MeProvider';
import { toast } from 'react-toastify';
import { useCreateReply, useReplyByAssetId } from '@/hooks/reply/useReply';
import Reply from '@/app/_component/Reply';
import TextButton from '@/components/TextButton';
import FilledTextButton from '@/components/FilledTextButton';

interface AssetListItemProps {
  asset: Asset;
}

export default function AssetListItem({ asset }: AssetListItemProps) {
  // context
  const { me, setIsOpenLoginModal } = useContext(MeContext);

  // states
  const [thumbnailSrc, setThumbnailSrc] = useState<string>(`/file/thumbnail/${asset.id}`);
  const [audioSrc, setAudioSrc] = useState<string>(`/file/audio/${asset.id}`);
  const [avatarSrc, setAvatarSrc] = useState<string>(`/file/avatar/${me?.id}`);
  const [isOpenReply, setIsOpenReply] = useState<boolean>(false);
  const [reply, setReply] = useState<string>('');

  // hooks
  const { createReply } = useCreateReply(asset.id);
  const { replyList } = useReplyByAssetId(asset.id);

  // functions
  function handleChangeAudioSrc(audioSrc: string) {
    setAudioSrc(audioSrc);
  }

  function handleClickReply() {
    me ? setIsOpenReply(!isOpenReply) : setIsOpenLoginModal(true);
  }

  function handleSubmitReply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!reply) {
      toast('There is no reply for this asset');
      return;
    }

    if (!me) {
      toast('Sign in first');
      return;
    }

    createReply({ content: reply, userId: me.id });

    setReply('');
  }

  return (
    <div>
      <div className="flex gap-6">
        <img
          src={thumbnailSrc}
          onError={() => {
            setThumbnailSrc('/default-thumbnail.jpg');
          }}
          alt="thumbnail"
          className="w-44 h-44 object-cover"
        />
        <WaveAudioPlayer
          title={asset.title}
          assetId={asset.id}
          userId={asset.userId}
          src={audioSrc}
          handleChangeAudioSrc={handleChangeAudioSrc}
        />

        <button
          onClick={handleClickReply}
          className="self-end cursor-pointer text-white hover:bg-zinc-500 active:bg-zinc-600 transition-colors rounded-full p-2"
        >
          <FaMessage />
        </button>
      </div>

      {isOpenReply && (
        <div>
          <form className="flex flex-col gap-4 mb-4" onSubmit={handleSubmitReply}>
            <label className="group flex gap-4 w-full flex-grow mt-4 relative">
              <img
                src={avatarSrc}
                alt="avatar"
                onError={() => {
                  setAvatarSrc('/default-avatar.jpg');
                }}
                className="object-cover w-10 h-10 rounded-full"
              />

              <input
                type="text"
                value={reply}
                onChange={(e) => {
                  setReply(e.target.value);
                }}
                className="border-b focus:outline-none group-hover:border-white w-full border-zinc-500 focus:border-white transition-colors box-border"
                placeholder="reply..."
              />

              <div className="group-focus-within:w-[calc(100%-56px)] w-0 transition-[width] duration-500 h-[1px] left-[56px] absolute -bottom-[1px] bg-white"></div>
            </label>

            <div className="flex gap-2 self-end">
              <TextButton
                text="Cancel"
                onClick={() => {
                  setReply('');
                }}
              />
              <FilledTextButton text="Add" type="submit" />
            </div>
          </form>

          <div className="flex flex-col gap-4">
            {replyList &&
              replyList.map((reply) => <Reply key={`reply-list-key-${reply.id}`} reply={reply} />)}
          </div>
        </div>
      )}
    </div>
  );
}

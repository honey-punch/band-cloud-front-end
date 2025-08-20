import WaveAudioPlayer from '@/app/_component/WaveAudioPlayer';
import { useContext, useState, FormEvent, useEffect, useRef } from 'react';
import { FaMessage } from 'react-icons/fa6';
import { MeContext } from '@/app/_component/MeProvider';
import { toast } from 'react-toastify';
import { useCreateReply, useReplyByAssetId } from '@/hooks/reply/useReply';
import Reply from '@/app/_component/Reply';
import TextButton from '@/components/TextButton';
import FilledTextButton from '@/components/FilledTextButton';
import { FaImage } from 'react-icons/fa';
import { useUpdateAssetThumbnail } from '@/hooks/asset/useAsset';
import { useRouter } from 'next/navigation';

interface AssetListItemProps {
  asset: Asset;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function AssetListItem({ asset }: AssetListItemProps) {
  //refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // context
  const { me, setIsOpenLoginModal } = useContext(MeContext);

  // states
  const [thumbnailSrc, setThumbnailSrc] = useState<string>(`/file/thumbnail/${asset.id}`);
  const [avatarSrc, setAvatarSrc] = useState<string>(`/file/avatar/${me?.id}`);
  const [isOpenReply, setIsOpenReply] = useState<boolean>(false);
  const [reply, setReply] = useState<string>('');

  // hooks
  const { createReply } = useCreateReply(asset.id);
  const { replyList } = useReplyByAssetId(asset.id);
  const { updateAssetThumbnail } = useUpdateAssetThumbnail(() => {
    setThumbnailSrc(`/file/thumbnail/${asset.id}?t=${Date.now()}`);
  });
  const router = useRouter();

  // effects
  useEffect(() => {
    setAvatarSrc(`/file/avatar/${me?.id}`);
  }, [me]);

  // functions
  function handleClickReply() {
    setIsOpenReply(!isOpenReply);
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    if (file.size > MAX_SIZE) {
      toast('Upload only files under 10MB');
      return;
    }

    updateAssetThumbnail({ assetId: asset.id, multipartFile: file });
  }

  function handleClickAddImage() {
    if (!me) {
      setIsOpenLoginModal(true);
      return;
    }
    fileInputRef.current?.click();
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex gap-6">
        <img
          src={thumbnailSrc}
          onError={() => {
            setThumbnailSrc('/default-thumbnail.jpg');
          }}
          onClick={() => {
            router.push(`/asset/${asset.id}`);
          }}
          alt="thumbnail"
          className="w-36 h-36 object-cover cursor-pointer hover:opacity-70 active:opacity-60 transition-opacity"
        />
        <WaveAudioPlayer
          title={asset.title}
          assetId={asset.id}
          userId={asset.userId}
          src={`/file/audio/${asset.id}`}
        />

        <div className="flex gap-2 self-end">
          <button
            onClick={handleClickReply}
            className={`${isOpenReply ? 'bg-zinc-500 hover:bg-zinc-600 active:bg-zinc-700' : 'hover:bg-zinc-500 active:bg-zinc-600'} cursor-pointer relative text-white  transition-colors rounded-full p-3`}
          >
            <FaMessage />
            {(replyList?.length || 0) > 0 && (
              <div className="absolute -top-1 -right-1 rounded-full font-semibold bg-red-500 flex items-center justify-center text-xs w-5 h-5">
                {replyList?.length || ''}
              </div>
            )}
          </button>
          {me?.id === asset.userId && (
            <button
              onClick={handleClickAddImage}
              className="cursor-pointer text-white hover:bg-zinc-500 active:bg-zinc-600 transition-colors rounded-full p-3"
            >
              <FaImage />
            </button>
          )}
        </div>
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
                onFocus={() => {
                  if (!me) {
                    setIsOpenLoginModal(true);
                    return;
                  }
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

import WaveAudioPlayer from '@/app/_component/WaveAudioPlayer';
import { useContext, useState, useRef, FormEvent } from 'react';
import { FaMessage } from 'react-icons/fa6';
import { MeContext } from '@/app/_component/MeProvider';
import { toast } from 'react-toastify';
import { useCreateReply, useReplyByAssetId } from '@/hooks/reply/useReply';
import { FaImage } from 'react-icons/fa';
import { useUpdateAsset, useUpdateAssetThumbnail } from '@/hooks/asset/useAsset';
import { useRouter } from 'next/navigation';
import { useStore } from '@/shared/rootStore';
import TextButton from '@/components/TextButton';
import FilledTextButton from '@/components/FilledTextButton';
import Reply from '@/app/_component/Reply';
import { GiCardboardBox, GiCardboardBoxClosed } from 'react-icons/gi';

interface AssetListItemProps {
  asset: Asset;
  searchParams: SearchParams;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function AssetListItem({ asset, searchParams }: AssetListItemProps) {
  //refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // context
  const { me, setIsOpenLoginModal, avatarSrc } = useContext(MeContext);
  const isMe = me?.id === asset.userId;

  // states
  const [reply, setReply] = useState<string>('');
  const [thumbnailSrc, setThumbnailSrc] = useState<string>(
    `/file/thumbnail/${asset.id}?t=${Date.now()}`,
  );
  const [isOpenReply, setIsOpenReply] = useState<boolean>(false);
  const [searchReplyParams, setSearchReplyParams] = useState<SearchParams>({
    page: 0,
    size: 25,
    sort: 'createdDate,desc',
    limit: 9999,
  });

  // zustand
  const setCurrentThumbnailSrc = useStore((state) => state.setCurrentThumbnailSrc);

  // hooks
  const { replyList, hasNextPage, fetchNextPage } = useReplyByAssetId(asset.id, searchReplyParams);
  const replyResultList = replyList?.pages.flatMap((page) => page.result) ?? [];
  const totalCount = replyList?.pages[0].page?.totalCount ?? 0;
  const { createReply } = useCreateReply(asset.id);
  const { updateAsset } = useUpdateAsset(asset.id, searchParams);

  const { updateAssetThumbnail } = useUpdateAssetThumbnail(() => {
    setThumbnailSrc(`/file/thumbnail/${asset.id}?t=${Date.now()}`);
    setCurrentThumbnailSrc(`/file/thumbnail/${asset.id}?t=${Date.now()}`);
  });
  const router = useRouter();

  // functions
  function handleClickReply() {
    setIsOpenReply(!isOpenReply);
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
          searchParams={searchParams}
          isMe={isMe}
        />

        <div className="flex gap-2 self-end grow shrink">
          <button
            onClick={handleClickReply}
            className={`${isOpenReply ? 'bg-zinc-500 hover:bg-zinc-600 active:bg-zinc-700' : 'hover:bg-zinc-500 active:bg-zinc-600'} cursor-pointer relative text-white  transition-colors rounded-full p-3`}
          >
            <FaMessage />
            {totalCount > 0 && (
              <div className="absolute -top-1 -right-1 rounded-full font-semibold bg-red-500 flex items-center justify-center text-xs w-5 h-5">
                {totalCount}
              </div>
            )}
          </button>
          {me?.id === asset.userId && (
            <div className="flex gap-2">
              <button
                onClick={handleClickAddImage}
                className="cursor-pointer text-white hover:bg-zinc-500 active:bg-zinc-600 transition-colors rounded-full p-3"
              >
                <FaImage />
              </button>

              <button
                onClick={() => {
                  updateAsset({ isPublic: !asset.isPublic });
                }}
                className="cursor-pointer text-white hover:bg-zinc-500 active:bg-zinc-600 transition-colors rounded-full p-3 text-xl"
              >
                {asset.isPublic ? <GiCardboardBox /> : <GiCardboardBoxClosed />}
              </button>
            </div>
          )}
        </div>
      </div>

      {isOpenReply && (
        <div>
          <form className="flex flex-col gap-4 mb-4" onSubmit={handleSubmitReply}>
            <label className="group flex gap-4 w-full flex-grow mt-4 relative">
              <img src={avatarSrc} alt="avatar" className="object-cover w-10 h-10 rounded-full" />

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
            {replyResultList.map((reply) => (
              <Reply key={`reply-list-key-${reply.id}`} reply={reply} />
            ))}
            {hasNextPage && (
              <div
                onClick={() => {
                  fetchNextPage();
                }}
                className="w-full bg-zinc-500 hover:bg-zinc-600 active:bg-zinc-700 transition-colors flex justify-center font-bold items-center p-2 rounded-full cursor-pointer"
              >
                More
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

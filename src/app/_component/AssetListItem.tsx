import WaveAudioPlayer from '@/app/_component/WaveAudioPlayer';
import { useContext, useState, useRef, FormEvent, ChangeEvent } from 'react';
import { FaMessage } from 'react-icons/fa6';
import { MeContext } from '@/app/_component/MeProvider';
import { toast } from 'react-toastify';
import { useCreateReply, useReplyByAssetId } from '@/hooks/reply/useReply';
import { FaImage } from 'react-icons/fa';
import { useUpdateAsset, useUpdateAssetThumbnail } from '@/hooks/asset/useAsset';
import { useRouter } from 'next/navigation';
import Reply from '@/app/_component/Reply';
import { GiCardboardBox, GiCardboardBoxClosed } from 'react-icons/gi';
import TextForm from '@/components/TextForm';
import { useImage } from '@/hooks/useImage';
import { useStore } from '@/shared/rootStore';
import { Tooltip } from 'react-tooltip';
import { ClipLoader } from 'react-spinners';

interface AssetListItemProps {
  asset: Asset;
  searchParams: SearchParams;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function AssetListItem({ asset, searchParams }: AssetListItemProps) {
  //refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // zustand
  const currentAssetId = useStore((state) => state.currentAssetId);

  // context
  const { me, setIsOpenLoginModal } = useContext(MeContext);
  const isMe = me?.id === asset.userId;

  // states
  const [reply, setReply] = useState<string>('');
  const [isOpenReply, setIsOpenReply] = useState<boolean>(false);
  const [searchReplyParams, setSearchReplyParams] = useState<SearchParams>({
    page: 0,
    size: 25,
    sort: 'createdDate,desc',
    limit: 9999,
  });

  // hooks
  const { src, setSrc, handleImageError } = useImage({
    defaultSrc: '/default-thumbnail.png',
    type: 'thumbnail',
    id: asset.id || '',
  });
  const setThumbnailUrl = useStore((state) => state.setThumbnailUrl);
  const { replyList, hasNextPage, fetchNextPage } = useReplyByAssetId(asset.id, searchReplyParams);
  const replyResultList = replyList?.pages.flatMap((page) => page.result) ?? [];
  const totalCount = replyList?.pages[0].page?.totalCount ?? 0;
  const { createReply } = useCreateReply(asset.id, () => {
    setReply('');
  });
  const { updateAsset, isLoadingUpdateAsset } = useUpdateAsset(
    asset.id,
    () => {
      toast('Updated successfully');
    },
    () => {
      toast('Failed to update');
    },
  );

  const { updateAssetThumbnail } = useUpdateAssetThumbnail(() => {
    setSrc(`/file/thumbnail/${asset.id}?t=${Date.now()}`);
    if (asset.id === currentAssetId) {
      setThumbnailUrl(`/file/thumbnail/${asset.id}?t=${Date.now()}`);
    }
  });
  const router = useRouter();

  // functions
  function handleClickReply() {
    setIsOpenReply(!isOpenReply);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
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
          src={src}
          onClick={() => {
            router.push(`/asset/${asset.id}`);
          }}
          onError={handleImageError}
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
            data-tooltip-id="my-tooltip"
            data-tooltip-content="reply"
            onClick={handleClickReply}
            className={`${isOpenReply ? 'bg-zinc-500 hover:bg-zinc-600 active:bg-zinc-700' : 'hover:bg-zinc-500 active:bg-zinc-600'} cursor-pointer relative text-white  transition-colors rounded-full w-10 h-10 flex justify-center items-center`}
          >
            <FaMessage />
            {totalCount > 0 && (
              <div className="absolute -top-1 -right-1 rounded-full font-semibold text-black bg-white flex items-center justify-center text-xs w-5 h-5">
                {totalCount}
              </div>
            )}
          </button>
          {me?.id === asset.userId && (
            <div className="flex gap-2">
              <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="update thumbnail"
                onClick={handleClickAddImage}
                className="cursor-pointer text-white hover:bg-zinc-500 active:bg-zinc-600 transition-colors rounded-full w-10 h-10 flex justify-center items-center"
              >
                <FaImage />
              </button>

              <button
                onClick={() => {
                  updateAsset({ isPublic: !asset.isPublic });
                }}
                data-tooltip-id="my-tooltip"
                data-tooltip-content={asset.isPublic ? 'private' : 'public'}
                className="cursor-pointer text-white hover:bg-zinc-500 active:bg-zinc-600 transition-colors rounded-full w-10 h-10 text-xl flex justify-center items-center"
              >
                {isLoadingUpdateAsset ? (
                  <ClipLoader size={20} color="white" />
                ) : asset.isPublic ? (
                  <GiCardboardBox />
                ) : (
                  <GiCardboardBoxClosed />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {isOpenReply && (
        <div>
          <div className="mb-4">
            <TextForm
              value={reply}
              placeholder="Write a reply..."
              onChange={(e) => setReply(e.target.value)}
              onSubmit={handleSubmitReply}
              clear={() => setReply('')}
            />
          </div>

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

      <Tooltip id="my-tooltip" />
    </div>
  );
}

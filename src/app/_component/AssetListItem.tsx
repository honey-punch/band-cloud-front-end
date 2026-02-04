import WaveAudioPlayer from '@/app/_component/WaveAudioPlayer';
import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { FaMessage } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { FaImage } from 'react-icons/fa';
import { useUpdateAsset, useUpdateAssetThumbnail } from '@/hooks/asset/useAsset';
import { useRouter } from 'next/navigation';
import { GiCardboardBox, GiCardboardBoxClosed } from 'react-icons/gi';
import { useImage } from '@/hooks/useImage';
import { useStore } from '@/shared/rootStore';
import { Tooltip } from 'react-tooltip';
import { ClipLoader } from 'react-spinners';
import ReplySection from '@/app/_component/ReplySection';
import { useReplyTotalCount } from '@/hooks/reply/useReply';

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

  // states
  const [isOpenReply, setIsOpenReply] = useState<boolean>(false);

  // hooks
  // asset
  const setThumbnailUrl = useStore((state) => state.setThumbnailUrl);
  // user
  const setIsOpenLoginModal = useStore((state) => state.setIsOpenLoginModal);
  const me = useStore((state) => state.me);
  const isMe = me?.id === asset.userId;

  const { src, setSrc, handleImageError } = useImage({
    defaultSrc: '/default-thumbnail.png',
    type: 'thumbnail',
    id: asset.id || '',
  });

  const { replyTotalCount } = useReplyTotalCount(asset.id);
  const totalCount = replyTotalCount?.result.totalCount || -1;

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

      {isOpenReply && <ReplySection assetId={asset.id} />}

      <Tooltip id="my-tooltip" />
    </div>
  );
}

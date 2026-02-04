import TextForm from '@/components/TextForm';
import Reply from '@/app/_component/Reply';
import { useCreateReply, useReplyByAssetId } from '@/hooks/reply/useReply';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useStore } from '@/shared/rootStore';

interface ReplySectionProps {
  assetId: string;
}

export default function ReplySection({ assetId }: ReplySectionProps) {
  // state
  const [searchReplyParams, setSearchReplyParams] = useState<SearchParams>({
    page: 0,
    size: 25,
    sort: 'createdDate,desc',
    limit: 9999,
  });
  const [reply, setReply] = useState<string>('');

  // zustand
  const me = useStore((state) => state.me);

  // hooks
  const { replyList, hasNextPage, fetchNextPage } = useReplyByAssetId(assetId, searchReplyParams);
  const replyResultList = replyList?.pages.flatMap((page) => page.result) ?? [];
  const totalCount = replyList?.pages[0].page?.totalCount ?? 0;
  const { createReply } = useCreateReply(assetId, () => {
    setReply('');
  });

  // functions
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
  );
}

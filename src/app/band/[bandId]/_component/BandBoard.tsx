import TextForm from '@/components/TextForm';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useCreateNote, useNoteByBandId } from '@/hooks/note/useNote';
import Note from '@/app/band/[bandId]/_component/Note';
import { useStore } from '@/shared/rootStore';

interface BandBoardProps {
  bandId: string;
}

export default function BandBoard({ bandId }: BandBoardProps) {
  // states
  const [searchNoteParams, setSearchNoteParams] = useState<SearchParams>({
    page: 0,
    size: 25,
    sort: 'createdDate,desc',
    limit: 9999,
  });
  const [note, setNote] = useState<string>('');

  // zustand
  const me = useStore((state) => state.me);

  // hooks
  const { noteList, hasNextPage, fetchNextPage } = useNoteByBandId(bandId, searchNoteParams);
  const noteResultList = noteList?.pages.flatMap((page) => page.result) ?? [];
  const { createNote } = useCreateNote(bandId, () => {
    setNote('');
  });

  // functions
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!note) {
      toast('Please enter the note.');
      return;
    }

    if (!me) {
      toast('Sign in first');
      return;
    }

    createNote({ userId: me.id, content: note });
  }

  return (
    <div>
      <div className="mb-4">
        <TextForm
          value={note}
          placeholder="Write a note..."
          onChange={(e) => {
            setNote(e.target.value);
          }}
          onSubmit={handleSubmit}
          clear={() => {
            setNote('');
          }}
        />
      </div>

      <div className="flex flex-col gap-4">
        {noteResultList.map((note) => (
          <Note key={`note-list-key-${note.id}`} note={note} />
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

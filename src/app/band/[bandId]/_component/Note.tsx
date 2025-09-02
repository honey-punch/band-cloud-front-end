import { useContext, useRef, useState } from 'react';
import { useUserById } from '@/hooks/user/useUser';
import TimeAgo from 'timeago-react';
import { MeContext } from '@/app/_component/MeProvider';
import { BsThreeDotsVertical } from 'react-icons/bs';
import PopupMenu from '@/components/PopupMenu';
import TextButton from '@/components/TextButton';
import FilledTextButton from '@/components/FilledTextButton';
import { toast } from 'react-toastify';
import { useDeleteNote, useUpdateNote } from '@/hooks/note/useNote';

interface NoteProps {
  note: Note;
}

export default function Note({ note }: NoteProps) {
  // refs
  const popupMenuRef = useRef<HTMLDivElement>(null);

  // states
  const [noteValue, setNoteValue] = useState<string>(note.content);
  const [isOpenNoteMenu, setIsOpenNoteMenu] = useState<boolean>(false);
  const [isUpdateNote, setIsUpdateNote] = useState<boolean>(false);

  // hooks
  const { user } = useUserById(note.userId);
  const { updateNote } = useUpdateNote(note.bandId, note.id);
  const { deleteNote } = useDeleteNote(note.bandId, note.id);

  // context
  const { me, avatarSrc } = useContext(MeContext);

  // constants
  const canUpdateOrDeleteReply = !!me && !!user && me.id === user.id;
  const contentArray = [
    {
      text: 'Edit',
      onClick: () => {
        setIsUpdateNote(!isUpdateNote);
        setIsOpenNoteMenu(false);
      },
    },
    {
      text: 'Delete',
      onClick: () => {
        deleteNote();
        setIsOpenNoteMenu(false);
      },
    },
  ];

  // functions
  function handleSubmitUpdateReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (noteValue === note.content) {
      toast('No changes have been updated.');
      return;
    }

    updateNote({ content: noteValue });
    setIsUpdateNote(false);
    setIsOpenNoteMenu(false);
  }

  return (
    <div className="flex gap-4 flex-grow relative">
      <img
        src={note.userId === me?.id ? avatarSrc : `/file/avatar/${note.userId}`}
        alt="avatar"
        className="object-cover w-10 h-10 rounded-full"
      />

      <div className="w-full">
        <div className="flex gap-4">
          <div className="font-semibold">{user?.name || '알 수 없는 사용자'}</div>

          <TimeAgo datetime={note.createdDate} locale="kr" className="text-zinc-500" />
        </div>

        <form className="flex flex-col" onSubmit={handleSubmitUpdateReply}>
          <label className="mt-1 group relative">
            <input
              type="text"
              value={noteValue}
              disabled={!isUpdateNote}
              onChange={(e) => {
                setNoteValue(e.target.value);
              }}
              className={`${!isUpdateNote ? 'border-zinc-500/0' : 'cursor-text border-zinc-500/100'} transition-colors border-b py-1 w-full focus:outline-0`}
            />

            <div className="group-focus-within:w-full w-0 transition-[width] duration-500 h-[1px] left-0 absolute bottom-[0px] bg-white"></div>
          </label>

          {isUpdateNote && (
            <div className="flex gap-2 self-end mt-4">
              <TextButton
                text="Cancel"
                onClick={() => {
                  setIsUpdateNote(false);
                  setNoteValue(note.content);
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
            setIsOpenNoteMenu(true);
          }}
          className="cursor-pointer w-8 h-8 text-white hover:bg-zinc-500 active:bg-zinc-600 transition-colors rounded-full flex justify-center items-center"
        >
          <BsThreeDotsVertical />
        </button>
      )}

      {isOpenNoteMenu && (
        <div className="absolute top-10 right-0 z-10">
          <PopupMenu
            ref={popupMenuRef}
            isOpen={isOpenNoteMenu}
            contentArray={contentArray}
            closeMenu={() => {
              setIsOpenNoteMenu(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

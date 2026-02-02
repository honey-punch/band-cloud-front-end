import TextButton from '@/components/TextButton';
import FilledTextButton from '@/components/FilledTextButton';
import { ChangeEvent, FormEvent, useContext } from 'react';
import { MeContext } from '@/app/_component/MeProvider';
import { useImage } from '@/hooks/useImage';

interface TextFormProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  clear: () => void;
}

export default function TextForm({ value, placeholder, onChange, onSubmit, clear }: TextFormProps) {
  // context
  const { me, setIsOpenLoginModal } = useContext(MeContext);

  // hooks
  const { src, handleImageError } = useImage({
    defaultSrc: '/default-avatar.png',
    type: 'avatar',
    id: me?.id,
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <label className="group flex gap-4 w-full flex-grow mt-4 relative">
        <img
          src={src}
          onError={handleImageError}
          alt="avatar"
          className="object-cover w-10 h-10 rounded-full"
        />

        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => {
            if (!me) {
              setIsOpenLoginModal(true);
              return;
            }
          }}
          className="border-b focus:outline-none group-hover:border-white w-full border-zinc-500 focus:border-white transition-colors box-border"
          placeholder={placeholder}
        />

        <div className="group-focus-within:w-[calc(100%-56px)] w-0 transition-[width] duration-500 h-[1px] left-[56px] absolute -bottom-[1px] bg-white"></div>
      </label>

      <div className="flex gap-2 self-end">
        <TextButton
          text="Cancel"
          onClick={() => {
            clear();
          }}
        />
        <FilledTextButton text="Add" type="submit" />
      </div>
    </form>
  );
}

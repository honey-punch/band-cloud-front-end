interface FilledTextButtonProps {
  text: string;
  type?: 'button' | 'submit';

  onClick?: () => void;
}

export default function FilledTextButton({ text, type, onClick }: FilledTextButtonProps) {
  return (
    <button
      type={type || 'button'}
      onClick={() => {
        onClick && onClick();
      }}
      className="px-4 py-1 disabled:bg-zinc-500 cursor-pointer font-semibold bg-white hover:bg-zinc-200 active:bg-zinc-300 transition-colors text-black rounded-full"
    >
      {text}
    </button>
  );
}

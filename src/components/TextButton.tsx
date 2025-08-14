interface TextButtonProps {
  text: string;
  type?: 'button' | 'submit';

  onClick(): void;
}

export default function Textbutton({ text, type, onClick }: TextButtonProps) {
  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      className="p-2 font-semibold rounded-full cursor-pointer"
    >
      {text}
    </button>
  );
}

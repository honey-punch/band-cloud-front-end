interface TabProps {
  isCurrent: boolean;
  text: string;

  onClick(): void;
}

export function Tab({ isCurrent, text, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`${isCurrent ? 'text-white' : 'text-zinc-500 hover:text-zinc-300 active:text-zinc-400'} py-4 focus:outline-0 transition-colors text-lg relative group w-full flex justify-center items-center font-bold cursor-pointer`}
    >
      {text}
      <div
        className={`${isCurrent ? 'w-full bg-white' : 'w-0'} transition-[width] absolute bottom-0 h-[2px]`}
      ></div>
    </button>
  );
}

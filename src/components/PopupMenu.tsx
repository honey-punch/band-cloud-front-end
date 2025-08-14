import { RefObject, useEffect } from 'react';

interface PopupMenuProps {
  ref: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  contentArray: { text: string; onClick(): void }[];

  closeMenu(): void;
}

export default function PopupMenu({ ref, isOpen, contentArray, closeMenu }: PopupMenuProps) {
  // effects
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closeMenu();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={ref}
      className=" flex flex-col  bg-zinc-800 rounded-lg p-3 border z-10 border-zinc-500 gap-2"
    >
      {contentArray.map((item, i) => (
        <button
          key={`popup-menu-${i}`}
          onClick={item.onClick}
          className="whitespace-nowrap cursor-pointer rounded font-semibold py-2 px-4  hover:bg-zinc-500 active:bg-zinc-600 transition-colors"
        >
          {item.text}
        </button>
      ))}
    </div>
  );
}

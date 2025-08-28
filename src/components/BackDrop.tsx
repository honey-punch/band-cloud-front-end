import { ReactNode } from 'react';

interface BackDropProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function BackDrop({ children, onClick }: BackDropProps) {
  return (
    <div
      onClick={onClick}
      className="absolute flex justify-center items-center top-0 left-0 w-screen h-screen bg-white/60 z-50"
    >
      {children}
    </div>
  );
}

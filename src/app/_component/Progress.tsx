import { CSSProperties } from 'react';
import { secWithMsTohhmmss } from '@/utils/util';

interface ProgressProps {
  duration: number;
  currentTime: number;

  handleChangeProgress(e: React.ChangeEvent<HTMLInputElement>): void;
}

export default function Progress({ duration, currentTime, handleChangeProgress }: ProgressProps) {
  const percent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex gap-4 items-center flex-grow">
      <div className="font-semibold  min-w-[50px]">{secWithMsTohhmmss(currentTime || 0)}</div>

      <input
        type="range"
        min={0}
        max={duration}
        step={0.01}
        value={currentTime}
        onChange={handleChangeProgress}
        className="appearance-none w-full h-1 hover:h-2 custom-progress transition-[height] cursor-pointer"
        style={
          {
            background: `linear-gradient(to right, #ff6900 ${percent}%, #ddd ${percent}%)`,
          } as CSSProperties
        }
      />

      <div className="font-semibold  min-w-[50px]">{secWithMsTohhmmss(duration || 0)}</div>
    </div>
  );
}

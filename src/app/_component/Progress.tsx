import { useContext, CSSProperties } from 'react';
import { AudioContext } from '@/app/_component/CurrentAudioProvider';
import { secWithMsTohhmmss } from '@/utils/util';

export default function Progress() {
  const { currentWavesurferRef, currentTime, setCurrentTime } = useContext(AudioContext);
  const duration = currentWavesurferRef.current?.getDuration() || 0;

  const handleChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setCurrentTime(value);

    if (currentWavesurferRef.current && duration > 0) {
      currentWavesurferRef.current.seekTo(value / duration);
    }
  };

  const percent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex gap-4 items-center">
      <div className="font-semibold  min-w-[50px]">{secWithMsTohhmmss(currentTime)}</div>

      <input
        type="range"
        min={0}
        max={duration}
        step={0.01}
        value={currentTime}
        onChange={handleChangeProgress}
        className="appearance-none w-[500px] h-1 hover:h-2 custom-progress transition-[height] cursor-pointer"
        style={
          {
            background: `linear-gradient(to right, #ff6900 ${percent}%, #ddd ${percent}%)`,
          } as CSSProperties
        }
      />

      <div className="font-semibold  min-w-[50px]">{secWithMsTohhmmss(duration)}</div>
    </div>
  );
}

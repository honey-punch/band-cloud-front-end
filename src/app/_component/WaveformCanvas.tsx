'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  src: string;
  duration: number; // seconds
  currentTime: number; // seconds
  height?: number;
  className?: string;

  // 클릭/드래그로 seek 지원
  onSeek?: (time: number) => void;

  // 성능: 바 개수
  bars?: number;
};

export default function WaveformCanvas({
  src,
  duration,
  currentTime,
  height = 44,
  className = '',
  onSeek,
  bars = 140,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [peaks, setPeaks] = useState<number[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 드래그 상태
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubRatio, setScrubRatio] = useState<number | null>(null);

  // ✅ hover 상태
  const [isHover, setIsHover] = useState(false);

  // ✅ hover 애니메이션 강도(0~1)
  const [hoverIntensity, setHoverIntensity] = useState(0);
  const hoverRafRef = useRef<number | null>(null);

  // hoverIntensity 부드럽게 변화시키기 (트랜지션 느낌)
  useEffect(() => {
    if (hoverRafRef.current) cancelAnimationFrame(hoverRafRef.current);

    const target = isHover ? 1 : 0;
    const speed = 0.12; // 값 클수록 빨라짐

    const tick = () => {
      setHoverIntensity((prev) => {
        const next = prev + (target - prev) * speed;

        // 거의 도달하면 고정
        if (Math.abs(next - target) < 0.01) return target;

        hoverRafRef.current = requestAnimationFrame(tick);
        return next;
      });
    };

    hoverRafRef.current = requestAnimationFrame(tick);

    return () => {
      if (hoverRafRef.current) cancelAnimationFrame(hoverRafRef.current);
    };
  }, [isHover]);

  // 실제 재생 progress
  const playProgress = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.min(1, Math.max(0, currentTime / duration));
  }, [currentTime, duration]);

  // 드래그 중이면 드래그 progress로 색칠, 아니면 재생 progress
  const drawProgress = useMemo(() => {
    if (isScrubbing && scrubRatio !== null) return scrubRatio;
    return playProgress;
  }, [isScrubbing, scrubRatio, playProgress]);

  useEffect(() => {
    let cancelled = false;

    async function buildPeaks() {
      try {
        setIsLoading(true);

        const res = await fetch(src);
        const arrayBuffer = await res.arrayBuffer();

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        const channelData0 = audioBuffer.getChannelData(0);
        const channelData1 =
          audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : null;

        const totalSamples = channelData0.length;
        const blockSize = Math.floor(totalSamples / bars);

        const newPeaks: number[] = new Array(bars).fill(0);

        for (let i = 0; i < bars; i++) {
          const start = i * blockSize;
          const end = Math.min(start + blockSize, totalSamples);

          let peak = 0;

          for (let j = start; j < end; j++) {
            const v0 = Math.abs(channelData0[j]);
            const v = channelData1 ? (v0 + Math.abs(channelData1[j])) / 2 : v0;
            if (v > peak) peak = v;
          }

          newPeaks[i] = peak;
        }

        const max = Math.max(...newPeaks, 0.00001);
        const normalized = newPeaks.map((p) => p / max);

        if (!cancelled) setPeaks(normalized);

        await audioCtx.close();
      } catch (e) {
        console.error('Waveform build error:', e);
        if (!cancelled) setPeaks(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    buildPeaks();

    return () => {
      cancelled = true;
    };
  }, [src, bars]);

  // draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const cssWidth = canvas.clientWidth;
    const cssHeight = height;

    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, cssWidth, cssHeight);

    if (!peaks || peaks.length === 0) {
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = '#ffffff';
      const mid = cssHeight / 2;
      for (let i = 0; i < 40; i++) {
        const x = (i / 40) * cssWidth;
        ctx.fillRect(x, mid, 2, 2);
      }
      ctx.globalAlpha = 1;
      return;
    }

    const barWidth = cssWidth / peaks.length;
    const gap = Math.max(1, barWidth * 0.25);
    const usableBarWidth = Math.max(1, barWidth - gap);

    const centerY = cssHeight / 2;
    const maxBarHeight = cssHeight * 0.9;

    // 기본/활성 색
    const baseColor = 'rgba(255,255,255,0.35)';
    const activeColor = 'rgba(255,105,0,0.95)';

    // 드래그 중엔 살짝 더 밝게
    const scrubbingColor = 'rgba(255,255,255,1)';

    // ✅ hover 시 밝게 만들기 위한 컬러(화이트)
    // hoverIntensity(0~1)에 따라 baseColor/activeColor 위에 흰색을 덮는 느낌으로
    const hoverWhiteAlphaBase = 0.45 * hoverIntensity; // 비활성 바 밝아지는 정도
    const hoverWhiteAlphaActive = 0.25 * hoverIntensity; // 활성 바도 살짝 하얘지는 정도

    for (let i = 0; i < peaks.length; i++) {
      const x = i * barWidth;
      const h = Math.max(2, peaks[i] * maxBarHeight);
      const y = centerY - h / 2;

      const ratio = i / peaks.length;
      const isActive = ratio <= drawProgress;

      // 기본 색
      if (isActive) {
        ctx.fillStyle = isScrubbing ? scrubbingColor : activeColor;
      } else {
        ctx.fillStyle = baseColor;
      }

      const radius = Math.min(3, usableBarWidth / 2);
      roundRect(ctx, x, y, usableBarWidth, h, radius);
      ctx.fill();

      // ✅ hover 오버레이(흰색으로 부드럽게 밝아짐)
      if (!isScrubbing && hoverIntensity > 0.001) {
        ctx.globalAlpha = isActive ? hoverWhiteAlphaActive : hoverWhiteAlphaBase;
        ctx.fillStyle = '#ffffff';
        roundRect(ctx, x, y, usableBarWidth, h, radius);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // 드래그 중이면 현재 커서 위치에 얇은 라인 하나 추가 (감성 + 가독성)
    if (isScrubbing && scrubRatio !== null) {
      const x = scrubRatio * cssWidth;
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, 0, 1, cssHeight);
      ctx.globalAlpha = 1;
    }
  }, [peaks, drawProgress, isScrubbing, scrubRatio, height, hoverIntensity]);

  function getRatioFromEvent(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.min(1, Math.max(0, x / rect.width));
    return ratio;
  }

  function ratioToTime(ratio: number) {
    if (!duration || duration <= 0) return 0;
    return ratio * duration;
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!onSeek) return;
    if (!duration || duration <= 0) return;

    const ratio = getRatioFromEvent(e);
    setIsScrubbing(true);
    setScrubRatio(ratio);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isScrubbing) return;
    const ratio = getRatioFromEvent(e);
    setScrubRatio(ratio);
  }

  function handleMouseUp() {
    if (!onSeek) return;
    if (!duration || duration <= 0) return;

    if (scrubRatio !== null) {
      onSeek(ratioToTime(scrubRatio));
    }

    setIsScrubbing(false);
    setScrubRatio(null);
  }

  function handleMouseLeave() {
    // leave 시엔 미리보기만 종료 (seek은 안 함)
    setIsScrubbing(false);
    setScrubRatio(null);
    setIsHover(false);
  }

  return (
    <div className={`w-full ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ height }}
        className="w-full cursor-pointer select-none"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {isLoading && <div className="text-xs text-zinc-400 mt-1">waveform loading...</div>}
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

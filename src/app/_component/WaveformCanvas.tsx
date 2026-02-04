'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  src: string;
  currentTime: number;
  onSeek: (time: number) => void;

  // optional
  bars?: number;
  height?: number;
  className?: string;
}

export default function WaveformCanvas({
  src,
  currentTime,
  onSeek,
  bars = 100,
  height = 44,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [peaks, setPeaks] = useState<number[] | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // =========================
  // ✅ 상태는 ref로만 관리 (렌더링 최소화)
  // =========================
  const isHoverRef = useRef(false);
  const isScrubbingRef = useRef(false);
  const scrubRatioRef = useRef<number | null>(null);

  // hoverIntensity는 0~1로 부드럽게 이동 (애니메이션 값)
  const hoverIntensityRef = useRef(0);

  // RAF 관리
  const rafDrawRef = useRef<number | null>(null);
  const rafHoverRef = useRef<number | null>(null);

  // =========================
  // 재생 progress (state로 계산)
  // =========================
  const playProgress = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.min(1, Math.max(0, currentTime / duration));
  }, [currentTime, duration]);

  // =========================
  // peaks + duration build
  // =========================
  useEffect(() => {
    let cancelled = false;

    async function buildPeaks() {
      try {
        setIsLoading(true);
        setPeaks(null);
        setDuration(0);

        const res = await fetch(src);
        const arrayBuffer = await res.arrayBuffer();

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        if (cancelled) {
          await audioCtx.close();
          return;
        }

        setDuration(audioBuffer.duration);

        const channelData0 = audioBuffer.getChannelData(0);
        const channelData1 =
          audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : null;

        const totalSamples = channelData0.length;
        const blockSize = Math.max(1, Math.floor(totalSamples / bars));

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
        if (!cancelled) {
          setPeaks(null);
          setDuration(0);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    buildPeaks();

    return () => {
      cancelled = true;
    };
  }, [src, bars]);

  useEffect(() => {
    // ✅ 다른 오디오로 바뀌면 무조건 진행상황 0으로 초기화
    isScrubbingRef.current = false;
    scrubRatioRef.current = null;

    // hover도 같이 끄고 싶으면 (선택)
    isHoverRef.current = false;
    hoverIntensityRef.current = 0;

    // 바로 그려서 UI 즉시 0으로
    requestDraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // =========================
  // 유틸
  // =========================
  function getRatioFromPointerEvent(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    return Math.min(1, Math.max(0, x / rect.width));
  }

  function ratioToTime(ratio: number) {
    if (!duration || duration <= 0) return 0;
    return ratio * duration;
  }

  // =========================
  // draw (한 프레임에 한번만)
  // =========================
  const requestDraw = () => {
    if (rafDrawRef.current) return;
    rafDrawRef.current = requestAnimationFrame(() => {
      rafDrawRef.current = null;
      draw();
    });
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth;
    const cssHeight = height;

    // 캔버스 사이즈 세팅
    const nextW = Math.floor(cssWidth * dpr);
    const nextH = Math.floor(cssHeight * dpr);

    if (canvas.width !== nextW) canvas.width = nextW;
    if (canvas.height !== nextH) canvas.height = nextH;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    // peaks 없을 때 placeholder
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

    const baseColor = 'rgba(255,255,255,0.35)';
    const activeColor = 'rgba(255,105,0,0.95)';
    const scrubbingColor = 'rgba(255,255,255,1)';

    const isScrubbing = isScrubbingRef.current;
    const scrubRatio = scrubRatioRef.current;

    const drawProgress = isScrubbing && scrubRatio !== null ? scrubRatio : playProgress;

    const hoverIntensity = hoverIntensityRef.current;

    const hoverWhiteAlphaBase = 0.9 * hoverIntensity;
    const hoverWhiteAlphaActive = 0.5 * hoverIntensity;

    for (let i = 0; i < peaks.length; i++) {
      const x = i * barWidth;
      const h = Math.max(2, peaks[i] * maxBarHeight);
      const y = centerY - h / 2;

      const ratio = i / peaks.length;
      const isActive = ratio <= drawProgress;

      if (isActive) {
        ctx.fillStyle = isScrubbing ? scrubbingColor : activeColor;
      } else {
        ctx.fillStyle = baseColor;
      }

      const radius = Math.min(3, usableBarWidth / 2);
      roundRect(ctx, x, y, usableBarWidth, h, radius);
      ctx.fill();

      // hover overlay
      if (!isScrubbing && hoverIntensity > 0.001) {
        ctx.globalAlpha = isActive ? hoverWhiteAlphaActive : hoverWhiteAlphaBase;
        ctx.fillStyle = '#ffffff';
        roundRect(ctx, x, y, usableBarWidth, h, radius);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // scrubbing line
    if (isScrubbing && scrubRatio !== null) {
      const x = scrubRatio * cssWidth;
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, 0, 1, cssHeight);
      ctx.globalAlpha = 1;
    }
  };

  // =========================
  // hover 애니메이션 (state setX ❌)
  // =========================
  const startHoverAnimation = () => {
    if (rafHoverRef.current) cancelAnimationFrame(rafHoverRef.current);

    const target = isHoverRef.current ? 1 : 0;
    const speed = 0.16; // 0.12~0.2 정도가 250~350ms 느낌

    const tick = () => {
      const prev = hoverIntensityRef.current;
      const next = prev + (target - prev) * speed;

      hoverIntensityRef.current = next;

      requestDraw();

      if (Math.abs(next - target) < 0.01) {
        hoverIntensityRef.current = target;
        requestDraw();
        return;
      }

      rafHoverRef.current = requestAnimationFrame(tick);
    };

    rafHoverRef.current = requestAnimationFrame(tick);
  };

  // =========================
  // peaks/currentTime 변경시 다시 draw
  // =========================
  useEffect(() => {
    requestDraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peaks, playProgress, height]);

  // =========================
  // unmount cleanup
  // =========================
  useEffect(() => {
    return () => {
      if (rafDrawRef.current) cancelAnimationFrame(rafDrawRef.current);
      if (rafHoverRef.current) cancelAnimationFrame(rafHoverRef.current);
    };
  }, []);

  // =========================
  // JSX
  // =========================
  return (
    <div className={`w-full ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ height }}
        className="w-full cursor-pointer select-none"
        onPointerEnter={() => {
          isHoverRef.current = true;
          startHoverAnimation();
        }}
        onPointerLeave={(e) => {
          // hover는 반드시 종료
          isHoverRef.current = false;
          startHoverAnimation();

          // 스크러빙도 같이 종료
          isScrubbingRef.current = false;
          scrubRatioRef.current = null;

          // 혹시 캡처중이면 해제
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {}

          requestDraw();
        }}
        onPointerDown={(e) => {
          if (!duration || duration <= 0) return;

          e.currentTarget.setPointerCapture(e.pointerId);

          isScrubbingRef.current = true;
          scrubRatioRef.current = getRatioFromPointerEvent(e);

          requestDraw();
        }}
        onPointerMove={(e) => {
          if (!isScrubbingRef.current) return;

          scrubRatioRef.current = getRatioFromPointerEvent(e);
          requestDraw();
        }}
        onPointerUp={(e) => {
          if (!duration || duration <= 0) return;

          const ratio = scrubRatioRef.current;
          if (ratio !== null) {
            onSeek(ratioToTime(ratio));
          }

          isScrubbingRef.current = false;
          scrubRatioRef.current = null;

          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {}

          requestDraw();
        }}
        onPointerCancel={() => {
          isScrubbingRef.current = false;
          scrubRatioRef.current = null;

          isHoverRef.current = false;
          startHoverAnimation();

          requestDraw();
        }}
        onLostPointerCapture={() => {
          isScrubbingRef.current = false;
          scrubRatioRef.current = null;

          isHoverRef.current = false;
          startHoverAnimation();

          requestDraw();
        }}
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

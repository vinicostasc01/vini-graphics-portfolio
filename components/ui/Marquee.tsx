'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';

type Props = {
  children: ReactNode;
  /** Seconds for one full pass. Higher = slower. */
  duration?: number;
  reverse?: boolean;
  className?: string;
};

/**
 * Duplicates its children once and translates the track by exactly -50%,
 * so the seam is invisible regardless of content width.
 */
export default function Marquee({
  children,
  duration = 26,
  reverse = false,
  className,
}: Props) {
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        xPercent: reverse ? 50 : -50,
        ease: 'none',
        duration,
        repeat: -1,
      });
      if (reverse) gsap.set(el, { xPercent: -50 });
    }, el);

    return () => ctx.revert();
  }, [duration, reverse]);

  return (
    <div className={`marquee ${className ?? ''}`}>
      <div className="marquee-track" ref={track}>
        <div style={{ display: 'flex', flexShrink: 0 }}>{children}</div>
        <div style={{ display: 'flex', flexShrink: 0 }} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

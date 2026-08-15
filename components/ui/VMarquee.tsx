'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';

type Props = {
  children: ReactNode;
  /** Segundos para uma volta completa. Maior = mais lento. */
  duration?: number;
  /** Sobe em vez de descer. */
  up?: boolean;
  className?: string;
};

/**
 * Marquee vertical. Duplica os filhos uma vez e translada exatamente -50%,
 * então a emenda é invisível qualquer que seja a altura do conteúdo.
 */
export default function VMarquee({
  children,
  duration = 40,
  up = true,
  className,
}: Props) {
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { yPercent: up ? 0 : -50 });
      gsap.to(el, {
        yPercent: up ? -50 : 0,
        ease: 'none',
        duration,
        repeat: -1,
      });
    }, el);

    return () => ctx.revert();
  }, [duration, up]);

  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      <div ref={track}>
        <div>{children}</div>
        <div aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}

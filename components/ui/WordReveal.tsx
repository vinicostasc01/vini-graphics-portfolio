'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Props = {
  text: string;
  className?: string;
  /** Words rendered in blue instead of white — 0-indexed. */
  accent?: number[];
};

/**
 * Word-by-word scrub reveal: words start dim and light up as the block
 * crosses the viewport. This is the one effect worth doing in GSAP rather
 * than framer-motion — scrubbing dozens of children to scroll position is
 * exactly what ScrollTrigger is built for.
 */
export default function WordReveal({ text, className, accent = [] }: Props) {
  const root = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.wr-word'),
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.35,
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            end: 'bottom 58%',
            scrub: 0.6,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text]);

  return (
    <p ref={root} className={className}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="wr-word"
          style={{
            display: 'inline-block',
            marginRight: '0.28em',
            color: accent.includes(i) ? 'var(--blue-soft)' : undefined,
          }}
        >
          {w}
        </span>
      ))}
    </p>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

type Props = {
  className?: string;
  /** Espelha horizontalmente, para usar do outro lado da página. */
  flip?: boolean;
};

/**
 * Rabisco de caneta, desenhado com stroke-dashoffset quando entra em tela.
 * É o único elemento gestual da página — tudo o mais é régua reta — então
 * carrega sozinho a energia de marcação à mão da referência.
 */
export default function Scribble({ className, flip }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  const reduced = useReducedMotion();

  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 320 260"
      fill="none"
      aria-hidden="true"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <motion.path
        d="M18 232c46-18 86-52 96-98 5-24-3-48-22-52-17-4-31 12-30 30 2 30 34 47 66 48 44 2 84-24 108-58 14-20 20-46 10-66-8-16-28-22-42-12-16 11-16 34-6 50 14 22 40 33 66 34"
        stroke="var(--blue)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

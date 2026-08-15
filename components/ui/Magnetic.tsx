'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

type Props = {
  children: ReactNode;
  /** How far the element chases the cursor, 0–1. */
  strength?: number;
  className?: string;
};

export default function Magnetic({ children, strength = 0.32, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 22, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 22, mass: 0.6 });

  if (reduced) return <span className={className}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x, y, display: 'inline-flex' }}
      onPointerMove={(e) => {
        // Coarse pointers report a single synthetic move on tap; ignore them
        // so the element doesn't stick offset after a touch.
        if (e.pointerType !== 'mouse') return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left - r.width / 2) * strength);
        my.set((e.clientY - r.top - r.height / 2) * strength * 1.2);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

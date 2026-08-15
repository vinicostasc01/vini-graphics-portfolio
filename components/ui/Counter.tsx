'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

type Props = {
  to: number;
  /** Where the count starts. Useful for years (2019 shouldn't count from 0). */
  from?: number;
  suffix?: string;
  className?: string;
};

export default function Counter({ to, from = 0, suffix = '', className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduced = useReducedMotion();

  const value = useMotionValue(from);
  const spring = useSpring(value, { stiffness: 60, damping: 22 });

  useEffect(() => {
    if (inView) value.set(to);
  }, [inView, to, value]);

  useEffect(() => {
    if (reduced) return;
    return spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.round(v) + suffix;
    });
  }, [spring, suffix, reduced]);

  // Server-rendered content is the final value, so it is correct without JS
  // and correct for reduced-motion users.
  return (
    <span ref={ref} className={className}>
      {reduced ? to + suffix : from + suffix}
    </span>
  );
}

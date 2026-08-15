'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import styles from './Selo.module.css';

/**
 * Selo composto de dois arquivos originais dele: o mark fica parado no centro
 * e só o anel de texto gira, amarrado ao progresso do scroll.
 *
 * O `selo-oficial.svg` é peça única e giraria inteiro, logo do centro
 * incluído — por isso a composição usa `selo-texto.svg` + `logo-v.svg`.
 */
export default function Selo({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 260]);

  return (
    <div className={`${styles.selo} ${className ?? ''}`} ref={ref} aria-hidden="true">
      <motion.div className={styles.anel} style={{ rotate }}>
        <Image src="/selo-texto.svg" alt="" width={170} height={170} />
      </motion.div>
      <Image src="/logo-v.svg" alt="" width={49} height={50} className={styles.mark} />
    </div>
  );
}

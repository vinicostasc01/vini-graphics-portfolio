'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import styles from './SeamWord.module.css';

type Props = {
  children: string;
  /** Cor da metade de cima (sobre a seção escura). */
  top?: string;
  /** Cor da metade de baixo (sobre a seção clara). */
  bottom?: string;
};

/**
 * Palavra gigante cortada ao meio pela emenda entre duas seções: a metade de
 * cima fica sobre o fundo escuro, a de baixo sobre o claro. São duas cópias
 * do mesmo texto, cada uma recortada por clip-path na sua metade — assim a
 * letra continua sendo texto selecionável e acessível, não imagem.
 */
export default function SeamWord({
  children,
  top = 'var(--fg)',
  bottom = 'var(--paper-fg)',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Deriva lateral suave conforme passa pela tela — o mesmo gesto do wordmark
  // sangrando pelas bordas na referência.
  const x = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['6%', '-6%']);

  return (
    <div className={styles.wrap} ref={ref} aria-hidden="true">
      <motion.div className={styles.inner} style={{ x }}>
        <span className={`display ${styles.half}`} style={{ color: top }}>
          {children}
        </span>
        <span
          className={`display ${styles.half} ${styles.lower}`}
          style={{ color: bottom }}
        >
          {children}
        </span>
      </motion.div>
    </div>
  );
}

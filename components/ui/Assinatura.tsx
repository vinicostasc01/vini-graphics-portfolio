'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import styles from './Assinatura.module.css';

/**
 * A assinatura escrevendo, renderizada no Remotion e exportada em WebM com
 * canal alfa (VP8 + yuva420p).
 *
 * WebM com alfa não toca no Safari, e o vídeo simplesmente não pinta. Por isso
 * o SVG estático fica montado por baixo: se o vídeo falhar, não conseguir
 * tocar, ou o visitante pedir menos movimento, é ele que aparece.
 */
export default function Assinatura({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(wrap, { once: true, margin: '0px 0px -18% 0px' });
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!inView || reduced) return;
    const el = video.current;
    if (!el) return;
    el.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, [inView, reduced]);

  return (
    <div className={`${styles.wrap} ${className ?? ''}`} ref={wrap}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={video}
        className={styles.video}
        style={{ opacity: playing ? 1 : 0 }}
        src={reduced ? undefined : '/assinatura.webm'}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        onError={() => setPlaying(false)}
      />
      <img
        className={styles.still}
        style={{ opacity: playing ? 0 : 1 }}
        src="/assinatura.svg"
        alt="Assinatura de Vinícius Santos"
        width={1080}
        height={1080}
      />
    </div>
  );
}

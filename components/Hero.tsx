'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useId, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import PanelShape from './ui/PanelShape';
import Marquee from './ui/Marquee';
import VMarquee from './ui/VMarquee';
import Magnetic from './ui/Magnetic';
import Selo from './ui/Selo';
import Arrow from './ui/Arrow';
import { PROJECTS, wa, LINKS } from '@/lib/data';
import styles from './Hero.module.css';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

const EASE = [0.22, 1, 0.36, 1] as const;

const CLIENTS = [
  'Atena Proteção Veicular',
  'Litoral Norte Santos FC',
  'Bem Estar Fit',
  'Felina Closet',
  'Pacgens',
  'NXZ Vendas',
  'Residencial Palace',
];

// Quatro colunas de trabalho formam o papel de parede do painel.
const COLUMNS = [
  PROJECTS.slice(0, 3),
  PROJECTS.slice(3, 6),
  PROJECTS.slice(6, 9),
  PROJECTS.slice(9, 12),
];

function Stack({ items }: { items: typeof PROJECTS }) {
  return (
    <>
      {items.map((p) => (
        <span key={p.slug} className={styles.tile}>
          <Image src={p.image} alt="" width={404} height={316} sizes="240px" />
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();

  // O shape é desenhado no tamanho real do painel, então precisa medi-lo.
  const panelRef = useRef<HTMLDivElement>(null);
  const clipId = useId().replace(/:/g, '');
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Âncora do selo: o entalhe do shape gerado tem profundidade fixa.
  const notchDepth = 62;

  // Barra de progresso da página, ancorada na borda do painel como na referência.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <header className={styles.hero} id="top">
      <PanelShape id={clipId} width={box.w} height={box.h} notchDepth={notchDepth} />

      <div className={styles.panelWrap}>
      <motion.div
        className={styles.panel}
        ref={panelRef}
        style={{ clipPath: box.w ? `url(#${clipId})` : undefined }}
        initial={reduced ? false : { opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        {/* ── Papel de parede: o trabalho dele, rebaixado ── */}
        <div className={styles.paper} aria-hidden="true">
          {COLUMNS.map((col, i) => (
            <VMarquee
              key={i}
              className={styles.column}
              duration={52 + i * 7}
              up={i % 2 === 0}
            >
              <Stack items={col} />
            </VMarquee>
          ))}
        </div>
        <div className={styles.veil} aria-hidden="true" />
        <HeroCanvas />

        {/* ── Pills do topo ── */}
        <motion.span className={`${styles.pill} ${styles.pillLeft}`} {...rise(0.35)}>
          <i className={styles.dot} />
          Aceitando projetos
        </motion.span>
        <motion.span className={`${styles.pill} ${styles.pillRight}`} {...rise(0.42)}>
          Sergipe, Brasil
        </motion.span>

        {/* ── Bloco tipográfico ── */}
        <div className={styles.type}>
          {/* Os kickers precisam ser filhos deste wrapper, não do .type: como
              absolutos dentro do .type eles se posicionavam contra o painel
              inteiro e saíam pela borda de cima. */}
          <div className={styles.wordWrap}>
            <motion.span className={styles.kickerA} {...rise(0.5)}>
              Parecer do
            </motion.span>

            <h1 className={`display ${styles.word}`}>
              <span className={styles.wordMask}>
                <motion.span
                  initial={reduced ? false : { y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.05, delay: 0.24, ease: EASE }}
                >
                  tamanho;
                </motion.span>
              </span>
            </h1>

            <motion.span className={styles.kickerB} {...rise(0.56)}>
              que você já é
            </motion.span>
          </div>

          <motion.span
            className={styles.rule}
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: EASE }}
          />
        </div>

        {/* ── Rodapé do painel ── */}
        <motion.a
          className={styles.handle}
          href={LINKS.instagram}
          target="_blank"
          rel="noopener"
          {...rise(0.78)}
        >
          @vini_dsg no insta
          <Arrow />
        </motion.a>

        <motion.div className={styles.progress} {...rise(0.84)} aria-hidden="true">
          <span className={styles.track}>
            <motion.span style={{ scaleX: progress }} />
          </span>
        </motion.div>

      </motion.div>

        {/* Selo fora do painel de propósito: ele transborda o entalhe, e o
            clip-path do painel o cortaria pela metade. */}
        <motion.div
          className={styles.notch}
          style={{ height: notchDepth }}
          initial={reduced ? false : { opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.62, ease: EASE }}
        >
          <Magnetic strength={0.2}>
            <a
              href={wa('Olá Vini! Quero um orçamento para minha marca.')}
              target="_blank"
              rel="noopener"
              aria-label="Pedir orçamento no WhatsApp"
              className={styles.notchLink}
            >
              <Selo className={styles.selo} />
            </a>
          </Magnetic>
        </motion.div>
      </div>

      {/* ── Fora do painel ── */}
      <motion.p className={styles.sub} {...rise(0.9)}>
        Vinícius Santos, designer gráfico. Identidade visual e social media para negócio
        que já vende no boca a boca e cansou de parecer improvisado.
      </motion.p>

      <motion.div className={styles.ticker} {...rise(0.96)}>
        <Marquee duration={38}>
          {CLIENTS.map((c) => (
            <span key={c} className={styles.client}>
              {c}
              <i />
            </span>
          ))}
        </Marquee>
      </motion.div>
    </header>
  );
}

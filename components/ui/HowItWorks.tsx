'use client';

import type { CSSProperties } from 'react';
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from 'framer-motion';
import s from './HowItWorks.module.css';

export type HowItWorksStep = {
  /** Rótulo curto acima do título — "Etapa 01" */
  step: string;
  name: string;
  body: string;
};

type Props = {
  steps: HowItWorksStep[];
  className?: string;
};

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

/** Altura do palco no desktop — os cards são posicionados em absoluto. */
function stageHeight(count: number) {
  if (count <= 1) return 400;
  if (count === 2) return 450;
  if (count === 3) return 800;
  if (count === 4) return 900;
  return 1130;
}

/** Trilha pontilhada que costura um card no próximo. */
function trailPath(count: number) {
  const segments = [
    'M 290 150 C 500 150, 550 270, 710 270',
    ' C 850 270, 500 350, 290 450',
    ' C 290 600, 550 720, 750 720',
    ' C 950 720, 500 800, 290 850',
  ];
  return segments.slice(0, Math.max(0, count - 1)).join('');
}

export default function HowItWorks({ steps, className }: Props) {
  const reduced = useReducedMotion();
  const height = stageHeight(steps.length);
  const path = trailPath(steps.length);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={[s.stage, className].filter(Boolean).join(' ')}
        style={{ '--stage-h': `${height}px` } as CSSProperties}
        initial={reduced ? undefined : 'hidden'}
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      >
        {path && (
          <svg
            className={s.trail}
            viewBox={`0 0 1000 ${height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <m.path
              d={path}
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="8 6"
              strokeLinecap="round"
              fill="none"
              vectorEffect="non-scaling-stroke"
              initial={{ strokeDashoffset: 0 }}
              animate={reduced ? undefined : { strokeDashoffset: -140 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </svg>
        )}

        {steps.map((step, i) => (
          <m.div
            key={step.name}
            className={`${s.card} ${s[`p${i % 5}`]}`}
            variants={{
              hidden: reduced ? {} : { opacity: 0, y: 28 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <div className={s.tilt}>
              <div className={s.pane}>
                <Pin className={s.pin} />
                <div className={s.inner}>
                  <span className={s.num}>{`0${i + 1}`.slice(-2)}</span>
                  <span className={s.tag}>{step.step}</span>
                  <h3 className={s.title}>{step.name}</h3>
                  <p className={s.body}>{step.body}</p>
                </div>
              </div>
            </div>
          </m.div>
        ))}
      </m.div>
    </LazyMotion>
  );
}

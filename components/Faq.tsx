'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Reveal from './ui/Reveal';
import { FAQ } from '@/lib/data';
import s from './Sections.module.css';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <section id="duvidas">
      <div className="col">
        <Reveal className={s.head}>
          <div className="sec-head">
            <span className="mono">Dúvidas</span>
          </div>
          <h2 className="t-xl">O que costumam me perguntar</h2>
        </Reveal>

        <Reveal className={s.faq}>
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={s.faqItem}>
                <button
                  className={s.faqQ}
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                >
                  <span>{item.q}</span>
                  <span className={`${s.faqIcon} ${isOpen ? s.faqIconOpen : ''}`} aria-hidden="true">
                    <i />
                    <i />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      key="body"
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduced ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p className={`body ${s.faqA}`}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

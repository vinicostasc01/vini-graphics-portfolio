'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import styles from './TopBar.module.css';

const NAV = [
  { href: '#trabalhos', label: 'Trabalhos' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#planos', label: 'Planos' },
  { href: '#contato', label: 'Contato' },
];

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 40));

  return (
    <>
      <header className={`${styles.bar} ${solid ? styles.solid : ''}`}>
        <a href="#top" className={styles.brand} aria-label="Vini Graphics — início">
          {/* Paths exatas do arquivo oficial dele (public/logo-v.svg), inline
              para o mark poder herdar a cor no hover. */}
          <svg viewBox="0 0 49 50" className={styles.mark} aria-hidden="true">
            <path
              fill="currentColor"
              d="M48.5905 38.2399C48.5687 38.5622 48.5513 38.8453 48.4577 39.148C48.3858 39.381 48.2225 39.7817 47.8087 40.1977L39.3746 48.7864C38.865 49.3069 38.1682 49.5987 37.4386 49.5987H16.7442C15.3047 49.5987 14.0961 48.61 13.7608 47.2729V41.4781C13.7608 39.7229 12.3366 38.2987 10.5814 38.2987H2.02092C0.897239 38.2987 -0.0195622 37.3754 0.0174583 36.2517V36.2321C0.0849662 35.6137 0.363706 35.0322 0.814485 34.5902L9.40324 26.156C11.1214 24.4727 14.0177 25.6878 14.0177 28.092V31.7592C14.0177 33.8715 15.7294 35.5832 17.8417 35.5832H30.7532C32.8655 35.5832 34.5772 33.8715 34.5772 31.7592V3.10531C34.5772 2.63711 34.6773 2.07745 34.8603 1.5069C35.3045 0.614054 36.2235 0.00212669 37.2884 0.00212669H45.8793C46.9442 0.00212669 47.8654 0.614054 48.3074 1.5069C48.4903 2.07745 48.5905 2.63711 48.5905 3.10531H48.5927V37.4603C48.6036 37.652 48.6101 37.9198 48.5905 38.2399Z"
            />
            <path
              fill="currentColor"
              d="M4.6145 27.0228L13.2054 18.5886C13.7259 18.0791 14.0177 17.38 14.0177 16.6527V2.71338C14.0177 1.21514 12.8026 0 11.3043 0H2.71338C1.21514 0 0 1.21514 0 2.71338V25.0846C0 27.4888 2.89631 28.7061 4.61232 27.0206H4.6145V27.0228Z"
            />
          </svg>
          <span className={styles.wordmark}>Vini Graphics</span>
        </a>

        <nav className={styles.links} aria-label="Navegação principal">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>

        <button
          className={styles.menuBtn}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          <span className={`${styles.icon} ${open ? styles.iconOpen : ''}`}>
            <i />
            <i />
            <i />
            <i />
          </span>
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.sheet}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {NAV.map((n, i) => (
              <motion.a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.5 }}
              >
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                {n.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

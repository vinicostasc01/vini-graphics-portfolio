'use client';

import Image from 'next/image';
import Marquee from './ui/Marquee';
import { wa, LINKS } from '@/lib/data';
import s from './Sections.module.css';

export default function Footer() {
  return (
    <footer className={s.footer}>
      <a
        className={s.footerCta}
        href={wa('Olá Vini! Vim pelo seu portfólio e quero conversar sobre um projeto.')}
        target="_blank"
        rel="noopener"
        aria-label="Falar no WhatsApp"
      >
        <Marquee duration={22}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={s.footerWord}>
              Vamos conversar
              <i className={s.marqueeDot} />
            </span>
          ))}
        </Marquee>
      </a>

      <div className={`col ${s.footerBar}`}>
        {/* Wordmark oficial, arquivo original dele. */}
        <Image
          src="/logo-wordmark.svg"
          alt="Vini Graphics"
          width={143}
          height={52}
          className={s.footerLogo}
        />
        <p className={s.footerCopy}>© 2026 Vinícius Santos</p>
        <nav className={s.footerLinks} aria-label="Redes">
          <a href={LINKS.behance} target="_blank" rel="noopener">
            Behance
          </a>
          <a href={LINKS.instagram} target="_blank" rel="noopener">
            Instagram
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}

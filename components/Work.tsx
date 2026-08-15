'use client';

import { useMemo, useState } from 'react';
import Reveal from './ui/Reveal';
import Marquee from './ui/Marquee';
import Magnetic from './ui/Magnetic';
import Arrow from './ui/Arrow';
import CardFanCarousel, { type CardItem } from './ui/CardFanCarousel';
import { PROJECTS, CATEGORY_LABEL, LINKS, type Category } from '@/lib/data';
import s from './Sections.module.css';

type Filter = 'all' | Category;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tudo' },
  { id: 'identidade', label: 'Identidade' },
  { id: 'social', label: 'Social media' },
  { id: 'logotipo', label: 'Logotipo' },
  { id: 'motion', label: 'Motion & VFX' },
];

export default function Work() {
  const [filter, setFilter] = useState<Filter>('all');

  const cards: CardItem[] = useMemo(() => {
    const shown =
      filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
    return shown.map((p) => ({
      imgUrl: p.image,
      alt: `${p.title} — ${p.client}`,
      linkUrl: p.href,
      title: p.title,
      meta: CATEGORY_LABEL[p.category],
    }));
  }, [filter]);

  return (
    <section id="trabalhos">
      <Marquee duration={30} className={s.workMarquee}>
        {['Trabalhos selecionados', 'Trabalhos selecionados', 'Trabalhos selecionados'].map(
          (t, i) => (
            <span key={i} className={s.marqueeWord}>
              {t}
              <i className={s.marqueeDot} />
            </span>
          )
        )}
      </Marquee>

      <div className="col">
        <Reveal className={s.head}>
          <div className="sec-head">
            <span className="mono">Portfólio</span>
          </div>
          <h2 className="t-xl">Doze projetos publicados</h2>
          <p className="body" style={{ maxWidth: '52ch', marginInline: 'auto' }}>
            Cada capa abre o projeto completo no Behance, com as peças e as aplicações.
            Nada aqui é mockup de exemplo.
          </p>
        </Reveal>

        <Reveal className={s.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`${s.filter} ${filter === f.id ? s.filterOn : ''}`}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
            >
              {f.label}
            </button>
          ))}
        </Reveal>
      </div>

      {/*
        A key força a remontagem ao trocar de filtro. O carrossel guarda o slot
        central e o conjunto visível em refs — sem remontar, mudar a quantidade
        de cards deixaria esse estado apontando para índices que não existem
        mais, e o leque abriria torto.
      */}
      <CardFanCarousel key={filter} cards={cards} />

      <div className="col">
        <div className={s.centerBtn}>
          <Magnetic>
            <a className="btn btn-ghost" href={LINKS.behance} target="_blank" rel="noopener">
              Perfil completo no Behance <Arrow />
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

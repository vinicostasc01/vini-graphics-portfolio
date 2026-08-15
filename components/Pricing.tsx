'use client';

import Reveal, { RevealGroup, RevealItem } from './ui/Reveal';
import Magnetic from './ui/Magnetic';
import Arrow from './ui/Arrow';
import { PLANS, wa } from '@/lib/data';
import s from './Sections.module.css';

export default function Pricing() {
  return (
    <section id="planos">
      <div className="col">
        <Reveal className={s.head}>
          <div className="sec-head">
            <span className="mono">Planos</span>
          </div>
          <h2 className="t-xl">Escolha pelo momento da marca</h2>
          <p className="body" style={{ maxWidth: '52ch', marginInline: 'auto' }}>
            Todo escopo é ajustável. Se não souber por onde começar, me manda uma frase
            sobre o negócio que eu digo qual faz mais sentido.
          </p>
        </Reveal>

        <RevealGroup className={s.plans} as="div" stagger={0.09}>
          {PLANS.map((p) => (
            <RevealItem
              key={p.name}
              className={`card ${s.plan} ${p.featured ? s.planFeat : ''}`}
              as="article"
            >
              <span className={s.planTag}>{p.tag}</span>
              <h3 className="t-md">{p.name}</h3>
              <p className="body">{p.body}</p>

              <ul className={s.planList}>
                {p.items.map((item) => (
                  <li key={item}>
                    <i aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <Magnetic className={s.planCta}>
                <a
                  className={`btn ${p.featured ? 'btn-blue' : 'btn-ghost'}`}
                  href={wa(`Olá Vini! Quero orçamento do plano ${p.name}.`)}
                  target="_blank"
                  rel="noopener"
                >
                  Pedir orçamento <Arrow />
                </a>
              </Magnetic>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

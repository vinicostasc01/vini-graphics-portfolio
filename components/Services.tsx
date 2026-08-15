'use client';

import Reveal, { RevealGroup, RevealItem } from './ui/Reveal';
import { SERVICES } from '@/lib/data';
import s from './Sections.module.css';

export default function Services() {
  return (
    <section id="servicos">
      <div className="col">
        <Reveal className={s.head}>
          <div className="sec-head">
            <span className="mono">O que eu faço</span>
          </div>
          <h2 className="t-xl">Quatro frentes, uma só direção</h2>
        </Reveal>

        <RevealGroup className={s.serviceList} as="div">
          {SERVICES.map((sv) => (
            <RevealItem key={sv.id} className={`card card-rule ${s.service}`}>
              <span className={s.serviceIndex}>[{sv.id}]</span>
              <div className={s.serviceBody}>
                <h3 className="t-md">{sv.name}</h3>
                <p className="body">{sv.body}</p>
                <ul className={s.serviceTags}>
                  {sv.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

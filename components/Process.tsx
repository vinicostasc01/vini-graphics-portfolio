'use client';

import Reveal from './ui/Reveal';
import HowItWorks from './ui/HowItWorks';
import { PROCESS } from '@/lib/data';
import s from './Sections.module.css';

export default function Process() {
  return (
    <section id="processo">
      <div className="col">
        <Reveal className={s.head}>
          <div className="sec-head">
            <span className="mono">Como funciona</span>
          </div>
          <h2 className="t-xl">Da conversa ao arquivo final</h2>
        </Reveal>

        <HowItWorks steps={PROCESS} />
      </div>
    </section>
  );
}

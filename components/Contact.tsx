'use client';

import { useState, type FormEvent } from 'react';
import Reveal from './ui/Reveal';
import Magnetic from './ui/Magnetic';
import Arrow from './ui/Arrow';
import Selo from './ui/Selo';
import { wa, LINKS } from '@/lib/data';
import s from './Sections.module.css';

const BUDGETS = [
  'Ainda não sei',
  'Até R$ 1.000',
  'R$ 1.000 – R$ 3.000',
  'R$ 3.000 – R$ 8.000',
  'Acima de R$ 8.000',
];

export default function Contact() {
  const [note, setNote] = useState(
    'O formulário abre o WhatsApp com a mensagem já escrita.'
  );
  const [noteBlue, setNoteBlue] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? '').trim();

    const nome = get('nome');
    const mensagem = get('mensagem');

    if (!nome && !mensagem) {
      setNote('Escreve pelo menos seu nome ou uma mensagem.');
      setNoteBlue(true);
      return;
    }

    const texto = [
      'Oi Vini! Vim pelo portfólio.',
      '',
      `Nome: ${nome || '(não informado)'}`,
      `Contato: ${get('contato') || '(não informado)'}`,
      `Projeto: ${get('projeto') || '(não informado)'}`,
      `Orçamento: ${get('orcamento') || '(não informado)'}`,
      '',
      mensagem || '(sem mensagem)',
    ].join('\n');

    window.open(wa(texto), '_blank', 'noopener');
    setNote('Abrimos o WhatsApp numa nova aba. Se não abriu, libere os pop-ups.');
    setNoteBlue(true);
  }

  return (
    <section id="contato">
      <div className="col">
        <Reveal className={s.head}>
          <Selo className={s.seloContato} />
          <div className="sec-head">
            <span className="mono">Contato</span>
          </div>
          <h2 className="t-xl">Me conta do seu negócio</h2>
          <p className="body" style={{ maxWidth: '50ch', marginInline: 'auto' }}>
            Respondo com o caminho que faz mais sentido e o orçamento — sem enrolação e
            sem proposta de dez páginas.
          </p>
        </Reveal>

        <Reveal>
          <form className={`card ${s.form}`} onSubmit={onSubmit} noValidate>
            <div className={s.formRow}>
              <div className="field">
                <input type="text" id="nome" name="nome" placeholder=" " autoComplete="name" />
                <label htmlFor="nome">Seu nome</label>
              </div>
              <div className="field">
                <input type="text" id="contato" name="contato" placeholder=" " autoComplete="tel" />
                <label htmlFor="contato">WhatsApp ou e-mail</label>
              </div>
            </div>

            <div className="field">
              <input type="text" id="projeto" name="projeto" placeholder=" " />
              <label htmlFor="projeto">Que projeto você precisa?</label>
            </div>

            <div className={s.budget}>
              <span className="mono">Orçamento previsto</span>
              <div className={s.budgetOpts}>
                {BUDGETS.map((b, i) => (
                  <label key={b} className={s.budgetOpt}>
                    <input type="radio" name="orcamento" value={b} defaultChecked={i === 0} />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="field">
              <textarea id="mensagem" name="mensagem" placeholder=" " />
              <label htmlFor="mensagem">
                O que você vende, prazo e onde a marca vai aparecer
              </label>
            </div>

            <div className={s.formFoot}>
              <Magnetic>
                <button type="submit" className="btn btn-blue">
                  Enviar no WhatsApp <Arrow />
                </button>
              </Magnetic>
              <p className={s.note} style={{ color: noteBlue ? 'var(--blue-soft)' : undefined }}>
                {note}
              </p>
            </div>
          </form>
        </Reveal>

        <Reveal className={s.socials}>
          <a href={wa('Olá Vini! Vim pelo seu portfólio.')} target="_blank" rel="noopener">
            WhatsApp <Arrow />
          </a>
          <a href={LINKS.behance} target="_blank" rel="noopener">
            Behance <Arrow />
          </a>
          <a href={LINKS.instagram} target="_blank" rel="noopener">
            Instagram <Arrow />
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener">
            LinkedIn <Arrow />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

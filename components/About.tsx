'use client';

import Image from 'next/image';
import Reveal, { RevealGroup, RevealItem } from './ui/Reveal';
import Counter from './ui/Counter';
import Arrow from './ui/Arrow';
import SeamWord from './ui/SeamWord';
import Scribble from './ui/Scribble';
import Assinatura from './ui/Assinatura';
import { LINKS } from '@/lib/data';
import s from './Sections.module.css';

const SKILLS = [
  'Identidade visual',
  'Logotipo',
  'Social media',
  'Motion & VFX',
  'Tipografia',
  'Direção de arte',
];

const PROOF = [
  'Direção definida antes de qualquer peça ser desenhada',
  'Arquivos entregues organizados e prontos para publicar',
  'Você fala comigo do briefing à entrega, sem intermediário',
];

export default function About() {
  return (
    <>
      <SeamWord>vini graphics</SeamWord>

      <section id="sobre" className="paper">
        <Scribble className={s.scribble} />

        <div className="col">
          <Reveal className={s.head}>
            <div className="sec-head">
              <span className="mono">Sobre</span>
            </div>
            <h2 className="t-xl">Quem faz</h2>
          </Reveal>

          <div className={s.aboutGrid}>
            <Reveal>
              <p className="body-lg" style={{ marginBottom: 22 }}>
                Sou o Vinícius Santos. Meus clientes quase sempre chegam do mesmo jeito: o
                negócio funciona, o boca a boca traz gente, mas a marca ainda parece feita
                às pressas.
              </p>
              <p className="body">
                Proteção veicular, academia, torcida organizada, loja de camisa,
                hamburgueria, moda. Gente que vende de verdade e precisa parecer do tamanho
                que já é. Meu trabalho começa entendendo o que você vende e para quem, e
                termina com os arquivos organizados na sua mão.
              </p>

              <ul className={s.proof}>
                {PROOF.map((p) => (
                  <li key={p}>
                    <i aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>

              {/* Assinatura escrevendo — vídeo renderizado no Remotion, com
                  o SVG estático como fallback. */}
              <Assinatura className={s.assinatura} />

              <a className={s.handle} href={LINKS.instagram} target="_blank" rel="noopener">
                @vini_dsg <Arrow />
              </a>
            </Reveal>

            <Reveal>
              <figure className={s.portrait}>
                {/* Recorte com fundo transparente — sem as formas do logo
                    atrás, e sem filtro nenhum sobre a foto. */}
                <Image
                  src="/vini-cutout.png"
                  alt="Vinícius Santos"
                  width={1176}
                  height={1138}
                  sizes="(max-width: 820px) 90vw, 440px"
                  className={s.portraitImg}
                />
                <figcaption className="tag">Sergipe, Brasil — atendendo remoto</figcaption>
              </figure>
            </Reveal>
          </div>

          <div className={s.numbers}>
            <div className="sec-head" style={{ alignItems: 'flex-start' }}>
              <span className="mono">Até aqui</span>
            </div>
            <RevealGroup className={s.numberGrid} as="div">
              <RevealItem>
                <span className={`display ${s.bigNum}`}>
                  <Counter to={12} />
                </span>
                <span className={s.numLabel}>
                  Projetos
                  <br />
                  publicados
                </span>
              </RevealItem>
              <RevealItem>
                <span className={`display ${s.bigNum}`}>
                  <Counter to={2019} from={1990} />
                </span>
                <span className={s.numLabel}>
                  Trabalhando
                  <br />
                  com marca desde
                </span>
              </RevealItem>
              <RevealItem>
                <span className={`display ${s.bigNum}`}>1:1</span>
                <span className={s.numLabel}>
                  Do briefing
                  <br />
                  à entrega
                </span>
              </RevealItem>
            </RevealGroup>
          </div>

          <RevealGroup className={s.skills} as="div">
            {SKILLS.map((skill, i) => (
              <RevealItem key={skill} className={s.skill}>
                <span>{skill}</span>
                <span className="tag">{String(i + 1).padStart(2, '0')}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}

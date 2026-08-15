'use client';

/**
 * Gera o shape do painel no tamanho medido, em vez de esticar o SVG.
 *
 * Usar o arquivo como `mask-image` obrigava o painel a manter a proporção
 * 461/350 — e numa tela 16:9 isso impede o painel de ser grande: preencher a
 * largura pediria 1412px de altura em 1080 disponíveis. Esticar resolveria o
 * tamanho mas achataria os cantos e o entalhe.
 *
 * Aqui o retângulo é livre e só o raio dos cantos e o entalhe têm medida
 * fixa, então a forma continua correta em qualquer proporção.
 */

type Props = {
  id: string;
  width: number;
  height: number;
  /** Raio dos cantos. */
  radius?: number;
  /** Meia-largura do entalhe. */
  notchHalf?: number;
  /** Profundidade do entalhe. */
  notchDepth?: number;
};

/**
 * Pontos da curva do entalhe, como frações da meia-largura (h) e da
 * profundidade (d). Vieram do arquivo original dele — é a mesma curva,
 * reparametrizada para poder ser desenhada em qualquer escala.
 */
const CURVE = {
  c1: [0.767, 0],
  c2: [0.641, 0.136],
  p1: [0.522, 0.483],
  c3: [0.415, 0.795],
  c4: [0.217, 1],
} as const;

export default function PanelShape({
  id,
  width: w,
  height: h,
  radius = 30,
  notchHalf = 150,
  notchDepth = 62,
}: Props) {
  if (w <= 0 || h <= 0) return null;

  const r = Math.min(radius, w / 2, h / 2);
  const nh = Math.min(notchHalf, w / 2 - r - 8);
  const nd = notchDepth;
  // Base: onde ficam as bordas laterais. Só o entalhe desce além disso.
  const b = h - nd;
  const cx = w / 2;

  const x = (f: number) => cx + f * nh;
  const y = (f: number) => b + f * nd;

  const d = [
    `M ${r} 0`,
    `H ${w - r}`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `V ${b - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${b}`,
    // desce pelo lado direito do entalhe até o fundo, no centro
    `H ${x(1)}`,
    `C ${x(CURVE.c1[0])} ${y(CURVE.c1[1])}, ${x(CURVE.c2[0])} ${y(CURVE.c2[1])}, ${x(
      CURVE.p1[0],
    )} ${y(CURVE.p1[1])}`,
    `C ${x(CURVE.c3[0])} ${y(CURVE.c3[1])}, ${x(CURVE.c4[0])} ${y(CURVE.c4[1])}, ${cx} ${y(1)}`,
    // espelha para o lado esquerdo
    `C ${x(-CURVE.c4[0])} ${y(CURVE.c4[1])}, ${x(-CURVE.c3[0])} ${y(CURVE.c3[1])}, ${x(
      -CURVE.p1[0],
    )} ${y(CURVE.p1[1])}`,
    `C ${x(-CURVE.c2[0])} ${y(CURVE.c2[1])}, ${x(-CURVE.c1[0])} ${y(CURVE.c1[1])}, ${x(
      -1,
    )} ${b}`,
    `H ${r}`,
    `A ${r} ${r} 0 0 1 0 ${b - r}`,
    `V ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    'Z',
  ].join(' ');

  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        <clipPath id={id} clipPathUnits="userSpaceOnUse">
          <path d={d} />
        </clipPath>
      </defs>
    </svg>
  );
}

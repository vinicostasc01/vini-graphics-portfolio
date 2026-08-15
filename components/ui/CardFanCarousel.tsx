'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './CardFanCarousel.module.css';

/** Largura da zona sensível em cada ponta, como fração da largura do wrap. */
const EDGE_ZONE = 0.16;
/** Intervalo entre avanços quando o ponteiro está parado numa ponta. */
const AUTO_STEP_MS = 750;
/** Inclinação máxima do tilt 3D, em graus. */
const TILT = 11;
/** Pixels de arrasto que valem um card. */
const DRAG_STEP = 80;
/** Acima disso o gesto vira arrasto e o clique no link é cancelado. */
const DRAG_SLOP = 6;

export interface CardItem {
  imgUrl: string;
  alt?: string;
  linkUrl?: string;
  title?: string;
  meta?: string;
}

interface CardFanCarouselProps {
  cards: CardItem[];
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

/**
 * Escala os deslocamentos verticais quando a viewport é baixa demais para a
 * altura ideal do layout.
 */
function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  const available = window.innerHeight * 0.7;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

export default function CardFanCarousel({ cards }: CardFanCarouselProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  /** Camada só do arrasto. O container é do ScrollTrigger, que reescreve o
   *  transform inteiro no scrub e engoliria o tween de volta ao centro. */
  const dragRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const isDragging = useRef(false);
  const [edge, setEdge] = useState<'left' | 'right' | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<'left' | 'right' | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(
    needsPagination ? HALF : totalCards >> 1,
  );

  const getVisibleMap = useCallback(
    (center: number) => {
      const map = new Map<number, number>();
      if (!needsPagination) {
        cards.forEach((_, i) => map.set(i, i));
        return map;
      }
      for (let slot = 0; slot < MAX_VISIBLE; slot++) {
        map.set(
          (((center + slot - HALF) % totalCards) + totalCards) % totalCards,
          slot,
        );
      }
      return map;
    },
    [totalCards, needsPagination, cards],
  );

  const cycle = useCallback(
    (direction: 'left' | 'right') => {
      if (isAnimating.current || !needsPagination) return;
      isAnimating.current = true;
      directionRef.current = direction;
      setCenterIndex((prev) =>
        direction === 'right'
          ? (prev + 1) % totalCards
          : (prev - 1 + totalCards) % totalCards,
      );
    },
    [totalCards, needsPagination],
  );

  /* ── 1. Scroll: o leque gira como uma roda enquanto a seção atravessa ──
     Age só no container, nunca nas cartas — elas já são escritas pelo GSAP do
     leque, e dois tweens no mesmo alvo se anulariam. */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container,
        { rotate: 7, y: 54, scale: 0.94 },
        {
          rotate: -7,
          y: -26,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, []);

  /* ── 2. Auto-play ao encostar nas pontas ────────────────────────────── */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !needsPagination) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (isDragging.current) return; // o arrasto manda enquanto durar
      const r = wrap.getBoundingClientRect();
      const p = (e.clientX - r.left) / r.width;
      setEdge(p < EDGE_ZONE ? 'left' : p > 1 - EDGE_ZONE ? 'right' : null);
    };
    const onLeave = () => setEdge(null);

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, [needsPagination]);

  useEffect(() => {
    if (!edge) return;
    // Um passo imediato, para responder na hora, e depois o loop.
    cycle(edge);
    const id = window.setInterval(() => cycle(edge), AUTO_STEP_MS);
    return () => window.clearInterval(id);
  }, [edge, cycle]);

  /* ── 4. Arrastar ────────────────────────────────────────────────────── */
  useEffect(() => {
    const wrap = wrapRef.current;
    const follow = dragRef.current;
    if (!wrap || !follow || !needsPagination) return;

    let startX = 0;
    let lastStepX = 0;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      startX = lastStepX = e.clientX;
      moved = false;
      setGrabbing(true);
      setEdge(null); // arrastar tem prioridade sobre o auto-play da ponta
      wrap.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;

      const total = e.clientX - startX;
      if (Math.abs(total) > DRAG_SLOP) moved = true;

      // Acompanhamento elástico: o leque segue o dedo bem menos que 1:1,
      // só o suficiente para o gesto ter peso.
      gsap.set(follow, {
        x: gsap.utils.clamp(-64, 64, total * 0.24),
      });

      const dx = e.clientX - lastStepX;
      if (Math.abs(dx) >= DRAG_STEP) {
        // Arrastar para a esquerda traz o próximo card.
        cycle(dx < 0 ? 'right' : 'left');
        lastStepX = e.clientX;
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      setGrabbing(false);
      if (wrap.hasPointerCapture(e.pointerId)) wrap.releasePointerCapture(e.pointerId);

      gsap.to(follow, { x: 0, duration: 0.55, ease: 'power3.out' });

      /**
       * As cartas são links. Sem isto, terminar um arrasto em cima de uma
       * carta abriria o projeto no Behance — o gesto viraria navegação.
       * O listener é de captura e roda uma única vez.
       */
      if (moved) {
        const swallow = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
        };
        wrap.addEventListener('click', swallow, { capture: true, once: true });
        window.setTimeout(
          () => wrap.removeEventListener('click', swallow, { capture: true }),
          260,
        );
      }
    };

    wrap.addEventListener('pointerdown', onDown);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerup', onUp);
    wrap.addEventListener('pointercancel', onUp);

    return () => {
      wrap.removeEventListener('pointerdown', onDown);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerup', onUp);
      wrap.removeEventListener('pointercancel', onUp);
    };
  }, [cycle, needsPagination]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(
      container.querySelectorAll<HTMLElement>('[data-fan-card]'),
    );
    if (!cardElements.length) return;

    // O leque inteiro é decorativo em movimento: quem pede menos movimento
    // recebe o layout final, sem entrada, sem hover e sem elástico.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const release = () => {
      isAnimating.current = false;
      if (isFirstMount) hasEntered.current = true;
    };
    const onCardDone = () => {
      if (++completedCount >= visibleCount) release();
    };

    /**
     * Rede de segurança para a trava.
     *
     * Os tweens de hover usam overwrite:'auto' e podem matar os tweens do
     * ciclo antes do onComplete. Sem isto, `completedCount` nunca alcança
     * `visibleCount`, `isAnimating` fica preso em true e o carrossel para de
     * aceitar avanços — foi exatamente o que travou o auto-play das pontas.
     */
    const maxDuration = isFirstMount ? 1800 : 800;
    const failSafe = window.setTimeout(release, maxDuration);

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (reduced) {
          gsap.set(card, target);
          onCardDone();
        } else if (isFirstMount) {
          gsap.set(card, {
            x: 0,
            y: `${12 * hMult}rem`,
            rotation: 0,
            scale: 0.5,
            opacity: 0,
          });
          gsap.to(card, {
            ...target,
            duration: 1.2,
            ease: 'elastic.out(1.05,.78)',
            delay: 0.2 + slot * 0.06,
            onComplete: onCardDone,
          });
        } else if (!wasVisible) {
          const enterX = direction === 'right' ? 40 : -40;
          gsap.set(card, {
            x: `${enterX}rem`,
            y: `${y * hMult}rem`,
            rotation: direction === 'right' ? 30 : -30,
            scale: 0.5,
            opacity: 0,
          });
          gsap.to(card, {
            ...target,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: onCardDone,
          });
        } else {
          gsap.to(card, {
            ...target,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: onCardDone,
          });
        }
      } else if (wasVisible) {
        const exitX = direction === 'right' ? -40 : 40;
        gsap.to(card, {
          x: `${exitX}rem`,
          opacity: 0,
          scale: 0.5,
          rotation: direction === 'right' ? -30 : 30,
          duration: 0.4,
          ease: 'power2.in',
          zIndex: 0,
        });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    if (reduced) return;

    // ── Hover ──────────────────────────────────────────
    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized =
              centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength =
              8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot)
              targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`,
          y: `${targetY}rem`,
          rotation: targetRot,
          scale: targetScale,
          duration: 0.5,
          delay,
          ease: 'elastic.out(1,.75)',
          overwrite: 'auto',
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        if (activeSlot !== slot) {
          activeSlot = slot;
          updateHoverLayout(slot);
        }
      };
      el.addEventListener('mouseenter', handler);
      return { el, handler };
    });

    /* ── 3. Tilt 3D na carta sob o ponteiro ───────────────────────────
       Aplicado no wrapper interno, não na carta: a carta é escrita pelo
       leque e pelo hover com overwrite:'auto', que mataria o tween 3D. */
    const tiltHandlers: {
      el: HTMLElement;
      move: (e: PointerEvent) => void;
      leave: () => void;
    }[] = [];

    visibleEntries.forEach(({ el }) => {
      const inner = el.querySelector<HTMLElement>('[data-fan-inner]');
      const glare = el.querySelector<HTMLElement>('[data-fan-glare]');
      if (!inner) return;

      const setRotX = gsap.quickTo(inner, 'rotationX', {
        duration: 0.45,
        ease: 'power3.out',
      });
      const setRotY = gsap.quickTo(inner, 'rotationY', {
        duration: 0.45,
        ease: 'power3.out',
      });

      const move = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' || isAnimating.current) return;
        if (isDragging.current) return; // nada de tilt no meio do arrasto
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setRotY(px * TILT * 2);
        setRotX(-py * TILT * 2);
        if (glare) {
          gsap.to(glare, {
            opacity: 0.5,
            // O brilho corre no sentido oposto ao ponteiro, como reflexo.
            xPercent: -px * 60,
            yPercent: -py * 60,
            duration: 0.45,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }
      };

      const leave = () => {
        setRotX(0);
        setRotY(0);
        if (glare) {
          gsap.to(glare, { opacity: 0, duration: 0.5, overwrite: 'auto' });
        }
      };

      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      tiltHandlers.push({ el, move, leave });
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        updateHoverLayout(null);
      }, 50);
    };
    container.addEventListener('mouseleave', onMouseLeave);

    const onResize = () => {
      if (!isAnimating.current) updateHoverLayout(activeSlot);
    };
    window.addEventListener('resize', onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) =>
        el.removeEventListener('mouseenter', handler),
      );
      tiltHandlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
      container.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(failSafe);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination]);

  if (!totalCards) return null;

  const chevron = (direction: 'left' | 'right') => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points={direction === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  );

  return (
    <div
      className={`${s.wrap} ${needsPagination ? s.draggable : ''} ${
        grabbing ? s.grabbing : ''
      }`}
      ref={wrapRef}
    >
      {needsPagination && (
        <>
          <span
            className={`${s.edge} ${s.edgeLeft} ${edge === 'left' ? s.edgeOn : ''}`}
            aria-hidden="true"
          />
          <span
            className={`${s.edge} ${s.edgeRight} ${edge === 'right' ? s.edgeOn : ''}`}
            aria-hidden="true"
          />
        </>
      )}

      <div className={s.drag} ref={dragRef}>
        <div className={s.layout} ref={containerRef}>
        {cards.map((card, index) => {
          const inner = (
            <span className={s.inner} data-fan-inner>
              <span className={s.cardImg}>
                {/* next/image não serve aqui: o GSAP escreve transform direto no
                    elemento e a moldura precisa ser o nó posicionado. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.imgUrl} loading="lazy" alt={card.alt ?? ''} />
                <span className={s.glare} data-fan-glare aria-hidden="true" />
              </span>
              {card.title && (
                <span className={s.cardMeta}>
                  <span className={s.cardTitle}>{card.title}</span>
                  {card.meta && <span className={s.cardTag}>{card.meta}</span>}
                </span>
              )}
            </span>
          );

          return card.linkUrl ? (
            <a
              key={index}
              data-fan-card
              className={s.card}
              href={card.linkUrl}
              target={card.linkUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
            >
              {inner}
            </a>
          ) : (
            <div key={index} data-fan-card className={s.card}>
              {inner}
            </div>
          );
          })}
        </div>
      </div>

      {needsPagination && (
        <div className={s.controls}>
          <button className={s.arrow} onClick={() => cycle('left')} aria-label="Anterior">
            {chevron('left')}
          </button>
          <div className={s.dots}>
            {cards.map((_, i) => (
              <span
                key={i}
                className={`${s.dot} ${i === centerIndex ? s.dotOn : ''}`}
              />
            ))}
          </div>
          <button className={s.arrow} onClick={() => cycle('right')} aria-label="Próximo">
            {chevron('right')}
          </button>
        </div>
      )}
    </div>
  );
}

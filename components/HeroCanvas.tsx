'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const LINES = 18;

/**
 * Traços. Nada além disso.
 *
 * A versão anterior era um campo de partículas que lia como céu estrelado e
 * competia com a tipografia. Aqui o three.js desenha só linhas horizontais
 * finas em azul, à deriva em profundidades diferentes — o mesmo elemento
 * gráfico das réguas do layout, só que com paralaxe real de câmera.
 */
function Traces() {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const segments = useMemo(() => {
    return Array.from({ length: LINES }, () => ({
      y: (Math.random() - 0.5) * 11,
      z: (Math.random() - 0.5) * 7,
      x: (Math.random() - 0.5) * 12,
      len: 1.4 + Math.random() * 5.2,
      speed: 0.12 + Math.random() * 0.42,
      opacity: 0.14 + Math.random() * 0.4,
    }));
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    // Paralaxe amortecida do ponteiro.
    const px = (state.pointer.x * viewport.width) / 40;
    const py = (state.pointer.y * viewport.height) / 40;
    g.position.x += (px - g.position.x) * 0.03;
    g.position.y += (py - g.position.y) * 0.03;

    // Cada traço corre para a direita e reaparece do outro lado.
    g.children.forEach((child, i) => {
      child.position.x += segments[i].speed * delta;
      if (child.position.x > 9) child.position.x = -9;
    });
  });

  return (
    <group ref={group}>
      {segments.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <planeGeometry args={[s.len, 0.008]} />
          <meshBasicMaterial
            color="#1b4dff"
            transparent
            opacity={s.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroCanvas() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Timer, não requestAnimationFrame: rAF não dispara com a aba em segundo
    // plano, e o canvas nunca chegaria a montar.
    const id = window.setTimeout(() => setEnabled(true), 60);
    return () => window.clearTimeout(id);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        maskImage: 'linear-gradient(90deg, #000 20%, transparent 78%)',
        WebkitMaskImage: 'linear-gradient(90deg, #000 20%, transparent 78%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      >
        <Traces />
      </Canvas>
    </div>
  );
}

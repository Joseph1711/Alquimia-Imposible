import React, { useEffect, useRef, useState } from 'react';
import { Radiation, AlertTriangle, FastForward } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const NuclearDetonationCinematic: React.FC = () => {
  const { skipNuclearCinematic } = useGame();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hudMessage, setHudMessage] = useState('INICIANDO CONFINAMIENTO MAGNÉTICO DE NÚCLEO EXPERIMENTAL...');
  const [screenShake, setScreenShake] = useState(0);
  const [flashIntensity, setFlashIntensity] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const startTime = performance.now();

    // 600 explosion sparks and debris particles
    const particleCount = 450;
    const particles = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 260;
      return {
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: (Math.sin(angle) * speed) - (30 + Math.random() * 80),
        size: 2 + Math.random() * 4,
        color: Math.random() > 0.6 ? '#fde047' : Math.random() > 0.3 ? '#f97316' : '#ef4444',
        alpha: 1,
      };
    });

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      const elapsed = (now - startTime) / 1000;

      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Phase 1: Confinement sequence (0 - 2.5s)
      if (elapsed < 2.5) {
        setHudMessage('ALERTA: FLUCTUACIÓN CRÍTICA EN NÚCLEO DE URANIO-235 (FISIÓN ESPONTÁNEA)...');
        setScreenShake(Math.sin(elapsed * 25) * 3);

        // Pulsing glowing uranium core
        const coreR = 28 + Math.sin(elapsed * 12) * 6;
        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreR * 2);
        grad.addColorStop(0, '#67e8f9');
        grad.addColorStop(0.4, '#06b6d4');
        grad.addColorStop(0.8, 'rgba(8, 145, 178, 0.4)');
        grad.addColorStop(1, 'rgba(8, 145, 178, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR * 2, 0, Math.PI * 2);
        ctx.fill();

        // Magnetic confinement rings
        [45, 75, 105].forEach((rad, i) => {
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + Math.sin(elapsed * 8 + i) * 0.3})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.stroke();
        });
      }

      // Phase 2: Detonation Flash & Shockwave (2.5s - 5.5s)
      else if (elapsed < 5.5) {
        const boomTime = elapsed - 2.5;
        setHudMessage('DETONACIÓN NUCLEAR INICIADA: EXCURSIÓN DE POTENCIA CRÍTICA');
        setFlashIntensity(Math.max(0, 1 - boomTime * 0.7));
        setScreenShake(Math.max(0, (4 - boomTime) * 6));

        // Expanding Supersonic Shockwave Ring
        const waveRadius = boomTime * 220;
        ctx.strokeStyle = `rgba(103, 232, 249, ${Math.max(0, 0.9 - boomTime * 0.3)})`;
        ctx.lineWidth = Math.max(2, 12 - boomTime * 3);
        ctx.beginPath();
        ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Expanding Plasma Fireball
        const fireR = Math.min(180, boomTime * 90);
        const fireGrad = ctx.createRadialGradient(cx, cy, fireR * 0.1, cx, cy, fireR);
        fireGrad.addColorStop(0, '#ffffff');
        fireGrad.addColorStop(0.3, '#fef08a');
        fireGrad.addColorStop(0.6, '#f97316');
        fireGrad.addColorStop(0.9, '#ef4444');
        fireGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, fireR, 0, Math.PI * 2);
        ctx.fill();

        // Particles
        particles.forEach((p) => {
          const px = cx + p.vx * boomTime;
          const py = cy + p.vy * boomTime + 30 * boomTime * boomTime; // gravity
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, 1 - boomTime * 0.35);
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Phase 3: Dissipation and return to lab (5.5s - 7s)
      else if (elapsed < 7.5) {
        setHudMessage('DISIPACIÓN TÉRMICA: RECUPERANDO AMBIENTE DE CONTENCIÓN...');
        setFlashIntensity(0);
        setScreenShake(0);
      } else {
        skipNuclearCinematic();
      }

      ctx.restore();
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [skipNuclearCinematic]);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#05070f] overflow-hidden select-none flex flex-col justify-between"
      style={{
        transform: screenShake > 0 ? `translate(${(Math.random() - 0.5) * screenShake}px, ${(Math.random() - 0.5) * screenShake}px)` : undefined,
      }}
    >
      {/* Thermal Blinding Flash Screen Overlay */}
      {flashIntensity > 0 && (
        <div
          className="absolute inset-0 bg-white pointer-events-none z-30 transition-opacity"
          style={{ opacity: flashIntensity }}
        />
      )}

      {/* Top HUD Alert Bar */}
      <div className="relative z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center animate-pulse">
            <Radiation className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>PROTOCOLO DE SEGURIDAD RADIOLÓGICA ACTIVADO</span>
            </div>
            <div className="text-white text-xs sm:text-sm font-bold font-mono tracking-wide mt-0.5">
              {hudMessage}
            </div>
          </div>
        </div>

        <button
          onClick={skipNuclearCinematic}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-400 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <span>Omitir</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2D/3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Bottom Telemetry HUD */}
      <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-black/90 to-transparent flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span>ENERGÍA LIBERADA: <strong className="text-yellow-400">200 MeV / núcleo</strong></span>
          <span>FLUJO NEUTRÓNICO: <strong className="text-cyan-400">1.4 × 10¹⁴ n/cm²·s</strong></span>
        </div>
        <div className="text-slate-500 text-[11px]">
          Fisión Nuclear Cuántica · Simulación de Grado 10.º
        </div>
      </div>
    </div>
  );
};

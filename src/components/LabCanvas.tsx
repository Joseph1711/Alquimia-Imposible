import React, { useEffect, useRef } from 'react';
import { SUBSTANCES } from '../data/chemistryData';
import { ELEMENTS_118 } from '../data/elements118';
import { ExperimentalConditions } from '../data/reactionsEngine';
import { VesselType } from '../context/GameContext';

interface LabCanvasProps {
  reactants: string[];
  conditions: ExperimentalConditions;
  vessel: VesselType;
  isReacting: boolean;
  isExploding?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  type: 'bubble' | 'steam' | 'spark' | 'glow' | 'explosion';
}

export const LabCanvas: React.FC<LabCanvasProps> = ({
  reactants,
  conditions,
  vessel,
  isReacting,
  isExploding = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const explosionTimerRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let flameTime = 0;

    // Get color from element or substance
    const getLiquidColor = () => {
      if (reactants.length === 0) return 'rgba(255, 255, 255, 0.05)';
      const firstId = reactants[0];

      // Check in 118 elements first
      const el = ELEMENTS_118.find((e) => e.symbol === firstId);
      if (el) return el.color + '45';

      // Check in substances
      const sub = SUBSTANCES[firstId];
      if (sub) return sub.glowColor || 'rgba(56, 189, 248, 0.4)';

      return 'rgba(56, 189, 248, 0.35)';
    };

    const render = () => {
      flameTime += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const vesselBaseY = height - 90;

      // 1. Draw High Pressure Shield Aura if pressure === 'high'
      if (conditions.pressure === 'high') {
        ctx.save();
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(centerX, vesselBaseY - 60, 95, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(168, 85, 247, 0.04)';
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw Bunsen Burner & Flame if moderate or extreme temperature
      if (conditions.temperature !== 'ambient') {
        const isExtreme = conditions.temperature === 'extreme';
        const burnerTop = vesselBaseY + 15;

        // Burner nozzle
        ctx.fillStyle = '#334155';
        ctx.fillRect(centerX - 16, burnerTop + 45, 32, 25);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(centerX - 12, burnerTop + 30, 24, 15);

        // Animated Flame
        const flameHeight =
          (isExtreme ? 55 : 36) + Math.sin(flameTime * 6) * 4 + (isReacting ? 18 : 0);

        // Outer flame
        ctx.beginPath();
        ctx.moveTo(centerX - 16, burnerTop + 30);
        ctx.quadraticCurveTo(
          centerX - (isExtreme ? 22 : 18),
          burnerTop + 10,
          centerX,
          burnerTop + 30 - flameHeight
        );
        ctx.quadraticCurveTo(
          centerX + (isExtreme ? 22 : 18),
          burnerTop + 10,
          centerX + 16,
          burnerTop + 30
        );
        ctx.fillStyle = isExtreme ? 'rgba(239, 68, 68, 0.9)' : 'rgba(249, 115, 22, 0.85)';
        ctx.shadowColor = isExtreme ? '#dc2626' : '#ea580c';
        ctx.shadowBlur = isExtreme ? 24 : 18;
        ctx.fill();

        // Inner flame core (bright blue/cyan)
        ctx.beginPath();
        ctx.moveTo(centerX - 8, burnerTop + 30);
        ctx.quadraticCurveTo(centerX - 9, burnerTop + 18, centerX, burnerTop + 30 - flameHeight * 0.65);
        ctx.quadraticCurveTo(centerX + 9, burnerTop + 18, centerX + 8, burnerTop + 30);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.95)';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 3. Draw Spark / Electrolysis Electrodes if active
      if (conditions.electricity !== 'none') {
        const isElectrolysis = conditions.electricity === 'electrolysis';
        const electrodeY = vesselBaseY - 100;
        ctx.strokeStyle = isElectrolysis ? '#38bdf8' : '#94a3b8';
        ctx.lineWidth = 3;

        // Left rod (Cathode -)
        ctx.beginPath();
        ctx.moveTo(centerX - 42, electrodeY - 40);
        ctx.lineTo(centerX - 15, electrodeY + 30);
        ctx.stroke();

        // Right rod (Anode +)
        ctx.beginPath();
        ctx.moveTo(centerX + 42, electrodeY - 40);
        ctx.lineTo(centerX + 15, electrodeY + 30);
        ctx.stroke();

        // Spark arcs or Electrolytic glow
        if (conditions.electricity === 'spark') {
          if (Math.random() > 0.15 || isReacting) {
            ctx.beginPath();
            ctx.moveTo(centerX - 15, electrodeY + 30);
            const midX = centerX + (Math.random() - 0.5) * 20;
            const midY = electrodeY + 30 + (Math.random() - 0.5) * 15;
            ctx.lineTo(midX, midY);
            ctx.lineTo(centerX + 15, electrodeY + 30);
            ctx.strokeStyle = '#38bdf8';
            ctx.shadowColor = '#60a5fa';
            ctx.shadowBlur = 15;
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }

      // 4. Draw Catalyst mesh if catalyst !== 'none'
      if (conditions.catalyst !== 'none') {
        const meshY = vesselBaseY - 35;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 24, meshY, 48, 16);
        for (let gx = centerX - 20; gx < centerX + 24; gx += 8) {
          ctx.beginPath();
          ctx.moveTo(gx, meshY);
          ctx.lineTo(gx, meshY + 16);
          ctx.stroke();
        }
        ctx.fillStyle = '#f59e0b';
        ctx.font = '8px monospace';
        ctx.fillText(conditions.catalyst, centerX - 8, meshY - 3);
      }

      // 5. Draw Glassware Container
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 3.5;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';

      if (vessel === 'erlenmeyer') {
        const topY = vesselBaseY - 140;
        const neckWidth = 36;
        const baseWidth = 140;

        ctx.beginPath();
        ctx.moveTo(centerX - neckWidth / 2 - 4, topY);
        ctx.lineTo(centerX + neckWidth / 2 + 4, topY);
        ctx.lineTo(centerX + neckWidth / 2, topY + 40);
        ctx.lineTo(centerX + baseWidth / 2, vesselBaseY);
        ctx.quadraticCurveTo(centerX, vesselBaseY + 6, centerX - baseWidth / 2, vesselBaseY);
        ctx.lineTo(centerX - neckWidth / 2, topY + 40);
        ctx.lineTo(centerX - neckWidth / 2 - 4, topY);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        if (reactants.length > 0) {
          const liquidHeight = Math.min(85, reactants.length * 20 + (isReacting ? 15 : 0));
          const liquidTopY = vesselBaseY - liquidHeight;
          const ratio = liquidHeight / 100;
          const currentLiquidHalfWidth =
            neckWidth / 2 + (baseWidth / 2 - neckWidth / 2) * (1 - ratio * 0.7);

          ctx.save();
          ctx.clip();
          ctx.fillStyle = getLiquidColor();
          ctx.beginPath();
          ctx.moveTo(centerX - currentLiquidHalfWidth, liquidTopY);
          const wave = Math.sin(flameTime * 4) * (isReacting ? 5 : 2);
          ctx.quadraticCurveTo(centerX, liquidTopY + wave, centerX + currentLiquidHalfWidth, liquidTopY);
          ctx.lineTo(centerX + baseWidth / 2 + 10, vesselBaseY + 20);
          ctx.lineTo(centerX - baseWidth / 2 - 10, vesselBaseY + 20);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      } else if (vessel === 'crucible') {
        const topY = vesselBaseY - 90;
        const widthT = 90;
        const widthB = 55;

        ctx.beginPath();
        ctx.moveTo(centerX - widthT / 2, topY);
        ctx.lineTo(centerX + widthT / 2, topY);
        ctx.lineTo(centerX + widthB / 2, vesselBaseY);
        ctx.quadraticCurveTo(centerX, vesselBaseY + 8, centerX - widthB / 2, vesselBaseY);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        if (reactants.length > 0) {
          ctx.save();
          ctx.clip();
          ctx.fillStyle = getLiquidColor();
          ctx.fillRect(centerX - widthB / 2, vesselBaseY - 45, widthB, 50);
          ctx.restore();
        }
      } else if (vessel === 'testtube') {
        const topY = vesselBaseY - 150;
        const tWidth = 38;

        ctx.beginPath();
        ctx.moveTo(centerX - tWidth / 2, topY);
        ctx.lineTo(centerX + tWidth / 2, topY);
        ctx.lineTo(centerX + tWidth / 2, vesselBaseY - 15);
        ctx.arc(centerX, vesselBaseY - 15, tWidth / 2, 0, Math.PI);
        ctx.lineTo(centerX - tWidth / 2, topY);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        if (reactants.length > 0) {
          ctx.save();
          ctx.clip();
          ctx.fillStyle = getLiquidColor();
          ctx.fillRect(centerX - tWidth / 2, vesselBaseY - 70, tWidth, 80);
          ctx.restore();
        }
      } else {
        const topY = vesselBaseY - 120;
        const bWidth = 95;

        ctx.beginPath();
        ctx.moveTo(centerX - bWidth / 2 - 6, topY);
        ctx.lineTo(centerX - bWidth / 2, topY + 6);
        ctx.lineTo(centerX - bWidth / 2, vesselBaseY);
        ctx.quadraticCurveTo(centerX, vesselBaseY + 4, centerX + bWidth / 2, vesselBaseY);
        ctx.lineTo(centerX + bWidth / 2, topY);
        ctx.stroke();
        ctx.fill();

        if (reactants.length > 0) {
          ctx.save();
          ctx.clip();
          ctx.fillStyle = getLiquidColor();
          ctx.fillRect(centerX - bWidth / 2, vesselBaseY - 60, bWidth, 70);
          ctx.restore();
        }
      }

      ctx.restore();

      // 6. Spawn particles
      if (reactants.length > 0) {
        const bubbleChance =
          isReacting || conditions.electricity === 'electrolysis'
            ? 0.75
            : conditions.temperature !== 'ambient'
            ? 0.5
            : 0.15;

        if (Math.random() < bubbleChance) {
          particles.push({
            x: centerX + (Math.random() - 0.5) * 35,
            y: vesselBaseY - 10,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -1.2 - Math.random() * 1.5,
            radius: 2 + Math.random() * 4,
            alpha: 0.8,
            color: 'rgba(255, 255, 255, 0.7)',
            type: 'bubble',
          });
        }

        if (conditions.temperature !== 'ambient' || isReacting) {
          if (Math.random() < 0.4) {
            particles.push({
              x: centerX + (Math.random() - 0.5) * 20,
              y: vesselBaseY - 110,
              vx: (Math.random() - 0.5) * 1.2,
              vy: -1.8 - Math.random() * 1.4,
              radius: 6 + Math.random() * 8,
              alpha: 0.5,
              color: 'rgba(226, 232, 240, 0.45)',
              type: 'steam',
            });
          }
        }
      }

      // 7. Explosive Shockwave & Fiery Blast Spawning
      if (isExploding) {
        explosionTimerRef.current += 1;
        const blastPhase = explosionTimerRef.current;

        // Expanding shockwave ring
        const shockwaveR = (blastPhase * 5) % 150;
        const shockAlpha = Math.max(0, 1 - shockwaveR / 150);

        ctx.save();
        ctx.strokeStyle = `rgba(251, 146, 60, ${shockAlpha})`;
        ctx.lineWidth = 4;
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(centerX, vesselBaseY - 50, shockwaveR, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary inner plasma ring
        if (shockwaveR > 20) {
          ctx.strokeStyle = `rgba(254, 240, 138, ${shockAlpha * 0.9})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(centerX, vesselBaseY - 50, shockwaveR * 0.65, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // Flash burst in core
        if (blastPhase < 15) {
          ctx.save();
          const flashGrad = ctx.createRadialGradient(
            centerX,
            vesselBaseY - 50,
            0,
            centerX,
            vesselBaseY - 50,
            90
          );
          flashGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
          flashGrad.addColorStop(0.3, 'rgba(251, 146, 60, 0.5)');
          flashGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = flashGrad;
          ctx.fillRect(centerX - 100, vesselBaseY - 140, 200, 180);
          ctx.restore();
        }

        // Spawn explosive shrapnel sparks
        const sparkColors = ['#f87171', '#fb923c', '#facc15', '#ffffff'];
        for (let s = 0; s < 4; s++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2.5 + Math.random() * 5.5;
          particles.push({
            x: centerX + (Math.random() - 0.5) * 15,
            y: vesselBaseY - 50 + (Math.random() - 0.5) * 15,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 2 + Math.random() * 3.5,
            alpha: 1,
            color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
            type: 'explosion',
          });
        }
      } else {
        explosionTimerRef.current = 0;
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.type === 'explosion') {
          p.alpha -= 0.035;
          p.vy += 0.08; // gravity drop
        } else {
          p.alpha -= 0.015;
          if (p.type === 'steam') p.radius += 0.25;
        }

        if (p.alpha <= 0 || p.y < 10 || p.y > height) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        if (p.type === 'explosion') {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [reactants, conditions, vessel, isReacting, isExploding]);

  return (
    <div
      className={`relative w-full h-72 flex items-center justify-center transition-transform duration-100 ${
        isExploding ? 'scale-105 animate-pulse' : ''
      }`}
    >
      <canvas
        ref={canvasRef}
        width={340}
        height={280}
        className="w-full max-w-[340px] h-[280px] pointer-events-none drop-shadow-lg"
      />
      {isExploding && (
        <div className="absolute top-3 px-3 py-1 bg-red-600/90 border border-red-400 text-white text-xs font-mono font-bold tracking-wider rounded shadow-lg animate-bounce uppercase">
          ⚠️ ONDA DE CHOQUE TÉRMICA
        </div>
      )}
    </div>
  );
};

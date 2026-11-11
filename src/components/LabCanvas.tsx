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
  isDevastated?: boolean;
  isReconstructing?: boolean;
  isMagneticStirrerActive?: boolean;
  stirrerRpm?: number;
  isFumeHoodActive?: boolean;
  isVesselSealed?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  type: 'bubble' | 'steam' | 'spark' | 'glow' | 'explosion' | 'smoke' | 'ember' | 'nano' | 'vortex' | 'drip';
}

export const LabCanvas: React.FC<LabCanvasProps> = ({
  reactants,
  conditions,
  vessel,
  isReacting,
  isExploding = false,
  isDevastated = false,
  isReconstructing = false,
  isMagneticStirrerActive = false,
  stirrerRpm = 600,
  isFumeHoodActive = false,
  isVesselSealed = false,
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

      // 0. Draw Fume Hood Ventilation Ceiling if active
      if (isFumeHoodActive) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(0, 0, width, 18);
        ctx.strokeStyle = '#0d9488';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(0, 0, width, 18);

        // Louver vents
        for (let vx = 20; vx < width - 20; vx += 16) {
          ctx.beginPath();
          ctx.moveTo(vx, 4);
          ctx.lineTo(vx + 8, 14);
          ctx.strokeStyle = 'rgba(20, 184, 166, 0.6)';
          ctx.stroke();
        }

        // Upward laminar airflow streaks
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.25)';
        ctx.setLineDash([6, 8]);
        for (let fx = 40; fx < width; fx += 50) {
          const flowOffset = (flameTime * 40 + fx) % 70;
          ctx.beginPath();
          ctx.moveTo(fx, height - 70 - flowOffset);
          ctx.lineTo(fx, 20);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.restore();
      }

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

      // 5. Draw Glassware Container OR Devastated Workspace
      if (isDevastated) {
        // 1. Heavy Scorched Crater & Blast Stains on Table
        ctx.save();
        const scorchGrad = ctx.createRadialGradient(centerX, vesselBaseY + 10, 10, centerX, vesselBaseY + 10, 110);
        scorchGrad.addColorStop(0, 'rgba(5, 5, 10, 0.95)');
        scorchGrad.addColorStop(0.5, 'rgba(20, 10, 10, 0.75)');
        scorchGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = scorchGrad;
        ctx.beginPath();
        ctx.ellipse(centerX, vesselBaseY + 10, 120, 45, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Glowing Thermal Fissure Cracks in Surface
        const crackLines = [
          [-80, 12, -40, 5, -15, 8],
          [10, 6, 45, 15, 85, 10],
          [-10, 15, 15, 25, 40, 32],
          [-50, -10, -25, 2, 0, 5],
          [20, 5, 50, -5, 75, -2],
        ];
        crackLines.forEach((pts) => {
          ctx.beginPath();
          ctx.moveTo(centerX + pts[0], vesselBaseY + pts[1]);
          ctx.lineTo(centerX + pts[2], vesselBaseY + pts[3]);
          ctx.lineTo(centerX + pts[4], vesselBaseY + pts[5]);
          ctx.strokeStyle = '#ef4444';
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 8;
          ctx.lineWidth = 2;
          ctx.stroke();
        });
        ctx.restore();

        // 3. Shattered Glassware Shards & Overturned Broken Base
        ctx.save();
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.6)';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 2;

        // Jagged broken vessel stump
        ctx.beginPath();
        ctx.moveTo(centerX - 35, vesselBaseY + 5);
        ctx.lineTo(centerX - 30, vesselBaseY - 20);
        ctx.lineTo(centerX - 15, vesselBaseY - 12);
        ctx.lineTo(centerX, vesselBaseY - 28);
        ctx.lineTo(centerX + 18, vesselBaseY - 14);
        ctx.lineTo(centerX + 32, vesselBaseY - 22);
        ctx.lineTo(centerX + 36, vesselBaseY + 5);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        // Shattered glass splinters around
        const shards = [
          [-65, 8, 12, 6, 0.4],
          [-45, -5, 15, 8, -0.6],
          [50, 12, 14, 7, 0.8],
          [70, 2, 10, 5, -0.3],
          [-10, 18, 18, 9, 1.2],
          [25, 16, 12, 6, -1.0],
        ];
        shards.forEach(([sx, sy, sw, sh, srot]) => {
          ctx.save();
          ctx.translate(centerX + sx, vesselBaseY + sy);
          ctx.rotate(srot);
          ctx.beginPath();
          ctx.moveTo(-sw / 2, -sh / 2);
          ctx.lineTo(sw / 2, 0);
          ctx.lineTo(0, sh / 2);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
          ctx.restore();
        });
        ctx.restore();

        // 4. Overturned broken neck lying horizontally
        ctx.save();
        ctx.translate(centerX + 45, vesselBaseY - 8);
        ctx.rotate(0.35);
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(-12, -6, 24, 12);
        ctx.restore();

        // Spawn lingering ash smoke & glowing embers
        if (Math.random() < 0.45) {
          particles.push({
            x: centerX + (Math.random() - 0.5) * 120,
            y: vesselBaseY + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -0.6 - Math.random() * 0.8,
            radius: 8 + Math.random() * 12,
            alpha: 0.35,
            color: 'rgba(51, 65, 85, 0.35)',
            type: 'smoke',
          });
        }
        if (Math.random() < 0.3) {
          particles.push({
            x: centerX + (Math.random() - 0.5) * 80,
            y: vesselBaseY + (Math.random() - 0.5) * 15,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -1.2 - Math.random() * 1.5,
            radius: 1.5 + Math.random() * 2,
            alpha: 0.9,
            color: Math.random() > 0.4 ? '#ef4444' : '#f97316',
            type: 'ember',
          });
        }

        // Nanotech reconstruction swarm if active
        if (isReconstructing) {
          for (let n = 0; n < 4; n++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 60 + Math.random() * 80;
            particles.push({
              x: centerX + Math.cos(angle) * dist,
              y: vesselBaseY - 40 + Math.sin(angle) * dist * 0.6,
              vx: -Math.cos(angle) * 3.5,
              vy: -Math.sin(angle) * 3.5,
              radius: 2 + Math.random() * 3,
              alpha: 1,
              color: Math.random() > 0.5 ? '#10b981' : '#06b6d4',
              type: 'nano',
            });
          }

          // Radiant reconstruction scan beam
          ctx.save();
          const scanY = vesselBaseY - 60 + Math.sin(flameTime * 5) * 60;
          const scanGrad = ctx.createLinearGradient(centerX - 100, scanY, centerX + 100, scanY);
          scanGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
          scanGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.8)');
          scanGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
          ctx.strokeStyle = scanGrad;
          ctx.lineWidth = 3;
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.moveTo(centerX - 120, scanY);
          ctx.lineTo(centerX + 120, scanY);
          ctx.stroke();
          ctx.restore();
        }
      } else {
        // --- NORMAL GLASSWARE & INSTRUMENTS RENDERING ---
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';

        if (vessel === 'erlenmeyer') {
          // --- ERLENMEYER FLASK ---
          const topY = vesselBaseY - 140;
          const neckWidth = 36;
          const baseWidth = 140;

          // Flask body
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

          // Graduated volumetric tick marks (white enamel)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 1;
          for (let m = 0; m < 4; m++) {
            const my = vesselBaseY - 25 - m * 22;
            const mw = 32 - m * 4;
            ctx.beginPath();
            ctx.moveTo(centerX + 15, my);
            ctx.lineTo(centerX + 15 + mw, my);
            ctx.stroke();
          }

          // Hermetic Ground Glass Stopper if sealed
          if (isVesselSealed) {
            ctx.save();
            ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
            ctx.strokeStyle = 'rgba(192, 132, 252, 0.8)';
            ctx.lineWidth = 2;
            // Ground joint plug inside neck
            ctx.beginPath();
            ctx.moveTo(centerX - neckWidth / 2 + 2, topY + 2);
            ctx.lineTo(centerX + neckWidth / 2 - 2, topY + 2);
            ctx.lineTo(centerX + neckWidth / 2 - 5, topY + 26);
            ctx.lineTo(centerX - neckWidth / 2 + 5, topY + 26);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Stopper knob / flat handle
            ctx.fillStyle = 'rgba(216, 180, 254, 0.6)';
            ctx.beginPath();
            ctx.roundRect(centerX - 16, topY - 14, 32, 12, 3);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          }

          // Liquid content
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
        } else if (vessel === 'beaker') {
          // --- BEAKER WITH MAGNETIC STIRRER ---
          const topY = vesselBaseY - 125;
          const bWidth = 100;

          // 1. Magnetic Stirrer Base Plate underneath
          ctx.save();
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(centerX - 62, vesselBaseY + 2, 124, 22, 4);
          ctx.fill();
          ctx.stroke();
          // LED indicator on plate
          ctx.fillStyle = isMagneticStirrerActive ? '#06b6d4' : '#475569';
          ctx.shadowColor = isMagneticStirrerActive ? '#06b6d4' : 'transparent';
          ctx.shadowBlur = isMagneticStirrerActive ? 8 : 0;
          ctx.beginPath();
          ctx.arc(centerX - 46, vesselBaseY + 13, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#64748b';
          ctx.font = '8px monospace';
          ctx.fillText(isMagneticStirrerActive ? `${stirrerRpm} RPM` : 'STIRRER OFF', centerX - 36, vesselBaseY + 16);
          ctx.restore();

          // 2. Beaker Glass Body with Spout Lip
          ctx.beginPath();
          // Pouring spout at top left
          ctx.moveTo(centerX - bWidth / 2 - 10, topY - 2);
          ctx.lineTo(centerX - bWidth / 2, topY + 8);
          ctx.lineTo(centerX - bWidth / 2, vesselBaseY);
          ctx.quadraticCurveTo(centerX, vesselBaseY + 5, centerX + bWidth / 2, vesselBaseY);
          ctx.lineTo(centerX + bWidth / 2, topY);
          ctx.lineTo(centerX - bWidth / 2, topY);
          ctx.stroke();
          ctx.fill();

          // Volume graduation lines (100, 200, 300, 400 mL)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
          ctx.lineWidth = 1;
          for (let v = 1; v <= 4; v++) {
            const gy = vesselBaseY - v * 22;
            ctx.beginPath();
            ctx.moveTo(centerX + bWidth / 2 - 22, gy);
            ctx.lineTo(centerX + bWidth / 2 - 4, gy);
            ctx.stroke();
          }

          // 3. Liquid with Dynamic Stirrer Vortex if active
          if (reactants.length > 0) {
            const liquidHeight = Math.min(85, reactants.length * 18 + 15);
            const liquidTopY = vesselBaseY - liquidHeight;

            ctx.save();
            ctx.beginPath();
            ctx.rect(centerX - bWidth / 2 + 2, topY + 5, bWidth - 4, vesselBaseY - topY);
            ctx.clip();

            ctx.fillStyle = getLiquidColor();
            ctx.beginPath();
            ctx.moveTo(centerX - bWidth / 2 + 2, liquidTopY);

            if (isMagneticStirrerActive) {
              // Deep vortex conical dip in liquid surface
              const vortexDip = Math.min(32, (stirrerRpm / 1000) * 28 + (isReacting ? 6 : 0));
              ctx.quadraticCurveTo(centerX, liquidTopY + vortexDip, centerX + bWidth / 2 - 2, liquidTopY);
            } else {
              const wave = Math.sin(flameTime * 3) * (isReacting ? 3 : 1);
              ctx.quadraticCurveTo(centerX, liquidTopY + wave, centerX + bWidth / 2 - 2, liquidTopY);
            }

            ctx.lineTo(centerX + bWidth / 2 - 2, vesselBaseY + 2);
            ctx.lineTo(centerX - bWidth / 2 + 2, vesselBaseY + 2);
            ctx.closePath();
            ctx.fill();

            // 4. Teflon Magnetic Stir Bar at the bottom
            const barW = isMagneticStirrerActive
              ? 22 * Math.abs(Math.cos(flameTime * (stirrerRpm / 90))) + 8
              : 26;
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = isMagneticStirrerActive ? 6 : 0;
            ctx.beginPath();
            ctx.roundRect(centerX - barW / 2, vesselBaseY - 7, barW, 6, 3);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Spawn fluid vortex bubbles
            if (isMagneticStirrerActive && Math.random() < 0.35) {
              particles.push({
                x: centerX + (Math.random() - 0.5) * 20,
                y: liquidTopY + 8 + Math.random() * 20,
                vx: (Math.random() - 0.5) * 2.5,
                vy: (Math.random() - 0.5) * 1.5,
                radius: 1.5 + Math.random() * 2,
                alpha: 0.8,
                color: 'rgba(255, 255, 255, 0.7)',
                type: 'vortex',
              });
            }

            ctx.restore();
          }
        } else if (vessel === 'testtube') {
          // --- TEST TUBE IN WOODEN STAND ---
          const topY = vesselBaseY - 155;
          const tWidth = 36;

          // Metal / Wooden Clamp Stand on Right
          ctx.save();
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerX + 32, vesselBaseY + 15);
          ctx.lineTo(centerX + 32, topY + 25);
          ctx.stroke();
          // Clamp arm
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(centerX + 32, topY + 35);
          ctx.lineTo(centerX + tWidth / 2 + 4, topY + 35);
          ctx.stroke();
          // Clamp ring around tube
          ctx.fillStyle = '#64748b';
          ctx.fillRect(centerX + tWidth / 2 - 2, topY + 31, 8, 8);
          ctx.restore();

          // Glass Test Tube with Flared Rim
          ctx.beginPath();
          ctx.moveTo(centerX - tWidth / 2 - 3, topY);
          ctx.lineTo(centerX + tWidth / 2 + 3, topY);
          ctx.lineTo(centerX + tWidth / 2, topY + 6);
          ctx.lineTo(centerX + tWidth / 2, vesselBaseY - 16);
          ctx.arc(centerX, vesselBaseY - 16, tWidth / 2, 0, Math.PI);
          ctx.lineTo(centerX - tWidth / 2, topY + 6);
          ctx.lineTo(centerX - tWidth / 2 - 3, topY);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          // Liquid Column with Meniscus & Precipitate
          if (reactants.length > 0) {
            const lHeight = Math.min(100, reactants.length * 24 + 18);
            const liquidTopY = vesselBaseY - lHeight;

            ctx.save();
            ctx.beginPath();
            ctx.rect(centerX - tWidth / 2 + 1, topY + 5, tWidth - 2, vesselBaseY + 5 - topY);
            ctx.clip();

            ctx.fillStyle = getLiquidColor();
            ctx.beginPath();
            ctx.moveTo(centerX - tWidth / 2 + 1, liquidTopY);
            ctx.quadraticCurveTo(centerX, liquidTopY + 3, centerX + tWidth / 2 - 1, liquidTopY);
            ctx.lineTo(centerX + tWidth / 2 - 1, vesselBaseY - 16);
            ctx.arc(centerX, vesselBaseY - 16, tWidth / 2 - 1, 0, Math.PI);
            ctx.lineTo(centerX - tWidth / 2 + 1, liquidTopY);
            ctx.closePath();
            ctx.fill();

            // Colloidal precipitate flakes at the bottom
            if (reactants.length > 1) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
              for (let f = 0; f < 5; f++) {
                ctx.fillRect(
                  centerX - 10 + (f * 5),
                  vesselBaseY - 6 - (f % 2) * 3,
                  3,
                  3
                );
              }
            }

            ctx.restore();
          }
        } else if (vessel === 'crucible') {
          // --- CERAMIC CRUCIBLE OVER CLAY PIPE TRIANGLE ---
          const topY = vesselBaseY - 85;
          const widthT = 92;
          const widthB = 52;
          const isHighTemp = conditions.temperature !== 'ambient';

          // 1. Iron Tripod Ring & Clay Triangle Support
          ctx.save();
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 3;
          // Iron Ring
          ctx.beginPath();
          ctx.ellipse(centerX, vesselBaseY + 4, 55, 12, 0, 0, Math.PI * 2);
          ctx.stroke();
          // Tripod legs
          ctx.beginPath();
          ctx.moveTo(centerX - 48, vesselBaseY + 6);
          ctx.lineTo(centerX - 65, vesselBaseY + 32);
          ctx.moveTo(centerX + 48, vesselBaseY + 6);
          ctx.lineTo(centerX + 65, vesselBaseY + 32);
          ctx.stroke();
          // Clay pipe triangle rods (ceramic off-white)
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(centerX - 35, vesselBaseY - 4);
          ctx.lineTo(centerX + 35, vesselBaseY - 4);
          ctx.lineTo(centerX, vesselBaseY + 8);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();

          // 2. Porcelain Crucible Body (Incandescent Glow when heated!)
          ctx.save();
          if (isHighTemp) {
            const isExtreme = conditions.temperature === 'extreme';
            const glowGrad = ctx.createLinearGradient(centerX, topY, centerX, vesselBaseY);
            if (isExtreme) {
              glowGrad.addColorStop(0, 'rgba(254, 215, 170, 0.95)');
              glowGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.9)');
              glowGrad.addColorStop(1, 'rgba(220, 38, 38, 0.95)');
              ctx.shadowColor = '#ea580c';
              ctx.shadowBlur = 25;
            } else {
              glowGrad.addColorStop(0, 'rgba(241, 245, 249, 0.9)');
              glowGrad.addColorStop(0.7, 'rgba(251, 146, 60, 0.85)');
              glowGrad.addColorStop(1, 'rgba(234, 88, 12, 0.9)');
              ctx.shadowColor = '#f97316';
              ctx.shadowBlur = 15;
            }
            ctx.fillStyle = glowGrad;
            ctx.strokeStyle = isExtreme ? '#fdba74' : '#fed7aa';
          } else {
            ctx.fillStyle = 'rgba(226, 232, 240, 0.85)'; // Glazed porcelain
            ctx.strokeStyle = '#94a3b8';
          }

          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(centerX - widthT / 2, topY);
          ctx.lineTo(centerX + widthT / 2, topY);
          ctx.lineTo(centerX + widthB / 2, vesselBaseY);
          ctx.quadraticCurveTo(centerX, vesselBaseY + 8, centerX - widthB / 2, vesselBaseY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Molten sample / sintered solid in crucible
          if (reactants.length > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(centerX - widthT / 2 + 5, topY + 12);
            ctx.lineTo(centerX + widthT / 2 - 5, topY + 12);
            ctx.lineTo(centerX + widthB / 2 - 4, vesselBaseY - 2);
            ctx.quadraticCurveTo(centerX, vesselBaseY + 4, centerX - widthB / 2 + 4, vesselBaseY - 2);
            ctx.closePath();
            ctx.clip();

            ctx.fillStyle = isHighTemp ? 'rgba(254, 240, 138, 0.8)' : getLiquidColor();
            ctx.fillRect(centerX - widthB / 2, vesselBaseY - 45, widthB, 50);
            ctx.restore();
          }
          ctx.restore();
        } else if (vessel === 'distillation') {
          // --- DISTILLATION APPARATUS (ROUND FLASK + LIEBIG CONDENSER) ---
          const flaskRadius = 38;
          const flaskCenterY = vesselBaseY - 45;
          const flaskTopY = flaskCenterY - flaskRadius - 35;

          // 1. Boiling Flask (Spherical round-bottom)
          ctx.beginPath();
          // Neck
          ctx.moveTo(centerX - 12, flaskTopY);
          ctx.lineTo(centerX + 12, flaskTopY);
          ctx.lineTo(centerX + 12, flaskCenterY - flaskRadius + 5);
          // Spherical bulb
          ctx.arc(centerX, flaskCenterY, flaskRadius, -Math.PI / 4, Math.PI * 1.25);
          ctx.lineTo(centerX - 12, flaskTopY);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          // Liquid boiling in flask
          if (reactants.length > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, flaskCenterY, flaskRadius - 2, 0, Math.PI);
            ctx.closePath();
            ctx.clip();
            ctx.fillStyle = getLiquidColor();
            ctx.fillRect(centerX - flaskRadius, flaskCenterY - 10, flaskRadius * 2, flaskRadius + 15);
            ctx.restore();
          }

          // 2. Angled Side-Arm & Liebig Condenser
          const armStartX = centerX + 10;
          const armStartY = flaskTopY + 18;
          const armEndX = centerX + 85;
          const armEndY = flaskCenterY + 40;

          // Inner vapor tube
          ctx.save();
          ctx.strokeStyle = 'rgba(203, 213, 225, 0.6)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(armStartX, armStartY);
          ctx.lineTo(armEndX, armEndY);
          ctx.stroke();

          // Outer cooling water jacket
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
          ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
          ctx.lineWidth = 14;
          ctx.beginPath();
          ctx.moveTo(armStartX + 15, armStartY + 10);
          ctx.lineTo(armEndX - 10, armEndY - 8);
          ctx.stroke();

          // Water in/out nozzles
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(armStartX + 12, armStartY - 3, 6, 8);
          ctx.fillRect(armEndX - 18, armEndY - 18, 6, 8);

          // 3. Collection Beaker receiving distillate drops
          ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
          ctx.lineWidth = 2;
          ctx.strokeRect(armEndX - 8, armEndY + 8, 26, 32);
          ctx.fillRect(armEndX - 8, armEndY + 8, 26, 32);

          // Condensed distillate pool in receiving beaker
          if (reactants.length > 0) {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
            ctx.fillRect(armEndX - 7, armEndY + 26, 24, 13);
          }

          // Spawn falling condensed distillate drops if temperature > ambient
          if (conditions.temperature !== 'ambient' && Math.random() < 0.3) {
            particles.push({
              x: armEndX + 4,
              y: armEndY + 6,
              vx: 0,
              vy: 2.2,
              radius: 1.8,
              alpha: 0.9,
              color: '#38bdf8',
              type: 'drip',
            });
          }
          ctx.restore();
        } else if (vessel === 'mortar') {
          // --- AGATE MORTAR & PESTLE ---
          const mWidth = 110;
          const mHeight = 50;
          const mTopY = vesselBaseY - mHeight;

          // 1. Thick Heavy Agate Bowl
          ctx.save();
          const agateGrad = ctx.createLinearGradient(centerX - mWidth / 2, mTopY, centerX + mWidth / 2, vesselBaseY);
          agateGrad.addColorStop(0, '#64748b');
          agateGrad.addColorStop(0.5, '#475569');
          agateGrad.addColorStop(1, '#334155');
          ctx.fillStyle = agateGrad;
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 3;

          ctx.beginPath();
          ctx.moveTo(centerX - mWidth / 2, mTopY);
          ctx.quadraticCurveTo(centerX - mWidth / 2 + 10, vesselBaseY + 6, centerX, vesselBaseY + 6);
          ctx.quadraticCurveTo(centerX + mWidth / 2 - 10, vesselBaseY + 6, centerX + mWidth / 2, mTopY);
          // Inner cavity
          ctx.quadraticCurveTo(centerX + mWidth / 2 - 14, mTopY + 16, centerX, mTopY + 20);
          ctx.quadraticCurveTo(centerX - mWidth / 2 + 14, mTopY + 16, centerX - mWidth / 2, mTopY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // 2. Powder sample in cavity
          if (reactants.length > 0) {
            ctx.fillStyle = getLiquidColor();
            ctx.beginPath();
            ctx.ellipse(centerX, mTopY + 24, 32, 10, 0, 0, Math.PI * 2);
            ctx.fill();

            // Particulate speckles
            ctx.fillStyle = '#ffffff';
            for (let p = 0; p < 8; p++) {
              ctx.fillRect(
                centerX - 18 + (p * 5),
                mTopY + 20 + ((p * 7) % 8),
                2,
                2
              );
            }
          }

          // 3. Agate Pestle resting diagonally
          ctx.fillStyle = '#94a3b8';
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 2;
          ctx.save();
          ctx.translate(centerX + 15, mTopY + 15);
          ctx.rotate(-0.55);
          ctx.beginPath();
          ctx.roundRect(-8, -55, 16, 62, [6, 6, 8, 8]);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
          ctx.restore();
        } else if (vessel === 'watchglass') {
          // --- WATCH GLASS (CRISTALIZADOR) ---
          const wRadius = 65;
          const wY = vesselBaseY - 12;

          ctx.save();
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
          ctx.lineWidth = 2.5;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';

          // Low-profile concave circular dish
          ctx.beginPath();
          ctx.moveTo(centerX - wRadius, wY);
          ctx.quadraticCurveTo(centerX, wY + 22, centerX + wRadius, wY);
          ctx.quadraticCurveTo(centerX, wY + 14, centerX - wRadius, wY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Shallow liquid layer & crystallization needles
          if (reactants.length > 0) {
            ctx.fillStyle = getLiquidColor();
            ctx.beginPath();
            ctx.moveTo(centerX - wRadius + 8, wY + 3);
            ctx.quadraticCurveTo(centerX, wY + 18, centerX + wRadius - 8, wY + 3);
            ctx.quadraticCurveTo(centerX, wY + 11, centerX - wRadius + 8, wY + 3);
            ctx.closePath();
            ctx.fill();

            // Crystallization dendrites around perimeter
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            for (let c = -3; c <= 3; c++) {
              const cx = centerX + c * 16;
              ctx.beginPath();
              ctx.moveTo(cx, wY + 10);
              ctx.lineTo(cx + (c % 2 ? 5 : -5), wY + 4);
              ctx.stroke();
            }
          }
          ctx.restore();
        }

        ctx.restore();
      }

      // 6. Spawn reaction particles
      if (reactants.length > 0) {
        const bubbleChance =
          isReacting || conditions.electricity === 'electrolysis'
            ? 0.85
            : conditions.temperature !== 'ambient'
            ? 0.5
            : 0.15;

        // Fume hood exhaust reduces accumulation, shoots steam up fast
        if (Math.random() < bubbleChance) {
          particles.push({
            x: centerX + (Math.random() - 0.5) * (isReacting ? 50 : 35),
            y: vesselBaseY - 10,
            vx: (Math.random() - 0.5) * (isReacting ? 1.6 : 0.8),
            vy: (isReacting ? -2.2 : -1.2) - Math.random() * 1.8,
            radius: (isReacting ? 3 : 2) + Math.random() * (isReacting ? 5 : 4),
            alpha: 0.85,
            color: isReacting ? 'rgba(254, 240, 138, 0.9)' : 'rgba(255, 255, 255, 0.7)',
            type: 'bubble',
          });
        }

        // Steam release (attenuated if Erlenmeyer is sealed)
        if ((conditions.temperature !== 'ambient' || isReacting) && !(vessel === 'erlenmeyer' && isVesselSealed)) {
          if (Math.random() < (isReacting ? 0.65 : 0.35)) {
            particles.push({
              x: centerX + (Math.random() - 0.5) * 26,
              y: vesselBaseY - 110,
              vx: (Math.random() - 0.5) * (isFumeHoodActive ? 0.6 : 1.5),
              vy: (isFumeHoodActive ? -4.5 : -2.0) - Math.random() * 1.6,
              radius: 7 + Math.random() * 9,
              alpha: isReacting ? 0.7 : 0.45,
              color: isReacting ? 'rgba(240, 253, 250, 0.6)' : 'rgba(226, 232, 240, 0.45)',
              type: 'steam',
            });
          }
        }

        // Reaction energy swirl / quantum excitation glow while reacting
        if (isReacting && Math.random() < 0.5) {
          const angle = flameTime * 6 + Math.random() * Math.PI * 2;
          const dist = 10 + Math.random() * 35;
          particles.push({
            x: centerX + Math.cos(angle) * dist,
            y: vesselBaseY - 50 + Math.sin(angle) * 15,
            vx: -Math.sin(angle) * 2.2,
            vy: Math.cos(angle) * 1.2 - 0.8,
            radius: 2 + Math.random() * 3,
            alpha: 0.9,
            color: Math.random() > 0.5 ? '#38bdf8' : '#34d399',
            type: 'spark',
          });
        }
      }

      // 7. Explosive Shockwave & Fiery Blast Spawning
      if (isExploding) {
        explosionTimerRef.current += 1;
        const blastPhase = explosionTimerRef.current;

        // Expanding primary thermal shockwave ring (massive reach)
        const shockwaveR = (blastPhase * 8.5) % 260;
        const shockAlpha = Math.max(0, 1 - shockwaveR / 260);

        ctx.save();
        ctx.strokeStyle = `rgba(251, 146, 60, ${shockAlpha})`;
        ctx.lineWidth = 6;
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 35;
        ctx.beginPath();
        ctx.arc(centerX, vesselBaseY - 50, shockwaveR, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary supersonic cyan plasma Cherenkov ring (faster, massive energy)
        const plasmaR = (blastPhase * 12.0) % 290;
        const plasmaAlpha = Math.max(0, 1 - plasmaR / 290);
        if (plasmaR > 15) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${plasmaAlpha * 0.95})`;
          ctx.lineWidth = 4;
          ctx.shadowColor = '#0284c7';
          ctx.shadowBlur = 25;
          ctx.beginPath();
          ctx.arc(centerX, vesselBaseY - 50, plasmaR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Tertiary inner white-hot nuclear core ring
        if (shockwaveR > 20) {
          ctx.strokeStyle = `rgba(254, 240, 138, ${shockAlpha * 0.98})`;
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(centerX, vesselBaseY - 50, shockwaveR * 0.55, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Rising Nuclear Fireball & Mushroom Cap
        const fireballY = Math.max(40, vesselBaseY - 50 - blastPhase * 3.2);
        const fireballR = Math.min(65, 15 + blastPhase * 2.2);
        const fireballGrad = ctx.createRadialGradient(
          centerX,
          fireballY,
          5,
          centerX,
          fireballY,
          fireballR
        );
        fireballGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        fireballGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.9)');
        fireballGrad.addColorStop(0.65, 'rgba(249, 115, 22, 0.7)');
        fireballGrad.addColorStop(1, 'rgba(185, 28, 28, 0)');
        ctx.fillStyle = fireballGrad;
        ctx.beginPath();
        ctx.arc(centerX, fireballY, fireballR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Full-frame blinding white flash burst in core
        if (blastPhase < 24) {
          ctx.save();
          const flashGrad = ctx.createRadialGradient(
            centerX,
            vesselBaseY - 50,
            0,
            centerX,
            vesselBaseY - 50,
            width * 0.85
          );
          flashGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
          flashGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.85)');
          flashGrad.addColorStop(0.65, 'rgba(249, 115, 22, 0.55)');
          flashGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = flashGrad;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }

        // Spawn explosive shrapnel sparks and nuclear fire embers
        const sparkColors = ['#ffffff', '#fef08a', '#facc15', '#fb923c', '#f87171', '#38bdf8'];
        for (let s = 0; s < 12; s++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 4.5 + Math.random() * 9.5;
          particles.push({
            x: centerX + (Math.random() - 0.5) * 24,
            y: vesselBaseY - 50 + (Math.random() - 0.5) * 24,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2.2,
            radius: 2.5 + Math.random() * 5,
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
          p.alpha -= 0.028;
          p.vy += 0.12; // gravity drop
          p.vx *= 0.98; // air resistance
        } else if (p.type === 'spark') {
          p.alpha -= 0.04;
        } else if (p.type === 'smoke') {
          p.alpha -= isFumeHoodActive ? 0.02 : 0.007;
          p.radius += 0.18;
          p.vx += (Math.random() - 0.5) * 0.08;
          if (isFumeHoodActive) p.vy -= 0.25;
        } else if (p.type === 'ember') {
          p.alpha -= 0.018;
          p.vx += (Math.random() - 0.5) * 0.12;
        } else if (p.type === 'nano') {
          p.alpha -= 0.035;
        } else if (p.type === 'vortex') {
          p.alpha -= 0.03;
        } else if (p.type === 'drip') {
          p.alpha -= 0.02;
          p.vy += 0.1;
        } else {
          p.alpha -= isFumeHoodActive ? 0.035 : 0.015;
          if (p.type === 'steam') {
            p.radius += 0.25;
            if (isFumeHoodActive) p.vy -= 0.3;
          }
        }

        if (p.alpha <= 0 || p.y < 5 || p.y > height + 20) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        if (p.type === 'explosion' || p.type === 'ember' || p.type === 'nano') {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
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
  }, [
    reactants,
    conditions,
    vessel,
    isReacting,
    isExploding,
    isDevastated,
    isReconstructing,
    isMagneticStirrerActive,
    stirrerRpm,
    isFumeHoodActive,
    isVesselSealed,
  ]);

  return (
    <div className={`relative w-full h-72 flex items-center justify-center overflow-hidden rounded-2xl ${
      isDevastated ? 'bg-gradient-to-b from-red-950/20 via-black to-slate-950' : ''
    }`}>
      {/* Devastated Atmospheric Red Emergency Strobe */}
      {isDevastated && (
        <div className="absolute inset-0 pointer-events-none bg-red-900/10 animate-pulse z-10" />
      )}

      {/* Thermal Flash Screen Blaster Overlay */}
      {isExploding && (
        <div className="absolute inset-0 pointer-events-none z-20 rounded-2xl animate-thermal-flash" />
      )}

      {/* Camera Tracking Container: Zooms in on reaction, recoils violently on explosion */}
      <div
        className={`w-full max-w-[340px] h-[280px] flex items-center justify-center transition-transform ${
          isExploding
            ? 'animate-camera-recoil'
            : isReacting
            ? 'animate-cinematic-zoom'
            : 'transition-all duration-500 transform scale-100'
        }`}
      >
        <canvas
          ref={canvasRef}
          width={340}
          height={280}
          className="w-full max-w-[340px] h-[280px] pointer-events-none drop-shadow-2xl"
        />
      </div>

      {/* Devastated Workspace Alert Badge */}
      {isDevastated && !isReconstructing && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-red-950/90 border border-red-500/60 text-red-300 text-[11px] font-mono font-bold tracking-wider rounded-full shadow-2xl flex items-center gap-1.5 whitespace-nowrap animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>MESA DESTRUIDA · FISIÓN NO CONFINADA</span>
        </div>
      )}

      {/* Reconstruction In-Progress Badge */}
      {isReconstructing && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 bg-emerald-950/95 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold tracking-wider rounded-full shadow-2xl flex items-center gap-2 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>PROTOCOLO DE DESCONTAMINACIÓN Y RESTAURACIÓN...</span>
        </div>
      )}

      {/* Animated Dramatic HUD Warning Badge for Chemical Explosions */}
      {isExploding && !isDevastated && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-amber-600 border border-red-300 text-white text-xs font-mono font-black tracking-wider rounded-full shadow-2xl animate-screen-shake flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
          <span>DEFLAGRACIÓN TÉRMICA Y ONDA DE CHOQUE</span>
        </div>
      )}

      {/* Subtle Focus Indicator when reacting */}
      {isReacting && !isExploding && !isDevastated && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono rounded-full backdrop-blur-sm shadow-md animate-pulse">
          Zoom Cinemático · Excitación Molecular
        </div>
      )}
    </div>
  );
};

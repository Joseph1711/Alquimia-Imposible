import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Info,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { MoleculeRecipe, AnimationStep } from '../../data/bondsEngine';
import { ELEMENTS_118 } from '../../data/elements118';

interface BondFormation3DProps {
  recipe: MoleculeRecipe;
  height?: number | string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
  depth: number;
  scale: number;
}

export const BondFormation3D: React.FC<BondFormation3DProps> = ({
  recipe,
  height = 460,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [showElectrons, setShowElectrons] = useState(true);
  const [showDetailsCard, setShowDetailsCard] = useState(true);

  const totalSteps = recipe.animationSteps.length;
  const currentStep: AnimationStep =
    recipe.animationSteps[currentStepIdx] || recipe.animationSteps[0];

  // Camera state
  const cameraZRef = useRef(15);
  const rotXRef = useRef(0.2);
  const rotYRef = useRef(0.15);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  // Reset to first step whenever recipe changes
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(true);
  }, [recipe.id]);

  // Step transition timer when playing
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 3600 / speedMultiplier;
    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, speedMultiplier]);

  const handleNextStep = () => {
    if (currentStepIdx < totalSteps - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStepIdx(0);
    setIsPlaying(true);
    rotXRef.current = 0.2;
    rotYRef.current = 0.15;
    cameraZRef.current = 15;
  };

  const handleZoom = (dir: 'in' | 'out') => {
    cameraZRef.current = Math.max(6, Math.min(28, cameraZRef.current + (dir === 'in' ? -2.5 : 2.5)));
  };

  // Find element data for each atom
  const atomElementMap = useMemo(() => {
    const map: Record<string, typeof ELEMENTS_118[0]> = {};
    recipe.animationSteps.forEach((st) => {
      st.atomStates.forEach((at) => {
        if (!map[at.symbol]) {
          const found = ELEMENTS_118.find((e) => e.symbol === at.symbol);
          if (found) map[at.symbol] = found;
        }
      });
    });
    return map;
  }, [recipe]);

  // Main 3D Canvas Projection Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let globalAngle = 0;
    let lastTime = performance.now();

    // Smoothed atom positions for animated glide
    const currentPositions: Point3D[] = currentStep.atomStates.map((st) => ({
      x: st.position[0],
      y: st.position[1],
      z: st.position[2],
    }));

    const project = (p: Point3D, w: number, h: number, rotX: number, rotY: number, camZ: number): ProjectedPoint | null => {
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const fov = 620;
      const depth = camZ + z2;
      if (depth <= 0.2) return null;

      const scale = fov / depth;
      return {
        x: w / 2 + x1 * scale,
        y: h / 2 - y2 * scale,
        depth: z2,
        scale,
      };
    };

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      const w = canvas.clientWidth || 400;
      const h = canvas.clientHeight || 460;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      if (!isDraggingRef.current && isPlaying) {
        rotYRef.current += 0.005 * speedMultiplier;
      }
      globalAngle += dt * 2.5 * speedMultiplier;

      const rotX = rotXRef.current;
      const rotY = rotYRef.current;
      const camZ = cameraZRef.current;

      // 1. Pedestal Ground Grid
      const pedY = -4.5;
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.18)';
      ctx.lineWidth = 1;
      [2.5, 4.5, 6.5].forEach((rad) => {
        ctx.beginPath();
        let first = true;
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.15) {
          const pt = project({ x: Math.cos(a) * rad, y: pedY, z: Math.sin(a) * rad }, w, h, rotX, rotY, camZ);
          if (pt) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        }
        ctx.closePath();
        ctx.stroke();
      });

      // Smooth interpolation towards target step positions
      currentStep.atomStates.forEach((targetAt, i) => {
        if (!currentPositions[i]) {
          currentPositions[i] = { x: targetAt.position[0], y: targetAt.position[1], z: targetAt.position[2] };
        }
        const speed = 6.0 * dt * speedMultiplier;
        currentPositions[i].x += (targetAt.position[0] - currentPositions[i].x) * speed;
        currentPositions[i].y += (targetAt.position[1] - currentPositions[i].y) * speed;
        currentPositions[i].z += (targetAt.position[2] - currentPositions[i].z) * speed;
      });

      type RenderableItem = { depth: number; draw: () => void };
      const drawQueue: RenderableItem[] = [];

      // 2. Bond Lines connecting atoms (if bondLinesVisible)
      if (currentStep.bondLinesVisible && currentPositions.length >= 2) {
        for (let i = 0; i < currentPositions.length - 1; i++) {
          const pA = currentPositions[i];
          const pB = currentPositions[i + 1];
          const midZ = (pA.z + pB.z) / 2;

          drawQueue.push({
            depth: midZ,
            draw: () => {
              const ptA = project(pA, w, h, rotX, rotY, camZ);
              const ptB = project(pB, w, h, rotX, rotY, camZ);
              if (!ptA || !ptB) return;

              // Glowing connecting bond beam
              ctx.beginPath();
              ctx.moveTo(ptA.x, ptA.y);
              ctx.lineTo(ptB.x, ptB.y);
              ctx.strokeStyle = recipe.bondClassification === 'ionic' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(56, 189, 248, 0.8)';
              ctx.lineWidth = Math.max(3, 5 * ((ptA.scale + ptB.scale) / 2) * 0.05);
              ctx.stroke();

              // High-energy pulse core
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = Math.max(1, ctx.lineWidth * 0.35);
              ctx.stroke();
            },
          });
        }
      }

      // 3. Orbital Overlap Ellipse (for covalent bonds)
      if (currentStep.orbitalOverlapVisible && currentPositions.length >= 2) {
        const mid: Point3D = {
          x: (currentPositions[0].x + currentPositions[1].x) / 2,
          y: (currentPositions[0].y + currentPositions[1].y) / 2,
          z: (currentPositions[0].z + currentPositions[1].z) / 2,
        };
        const ptMid = project(mid, w, h, rotX, rotY, camZ);
        if (ptMid) {
          drawQueue.push({
            depth: ptMid.depth - 0.2,
            draw: () => {
              const rPx = 36 * (ptMid.scale * 0.05);
              const grad = ctx.createRadialGradient(ptMid.x, ptMid.y, 2, ptMid.x, ptMid.y, rPx);
              grad.addColorStop(0, 'rgba(52, 211, 153, 0.65)');
              grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.3)');
              grad.addColorStop(1, 'rgba(5, 150, 105, 0)');

              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(ptMid.x, ptMid.y, rPx, 0, Math.PI * 2);
              ctx.fill();
            },
          });
        }
      }

      // 4. Atom Spheres and Labels
      currentStep.atomStates.forEach((atomState, idx) => {
        const pos = currentPositions[idx] || { x: atomState.position[0], y: atomState.position[1], z: atomState.position[2] };
        const pt = project(pos, w, h, rotX, rotY, camZ);
        if (!pt) return;

        const el = atomElementMap[atomState.symbol];
        const baseColor = el ? el.color : '#38bdf8';
        const atomScale = (atomState.scale || 1.0) * (el ? Math.min(1.35, 0.75 + el.period * 0.1) : 1.0);
        const radiusPx = Math.max(14, 22 * atomScale * (pt.scale * 0.05));

        drawQueue.push({
          depth: pt.depth,
          draw: () => {
            // Radial shaded sphere
            const grad = ctx.createRadialGradient(
              pt.x - radiusPx * 0.35,
              pt.y - radiusPx * 0.35,
              radiusPx * 0.1,
              pt.x,
              pt.y,
              radiusPx
            );
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.35, baseColor);
            grad.addColorStop(0.85, '#0f172a');
            grad.addColorStop(1, '#020617');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, radiusPx, 0, Math.PI * 2);
            ctx.fill();

            // Outer highlight ring
            ctx.strokeStyle = baseColor + '99';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Valence electron orbits
            if (showElectrons) {
              const ringR = radiusPx * 1.55;
              ctx.strokeStyle = atomState.highlightValence ? 'rgba(52, 211, 153, 0.55)' : 'rgba(56, 189, 248, 0.35)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, ringR, 0, Math.PI * 2);
              ctx.stroke();

              // 2 orbiting electron dots
              const valCount = el ? el.valenceElectrons : 2;
              const displayE = Math.min(valCount, 8);
              for (let e = 0; e < displayE; e++) {
                const ang = globalAngle + (e / displayE) * Math.PI * 2;
                const ex = pt.x + Math.cos(ang) * ringR;
                const ey = pt.y + Math.sin(ang) * ringR * 0.45;

                ctx.fillStyle = atomState.highlightValence ? '#34d399' : '#38bdf8';
                ctx.beginPath();
                ctx.arc(ex, ey, 2.8, 0, Math.PI * 2);
                ctx.fill();
              }
            }

            // Chemical Symbol & Charge Badge
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 15px monospace, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(atomState.symbol, pt.x, pt.y);

            if (currentStep.ionsVisible && atomState.charge && atomState.charge !== '0') {
              const chargeY = pt.y - radiusPx - 10;
              ctx.fillStyle = atomState.charge.includes('+') ? 'rgba(239, 68, 68, 0.9)' : 'rgba(56, 189, 248, 0.9)';
              ctx.beginPath();
              ctx.roundRect(pt.x - 14, chargeY - 9, 28, 18, 6);
              ctx.fill();

              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 10px monospace';
              ctx.fillText(atomState.charge, pt.x, chargeY);
            }
          },
        });
      });

      // Sort back-to-front and render
      drawQueue.sort((a, b) => b.depth - a.depth);
      drawQueue.forEach((item) => item.draw());

      ctx.restore();
    };

    animId = requestAnimationFrame(render);

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseRef.current = { x: clientX, y: clientY };
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const dx = clientX - prevMouseRef.current.x;
      const dy = clientY - prevMouseRef.current.y;

      rotYRef.current += dx * 0.008;
      rotXRef.current += dy * 0.008;

      prevMouseRef.current = { x: clientX, y: clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraZRef.current = Math.max(6, Math.min(28, cameraZRef.current + e.deltaY * 0.015));
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    canvas.addEventListener('touchstart', handleMouseDown, { passive: true });
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      canvas.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);

      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [
    recipe,
    currentStep,
    speedMultiplier,
    showElectrons,
    isPlaying,
    atomElementMap,
  ]);

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#060b14] via-[#09101f] to-[#040812] border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
      {/* Top Header Card */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 px-3.5 py-1.5 rounded-xl shadow-xl backdrop-blur-md">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{recipe.formula}</span>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-1.5 py-0.2 rounded">
                {recipe.bondClassificationName}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono">
              ΔEN = {recipe.deltaEN} · {recipe.geometryName}
            </div>
          </div>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-1.5 bg-slate-950/90 border border-slate-800 p-1 rounded-xl shadow-md backdrop-blur-md">
          {recipe.animationSteps.map((st, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentStepIdx(i);
                setIsPlaying(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                currentStepIdx === i
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Paso {st.stepNumber}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div
        style={{ height }}
        className="w-full relative cursor-grab active:cursor-grabbing select-none"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Educational Step Details Card */}
      {showDetailsCard && (
        <div className="absolute top-16 left-3 max-w-sm z-10 bg-slate-950/90 border border-slate-800/90 p-4 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 pointer-events-auto">
          <div className="flex items-center justify-between text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
            <span>Paso {currentStep.stepNumber}: {currentStep.title}</span>
            <span>{Math.round(((currentStepIdx + 1) / totalSteps) * 100)}%</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">{currentStep.explanation}</p>
          <div className="pt-1 text-[11px] text-slate-400 font-mono border-t border-slate-800/80 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{currentStep.scientificDetail}</span>
          </div>
        </div>
      )}

      {/* Floating 3D Navigation Controls Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-slate-950/95 border border-slate-800 px-3.5 py-2 rounded-2xl shadow-2xl backdrop-blur-md max-w-[94%]">
        <button
          onClick={handlePrevStep}
          disabled={currentStepIdx === 0}
          className={`p-1.5 rounded-xl transition ${
            currentStepIdx === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Paso Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-md active:scale-95"
          title={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        </button>

        <button
          onClick={handleNextStep}
          disabled={currentStepIdx === totalSteps - 1}
          className={`p-1.5 rounded-xl transition ${
            currentStepIdx === totalSteps - 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Paso Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={handleRestart}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Reiniciar"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-800" />

        <button
          onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : prev === 2 ? 0.5 : 1))}
          className="px-2 py-1 text-xs font-mono font-semibold text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
          title="Velocidad"
        >
          {speedMultiplier}x
        </button>

        <button
          onClick={() => setShowElectrons(!showElectrons)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
            showElectrons ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'text-slate-500'
          }`}
          title="Electrones"
        >
          Electrones
        </button>

        <button
          onClick={() => setShowDetailsCard(!showDetailsCard)}
          className={`p-1.5 rounded-xl transition ${
            showDetailsCard ? 'text-cyan-400 bg-slate-800' : 'text-slate-500'
          }`}
          title="Info"
        >
          <Info className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-800" />

        <button
          onClick={() => handleZoom('in')}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Acercar"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Alejar"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

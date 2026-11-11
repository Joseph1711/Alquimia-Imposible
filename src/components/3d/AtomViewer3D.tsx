import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ChemicalElement, getAtomicStructure } from '../../data/elements118';

interface AtomViewer3DProps {
  element: ChemicalElement;
  height?: number | string;
  showCardDetails?: boolean;
}

// 3D Point interface for vector math
interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Projected 2D Point with scale and depth
interface ProjectedPoint {
  x: number;
  y: number;
  depth: number;
  scale: number;
}

export const AtomViewer3D: React.FC<AtomViewer3DProps> = ({
  element,
  height = 440,
  showCardDetails = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [modelType, setModelType] = useState<'bohr' | 'quantum'>('bohr');
  const [isPaused, setIsPaused] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showNucleons, setShowNucleons] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [viewAngle, setViewAngle] = useState<'free' | 'top' | 'front'>('free');

  // Camera state
  const cameraZRef = useRef(17);
  const rotXRef = useRef(0.18);
  const rotYRef = useRef(0.25);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  const atomicInfo = useMemo(() => getAtomicStructure(element), [element]);

  // Pre-generate stable nucleon positions
  const nucleonPositions = useMemo(() => {
    const total = atomicInfo.protons + atomicInfo.neutrons;
    const count = Math.min(total, 64);
    const radius = Math.min(1.5, 0.5 + Math.cbrt(total) * 0.17);
    const list: { isProton: boolean; x: number; y: number; z: number; r: number }[] = [];

    // Golden ratio spherical distribution
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1 || 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const dist = radius * (0.55 + ((i * 13) % 38) * 0.01);

      list.push({
        isProton: i % 2 === 0,
        x: Math.cos(theta) * radiusAtY * dist,
        y: y * dist,
        z: Math.sin(theta) * radiusAtY * dist,
        r: Math.max(0.12, 0.22 - count * 0.0018),
      });
    }
    return { radius, list };
  }, [atomicInfo]);

  // Pre-generate quantum cloud dots for Schrödinger density
  const quantumCloudPoints = useMemo(() => {
    const count = Math.min(420, element.number * 8 + 120);
    const pts: Point3D[] = [];
    const nucR = nucleonPositions.radius;

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = nucR + 0.9 + Math.pow(Math.random(), 1.6) * 4.2;
      const sinPhi = Math.sin(phi);

      pts.push({
        x: r * sinPhi * Math.cos(theta),
        y: r * sinPhi * Math.sin(theta),
        z: r * Math.cos(phi),
      });
    }
    return pts;
  }, [element.number, nucleonPositions.radius]);

  // Handle Preset Angle Switch
  const handleSetViewAngle = (angle: 'free' | 'top' | 'front') => {
    setViewAngle(angle);
    if (angle === 'top') {
      rotXRef.current = -Math.PI / 2;
      rotYRef.current = 0;
      cameraZRef.current = 20;
    } else if (angle === 'front') {
      rotXRef.current = 0;
      rotYRef.current = 0;
      cameraZRef.current = 17;
    } else {
      rotXRef.current = 0.18;
      rotYRef.current = 0.25;
      cameraZRef.current = 17;
    }
  };

  const handleZoom = (dir: 'in' | 'out') => {
    cameraZRef.current = Math.max(7, Math.min(32, cameraZRef.current + (dir === 'in' ? -2.5 : 2.5)));
  };

  const handleResetCamera = () => {
    cameraZRef.current = 17;
    rotXRef.current = 0.18;
    rotYRef.current = 0.25;
    setViewAngle('free');
  };

  // Main 3D Canvas Projection and Animation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let electronAngles = atomicInfo.shellDistribution.map(() => 0);
    let lastTime = performance.now();

    // 3D Projection math helper
    const project = (p: Point3D, w: number, h: number, rotX: number, rotY: number, camZ: number): ProjectedPoint | null => {
      // 1. Rotate Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;

      // 2. Rotate X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      // 3. Perspective divide
      const fov = 640;
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
      const h = canvas.clientHeight || 440;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Auto gentle spin in free mode when not dragging
      if (!isDraggingRef.current && !isPaused && viewAngle === 'free') {
        rotYRef.current += 0.007 * speedMultiplier;
      }

      const rotX = rotXRef.current;
      const rotY = rotYRef.current;
      const camZ = cameraZRef.current;

      // 1. Laboratory Ground Pedestal
      const pedestalY = -6.2;
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.35)';
      ctx.lineWidth = 1;

      // Concentric pedestal metric rings
      [3.5, 5.5, 7.5].forEach((rad, idx) => {
        ctx.beginPath();
        let first = true;
        for (let a = 0; a <= Math.PI * 2; a += 0.15) {
          const pt = project({ x: Math.cos(a) * rad, y: pedestalY, z: Math.sin(a) * rad }, w, h, rotX, rotY, camZ);
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
        ctx.strokeStyle = idx === 1 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(14, 165, 233, 0.25)';
        ctx.stroke();
      });

      // 2. Quantum / Atomic Center
      const nucR = nucleonPositions.radius;
      const nucCenter = project({ x: 0, y: 0, z: 0 }, w, h, rotX, rotY, camZ);

      // Render items list for depth sorting (Painter's Algorithm)
      type RenderableItem = {
        depth: number;
        draw: () => void;
      };
      const drawQueue: RenderableItem[] = [];

      // A. Nucleus Core Glow
      if (nucCenter) {
        drawQueue.push({
          depth: nucCenter.depth,
          draw: () => {
            const radPx = nucR * 1.1 * nucCenter.scale;
            const grad = ctx.createRadialGradient(
              nucCenter.x - radPx * 0.25,
              nucCenter.y - radPx * 0.25,
              radPx * 0.1,
              nucCenter.x,
              nucCenter.y,
              radPx
            );
            grad.addColorStop(0, '#fca5a5');
            grad.addColorStop(0.4, '#ef4444');
            grad.addColorStop(0.8, '#b91c1c');
            grad.addColorStop(1, 'rgba(185, 28, 28, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(nucCenter.x, nucCenter.y, radPx * 1.25, 0, Math.PI * 2);
            ctx.fill();

            // Strong force containment cage ring
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          },
        });
      }

      // B. Individual Nucleons
      if (showNucleons) {
        nucleonPositions.list.forEach((nuc) => {
          const pt = project(nuc, w, h, rotX, rotY, camZ);
          if (pt) {
            drawQueue.push({
              depth: pt.depth,
              draw: () => {
                const rPx = Math.max(2, nuc.r * pt.scale);
                const grad = ctx.createRadialGradient(
                  pt.x - rPx * 0.35,
                  pt.y - rPx * 0.35,
                  rPx * 0.1,
                  pt.x,
                  pt.y,
                  rPx
                );
                if (nuc.isProton) {
                  grad.addColorStop(0, '#fca5a5');
                  grad.addColorStop(0.6, '#ef4444');
                  grad.addColorStop(1, '#991b1b');
                } else {
                  grad.addColorStop(0, '#bae6fd');
                  grad.addColorStop(0.6, '#38bdf8');
                  grad.addColorStop(1, '#0369a1');
                }
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, rPx, 0, Math.PI * 2);
                ctx.fill();
              },
            });
          }
        });
      }

      // C. Bohr Shells & Orbiting Electrons
      if (modelType === 'bohr') {
        const baseRadius = nucR + 1.25;
        const shellSpacing = 1.15;
        const totalShells = atomicInfo.shellDistribution.length;

        atomicInfo.shellDistribution.forEach((eCount, sIdx) => {
          const shellR = baseRadius + sIdx * shellSpacing;
          const isValence = sIdx === totalShells - 1;
          const tilt = sIdx * 0.18;

          // Update electron angle
          if (!isPaused) {
            electronAngles[sIdx] = (electronAngles[sIdx] || 0) + (1.8 / Math.sqrt(shellR)) * dt * speedMultiplier;
          }
          const baseAng = electronAngles[sIdx] || 0;

          // 1. Orbit Ring path
          drawQueue.push({
            depth: -shellR * Math.sin(rotX), // Average depth of ring
            draw: () => {
              ctx.beginPath();
              let first = true;
              for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.08) {
                // Point on tilted ring plane
                const rawX = shellR * Math.cos(a);
                const rawY = shellR * Math.sin(a) * Math.sin(tilt);
                const rawZ = shellR * Math.sin(a) * Math.cos(tilt);

                const pt = project({ x: rawX, y: rawY, z: rawZ }, w, h, rotX, rotY, camZ);
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
              ctx.strokeStyle = isValence ? 'rgba(52, 211, 153, 0.75)' : 'rgba(56, 189, 248, 0.38)';
              ctx.lineWidth = isValence ? 2 : 1.2;
              ctx.stroke();
            },
          });

          // 2. Orbiting Electron Spheres on this shell
          for (let eIdx = 0; eIdx < eCount; eIdx++) {
            const angle = baseAng + (eIdx / eCount) * Math.PI * 2;
            const rawX = shellR * Math.cos(angle);
            const rawY = shellR * Math.sin(angle) * Math.sin(tilt);
            const rawZ = shellR * Math.sin(angle) * Math.cos(tilt);

            const pt = project({ x: rawX, y: rawY, z: rawZ }, w, h, rotX, rotY, camZ);
            if (pt) {
              drawQueue.push({
                depth: pt.depth,
                draw: () => {
                  const eRadius = (isValence ? 0.16 : 0.12) * pt.scale;
                  const grad = ctx.createRadialGradient(
                    pt.x - eRadius * 0.3,
                    pt.y - eRadius * 0.3,
                    eRadius * 0.1,
                    pt.x,
                    pt.y,
                    eRadius
                  );
                  if (isValence) {
                    grad.addColorStop(0, '#a7f3d0');
                    grad.addColorStop(0.5, '#34d399');
                    grad.addColorStop(1, '#059669');
                  } else {
                    grad.addColorStop(0, '#e0f2fe');
                    grad.addColorStop(0.5, '#38bdf8');
                    grad.addColorStop(1, '#0284c7');
                  }

                  // Outer glow corona for valence electrons
                  if (isValence) {
                    ctx.fillStyle = 'rgba(52, 211, 153, 0.35)';
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, eRadius * 2.2, 0, Math.PI * 2);
                    ctx.fill();
                  }

                  ctx.fillStyle = grad;
                  ctx.beginPath();
                  ctx.arc(pt.x, pt.y, Math.max(2.5, eRadius), 0, Math.PI * 2);
                  ctx.fill();
                },
              });
            }
          }
        });
      }

      // D. Quantum Mechanical Model (Schrödinger Orbitals & Probability Cloud)
      if (modelType === 'quantum') {
        // 1. 1s spherical density cloud
        if (nucCenter) {
          drawQueue.push({
            depth: nucCenter.depth - 0.5,
            draw: () => {
              const rPx = (nucR + 1.3) * nucCenter.scale;
              const grad = ctx.createRadialGradient(nucCenter.x, nucCenter.y, rPx * 0.2, nucCenter.x, nucCenter.y, rPx);
              grad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
              grad.addColorStop(0.6, 'rgba(14, 165, 233, 0.18)');
              grad.addColorStop(1, 'rgba(2, 132, 199, 0)');

              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(nucCenter.x, nucCenter.y, rPx, 0, Math.PI * 2);
              ctx.fill();
            },
          });
        }

        // 2. 2p Dumbbell / Peanut Lobes (px, py, pz) for Z >= 5
        if (element.number >= 5) {
          const lobeDist = nucR + 1.8;
          const lobes = [
            { axis: 'x', dir: 1, color: '#10b981', label: '+px' },
            { axis: 'x', dir: -1, color: '#059669', label: '-px' },
            { axis: 'y', dir: 1, color: '#38bdf8', label: '+py' },
            { axis: 'y', dir: -1, color: '#f59e0b', label: '-py' },
            { axis: 'z', dir: 1, color: '#a855f7', label: '+pz' },
            { axis: 'z', dir: -1, color: '#ec4899', label: '-pz' },
          ];

          lobes.forEach((lb) => {
            const x = lb.axis === 'x' ? lobeDist * lb.dir : 0;
            const y = lb.axis === 'y' ? lobeDist * lb.dir : 0;
            const z = lb.axis === 'z' ? lobeDist * lb.dir : 0;

            const pt = project({ x, y, z }, w, h, rotX, rotY, camZ);
            if (pt) {
              drawQueue.push({
                depth: pt.depth,
                draw: () => {
                  const lobeR = 1.2 * pt.scale;
                  const grad = ctx.createRadialGradient(pt.x, pt.y, lobeR * 0.1, pt.x, pt.y, lobeR);
                  grad.addColorStop(0, lb.color);
                  grad.addColorStop(0.7, lb.color + '55');
                  grad.addColorStop(1, lb.color + '00');

                  ctx.fillStyle = grad;
                  ctx.beginPath();
                  ctx.arc(pt.x, pt.y, lobeR, 0, Math.PI * 2);
                  ctx.fill();
                },
              });
            }
          });
        }

        // 3. Electron Probability Sparkles (|Ψ|²)
        quantumCloudPoints.forEach((pt3D) => {
          const pt = project(pt3D, w, h, rotX, rotY, camZ);
          if (pt) {
            drawQueue.push({
              depth: pt.depth,
              draw: () => {
                ctx.fillStyle = 'rgba(103, 232, 249, 0.65)';
                ctx.fillRect(pt.x, pt.y, 1.8, 1.8);
              },
            });
          }
        });
      }

      // E. Billboard Labels Overlay in 3D Space
      if (showLabels && nucCenter) {
        drawQueue.push({
          depth: nucCenter.depth + 1.5,
          draw: () => {
            // Nucleus billboard label
            const labelX = nucCenter.x;
            const labelY = nucCenter.y - (nucR + 1.3) * nucCenter.scale;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.5;

            const pillW = 160;
            const pillH = 34;
            const px = labelX - pillW / 2;
            const py = labelY - pillH / 2;

            ctx.beginPath();
            ctx.roundRect(px, py, pillW, pillH, 8);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`Núcleo: ${atomicInfo.protons}p⁺ | ${atomicInfo.neutrons}n⁰`, labelX, labelY - 4);

            ctx.font = '10px monospace';
            ctx.fillStyle = '#fca5a5';
            ctx.fillText(`A = ${atomicInfo.massNumber} (${element.symbol})`, labelX, labelY + 9);
          },
        });
      }

      // SORT BY DEPTH (Farthest first, nearest last) and DRAW!
      drawQueue.sort((a, b) => b.depth - a.depth);
      drawQueue.forEach((item) => item.draw());

      ctx.restore();
    };

    animId = requestAnimationFrame(render);

    // Pointer Drag Listeners
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const dx = clientX - prevMouseRef.current.x;
      const dy = clientY - prevMouseRef.current.y;

      rotYRef.current += dx * 0.008;
      rotXRef.current += dy * 0.008;

      prevMouseRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraZRef.current = Math.max(7, Math.min(32, cameraZRef.current + e.deltaY * 0.015));
    };

    canvas.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    canvas.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);

      canvas.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [
    element,
    atomicInfo,
    modelType,
    showNucleons,
    showLabels,
    speedMultiplier,
    viewAngle,
    isPaused,
    nucleonPositions,
    quantumCloudPoints,
  ]);

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#060b14] via-[#09101f] to-[#040812] border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
      {/* Top Header Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Element Identity Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 px-3.5 py-1.5 rounded-xl shadow-xl backdrop-blur-md">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold font-mono text-white text-lg shadow-sm"
            style={{ backgroundColor: element.color + '40', borderColor: element.color, borderWidth: 1 }}
          >
            {element.symbol}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{element.name}</span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-1.5 py-0.2 rounded">
                Z={element.number}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="text-red-400 font-semibold">{atomicInfo.protons}p⁺</span>
              <span>·</span>
              <span className="text-cyan-400 font-semibold">{atomicInfo.neutrons}n⁰</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">{atomicInfo.electrons}e⁻</span>
            </div>
          </div>
        </div>

        {/* Top Control Cluster: View Angles + Model Switcher */}
        <div className="flex items-center gap-2">
          {/* View Preset Selector */}
          <div className="flex items-center gap-1 bg-slate-950/90 border border-slate-800 p-1 rounded-xl shadow-md backdrop-blur-md">
            <button
              onClick={() => handleSetViewAngle('free')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition ${
                viewAngle === 'free' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista 3D Libre (Rotación interactiva)"
            >
              3D Libre
            </button>
            <button
              onClick={() => handleSetViewAngle('top')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition ${
                viewAngle === 'top' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Cenital 2D (Concéntrica)"
            >
              Cenital (2D)
            </button>
            <button
              onClick={() => handleSetViewAngle('front')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition ${
                viewAngle === 'front' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Frontal"
            >
              Frontal
            </button>
          </div>

          {/* Model Switcher: Bohr vs Quantum */}
          <div className="flex items-center gap-1 bg-slate-950/90 border border-slate-800 p-1 rounded-xl shadow-md backdrop-blur-md">
            <button
              onClick={() => setModelType('bohr')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                modelType === 'bohr'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Modelo de Bohr (Niveles y capas concéntricas)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bohr</span>
            </button>
            <button
              onClick={() => setModelType('quantum')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                modelType === 'quantum'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Modelo Cuántico (Orbitales y nubes de probabilidad)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Orbitales</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Canvas Mount Container */}
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full relative cursor-grab active:cursor-grabbing select-none"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Floating 3D Interaction Control Dock (Bottom Center) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-slate-950/90 border border-slate-800/90 px-3 py-1.5 rounded-2xl shadow-2xl backdrop-blur-md max-w-[94%]">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title={isPaused ? 'Reanudar rotación' : 'Pausar rotación'}
        >
          {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
        </button>

        <button
          onClick={handleResetCamera}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Centrar vista 3D"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-800" />

        <button
          onClick={() => handleZoom('in')}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Acercar (Zoom In)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Alejar (Zoom Out)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-800" />

        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-lg transition ${
            showLabels ? 'bg-slate-800 text-emerald-400 border border-emerald-900/60' : 'text-slate-500'
          }`}
          title="Mostrar u ocultar etiquetas 3D de capas y núcleo"
        >
          {showLabels ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>Etiquetas</span>
        </button>

        <button
          onClick={() => setShowNucleons(!showNucleons)}
          className={`px-2 py-1 text-[10px] font-semibold rounded-lg transition ${
            showNucleons ? 'bg-slate-800 text-cyan-400 border border-cyan-900/60' : 'text-slate-500'
          }`}
          title="Ver protones y neutrones individuales en el núcleo"
        >
          Nucleones
        </button>

        <button
          onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1))}
          className="px-2 py-1 text-[10px] font-mono font-semibold text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
          title="Velocidad de órbita electrónica"
        >
          {speedMultiplier}x
        </button>
      </div>

      {/* 3D Visual Legend Bar */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-300 gap-2">
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
            <span className="text-slate-300 font-medium">Protón (p⁺)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span className="text-slate-300 font-medium">Neutrón (n⁰)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" />
            <span className="text-slate-300 font-medium">Electrón interno (e⁻)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
            <span className="text-emerald-400 font-bold">Electrón de valencia (e⁻ val)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Capa de Valencia:</span>
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-md font-bold">
            {element.valenceElectrons} e⁻
          </span>
        </div>
      </div>

      {/* Expanded Atomic Information Panel */}
      {showCardDetails && (
        <div className="p-4 bg-[#090e1a] border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Configuración</span>
            <div className="font-mono text-emerald-400 font-semibold mt-0.5 truncate" title={element.electronConfig}>
              {element.electronConfig}
            </div>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Distribución (K-Q)</span>
            <div className="font-mono text-white font-semibold mt-0.5 truncate" title={atomicInfo.shellDistribution.join(' · ')}>
              {atomicInfo.shellDistribution.join(' · ')}
            </div>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Electronegatividad</span>
            <div className="font-mono text-amber-400 font-semibold mt-0.5">
              {element.electronegativity !== null ? `${element.electronegativity} (Pauling)` : 'No establecida'}
            </div>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Isótopo Ref.</span>
            <div className="font-mono text-cyan-400 font-semibold mt-0.5">
              {atomicInfo.massNumber}{element.symbol} (A={atomicInfo.massNumber})
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

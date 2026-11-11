import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
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

// Helper to create a crisp 2D canvas text texture for 3D billboard sprites
function createAtomLabelSprite(
  symbol: string,
  charge: string,
  colorHex: string
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 256, 128);

    // Pill background
    ctx.fillStyle = 'rgba(10, 16, 32, 0.85)';
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 4;

    const x = 28, y = 20, w = 200, h = 88, r = 24;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Element symbol
    ctx.font = 'bold 50px "JetBrains Mono", monospace, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, 110, 64);

    // Charge badge if non-zero
    if (charge && charge !== '0') {
      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = charge.includes('+') ? '#f87171' : charge.includes('-') ? '#38bdf8' : '#fbbf24';
      ctx.fillText(charge, 190, 48);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(1.8, 0.9, 1);
  return sprite;
}

export const BondFormation3D: React.FC<BondFormation3DProps> = ({
  recipe,
  height = 460,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [showElectrons, setShowElectrons] = useState(true);
  const [showDetailsCard, setShowDetailsCard] = useState(true);

  const totalSteps = recipe.animationSteps.length;
  const currentStep: AnimationStep =
    recipe.animationSteps[currentStepIdx] || recipe.animationSteps[0];

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bondGroupRef = useRef<THREE.Group | null>(null);
  const atomMeshesMapRef = useRef<{
    [key: number]: {
      group: THREE.Group;
      sphere: THREE.Mesh;
      sprite: THREE.Sprite;
      targetPos: THREE.Vector3;
      ringMeshes: THREE.Mesh[];
      electronMeshes: THREE.Mesh[];
    };
  }>({});
  const bondMeshesGroupRef = useRef<THREE.Group | null>(null);
  const transferParticleRef = useRef<THREE.Mesh | null>(null);
  const isInteractingRef = useRef(false);
  const previousPointerPositionRef = useRef({ x: 0, y: 0 });

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
  }, [isPlaying, totalSteps, speedMultiplier, currentStepIdx]);

  // Three.js Scene Setup & Render
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 500;
    const heightPx =
      typeof height === 'number' ? height : container.clientHeight || 460;

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 2, 13);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- Atmospheric Laboratory Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Key Light (Crisp Cool Blue/Cyan)
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    keyLight.position.set(10, 14, 12);
    scene.add(keyLight);

    // Warm Fill Light (Amber)
    const fillLight = new THREE.DirectionalLight(0xf59e0b, 1.6);
    fillLight.position.set(-10, -6, -8);
    scene.add(fillLight);

    // Rim Backlight (Neon Emerald / Violet)
    const rimLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    rimLight.position.set(0, -10, 10);
    scene.add(rimLight);

    // --- Master Hologram Group ---
    const bondGroup = new THREE.Group();
    scene.add(bondGroup);
    bondGroupRef.current = bondGroup;

    // Holographic Pedestal Floor Grid
    const gridHelper = new THREE.GridHelper(16, 16, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -3.2;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    bondGroup.add(gridHelper);

    // Concentric Energy Rings on Pedestal
    const pedestalRingGeo = new THREE.RingGeometry(2.5, 2.58, 64);
    const pedestalRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const pedestalRing = new THREE.Mesh(pedestalRingGeo, pedestalRingMat);
    pedestalRing.rotation.x = Math.PI / 2;
    pedestalRing.position.y = -3.18;
    bondGroup.add(pedestalRing);

    // Group for all active bond lines
    const bondMeshesGroup = new THREE.Group();
    bondGroup.add(bondMeshesGroup);
    bondMeshesGroupRef.current = bondMeshesGroup;

    // Electron Transfer Particle (Glowing photon ball)
    const transferGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const transferMat = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.5,
      roughness: 0.1,
    });
    const transferMesh = new THREE.Mesh(transferGeo, transferMat);
    transferMesh.visible = false;
    bondGroup.add(transferMesh);
    transferParticleRef.current = transferMesh;

    // Build Atom Meshes for this recipe
    rebuildSceneAtoms(bondGroup, recipe, currentStep, showElectrons);

    // Pointer Drag Interaction for 3D Camera Orbit
    const handlePointerDown = (e: PointerEvent) => {
      isInteractingRef.current = true;
      previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isInteractingRef.current || !bondGroupRef.current) return;
      const deltaX = e.clientX - previousPointerPositionRef.current.x;
      const deltaY = e.clientY - previousPointerPositionRef.current.y;

      bondGroupRef.current.rotation.y += deltaX * 0.008;
      bondGroupRef.current.rotation.x += deltaY * 0.008;

      previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isInteractingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newZ = cameraRef.current.position.z + e.deltaY * 0.015;
      cameraRef.current.position.z = Math.max(5, Math.min(26, newZ));
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Animation Loop
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Slow elegant idle orbit when user is not manually rotating
      if (bondGroupRef.current && !isInteractingRef.current) {
        bondGroupRef.current.rotation.y += 0.004 * speedMultiplier;
      }

      // Smoothly interpolate atom positions toward step targets
      const stepData =
        recipe.animationSteps[currentStepIdx] || recipe.animationSteps[0];

      stepData.atomStates.forEach((atomState, idx) => {
        const item = atomMeshesMapRef.current[idx];
        if (item) {
          const target = new THREE.Vector3(...atomState.position);
          item.group.position.lerp(target, delta * 3.5 * speedMultiplier);

          // Ionization scale
          const targetScale = atomState.scale;
          item.sphere.scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            delta * 3.5 * speedMultiplier
          );

          // Rotate electron rings smoothly
          item.ringMeshes.forEach((ring, rIdx) => {
            ring.rotation.z += 0.03 * (rIdx % 2 === 0 ? 1 : -1) * speedMultiplier;
          });
        }
      });

      // Update all bond cylinders dynamically between bonded pairs
      updateBondCylinders(stepData, recipe);

      // Handle migrating electron transfer animation along Bezier curve
      if (stepData.electronTransfers && stepData.electronTransfers.length > 0) {
        const transfer = stepData.electronTransfers[0];
        const fromItem = atomMeshesMapRef.current[transfer.fromAtomIndex];
        const toItem = atomMeshesMapRef.current[transfer.toAtomIndex];

        if (fromItem && toItem && transferParticleRef.current) {
          transferParticleRef.current.visible = true;
          const p1 = fromItem.group.position;
          const p2 = toItem.group.position;

          // Parabolic migration curve
          const t = (Math.sin(elapsedTime * 3 * speedMultiplier) + 1) / 2;
          const currentPos = new THREE.Vector3().lerpVectors(p1, p2, t);
          currentPos.y += Math.sin(t * Math.PI) * 1.5; // Arcing jump
          transferParticleRef.current.position.copy(currentPos);
        }
      } else if (transferParticleRef.current) {
        transferParticleRef.current.visible = false;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || 500;
      const h =
        typeof height === 'number' ? height : container.clientHeight || 460;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('wheel', handleWheel);

      scene.clear();
      renderer.dispose();
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [recipe, currentStepIdx, showElectrons]);

  // Dynamically position and orient bond cylinders between bonded atoms
  function updateBondCylinders(step: AnimationStep, rec: MoleculeRecipe) {
    const bondGroup = bondMeshesGroupRef.current;
    if (!bondGroup) return;

    if (!step.bondLinesVisible) {
      bondGroup.visible = false;
      return;
    }
    bondGroup.visible = true;

    // Detect bonding topology based on recipe
    // For diatomics (NaCl, O2, N2, HCl, CaO, MgO): 0 <-> 1
    // For triatomics (H2O, CO2, CaCl2, SO2): central is bonded to terminals
    // For tetratomics (NH3, SO3): central is bonded to all terminals
    // For pentatomics (CH4): central (0) is bonded to 1, 2, 3, 4
    let pairs: { from: number; to: number }[] = [];

    if (rec.atoms.length === 2 && rec.atoms[0].count === 1 && rec.atoms[1].count === 1) {
      pairs = [{ from: 0, to: 1 }];
    } else if (rec.id === 'h2o' || rec.id === 'co2' || rec.id === 'cacl2') {
      // Index 0 or central is bonded to both
      if (rec.id === 'co2') {
        // C is in center (index 1), O1 (index 0), O2 (index 2)
        pairs = [{ from: 1, to: 0 }, { from: 1, to: 2 }];
      } else {
        pairs = [{ from: 0, to: 1 }, { from: 0, to: 2 }];
      }
    } else if (rec.id === 'ch4') {
      pairs = [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 }];
    } else if (rec.id === 'nh3') {
      pairs = [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }];
    } else {
      // Default: connect all other atoms to atom 0
      for (let i = 1; i < step.atomStates.length; i++) {
        pairs.push({ from: 0, to: i });
      }
    }

    // Ensure bondGroup has enough child cylinders for all pairs & multiplicity
    const multiplicityCount = rec.multiplicity === 'triple' ? 3 : rec.multiplicity === 'double' ? 2 : 1;
    const requiredCylindersCount = pairs.length * multiplicityCount;

    while (bondGroup.children.length < requiredCylindersCount) {
      const geo = new THREE.CylinderGeometry(0.09, 0.09, 1, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: rec.bondClassification === 'ionic' ? 0xf59e0b : 0x10b981,
        emissive: rec.bondClassification === 'ionic' ? 0xd97706 : 0x059669,
        emissiveIntensity: 0.6,
        roughness: 0.15,
        metalness: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      bondGroup.add(mesh);
    }

    let cylinderIdx = 0;
    pairs.forEach((pair) => {
      const itemFrom = atomMeshesMapRef.current[pair.from];
      const itemTo = atomMeshesMapRef.current[pair.to];
      if (!itemFrom || !itemTo) return;

      const posA = itemFrom.group.position;
      const posB = itemTo.group.position;
      const distance = posA.distanceTo(posB);
      if (distance < 0.1) return;

      const mid = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(posB, posA).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir
      );

      // Compute perpendicular offset vector for double/triple bonds
      const up = Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
      const perp = new THREE.Vector3().crossVectors(dir, up).normalize();

      if (multiplicityCount === 1) {
        const cyl = bondGroup.children[cylinderIdx] as THREE.Mesh;
        if (cyl) {
          cyl.visible = true;
          cyl.position.copy(mid);
          cyl.scale.set(1, distance, 1);
          cyl.quaternion.copy(quaternion);
        }
        cylinderIdx++;
      } else if (multiplicityCount === 2) {
        // Double bond: two parallel cylinders
        [-0.18, 0.18].forEach((offset) => {
          const cyl = bondGroup.children[cylinderIdx] as THREE.Mesh;
          if (cyl) {
            cyl.visible = true;
            const offsetPos = new THREE.Vector3().copy(mid).addScaledVector(perp, offset);
            cyl.position.copy(offsetPos);
            cyl.scale.set(0.85, distance, 0.85);
            cyl.quaternion.copy(quaternion);
          }
          cylinderIdx++;
        });
      } else if (multiplicityCount === 3) {
        // Triple bond: three parallel cylinders
        [-0.26, 0, 0.26].forEach((offset) => {
          const cyl = bondGroup.children[cylinderIdx] as THREE.Mesh;
          if (cyl) {
            cyl.visible = true;
            const offsetPos = new THREE.Vector3().copy(mid).addScaledVector(perp, offset);
            cyl.position.copy(offsetPos);
            cyl.scale.set(0.75, distance, 0.75);
            cyl.quaternion.copy(quaternion);
          }
          cylinderIdx++;
        });
      }
    });

    // Hide any unused leftover cylinders
    for (let i = cylinderIdx; i < bondGroup.children.length; i++) {
      bondGroup.children[i].visible = false;
    }
  }

  // Rebuild atoms, labels, and electron rings
  function rebuildSceneAtoms(
    group: THREE.Group,
    rec: MoleculeRecipe,
    step: AnimationStep,
    displayElectrons: boolean
  ) {
    // Clear old atom meshes
    Object.values(atomMeshesMapRef.current).forEach((item) => {
      group.remove(item.group);
    });
    atomMeshesMapRef.current = {};

    step.atomStates.forEach((atomState, idx) => {
      const elInfo = ELEMENTS_118.find((e) => e.symbol === atomState.symbol);
      const atomColor = elInfo ? elInfo.color : '#38bdf8';
      const hexColor = parseInt(atomColor.replace('#', '0x'), 16);

      const atomRootGroup = new THREE.Group();
      atomRootGroup.position.set(...atomState.position);
      group.add(atomRootGroup);

      // 1. Polished PBR Atom Sphere (Gemstone appearance with clearcoat)
      const sphereGeo = new THREE.SphereGeometry(0.85, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: hexColor,
        roughness: 0.18,
        metalness: 0.25,
        emissive: atomState.highlightValence ? 0x10b981 : 0x051020,
        emissiveIntensity: atomState.highlightValence ? 0.45 : 0.1,
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.scale.set(atomState.scale, atomState.scale, atomState.scale);
      atomRootGroup.add(sphereMesh);

      // 2. High-legibility 3D Billboard Sprite Label (shows Symbol & Charge)
      const labelSprite = createAtomLabelSprite(
        atomState.symbol,
        atomState.charge,
        atomColor
      );
      labelSprite.position.set(0, 1.45 * atomState.scale, 0);
      atomRootGroup.add(labelSprite);

      // 3. Electron Orbit Rings & Orbiting Valence Electrons
      const ringMeshes: THREE.Mesh[] = [];
      const electronMeshes: THREE.Mesh[] = [];

      if (displayElectrons) {
        const ringGeo = new THREE.TorusGeometry(1.4, 0.022, 12, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: atomState.highlightValence ? 0x10b981 : 0x475569,
          transparent: true,
          opacity: atomState.highlightValence ? 0.75 : 0.4,
        });

        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2 + idx * 0.35;
        sphereMesh.add(ring);
        ringMeshes.push(ring);

        // Orbiting valence electron balls
        const valenceCount = elInfo ? Math.min(elInfo.valenceElectrons, 8) : 4;
        const eGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const eMat = new THREE.MeshStandardMaterial({
          color: 0x67e8f9,
          emissive: 0x0284c7,
          emissiveIntensity: 1.2,
          roughness: 0.1,
        });

        for (let e = 0; e < valenceCount; e++) {
          const angle = (e / valenceCount) * Math.PI * 2;
          const eMesh = new THREE.Mesh(eGeo, eMat);
          eMesh.position.set(1.4 * Math.cos(angle), 1.4 * Math.sin(angle), 0);
          ring.add(eMesh);
          electronMeshes.push(eMesh);
        }
      }

      atomMeshesMapRef.current[idx] = {
        group: atomRootGroup,
        sphere: sphereMesh,
        sprite: labelSprite,
        targetPos: new THREE.Vector3(...atomState.position),
        ringMeshes,
        electronMeshes,
      };
    });
  }

  // Navigation handlers
  const handlePrevStep = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.min(totalSteps - 1, prev + 1));
  };

  const handleRestart = () => {
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const handleZoom = (dir: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const delta = dir === 'in' ? -2 : 2;
    cameraRef.current.position.z = Math.max(
      5,
      Math.min(26, cameraRef.current.position.z + delta)
    );
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#070c16] via-[#091122] to-[#0c1220] border border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col">
      {/* Top Header Bar */}
      <div className="p-4 bg-slate-950/85 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-mono text-sm shadow-md">
            {recipe.formula}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base tracking-tight">
                {recipe.name}
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {recipe.bondClassificationName}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Geometría: <strong className="text-slate-200">{recipe.geometryName}</strong> ({recipe.bondAngle}) · ΔEN: {recipe.deltaEN}
            </p>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {recipe.animationSteps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentStepIdx(idx);
                setIsPlaying(false);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentStepIdx
                  ? 'w-7 bg-cyan-400 shadow-sm shadow-cyan-400/50'
                  : idx < currentStepIdx
                  ? 'w-3 bg-cyan-800'
                  : 'w-3 bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Paso ${idx + 1}: ${s.title}`}
            />
          ))}
          <span className="text-xs font-mono text-slate-400 ml-1.5">
            {currentStepIdx + 1}/{totalSteps}
          </span>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full relative cursor-grab active:cursor-grabbing select-none"
      />

      {/* Educational Step Callout Floating Card (Overlay) */}
      {showDetailsCard && (
        <div className="absolute top-20 left-4 right-4 sm:right-auto sm:max-w-md z-10 bg-slate-950/92 border border-cyan-500/30 p-4 rounded-2xl shadow-2xl backdrop-blur-md transition-all">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold font-mono text-[11px] flex items-center justify-center">
                {currentStep.stepNumber}
              </span>
              <h4 className="font-bold text-xs sm:text-sm text-white">
                {currentStep.title}
              </h4>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">
              Paso {currentStep.stepNumber} de {totalSteps}
            </span>
          </div>

          <p className="text-xs text-slate-200 mt-2 leading-relaxed">
            {currentStep.explanation}
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-xl">
            <strong className="text-cyan-400">Detalle Científico:</strong>{' '}
            {currentStep.scientificDetail}
          </div>

          {/* Atomic States Pill Cluster */}
          <div className="mt-2.5 flex items-center flex-wrap gap-1.5">
            {currentStep.atomStates.map((at, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-900 border border-slate-800 text-slate-300"
              >
                {at.symbol} (Carga:{' '}
                <strong
                  className={
                    at.charge.includes('+')
                      ? 'text-rose-400'
                      : at.charge.includes('-')
                      ? 'text-cyan-400'
                      : 'text-slate-200'
                  }
                >
                  {at.charge}
                </strong>
                )
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Floating 3D Navigation Controls Dock (Bottom Center) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-slate-950/95 border border-slate-800 px-3.5 py-2 rounded-2xl shadow-2xl backdrop-blur-md max-w-[94%]">
        {/* Step Backward */}
        <button
          onClick={handlePrevStep}
          disabled={currentStepIdx === 0}
          className={`p-1.5 rounded-xl transition ${
            currentStepIdx === 0
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Paso Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Play / Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-md active:scale-95"
          title={isPlaying ? 'Pausar Animación' : 'Reproducir Paso a Paso'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </button>

        {/* Step Forward */}
        <button
          onClick={handleNextStep}
          disabled={currentStepIdx === totalSteps - 1}
          className={`p-1.5 rounded-xl transition ${
            currentStepIdx === totalSteps - 1
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Paso Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Restart */}
        <button
          onClick={handleRestart}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Reiniciar Animación"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-800" />

        {/* Speed multiplier */}
        <button
          onClick={() =>
            setSpeedMultiplier((prev) =>
              prev === 1 ? 1.5 : prev === 1.5 ? 2 : prev === 2 ? 0.5 : 1
            )
          }
          className="px-2 py-1 text-xs font-mono font-semibold text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
          title="Velocidad de reproducción"
        >
          {speedMultiplier}x
        </button>

        {/* Toggle Electrons */}
        <button
          onClick={() => setShowElectrons(!showElectrons)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
            showElectrons
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Mostrar/Ocultar electrones de valencia"
        >
          Electrones
        </button>

        {/* Toggle Details Card */}
        <button
          onClick={() => setShowDetailsCard(!showDetailsCard)}
          className={`p-1.5 rounded-xl transition ${
            showDetailsCard
              ? 'text-cyan-400 bg-slate-800'
              : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Ocultar / Mostrar tarjeta explicativa"
        >
          <Info className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-800" />

        {/* Camera Zoom */}
        <button
          onClick={() => handleZoom('in')}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Acercar Cámara"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Alejar Cámara"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

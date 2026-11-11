import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Radiation, AlertTriangle, FastForward } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const NuclearDetonationCinematic: React.FC = () => {
  const {
    skipNuclearCinematic,
  } = useGame();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hudMessage, setHudMessage] = useState('INICIANDO CONFINAMIENTO MAGNÉTICO DE NÚCLEO EXPERIMENTAL...');
  const [screenShake, setScreenShake] = useState(0);
  const [flashIntensity, setFlashIntensity] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Three.js Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070f);
    scene.fog = new THREE.FogExp2(0x05070f, 0.025);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 4, 18);
    const cameraTarget = new THREE.Vector3(0, 1.8, 0);
    camera.lookAt(cameraTarget);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- Laboratory Environment Geometry ---
    // 1. Tiled bunker floor
    const floorGeo = new THREE.PlaneGeometry(60, 60, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111625,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid lines on floor
    const grid = new THREE.GridHelper(60, 30, 0x1e293b, 0x0f172a);
    grid.position.y = 0.01;
    scene.add(grid);

    // 2. Concrete back wall
    const wallGeo = new THREE.PlaneGeometry(60, 25);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.9,
      metalness: 0.1,
    });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 12, -15);
    scene.add(backWall);

    // 3. Laboratory Heavy Experimental Workbench
    const benchGroup = new THREE.Group();
    const tableTopGeo = new THREE.BoxGeometry(10, 0.6, 4.5);
    const tableTopMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.3,
      roughness: 0.4,
    });
    const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
    tableTop.position.set(0, 2.2, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    benchGroup.add(tableTop);

    // Steel Legs
    const legGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.2, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    [[-4.5, -1.8], [4.5, -1.8], [-4.5, 1.8], [4.5, 1.8]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, 1.1, lz);
      leg.castShadow = true;
      benchGroup.add(leg);
    });

    // 4. Heavy Containment Sphere Pedestal & Chamber Core
    const pedestalGeo = new THREE.CylinderGeometry(1.2, 1.5, 0.5, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.3 });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, 2.75, 0);
    benchGroup.add(pedestal);

    // Magnetic Tokamak Coils / Confinement Rings
    const ringGeo = new THREE.TorusGeometry(1.4, 0.1, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.position.set(0, 3.8, 0);
    benchGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.set(0, 3.8, 0);
    benchGroup.add(ring2);

    // Core glowing sphere (Pre-detonation critical sample)
    const coreGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.5,
      roughness: 0.2,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 3.8, 0);
    benchGroup.add(core);

    // Glassware props on bench (erlenmeyers, beakers)
    const glassGeo = new THREE.ConeGeometry(0.35, 0.8, 16);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
    });
    const flask1 = new THREE.Mesh(glassGeo, glassMat);
    flask1.position.set(-3.2, 2.9, 0.8);
    benchGroup.add(flask1);

    const flask2 = new THREE.Mesh(glassGeo, glassMat);
    flask2.position.set(3.4, 2.9, -0.6);
    benchGroup.add(flask2);

    scene.add(benchGroup);

    // --- Dynamic Lighting ---
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    // Alarm emergency rotating red beacon lights
    const redLight1 = new THREE.PointLight(0xef4444, 4, 30);
    redLight1.position.set(-8, 8, -5);
    scene.add(redLight1);

    const redLight2 = new THREE.PointLight(0xef4444, 4, 30);
    redLight2.position.set(8, 8, -5);
    scene.add(redLight2);

    // Overhead central lab spotlight
    const labSpot = new THREE.SpotLight(0x38bdf8, 3, 25, Math.PI / 4, 0.4, 1);
    labSpot.position.set(0, 14, 2);
    labSpot.target = core;
    labSpot.castShadow = true;
    scene.add(labSpot);

    // Blinding Detonation Flash Light
    const detonationLight = new THREE.PointLight(0xffffff, 0, 120);
    detonationLight.position.set(0, 4, 0);
    scene.add(detonationLight);

    // Secondary Warm Fireball Ambient Light
    const fireLight = new THREE.PointLight(0xf97316, 0, 80);
    fireLight.position.set(0, 6, 0);
    scene.add(fireLight);

    // --- Plasma Fireball Sphere (Hidden until detonation) ---
    const fireballGeo = new THREE.SphereGeometry(1, 32, 32);
    const fireballMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    });
    const fireball = new THREE.Mesh(fireballGeo, fireballMat);
    fireball.position.set(0, 4, 0);
    scene.add(fireball);

    // --- Supersonic Shockwave Ring 3D Mesh ---
    const shockwaveGeo = new THREE.RingGeometry(0.5, 0.9, 64);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const shockwaveRing = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwaveRing.rotation.x = -Math.PI / 2;
    shockwaveRing.position.set(0, 0.1, 0);
    scene.add(shockwaveRing);

    // Vertical shockwave sphere ring
    const sphereRingMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const shockwaveSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 24), sphereRingMat);
    shockwaveSphere.position.set(0, 4, 0);
    scene.add(shockwaveSphere);

    // --- Particle System for Mushroom Cloud & Flying Debris ---
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const pColorHot = new THREE.Color(0xfacc15);
    const pColorFire = new THREE.Color(0xf97316);
    const pColorSmoke = new THREE.Color(0x334155);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 1] = 3.8 + (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      // Distribute outward velocity (stem + mushroom cap)
      const isCap = Math.random() > 0.4;
      const angle = Math.random() * Math.PI * 2;
      const speed = isCap ? (2.5 + Math.random() * 5.5) : (1.0 + Math.random() * 2.5);

      velocities[i * 3] = Math.cos(angle) * speed;
      velocities[i * 3 + 1] = isCap ? (3.5 + Math.random() * 5.0) : (5.5 + Math.random() * 6.0); // Ascending thermal draft
      velocities[i * 3 + 2] = Math.sin(angle) * speed;

      // Color gradient
      const choice = Math.random();
      const c = choice > 0.7 ? pColorHot : choice > 0.35 ? pColorFire : pColorSmoke;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 12 + Math.random() * 20;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle Shader / Points Material
    const particleMat = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Broken Debris Meshes (Appear during devastation phase) ---
    const debrisGroup = new THREE.Group();
    const shardGeo = new THREE.TetrahedronGeometry(0.3, 0);
    const shardMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    for (let i = 0; i < 40; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      shard.position.set(
        (Math.random() - 0.5) * 16,
        0.15 + Math.random() * 0.3,
        (Math.random() - 0.5) * 12
      );
      shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      debrisGroup.add(shard);
    }
    debrisGroup.visible = false;
    scene.add(debrisGroup);

    // --- Animation State & Clock ---
    const startTime = performance.now();
    let frameId: number;
    let devastationApplied = false;

    const animate = (timestamp: number) => {
      frameId = requestAnimationFrame(animate);
      const elapsed = (timestamp - startTime) / 1000; // in seconds

      // 1. ROTATING EMERGENCY ALARMS & LIGHT FLICKERING
      const alarmSweep = elapsed * 5;
      redLight1.position.x = Math.sin(alarmSweep) * 10;
      redLight1.position.z = Math.cos(alarmSweep) * 10 - 2;
      redLight2.position.x = -Math.sin(alarmSweep) * 10;
      redLight2.position.z = -Math.cos(alarmSweep) * 10 - 2;

      // Power Grid Failure Flicker before 2.8s
      if (elapsed < 2.8) {
        const flicker = Math.sin(elapsed * 25) > 0.2 ? 1 : 0.2;
        labSpot.intensity = flicker * (2.8 - elapsed);
        ringMat.emissiveIntensity = 0.5 + Math.sin(elapsed * 12) * 0.4;
        ring1.rotation.z += 0.05 + elapsed * 0.08;
        ring2.rotation.y += 0.05 + elapsed * 0.08;
      }

      // Camera Smooth Zoom toward workbench core during phase 1
      if (elapsed < 2.6) {
        const zoomProg = Math.min(1, elapsed / 2.6);
        camera.position.z = 18 - zoomProg * 7.5;
        camera.position.y = 4 - zoomProg * 0.8;
        camera.lookAt(0, 3.2, 0);
      }

      // 2. PHASE TRANSITION TIMELINE
      if (elapsed < 1.1) {
        setHudMessage('FASE 1: CONFINAMIENTO MAGNÉTICO E INICIACIÓN DE NEUTRONES RÁPIDOS...');
        setScreenShake(0);
        setFlashIntensity(0);
      } else if (elapsed < 2.8) {
        setHudMessage('FASE 2: FISIÓN SUPERCRÍTICA EN CADENA Y VÓRTICE DE ENERGÍA (E = mc²)...');
        // Core vibration
        core.scale.setScalar(1 + Math.sin(elapsed * 40) * 0.2);
        coreMat.emissiveIntensity = 2 + (elapsed - 1.1) * 6;
        setScreenShake((elapsed - 1.1) * 2.5);
      } else if (elapsed < 3.6) {
        // DETONATION FLASH & INTENSE ILLUMINATION
        setHudMessage('FASE 3: ¡DETONACIÓN DE PLASMA TÉRMICO Y LIBERACIÓN FOTÓNICA RADIAL!');
        const flashAge = elapsed - 2.8;
        const flashVal = Math.max(0, 1 - flashAge * 1.5);
        setFlashIntensity(flashVal);
        detonationLight.intensity = flashVal * 80;
        fireLight.intensity = Math.min(8, flashAge * 15);

        // Fireball expands rapidly
        fireball.visible = true;
        const fireballScale = 1 + flashAge * 14;
        fireball.scale.set(fireballScale, fireballScale * 1.1, fireballScale);
        (fireball.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - flashAge * 0.8);
        (fireball.material as THREE.MeshBasicMaterial).color.setHex(flashAge < 0.3 ? 0xffffff : 0xf97316);

        setScreenShake(14 + Math.random() * 8);

        // Turn on debris and destroy workbench visually
        if (!devastationApplied) {
          devastationApplied = true;
          // Displace table top
          tableTop.rotation.z = 0.12;
          tableTop.rotation.x = -0.08;
          tableTop.position.y = 1.9;
          tableTopMat.color.setHex(0x0a0d14); // scorched black
          // Dislodge glassware
          flask1.rotation.z = Math.PI / 2;
          flask1.position.set(-3.5, 2.1, 1.2);
          flask2.visible = false; // shattered
          // Hide rings
          ring1.visible = false;
          ring2.visible = false;
          core.visible = false;
          debrisGroup.visible = true;
        }
      } else if (elapsed < 5.0) {
        // SUPERSONIC EXPANDING SHOCKWAVE & MUSHROOM CLOUD FORMATION
        setHudMessage('FASE 4: ONDA DE CHOQUE SUPERSONICA Y COLUMNA CONVECTIVA DE HUMO...');
        setFlashIntensity(0);
        detonationLight.intensity = 0;
        fireball.visible = false;

        const shockAge = elapsed - 3.6;
        shockwaveMat.opacity = Math.max(0, 0.9 - shockAge * 0.6);
        const shockRadius = 1 + shockAge * 22;
        shockwaveRing.scale.set(shockRadius, shockRadius, shockRadius);

        sphereRingMat.opacity = Math.max(0, 0.7 - shockAge * 0.5);
        const sphereRadius = 1 + shockAge * 18;
        shockwaveSphere.scale.set(sphereRadius, sphereRadius, sphereRadius);

        // Particles mushroom rise
        particleMat.opacity = Math.min(0.9, shockAge * 1.2);
        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        const posArr = posAttr.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          posArr[i * 3] += velocities[i * 3] * 0.05;
          posArr[i * 3 + 1] += velocities[i * 3 + 1] * 0.05;
          posArr[i * 3 + 2] += velocities[i * 3 + 2] * 0.05;
          // Cap rolls outward forming mushroom torus
          if (posArr[i * 3 + 1] > 12) {
            velocities[i * 3 + 1] *= 0.92;
            velocities[i * 3] *= 1.02;
            velocities[i * 3 + 2] *= 1.02;
          }
        }
        posAttr.needsUpdate = true;

        // Camera recoil vibration
        setScreenShake(Math.max(1, (5.0 - elapsed) * 6));
      } else if (elapsed < 7.4) {
        // SMOKE SETTLING & RESIDUAL THERMAL DAMAGE
        setHudMessage('FASE 5: COLAPSO ESTRUCTURAL, HUMO RESIDUAL Y RADIACIÓN ENFRIÁNDOSE...');
        shockwaveMat.opacity = 0;
        sphereRingMat.opacity = 0;
        fireLight.intensity = Math.max(0.5, (7.4 - elapsed) * 1.5);

        // Lingering particles
        particleMat.opacity = Math.max(0.2, (7.4 - elapsed) * 0.3);
        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        const posArr = posAttr.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          posArr[i * 3 + 1] += 0.015; // Slow rising smoke
        }
        posAttr.needsUpdate = true;

        setScreenShake(Math.max(0, (7.4 - elapsed) * 0.8));
      } else {
        // FINAL DEVASTATION VIEW
        setHudMessage('ESTADO FINAL: LABORATORIO DEVASTADO · ESPERANDO PROTOCOLO DE DESCONTAMINACIÓN');
        setScreenShake(0);
      }

      // Camera shake injection
      if (screenShake > 0) {
        camera.position.x = (Math.random() - 0.5) * screenShake * 0.08;
        camera.position.y = 4 + (Math.random() - 0.5) * screenShake * 0.08;
      }

      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || window.innerWidth;
      const nh = container.clientHeight || window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        try {
          container.removeChild(renderer.domElement);
        } catch {
          // ignore
        }
      }
      renderer.dispose();
    };
  }, [screenShake]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Blinding Flashbang Whiteout Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-30 bg-white transition-opacity duration-75"
        style={{ opacity: flashIntensity }}
      />

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full relative"
        style={{
          transform: screenShake > 0
            ? `translate(${(Math.random() - 0.5) * screenShake * 4}px, ${(Math.random() - 0.5) * screenShake * 4}px)`
            : 'none',
        }}
      />

      {/* Emergency Hazard Stripes Top & Bottom */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-500 via-black to-yellow-500 z-40" />
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-500 via-black to-yellow-500 z-40" />

      {/* Cinematic HUD Header */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2.5 bg-black/80 backdrop-blur-md border border-red-500/50 px-4 py-2 rounded-xl text-xs font-mono shadow-2xl">
          <Radiation className="w-5 h-5 text-red-500 animate-spin" style={{ animationDuration: '4s' }} />
          <div>
            <div className="text-red-400 font-bold tracking-wider flex items-center gap-2">
              <span>EXPERIMENTO NUCLEAR · SECUENCIA DE DETONACIÓN</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
            <div className="text-[10px] text-slate-400 font-sans">
              Conversión de masa en energía pura: E = Δm · c² · Simulación física virtual
            </div>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={skipNuclearCinematic}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors shadow-lg"
        >
          <FastForward className="w-3.5 h-3.5 text-amber-400" />
          <span>Omitir Cinemática</span>
        </button>
      </div>

      {/* Scientific Telemetry & Status HUD at Bottom */}
      <div className="absolute bottom-6 left-4 right-4 z-40 flex flex-col items-center gap-2">
        {/* Phase Telemetry Banner */}
        <div className="bg-black/85 backdrop-blur-md border border-yellow-500/40 px-5 py-2.5 rounded-xl text-center shadow-2xl max-w-xl w-full">
          <div className="flex items-center justify-center gap-2 text-yellow-400 text-xs font-mono font-bold tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
            <span>{hudMessage}</span>
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-mono">
            <span>FLUX: 1.4 × 10²⁴ n/cm²·s</span>
            <span>·</span>
            <span>ENERGÍA: ~200 MeV / fisión</span>
            <span>·</span>
            <span>TEMP. PLASMATICA: &gt; 10⁷ K</span>
          </div>
        </div>

        {/* Educational safety disclaimer */}
        <div className="text-center text-[10px] text-slate-500 max-w-lg px-2">
          Esta función es exclusivamente educativa y visual para demostrar la física teórica de la equivalencia masa-energía (E=mc²). No contiene ni representa diseños funcionales de armas.
        </div>
      </div>
    </div>
  );
};

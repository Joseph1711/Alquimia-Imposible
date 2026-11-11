import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Layers,
  Sparkles,
  Info,
  Compass,
  Eye,
  EyeOff,
  Maximize2,
} from 'lucide-react';
import { ChemicalElement, getAtomicStructure } from '../../data/elements118';

interface AtomViewer3DProps {
  element: ChemicalElement;
  height?: number | string;
  showCardDetails?: boolean;
}

// Helper to create high-resolution crisp 2D canvas text sprites for 3D billboard labels
function createTextSprite(
  title: string,
  subtitle?: string,
  badgeType: 'valence' | 'nucleus' | 'shell' | 'quantum' = 'shell'
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 128);

    // Styling based on badgeType
    let bgColor = 'rgba(10, 16, 30, 0.88)';
    let borderColor = '#38bdf8';
    let titleColor = '#ffffff';
    let subColor = '#94a3b8';

    if (badgeType === 'valence') {
      bgColor = 'rgba(6, 30, 20, 0.92)';
      borderColor = '#10b981';
      titleColor = '#34d399';
      subColor = '#a7f3d0';
    } else if (badgeType === 'nucleus') {
      bgColor = 'rgba(30, 12, 12, 0.92)';
      borderColor = '#f87171';
      titleColor = '#fca5a5';
      subColor = '#fecaca';
    } else if (badgeType === 'quantum') {
      bgColor = 'rgba(25, 12, 35, 0.92)';
      borderColor = '#c084fc';
      titleColor = '#e9d5ff';
      subColor = '#d8b4fe';
    }

    // Pill container
    const x = 16, y = 14, w = 480, h = 100, r = 24;
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

    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Main text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (subtitle) {
      ctx.font = 'bold 36px "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = titleColor;
      ctx.fillText(title, 256, 48);

      ctx.font = '600 24px monospace, sans-serif';
      ctx.fillStyle = subColor;
      ctx.fillText(subtitle, 256, 88);
    } else {
      ctx.font = 'bold 42px "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = titleColor;
      ctx.fillText(title, 256, 64);
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
  sprite.scale.set(3.2, 0.8, 1);
  return sprite;
}

export const AtomViewer3D: React.FC<AtomViewer3DProps> = ({
  element,
  height = 440,
  showCardDetails = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modelType, setModelType] = useState<'bohr' | 'quantum'>('bohr');
  const [isPaused, setIsPaused] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showNucleons, setShowNucleons] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [viewAngle, setViewAngle] = useState<'free' | 'top' | 'front'>('free');

  // References to communicate with render loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const atomGroupRef = useRef<THREE.Group | null>(null);
  const labelsGroupRef = useRef<THREE.Group | null>(null);

  // References to active electron objects for animation
  const activeElectronsRef = useRef<
    {
      mesh: THREE.Mesh;
      radius: number;
      angle: number;
      speed: number;
      parentGroup: THREE.Group;
    }[]
  >([]);

  const isInteractingRef = useRef(false);
  const previousPointerPositionRef = useRef({ x: 0, y: 0 });

  const atomicInfo = getAtomicStructure(element);

  // Sync label visibility without rebuilding scene
  useEffect(() => {
    if (labelsGroupRef.current) {
      labelsGroupRef.current.visible = showLabels;
    }
  }, [showLabels]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL as mandated by threejs skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 400;
    const heightPx = typeof height === 'number' ? height : container.clientHeight || 440;

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 5, 17);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Realistic Studio / Laboratory Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(12, 16, 14);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    rimLight.position.set(-12, -8, -10);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x10b981, 1.5, 25);
    fillLight.position.set(0, -6, 4);
    scene.add(fillLight);

    // 3. Holographic Laboratory Floor Pedestal for Spatial Grounding
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -6.5, 0);

    // Concentric metallic pedestal discs
    const discGeo = new THREE.CylinderGeometry(8.5, 8.8, 0.25, 48);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x070d1a,
      metalness: 0.8,
      roughness: 0.3,
    });
    const discMesh = new THREE.Mesh(discGeo, discMat);
    pedestalGroup.add(discMesh);

    // Glowing concentric metric rings on pedestal
    [3.5, 5.5, 7.5].forEach((rad, idx) => {
      const ringGeo = new THREE.RingGeometry(rad - 0.03, rad + 0.03, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 1 ? 0x10b981 : 0x0284c7,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.14;
      pedestalGroup.add(ringMesh);
    });

    // Radial calibration ticks
    const gridHelper = new THREE.PolarGridHelper(8, 16, 8, 48, 0x1e3a8a, 0x0f172a);
    gridHelper.position.y = 0.15;
    pedestalGroup.add(gridHelper);
    scene.add(pedestalGroup);

    // 4. Master Atom Group
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);
    atomGroupRef.current = atomGroup;

    const labelsGroup = new THREE.Group();
    labelsGroup.visible = showLabels;
    scene.add(labelsGroup);
    labelsGroupRef.current = labelsGroup;

    // Build the visual geometry
    buildAtomGeometry(atomGroup, labelsGroup, element, atomicInfo, modelType, showNucleons);

    // 5. Pointer Drag Interaction for 3D Camera Orbit
    const handlePointerDown = (e: PointerEvent) => {
      isInteractingRef.current = true;
      previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isInteractingRef.current || !atomGroupRef.current) return;
      const deltaX = e.clientX - previousPointerPositionRef.current.x;
      const deltaY = e.clientY - previousPointerPositionRef.current.y;

      atomGroupRef.current.rotation.y += deltaX * 0.008;
      atomGroupRef.current.rotation.x += deltaY * 0.008;

      previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isInteractingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newZ = cameraRef.current.position.z + e.deltaY * 0.015;
      cameraRef.current.position.z = Math.max(6, Math.min(32, newZ));
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // 6. Animation Loop
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Gentle natural rotation of atom when not dragging
      if (atomGroupRef.current && !isInteractingRef.current && !isPaused && viewAngle === 'free') {
        atomGroupRef.current.rotation.y += 0.007 * speedMultiplier;
        atomGroupRef.current.rotation.x = Math.sin(time * 0.5) * 0.12;
      }

      // Smooth electron orbital motion: each electron glides along its ring plane
      if (!isPaused && activeElectronsRef.current.length > 0) {
        activeElectronsRef.current.forEach((item) => {
          item.angle += item.speed * delta * speedMultiplier;
          // In the local coordinate frame of each shellGroup, the orbit is in the XY plane:
          const x = item.radius * Math.cos(item.angle);
          const y = item.radius * Math.sin(item.angle);
          item.mesh.position.set(x, y, 0);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Window resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || 400;
      const h = typeof height === 'number' ? height : container.clientHeight || 440;
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
  }, [element, modelType, showNucleons, viewAngle]);

  // Construct atom geometry
  function buildAtomGeometry(
    atomGroup: THREE.Group,
    labelsGroup: THREE.Group,
    el: ChemicalElement,
    info: ReturnType<typeof getAtomicStructure>,
    type: 'bohr' | 'quantum',
    renderNucleons: boolean
  ) {
    // Clear old meshes
    while (atomGroup.children.length > 0) {
      const child = atomGroup.children[0];
      atomGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    }
    while (labelsGroup.children.length > 0) {
      labelsGroup.remove(labelsGroup.children[0]);
    }
    activeElectronsRef.current = [];

    // ==========================================
    // A. NUCLEUS (Protons & Neutrons)
    // ==========================================
    const nucleusGroup = new THREE.Group();
    atomGroup.add(nucleusGroup);

    const protonCount = info.protons;
    const neutronCount = info.neutrons;
    const totalNucleons = protonCount + neutronCount;

    // Proportional physical scale for nucleus
    const nucleusRadius = Math.min(1.5, 0.5 + Math.cbrt(totalNucleons) * 0.17);

    // Glowing core mesh (dense central energy)
    const coreGeo = new THREE.SphereGeometry(nucleusRadius * 0.88, 28, 28);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    nucleusGroup.add(coreMesh);

    // Translucent Strong Nuclear Force Confinement Cage (Fuerza Nuclear Fuerte)
    const cageGeo = new THREE.IcosahedronGeometry(nucleusRadius * 1.16, 2);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    nucleusGroup.add(cageMesh);

    // Render individual nucleons (Protons = Ruby Red, Neutrons = Cyan/Ice Blue)
    if (renderNucleons) {
      const displayCount = Math.min(totalNucleons, 64);
      const subRadius = Math.max(0.09, 0.22 - displayCount * 0.002);
      const subGeo = new THREE.SphereGeometry(subRadius, 14, 14);

      const protonMat = new THREE.MeshStandardMaterial({
        color: 0xf87171,
        emissive: 0xef4444,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });

      const neutronMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.45,
        roughness: 0.25,
      });

      // Golden ratio Fibonacci sphere packing
      const phiRatio = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < displayCount; i++) {
        const y = 1 - (i / (displayCount - 1 || 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phiRatio * i;
        const r = nucleusRadius * (0.55 + Math.random() * 0.38);

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        const isProton = i % 2 === 0;
        const nucleonMesh = new THREE.Mesh(subGeo, isProton ? protonMat : neutronMat);
        nucleonMesh.position.set(x * r, y * r, z * r);
        nucleusGroup.add(nucleonMesh);
      }
    }

    // 3D Billboard Label for Nucleus
    const nucleusSprite = createTextSprite(
      `Núcleo: ${protonCount}p⁺ | ${neutronCount}n⁰`,
      `Masa A = ${info.massNumber} (${el.symbol})`,
      'nucleus'
    );
    nucleusSprite.position.set(0, nucleusRadius + 1.2, 0);
    labelsGroup.add(nucleusSprite);

    // ==========================================
    // B. ELECTRON SHELLS (BOHR MODEL)
    // ==========================================
    if (type === 'bohr') {
      const baseRadius = nucleusRadius + 1.25;
      const shellSpacing = 1.2;
      const totalShells = info.shellDistribution.length;

      info.shellDistribution.forEach((eCountInShell, shellIdx) => {
        const radius = baseRadius + shellIdx * shellSpacing;
        const isValenceShell = shellIdx === totalShells - 1;
        const shellLetter = ['K (n=1)', 'L (n=2)', 'M (n=3)', 'N (n=4)', 'O (n=5)', 'P (n=6)', 'Q (n=7)'][shellIdx] || `Capa ${shellIdx + 1}`;

        // Create a dedicated shell group tilted in 3D for dynamic depth
        const shellGroup = new THREE.Group();
        // Give each shell a gentle tilt so they don't block each other
        const tiltX = (shellIdx * 0.16);
        const tiltY = (shellIdx * 0.28);
        shellGroup.rotation.x = tiltX;
        shellGroup.rotation.y = tiltY;
        atomGroup.add(shellGroup);

        // 1. Sleek Torus Orbit Ring
        const ringGeo = new THREE.TorusGeometry(radius, isValenceShell ? 0.038 : 0.022, 16, 100);
        const ringMat = new THREE.MeshStandardMaterial({
          color: isValenceShell ? 0x10b981 : 0x38bdf8,
          emissive: isValenceShell ? 0x059669 : 0x0284c7,
          emissiveIntensity: isValenceShell ? 1.0 : 0.45,
          transparent: true,
          opacity: isValenceShell ? 0.85 : 0.4,
          roughness: 0.2,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        shellGroup.add(ringMesh);

        // 2. 3D Billboard Label for this shell level
        const shellLabelSprite = createTextSprite(
          isValenceShell ? `Capa de Valencia (${shellLetter})` : `Capa ${shellLetter}`,
          `${eCountInShell} electron${eCountInShell > 1 ? 'es' : ''} (e⁻)`,
          isValenceShell ? 'valence' : 'shell'
        );
        // Position at outer perimeter
        shellLabelSprite.position.set(radius + 0.6, 0.4, 0);
        shellLabelSprite.scale.set(2.8, 0.7, 1);
        shellGroup.add(shellLabelSprite);

        // 3. Orbiting Electron Spheres (Pulsing and perfectly on the ring!)
        const electronGeo = new THREE.SphereGeometry(isValenceShell ? 0.16 : 0.12, 16, 16);
        const electronMat = new THREE.MeshStandardMaterial({
          color: isValenceShell ? 0x34d399 : 0x38bdf8,
          emissive: isValenceShell ? 0x10b981 : 0x0284c7,
          emissiveIntensity: isValenceShell ? 1.2 : 0.8,
          roughness: 0.15,
          metalness: 0.4,
        });

        // Add soft halo corona to valence electrons for instant visual distinction
        for (let i = 0; i < eCountInShell; i++) {
          const angle = (i / eCountInShell) * Math.PI * 2;
          const eMesh = new THREE.Mesh(electronGeo, electronMat);

          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          eMesh.position.set(x, y, 0);
          shellGroup.add(eMesh);

          activeElectronsRef.current.push({
            mesh: eMesh,
            radius,
            angle,
            speed: (2.0 / Math.sqrt(radius)) * (i % 2 === 0 ? 1 : 1.08),
            parentGroup: shellGroup,
          });
        }
      });
    }

    // ==========================================
    // C. QUANTUM MECHANICAL MODEL (ORBITALS)
    // ==========================================
    if (type === 'quantum') {
      // 1. Spherical 1s orbital cloud
      const s1Geo = new THREE.SphereGeometry(nucleusRadius + 1.2, 32, 32);
      const s1Mat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.25,
        transparent: true,
        opacity: 0.22,
        roughness: 0.6,
      });
      atomGroup.add(new THREE.Mesh(s1Geo, s1Mat));

      // 2. 2s concentric nodal spherical shell if period >= 2
      if (el.period >= 2) {
        const s2Geo = new THREE.SphereGeometry(nucleusRadius + 2.4, 32, 32);
        const s2Mat = new THREE.MeshStandardMaterial({
          color: 0x0ea5e9,
          emissive: 0x0369a1,
          emissiveIntensity: 0.2,
          transparent: true,
          opacity: 0.15,
          wireframe: true,
        });
        atomGroup.add(new THREE.Mesh(s2Geo, s2Mat));
      }

      // 3. 2p Dumbbell / Peanut Lobes (px, py, pz) for Boron (Z=5) and higher
      if (el.number >= 5) {
        const createLobe = (axis: 'x' | 'y' | 'z', dir: 1 | -1, col: number, emissiveCol: number) => {
          // Teardrop / dumbbell geometry
          const lobeGeo = new THREE.SphereGeometry(1.25, 24, 24);
          lobeGeo.scale(0.75, 1.45, 0.75);

          const lobeMat = new THREE.MeshStandardMaterial({
            color: col,
            emissive: emissiveCol,
            emissiveIntensity: 0.45,
            transparent: true,
            opacity: 0.32,
            roughness: 0.35,
          });
          const lobeMesh = new THREE.Mesh(lobeGeo, lobeMat);
          const dist = nucleusRadius + 1.8;

          if (axis === 'x') {
            lobeMesh.position.set(dist * dir, 0, 0);
            lobeMesh.rotation.z = Math.PI / 2;
          } else if (axis === 'y') {
            lobeMesh.position.set(0, dist * dir, 0);
          } else {
            lobeMesh.position.set(0, 0, dist * dir);
            lobeMesh.rotation.x = Math.PI / 2;
          }
          atomGroup.add(lobeMesh);
        };

        // Standard textbook phase coloring (+ lobe cyan, - lobe orange)
        createLobe('x', 1, 0x10b981, 0x059669); // +px (Emerald)
        createLobe('x', -1, 0x059669, 0x047857); // -px
        createLobe('y', 1, 0x38bdf8, 0x0284c7); // +py (Cyan)
        createLobe('y', -1, 0xf59e0b, 0xd97706); // -py (Amber)
        createLobe('z', 1, 0xa855f7, 0x7e22ce); // +pz (Purple)
        createLobe('z', -1, 0xec4899, 0xbe185d); // -pz (Pink)
      }

      // 4. 3d Cloverleaf Lobes for Transition Metals (Z >= 21)
      if (el.number >= 21) {
        const cloverGroup = new THREE.Group();
        const dGeo = new THREE.SphereGeometry(1.1, 20, 20);
        dGeo.scale(0.6, 1.5, 0.6);
        const dMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xb45309,
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.35,
        });

        // 4 diagonal lobes for d_xy
        const dDist = nucleusRadius + 2.8;
        const angles = [Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4];
        angles.forEach((ang) => {
          const mesh = new THREE.Mesh(dGeo, dMat);
          mesh.position.set(Math.cos(ang) * dDist, Math.sin(ang) * dDist, 0);
          mesh.rotation.z = ang - Math.PI / 2;
          cloverGroup.add(mesh);
        });
        atomGroup.add(cloverGroup);
      }

      // 5. Realistic Schrödinger Electron Probability Point Cloud (|Ψ|²)
      const particleCount = Math.min(450, el.number * 10 + 100);
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        // Exponential radial distribution for probability density
        const r = nucleusRadius + 0.9 + Math.pow(Math.random(), 1.6) * 4.2;
        const sinPhi = Math.sin(phi);

        posArray[i * 3] = r * sinPhi * Math.cos(theta);
        posArray[i * 3 + 1] = r * sinPhi * Math.sin(theta);
        posArray[i * 3 + 2] = r * Math.cos(phi);
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x67e8f9,
        transparent: true,
        opacity: 0.65,
      });
      atomGroup.add(new THREE.Points(particleGeo, particleMat));

      // Quantum Model 3D Billboard
      const quantumSprite = createTextSprite(
        'Modelo Cuántico de Schrödinger',
        'Densidad de probabilidad |Ψ|² • Orbitales s, p, d',
        'quantum'
      );
      quantumSprite.position.set(0, nucleusRadius + 3.8, 0);
      labelsGroup.add(quantumSprite);
    }
  }

  // Camera Zoom Controls
  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const delta = direction === 'in' ? -2.5 : 2.5;
    cameraRef.current.position.z = Math.max(6, Math.min(32, cameraRef.current.position.z + delta));
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !atomGroupRef.current) return;
    cameraRef.current.position.set(0, 5, 17);
    cameraRef.current.lookAt(0, 0, 0);
    atomGroupRef.current.rotation.set(0, 0, 0);
    setViewAngle('free');
  };

  // Quick Angle Presets: Top-down (textbook electron counting) vs Isometric vs Front
  const handleSetViewAngle = (angle: 'free' | 'top' | 'front') => {
    setViewAngle(angle);
    if (!cameraRef.current || !atomGroupRef.current) return;

    if (angle === 'top') {
      // Top-down view looking straight down along Y axis
      cameraRef.current.position.set(0, 20, 0.01);
      cameraRef.current.lookAt(0, 0, 0);
      atomGroupRef.current.rotation.set(-Math.PI / 2, 0, 0);
    } else if (angle === 'front') {
      cameraRef.current.position.set(0, 0, 18);
      cameraRef.current.lookAt(0, 0, 0);
      atomGroupRef.current.rotation.set(0, 0, 0);
    } else {
      cameraRef.current.position.set(0, 5, 17);
      cameraRef.current.lookAt(0, 0, 0);
      atomGroupRef.current.rotation.set(0.15, 0.25, 0);
    }
  };

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
              title="Vista Cenital 2D (Ideal para contar electrones por capa como en libros de texto)"
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
              title="Modelo Cuántico (Orbitales y nubes de probabilidad de Schrödinger)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Orbitales</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full relative cursor-grab active:cursor-grabbing select-none"
      />

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

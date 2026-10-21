import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const MOLAR_URL = '/models/molar.glb';

// Resting pose: a three-quarter view revealing the mesial/buccal faces and the occlusal table.
const REST = { yaw: 0.6, pitch: 0.13, roll: 0.04 };
const POINTER_RANGE = { yaw: 0.2, pitch: 0.09 };

export function floatOffset(t) {
  return Math.sin(t * 0.55) * 0.045 + Math.sin(t * 0.21 + 1.3) * 0.02;
}

function createEnamelMaterial() {
  const material = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    vertexColors: true,
    roughness: 0.32,
    metalness: 0,
    // porcelain glaze: a clear, slightly soft coat gives broad, controlled highlights
    clearcoat: 0.9,
    clearcoatRoughness: 0.14,
    specularIntensity: 0.6,
    specularColor: new THREE.Color('#ffffff'),
    ior: 1.55,
    envMapIntensity: 1.1,
  });
  // Subtle translucency: thin enamel lets a little light through at grazing angles.
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
      float enamelRim = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 2.6);
      totalEmissiveRadiance += vec3(0.94, 0.97, 1.0) * enamelRim * 0.07;`,
    );
  };
  return material;
}

/**
 * The single hero molar. All continuous motion is applied here, from refs, inside the
 * R3F frame loop. GSAP only tweens plain numbers on `motion` (reveal / scroll).
 */
export default function ToothModel({ motion, still = false, interactive = false, onReady }) {
  const { scene } = useGLTF(MOLAR_URL);
  const outer = useRef();
  const inner = useRef();
  const pointer = useRef({ yaw: 0, pitch: 0 });

  const { model, material } = useMemo(() => {
    const material = createEnamelMaterial();
    const model = scene.clone(true);
    model.traverse((o) => {
      if (o.isMesh) o.material = material;
    });
    // centre the anatomy on its own bounding box so rotations pivot on the tooth itself
    const centre = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
    model.position.sub(centre);
    return { model, material };
  }, [scene]);

  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useFrame((state, delta) => {
    const g = outer.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const r = motion.reveal;
    const s = motion.scroll;
    const dt = Math.min(delta, 1 / 20);

    const follow = interactive && !still;
    const p = pointer.current;
    p.yaw = THREE.MathUtils.damp(p.yaw, follow ? motion.pointerX * POINTER_RANGE.yaw : 0, 2.2, dt);
    p.pitch = THREE.MathUtils.damp(p.pitch, follow ? motion.pointerY * POINTER_RANGE.pitch : 0, 2.2, dt);

    const alive = still ? 0 : 1;
    const float = alive * floatOffset(t);
    const drift = alive * (Math.sin(t * 0.16) * 0.11 + Math.sin(t * 0.07 + 2.0) * 0.05);
    const sway = alive * Math.sin(t * 0.23 + 0.6) * 0.025;

    const enter = 1 - r; // 1 → 0 during the entrance
    g.position.set(-0.08 * enter + s * 0.18, -0.32 * enter + float + s * 0.55, 0);
    g.scale.setScalar((0.84 + 0.16 * r) * (1 - 0.09 * s));

    inner.current.rotation.set(
      REST.pitch + sway + p.pitch - 0.06 * enter - s * 0.12,
      REST.yaw + drift + p.yaw - 0.55 * enter + s * 0.22,
      REST.roll + sway * 0.6 + 0.04 * enter,
      'YXZ',
    );
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={model} />
      </group>
    </group>
  );
}

useGLTF.preload(MOLAR_URL);

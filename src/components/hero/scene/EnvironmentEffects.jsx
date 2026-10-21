import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { floatOffset } from './ToothModel.jsx';

function makeShadowTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(52,92,122,0.6)');
  g.addColorStop(0.35, 'rgba(52,92,122,0.3)');
  g.addColorStop(0.7, 'rgba(52,92,122,0.08)');
  g.addColorStop(1, 'rgba(52,92,122,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Soft contact shadow for a suspended object: two stacked blurred discs (core + penumbra)
 * that widen and lighten as the tooth floats up. Far cheaper than a per-frame shadow pass.
 */
export default function EnvironmentEffects({ motion, floorY = -1.3, still = false }) {
  const texture = useMemo(makeShadowTexture, []);
  const core = useRef();
  const penumbra = useRef();
  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ clock }) => {
    const lift = still ? 0 : floatOffset(clock.elapsedTime) / 0.065; // ≈ -1..1
    // gone before the hero's bottom edge could clip it during the scroll hand-off
    const fade = motion.reveal * THREE.MathUtils.clamp(1 - motion.scroll * 2.4, 0, 1);
    core.current.material.opacity = 0.3 * fade * (1 - lift * 0.18);
    core.current.scale.set(1.25 - lift * 0.08, 0.6, 1);
    penumbra.current.material.opacity = 0.18 * fade;
    penumbra.current.scale.set(2.6 + lift * 0.12, 1.3, 1);
  });

  return (
    <group position={[0.02, floorY, 0.05]} rotation-x={-Math.PI / 2}>
      <mesh ref={penumbra} renderOrder={-2}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} opacity={0} toneMapped={false} />
      </mesh>
      <mesh ref={core} renderOrder={-1} position={[0, 0, 0.001]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} opacity={0} toneMapped={false} />
      </mesh>
    </group>
  );
}

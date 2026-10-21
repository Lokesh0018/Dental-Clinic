import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import ToothModel from './ToothModel.jsx';
import StudioLighting from './StudioLighting.jsx';
import EnvironmentEffects from './EnvironmentEffects.jsx';
import CameraRig from './CameraRig.jsx';

/**
 * The WebGL layer of the hero. Lazy-loaded so the copy and CTAs never wait on three.js.
 * `active` pauses rendering when the hero is off-screen; `still` renders a motionless frame.
 */
export default function ToothScene({
  motion,
  active = true,
  still = false,
  interactive = false,
  lite = false,
  fill = 1,
  preserveDrawingBuffer = false,
  onReady,
}) {
  const frameloop = !active ? 'never' : still ? 'demand' : 'always';
  return (
    <Canvas
      className="hero-scene__canvas"
      frameloop={frameloop}
      dpr={lite ? [1, 1.5] : [1, 1.8]}
      camera={{ fov: 23, near: 0.1, far: 60, position: [0, 1, 9] }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.NeutralToneMapping,
        toneMappingExposure: 0.98,
        preserveDrawingBuffer,
      }}
      aria-hidden="true"
      tabIndex={-1}
    >
      <CameraRig fill={fill} />
      <StudioLighting still={still} lite={lite} />
      <Suspense fallback={null}>
        <ToothModel motion={motion} still={still} interactive={interactive} onReady={onReady} />
      </Suspense>
      <EnvironmentEffects motion={motion} still={still} />
    </Canvas>
  );
}

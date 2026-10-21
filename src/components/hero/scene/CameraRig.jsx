import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Long-lens product framing: computes the camera distance so the tooth (plus breathing room)
 * fits the canvas at any aspect ratio, from a slightly elevated angle.
 * `fill` < 1 leaves more negative space; > 1 frames tighter.
 */
export default function CameraRig({ fill = 1, elevation = 15, targetY = -0.12 }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fitH = 3.05 / fill; // tooth height + float + shadow + margin
    const fitW = 2.25 / fill;
    const dist = Math.max(fitH / 2 / tanHalf, fitW / 2 / (tanHalf * aspect));
    const el = THREE.MathUtils.degToRad(elevation);
    camera.position.set(0, targetY + Math.sin(el) * dist, Math.cos(el) * dist);
    camera.lookAt(0, targetY, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, fill, elevation, targetY, invalidate]);

  return null;
}

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';

/**
 * Bright product studio on a powder-blue sweep: a large key softbox upper-left, a broad
 * frontal fill, a rim strip behind and a blue floor bounce — baked once into a local
 * environment map (no network HDRI). The blue ambient gives recesses a cool gray-blue tone.
 */
export default function StudioLighting({ still = false, lite = false }) {
  const key = useRef();

  useFrame(({ clock }) => {
    if (still || !key.current) return;
    // almost imperceptible "breathing" of the key light
    key.current.intensity = 2.5 + Math.sin(clock.elapsedTime * 0.31) * 0.07;
  });

  return (
    <>
      <Environment frames={1} resolution={lite ? 128 : 256}>
        <color attach="background" args={['#a9bccb']} />
        {/* key softbox, upper left */}
        <Lightformer form="rect" intensity={5} color="#ffffff" position={[-5.5, 4.5, 3]} scale={[6, 4.5, 1]} target={[0, 0, 0]} />
        {/* broad frontal fill */}
        <Lightformer form="rect" intensity={0.7} color="#f3f8fc" position={[0.5, 0.5, 7]} scale={[9, 5, 1]} target={[0, 0, 0]} />
        {/* overhead strip for long crown highlights */}
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 6, 0.5]} rotation-x={Math.PI / 2} scale={[8, 1.4, 1]} />
        {/* rim */}
        <Lightformer form="rect" intensity={2.6} color="#ffffff" position={[3, 2.5, -6]} scale={[6, 3, 1]} target={[0, 0, 0]} />
        {/* powder-blue floor bounce */}
        <Lightformer form="rect" intensity={0.45} color="#b9d6e6" position={[0, -5, 1]} rotation-x={-Math.PI / 2} scale={[12, 12, 1]} />
      </Environment>

      <hemisphereLight args={['#ffffff', '#9fc0d4', 0.22]} />
      <directionalLight ref={key} position={[-5, 5, 3]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[0.5, 0.8, 5]} intensity={0.2} color="#eef6fb" />
      {!lite && <directionalLight position={[2, 3, -5]} intensity={1.2} color="#ffffff" />}
    </>
  );
}

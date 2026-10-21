// Dev-only: renders the hero scene motionless at its final pose so a matching
// still (public/images/molar-still.webp) can be exported. Not part of the build.
import { createRoot } from 'react-dom/client';
import ToothScene from '../src/components/hero/scene/ToothScene.jsx';

const motion = { reveal: 1, scroll: 0, pointerX: 0, pointerY: 0 };
createRoot(document.getElementById('root')).render(
  <ToothScene
    motion={motion}
    still
    preserveDrawingBuffer
    onReady={() => setTimeout(() => (window.__sceneReady = true), 800)}
  />,
);

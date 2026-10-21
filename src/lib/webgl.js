let cached;

/** True when the browser can create a WebGL context (checked once). */
export function hasWebGL() {
  if (cached !== undefined) return cached;
  try {
    if (new URLSearchParams(window.location.search).has('nowebgl')) return (cached = false);
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    cached = Boolean(gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

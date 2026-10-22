import { BRAND } from './brand.js';

/**
 * Where the map points. Google's free embed only renders when the query
 * geocodes, and a bare clinic name usually does not, so the order is:
 * exact embed URL → coordinates → street address → nothing (placeholder shown).
 */
export function getMapTarget() {
  const { contact } = BRAND;
  const m = contact.map ?? {};
  const hasCoords = Number.isFinite(m.lat) && Number.isFinite(m.lng);
  const query = hasCoords ? `${m.lat},${m.lng}` : contact.address || null;
  const label = contact.address || BRAND.name;

  if (m.embedUrl) {
    return { src: m.embedUrl, directions: directionsFor(query || label), label };
  }
  if (!query) return { src: null, directions: directionsFor(label), label };
  return {
    src: `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${m.zoom ?? 16}&output=embed`,
    directions: directionsFor(query),
    label,
  };
}

const directionsFor = (dest) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;

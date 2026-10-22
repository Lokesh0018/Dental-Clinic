/**
 * Shared SVG primitives. Icons are 24×24 Lucide geometry (ISC licence) drawn
 * with 2px strokes; sections spread `iconProps` and override size as needed.
 */
export const iconProps = {
  viewBox: '0 0 24 24',
  width: 24,
  height: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

/** Tick used in every "what's included" / trust list. */
export function CheckIcon({ size = 14, strokeWidth = 3 }) {
  return (
    <svg {...iconProps} width={size} height={size} strokeWidth={strokeWidth}>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

export function CloseIcon({ size = 20 }) {
  return (
    <svg {...iconProps} width={size} height={size} strokeLinejoin="miter">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

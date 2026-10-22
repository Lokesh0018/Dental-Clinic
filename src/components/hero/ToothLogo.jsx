/** Molar silhouette path, shared with the footer backdrop. */
export const TOOTH_PATH =
  'M8.2 2.6C4.4 2.6 1.5 5.7 1.5 10.4c0 3.6 1.4 6.4 2.4 9.6.9 2.9 1.3 6.4 2 9.6.6 2.7 1.6 4.4 3.1 4.4 1.7 0 2.3-2 2.8-4.6.6-3.2 1.3-6.6 4.2-6.6s3.6 3.4 4.2 6.6c.5 2.6 1.1 4.6 2.8 4.6 1.5 0 2.5-1.7 3.1-4.4.7-3.2 1.1-6.7 2-9.6 1-3.2 2.4-6 2.4-9.6 0-4.7-2.9-7.8-6.7-7.8-2.9 0-4.3 1.6-7.8 1.6S11.1 2.6 8.2 2.6z';

/** Solid molar silhouette used as the logo mark. */
export default function ToothLogo(props) {
  return (
    <svg viewBox="0 0 32 36" aria-hidden="true" focusable="false" {...props}>
      <path fill="currentColor" d={TOOTH_PATH} />
    </svg>
  );
}

import { useId } from 'react';
import { BRAND, bookingLinkProps } from '../../config/brand.js';
import ArrowIcon from './ArrowIcon.jsx';

/** Lime circular badge: the booking label runs around a slowly spinning ring. */
export default function ConsultBadge() {
  const pathId = useId();
  const ring = `${BRAND.booking.label.toUpperCase()} • `;
  return (
    // the wrapper carries the entrance tween; the link keeps its own hover transform
    <div className="consult-wrap" data-hero="consult">
      <a className="consult" href={BRAND.booking.href} {...bookingLinkProps}>
        <span className="visually-hidden">{BRAND.booking.label}</span>
        <svg className="consult__ring" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
          <defs>
            <path id={pathId} d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" />
          </defs>
          <text>
            <textPath href={`#${pathId}`} textLength="282" lengthAdjust="spacing">
              {ring}
            </textPath>
          </text>
        </svg>
        <ArrowIcon className="consult__arrow" />
      </a>
    </div>
  );
}

import { useState } from 'react';
import { BRAND } from '../../config/brand.js';

const { patient } = BRAND.hero;
const { stat } = BRAND.proof;

// "98%" → 0.98 for the meter; anything that isn't a percentage gets no meter
const percent = /^\s*(\d+(?:\.\d+)?)\s*%\s*$/.exec(stat?.value ?? '');
const meter = percent ? Math.min(1, Number(percent[1]) / 100) : null;

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PatientProof() {
  const [hasPhoto, setHasPhoto] = useState(Boolean(patient?.src));
  if (!stat && !hasPhoto) return null;

  return (
    <div className="proof" data-has-photo={hasPhoto}>
      {stat && (
        <div className="proof__card" data-hero="stat">
          <p className="proof__text">
            <span className="proof__head">
              <span className="proof__icon">
                <HeartIcon />
              </span>
              <strong className="proof__value">
                {/* the visible number counts up; screen readers get the final value only */}
                <span aria-hidden="true" data-count>
                  {stat.value}
                </span>
                <span className="visually-hidden proof__sr">{stat.value}</span>
              </strong>
            </span>
            <span className="proof__label">{stat.label}</span>
          </p>
          {meter !== null && (
            <span className="proof__meter" aria-hidden="true">
              <span className="proof__meter-fill" data-hero="meter" style={{ '--value': meter }} />
            </span>
          )}
        </div>
      )}
      {hasPhoto && (
        <img
          className="proof__photo"
          data-hero="patient"
          src={patient.src}
          alt={patient.alt}
          width="600"
          height="800"
          decoding="async"
          onError={() => setHasPhoto(false)}
        />
      )}
    </div>
  );
}

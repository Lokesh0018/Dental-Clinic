import { useState } from 'react';
import { BRAND } from '../../config/brand.js';

const { patient } = BRAND.hero;
const { stat } = BRAND.proof;

/** Wavy-edged white card behind the stat, drawn so it scales without distortion of the curves. */
function WavyCard() {
  return (
    <svg className="proof__shape" viewBox="0 0 200 180" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M24 8C60 2 92 14 120 10s56-8 66 6c10 15 4 40 6 66s10 52 0 70c-10 17-40 18-70 14s-52 10-86 6C14 170 6 150 8 124s-8-48-4-76S0 12 24 8z"
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
          <WavyCard />
          <p className="proof__text">
            <strong className="proof__value">
              <span aria-hidden="true" data-count>
                {stat.value}
              </span>
              <span className="visually-hidden">{stat.value}</span>
            </strong>
            <span className="proof__label">{stat.label}</span>
          </p>
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

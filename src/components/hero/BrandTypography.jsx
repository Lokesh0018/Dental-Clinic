import { BRAND } from '../../config/brand.js';

export default function BrandTypography() {
  return (
    <h1 id="hero-title" className="brand-type">
      <span className="brand-type__mark" data-hero="wordmark">
        {BRAND.wordmark}
      </span>{' '}
      <span className="brand-type__sub" data-hero="subtitle">
        {BRAND.subtitle}
      </span>
    </h1>
  );
}

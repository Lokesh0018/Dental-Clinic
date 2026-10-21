import { BRAND, bookingLinkProps } from '../../config/brand.js';
import ArrowIcon from './ArrowIcon.jsx';

const { hero, proof } = BRAND;

/** Splits "plain **bright** plain" into spans; the bright parts render in full white. */
function renderIntro(text) {
  return text.split('**').map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

function AvatarStack() {
  if (!proof.avatars?.length && !proof.count) return null;
  return (
    <span className="avatars" data-hero="avatars" role="img" aria-label={proof.countLabel ?? 'Our patients'}>
      {proof.avatars?.map((a, i) => (
        <img key={a.src} className="avatars__face" src={a.src} alt="" width="64" height="64" loading="eager" style={{ zIndex: i }} />
      ))}
      {proof.count && (
        <span className="avatars__count" aria-hidden="true">
          {proof.count}
        </span>
      )}
    </span>
  );
}

export default function HeroCopy() {
  const last = hero.headline.length - 1;
  return (
    <div className="hero-copy">
      <h1 id="hero-title" className="hero-copy__title">
        {hero.headline.map((line, i) => (
          <span key={line} className="hero-copy__line">
            <span className="hero-copy__line-inner" data-hero="line">
              {line}
              {i === last && <AvatarStack />}
            </span>
          </span>
        ))}
      </h1>
      <p className="hero-copy__intro" data-hero="intro">
        {renderIntro(hero.intro)}
      </p>
      <div className="hero-copy__actions" data-hero="actions">
        <a className="btn btn--primary" href={BRAND.booking.href} {...bookingLinkProps}>
          {BRAND.booking.label}
          <ArrowIcon />
        </a>
        <a className="btn btn--ghost" href={hero.secondary.href}>
          {hero.secondary.label}
        </a>
      </div>
    </div>
  );
}

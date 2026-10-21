import { BRAND } from '../../config/brand.js';
import ScrollIndicator from './ScrollIndicator.jsx';

// Outer element fades on scroll; inner element carries the entrance animation —
// separate nodes so the two tweens never fight over the same opacity.
export default function SmileTagline() {
  return (
    <div className="smile">
      <div className="smile__inner" data-hero="tagline">
        <p className="smile__text">{BRAND.tagline}</p>
        <ScrollIndicator />
      </div>
    </div>
  );
}

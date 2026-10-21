import { BRAND } from '../../config/brand.js';

export default function AboutSection() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="section__inner about__inner">
        <p className="section__eyebrow">About</p>
        <h2 id="about-title" className="section__title">
          Modern dentistry, delivered with a gentle touch.
        </h2>
        <p className="section__lede">
          At {BRAND.name}, every visit begins with listening. We explain what we see, outline your options clearly, and move at a
          pace that feels comfortable — so you leave with a healthier, brighter smile and complete confidence in your care.
        </p>
      </div>
    </section>
  );
}

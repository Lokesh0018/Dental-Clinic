const SERVICES = [
  {
    title: 'Preventive care',
    body: 'Thorough examinations and gentle hygiene visits that keep small concerns from becoming larger ones.',
  },
  {
    title: 'Restorative dentistry',
    body: 'Fillings, crowns and bridges planned with precision and finished to blend naturally with your smile.',
  },
  {
    title: 'Cosmetic dentistry',
    body: 'Whitening and smile design guided by proportion and restraint, so results look like you — only brighter.',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <div className="section__inner">
        <p className="section__eyebrow">Services</p>
        <h2 id="services-title" className="section__title">
          Care for every smile.
        </h2>
        <ul className="services__grid">
          {SERVICES.map((s, i) => (
            <li key={s.title} className="services__card">
              <span className="services__index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

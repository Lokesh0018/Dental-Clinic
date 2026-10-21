import { BRAND, bookingLinkProps } from '../../config/brand.js';

export default function ContactSection() {
  const { contact, booking } = BRAND;
  const details = [
    contact.phone && { label: 'Telephone', value: contact.phone, href: `tel:${contact.phone.replace(/[^+\d]/g, '')}` },
    contact.email && { label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    contact.address && { label: 'Address', value: contact.address },
    contact.hours && { label: 'Hours', value: contact.hours },
  ].filter(Boolean);

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="section__inner contact__inner">
        <div>
          <p className="section__eyebrow">Contact Us</p>
          <h2 id="contact-title" className="section__title">
            Book your visit.
          </h2>
          <p className="section__lede">Tell us a little about what you need and we will find a time that suits you.</p>
          {booking.external && (
            <a className="btn-outline btn-outline--dark" href={booking.href} {...bookingLinkProps}>
              {booking.label}
            </a>
          )}
        </div>

        {details.length > 0 && (
          <dl className="contact__details">
            {details.map((d) => (
              <div key={d.label}>
                <dt>{d.label}</dt>
                <dd>{d.href ? <a href={d.href}>{d.value}</a> : d.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

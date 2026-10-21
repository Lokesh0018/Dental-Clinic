/**
 * Single source of truth for the clinic's identity. Change it here and the
 * navigation, hero copy and booking links all follow.
 * Anything left as `null` is not rendered — nothing is invented.
 */
export const BRAND = {
  name: 'Crown Dental Group',
  shortName: 'CrownDental',

  nav: [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ],

  // White pill in the top-right corner of the hero card.
  navCta: { label: 'Contacts', href: '#contact' },

  booking: {
    label: 'Book your consultation',
    // Internal anchor or an external online-booking URL.
    href: '#contact',
    external: false,
  },

  hero: {
    // One entry per line of the headline; the avatar stack sits after the last line.
    headline: ['Restore', 'Your True', 'Smile'],
    // **double asterisks** mark the words rendered in bright white.
    intro: 'Using **advanced technology**, we deliver comprehensive treatments for a healthy, **confident smile.**',

    // Cut-out (transparent PNG/WebP) photo of a happy patient, bottom-left of the hero.
    // Hidden automatically until the file exists.
    patient: { src: '/images/patient.png', alt: 'A smiling patient celebrating with both fists raised' },
  },

  /*
   * Social proof shown in the hero. PLACEHOLDERS — replace with your real figures and
   * your own patients' photos (with consent), or set a field to null to hide it.
   */
  proof: {
    stat: { value: '98%', label: 'loyal dental patients' },
    avatars: [
      { src: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { src: 'https://randomuser.me/api/portraits/women/68.jpg' },
    ],
    count: '+2k',
    countLabel: 'more than 2,000 happy patients',
  },

  contact: {
    phone: null, // e.g. '+1 (555) 010-0199'
    email: null, // e.g. 'hello@crowndental.com'
    address: null, // e.g. '24 Harbour Street, Suite 3'
    hours: null, // e.g. 'Mon–Fri 8:00–18:00'
  },
};

export const bookingLinkProps = BRAND.booking.external ? { target: '_blank', rel: 'noopener' } : {};

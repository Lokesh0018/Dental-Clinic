/**
 * Single source of truth for the clinic's identity. Change it here and the
 * navigation, wordmark, page title text and booking links all follow.
 * Anything left as `null` is not rendered — nothing is invented.
 */
export const BRAND = {
  wordmark: 'CROWN',
  subtitle: 'DENTAL GROUP',
  name: 'Crown Dental Group',
  tagline: 'brighten your smile',

  nav: [
    { label: 'Home', href: '#top' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact Us', href: '#contact' },
  ],

  booking: {
    label: 'Book Online',
    // Internal anchor or an external online-booking URL.
    href: '#contact',
    external: false,
  },

  contact: {
    phone: null, // e.g. '+1 (555) 010-0199'
    email: null, // e.g. 'hello@crowndental.com'
    address: null, // e.g. '24 Harbour Street, Suite 3'
    hours: null, // e.g. 'Mon–Fri 8:00–18:00'
  },
};

export const bookingLinkProps = BRAND.booking.external ? { target: '_blank', rel: 'noopener' } : {};

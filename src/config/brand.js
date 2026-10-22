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
  navCta: { label: 'Book now', href: '#contact' },

  booking: {
    label: 'Book your consultation',
    shortLabel: 'Book now', // compact sticky nav
    // Internal anchor or an external online-booking URL.
    href: '#contact',
    external: false,
  },

  hero: {
    // One entry per line of the headline; the avatar stack sits after the last line.
    headline: ['Restore', 'Your True', 'Smile'],
    // **double asterisks** mark the words rendered in bright white.
    intro: 'Using **advanced technology**, we deliver comprehensive treatments for a healthy, **confident smile.**',
    // Ghost button beside the booking CTA.
    secondary: { label: 'Explore services', href: '#services' },

    // Hero animation: transparent cut-out frames in /public (made by tools/key-frames.py from
    // assets-src/frames_Fix), played as a seamless loop. `size` = full frame size (meta.json);
    // `sets` = the same frames at different widths, smallest first (tools/resize-frames.py).
    sequence: {
      start: 11,
      count: 61,
      pad: 6,
      ext: '.webp',
      fps: 24,
      size: [1274, 1040],
      sets: [
        { width: 760, path: '/frames_keyed_760/frame_' },
        { width: 1274, path: '/frames_keyed/frame_' },
      ],
    },
    sequenceLabel: 'Miniature dentists polishing and treating a giant tooth implant',

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
    // Where the booking form POSTs JSON (e.g. a Formspree/Basin URL). With no endpoint,
    // the form opens the visitor's mail client addressed to `email`; with neither it just confirms.
    formEndpoint: null,
    // Map beside the booking form. Google's free embed needs something it can geocode, so set
    // `lat`/`lng` (most reliable; right-click the clinic in Google Maps to copy them) or fill in
    // `address` above. `embedUrl` overrides both with an exact "Share → Embed a map" URL.
    // With none of these set, a placeholder panel is shown instead of an empty map.
    map: {
      lat: 17.815166,
      lng: 83.357618,
      zoom: 16,
      embedUrl: null,
    },
  },
};

// Footer social icons; any entry left null is not rendered.
BRAND.social = {
  instagram: null, // e.g. 'https://instagram.com/crowndental'
  facebook: null,
  youtube: null,
  whatsapp: null, // e.g. 'https://wa.me/15550100199'
};

export const bookingLinkProps = BRAND.booking.external ? { target: '_blank', rel: 'noopener' } : {};

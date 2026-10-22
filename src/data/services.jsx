/**
 * The five treatments: card copy, pop-up detail, data points, includes and the
 * before/after pair. Single source for the services grid, the contact form's
 * treatment select and the footer's Treatments column.
 */
import { iconProps } from '../components/icons.jsx';

import rootCanalBefore from '../assets/images/root-canal-before.webp';
import rootCanalAfter from '../assets/images/root-canal-after.webp';
import implantsBefore from '../assets/images/dental-implants-before.webp';
import implantsAfter from '../assets/images/dental-implants-after.webp';
import alignersBefore from '../assets/images/clear-aligners-before.webp';
import alignersAfter from '../assets/images/clear-aligners-after.webp';
import smileBefore from '../assets/images/smile-designing-before.webp';
import smileAfter from '../assets/images/smile-designing-after.webp';
import crownsBefore from '../assets/images/zirconia-crowns-before.webp';
import crownsAfter from '../assets/images/zirconia-crowns-after.webp';


/* a shared molar outline, so every tooth-based icon has the same silhouette */
const TOOTH =
  'M12 5.3c-1.6-1.5-4.1-2-6.1-1C3.4 5.6 2.9 8.8 3.9 11.3c1 2.8 2 6 2.5 9 .3 1.4 2 1.6 2.6.3L11 15.8c.4-.8 1.6-.8 2 0l2 4.8c.6 1.3 2.3 1.1 2.6-.3.5-3 1.5-6.2 2.5-9 1-2.5.5-5.7-2-7-2-1-4.5-.5-6.1 1z';

export const SERVICE_ICONS = {
  /* tooth with the canal traced down the centre */
  rootCanal: (
    <svg {...iconProps}>
      <path d={TOOTH} />
      <path d="M12 8.5v6" strokeDasharray="1.5 2" />
    </svg>
  ),
  /* crown on a threaded titanium post */
  implants: (
    <svg {...iconProps}>
      <path d="M8 3h8a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M10 8v10.5a2 2 0 0 0 4 0V8" />
      <path d="M10 11h4M10 14h4M10 17h4" />
    </svg>
  ),
  /* dental arch wrapped in a clear tray */
  aligners: (
    <svg {...iconProps}>
      <path d="M4 12V11a8 8 0 0 1 16 0v1" />
      <path d="M4 12c0 3.3 3.6 5 8 5s8-1.7 8-5" />
      <path d="M8.5 6.5V15M12 4.5V16M15.5 6.5V15" strokeOpacity="0.55" />
    </svg>
  ),
  /* tooth with a sparkle: design, not just repair */
  smile: (
    <svg {...iconProps}>
      <path d={TOOTH} />
      <path d="M18.5 2.5v4M16.5 4.5h4" />
    </svg>
  ),
  /* Lucide "crown" */
  crowns: (
    <svg {...iconProps}>
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </svg>
  ),
};

/* Every service carries the same shape so the pop-up stays identical:
   detail copy, four data points, the includes list, and a before/after pair. */
export const SERVICES = [
  {
    icon: 'rootCanal',
    title: 'Root Canal',
    body: 'Gentle, pain-free endodontic therapy designed to save and preserve your natural tooth while eliminating infection.',
    detail:
      'We remove the infected pulp, disinfect and seal the canals, then protect the tooth with a crown. Modern rotary instruments and digital length measurement make the visit quick and comfortable.',
    stats: [
      { label: 'Visits', value: '1–2' },
      { label: 'Chair time', value: '60–90 min' },
      { label: 'Success rate', value: '95%+' },
      { label: 'Recovery', value: '1–2 days' },
    ],
    includes: ['Single-visit options', 'Digital apex locator', 'Pain-free anaesthesia'],
    before: rootCanalBefore,
    after: rootCanalAfter,
  },
  {
    icon: 'implants',
    title: 'Dental Implants',
    body: 'Permanent titanium and zirconia tooth replacements that look, feel, and function just like natural teeth.',
    detail:
      'A biocompatible post is placed in the jaw and left to fuse with the bone, then topped with a custom crown. Guided planning from a 3D scan means a precise, minimally invasive placement.',
    stats: [
      { label: 'Success rate', value: '98%' },
      { label: 'Healing', value: '3–6 months' },
      { label: 'Lifespan', value: '25+ years' },
      { label: 'Material', value: 'Ti / Zirconia' },
    ],
    includes: ['Full-arch solutions', 'Computer-guided placement', 'Natural aesthetics'],
    before: implantsBefore,
    after: implantsAfter,
  },
  {
    icon: 'aligners',
    title: 'Clear Aligners',
    body: 'Discreet, comfortable transparent trays that straighten your teeth seamlessly without brackets or metal wires.',
    detail:
      'A digital scan maps every tooth and simulates the final result before you begin. A series of custom trays then moves your teeth in small, planned steps, swapped every one to two weeks.',
    stats: [
      { label: 'Treatment', value: '6–18 months' },
      { label: 'Daily wear', value: '22 hours' },
      { label: 'New tray', value: 'Every 1–2 wks' },
      { label: 'Check-ups', value: 'Every 6–8 wks' },
    ],
    includes: ['Custom 3D scan', 'Virtually invisible', 'Removable convenience'],
    before: alignersBefore,
    after: alignersAfter,
  },
  {
    icon: 'smile',
    title: 'Smile Designing',
    body: 'Bespoke aesthetic smile transformations combining proportions, facial symmetry, veneers, and whitening.',
    detail:
      'Digitally planned around your facial proportions using veneers, whitening, and contouring for a harmonious smile.',
    stats: [
      { label: 'Visits', value: '2–3' },
      { label: 'Thickness', value: '0.3–0.5 mm' },
      { label: 'Lifespan', value: '10–15 yrs' },
      { label: 'Preview', value: 'Digital 3D' },
    ],
    includes: ['Digital 3D simulation', 'Porcelain veneers', 'Enamel reshaping'],
    before: smileBefore,
    after: smileAfter,
  },
  {
    icon: 'crowns',
    title: 'Zirconia Crowns',
    body: 'Ultra-durable, lifelike biocompatible crowns that restore strength, function, and aesthetic perfection.',
    detail:
      'Milled from a single block of zirconia and shaded to match neighbouring teeth, these crowns are metal-free, gum-friendly, and strong enough for molars. CAD/CAM design gives a precise, comfortable fit.',
    stats: [
      { label: 'Visits', value: '2' },
      { label: 'Flexural strength', value: '1,200 MPa' },
      { label: 'Lifespan', value: '15+ years' },
      { label: 'Material', value: 'Metal-free' },
    ],
    includes: ['Metal-free biocompatibility', 'High fracture resistance', 'Precision CAD/CAM fit'],
    before: crownsBefore,
    after: crownsAfter,
  },
];

/** Titles only, for selects and link lists. */
export const SERVICE_TITLES = SERVICES.map((s) => s.title);

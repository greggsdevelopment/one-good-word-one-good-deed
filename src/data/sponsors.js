// Single source of truth for the sponsor roster.
// Used by the Hall of Fame page and the Sponsors nav dropdown.
// `pending: true` keeps a sponsor out of public lists until the partnership is official.

export const SPONSORS = [
  {
    name: 'Wristband Bros',
    to: '/wristband-bros',
    monogram: 'WB',
    category: 'Custom Wristbands',
    location: 'Metro Detroit',
    blurb:
      'Custom wristbands built to spread love and stop hate. Every band a student slides on after an assembly comes from here.',
    accent: '#e6b450',
  },
  {
    name: 'Goosehead Insurance',
    to: '/goosehead-insurance',
    monogram: 'GI',
    category: 'Insurance',
    location: 'Agent: Rebecca Frolka',
    blurb:
      'Comprehensive coverage from an agent who answered the call for this movement before she was ever asked twice.',
    accent: '#4f9cf9',
  },
  {
    name: 'Dog N Suds Pet Grooming',
    to: '/dog-n-suds',
    monogram: 'DS',
    category: 'Pet Grooming',
    location: 'Westland, MI',
    blurb:
      'Over two and a half decades of trusted grooming in Westland, carrying the same heart of service this movement runs on.',
    accent: '#5fc48a',
  },
  {
    name: 'T.D. Keleman Trucking',
    to: '/td-keleman-trucking',
    monogram: 'TK',
    category: 'Trucking & Logistics',
    location: 'Livonia, MI',
    blurb:
      'Showing up, doing the work, and never leaving someone behind. Same values we teach students, different road.',
    accent: '#e07a5f',
  },
  {
    name: 'AD Collectibles',
    to: '/subway-taylor',
    monogram: 'AD',
    category: 'Collectibles',
    location: 'Taylor, MI',
    blurb:
      'Ali built something out of pure hustle and heart, then turned around and put it behind these kids.',
    accent: '#b07de0',
  },
  {
    name: "Papa's Pizza & BBQ",
    to: '/papas-pizza',
    monogram: 'PP',
    category: 'Pizza & BBQ',
    location: 'Westland, MI',
    blurb:
      'A Westland staple open until midnight, 4.8 stars across more than 111 reviews, feeding families and night owls alike.',
    accent: '#e05a5a',
  },
  {
    name: "Plymouth's Auto Repair",
    to: '/plymouths-auto-repair',
    monogram: 'PA',
    category: 'Auto Repair',
    location: 'Plymouth, MI',
    blurb:
      'No upselling, no phantom repairs, no surprises. Sam runs the kind of shop that proves integrity still sells.',
    accent: '#7aa2e0',
  },
  {
    name: 'Fully Promoted',
    to: '/fully-promoted',
    monogram: 'FP',
    category: 'Promotional Products',
    location: 'Plymouth, MI',
    blurb:
      'Tom and Gina help this message travel further than the truck can drive, one shirt and one banner at a time.',
    accent: '#e6b450',
  },
  {
    name: 'Classic State Wayne Theater',
    to: '/classic-state-wayne',
    monogram: 'SW',
    category: 'Theater',
    location: '35310 Michigan Ave, Wayne, MI',
    blurb:
      'They opened the doors of a historic house to this community and asked for nothing back.',
    accent: '#d4a04c',
  },
  {
    name: 'Tree Fort Bikes',
    to: '/tree-fort-bikes',
    monogram: 'TF',
    category: 'Bike Shop',
    location: 'Ypsilanti, MI',
    blurb:
      'Skilled mechanics keeping Washtenaw County riders rolling, and neighbors showing up for neighbors.',
    accent: '#5fc48a',
  },
  {
    name: 'Live Rite Recovery',
    to: '/liv-rite-recovery',
    monogram: 'LR',
    category: 'Recovery Housing',
    location: 'Michigan',
    blurb:
      'Nine recovery homes giving people a structured place to take their first steps back.',
    accent: '#7fd1c4',
    pending: true, // not official yet, hidden from public lists
  },
];

export const PUBLIC_SPONSORS = SPONSORS.filter((s) => !s.pending);

/**
 * OGWOGD school program rate sheet, 2026 to 2027.
 *
 * This file is the single source of truth for program pricing. The public rate
 * sheet on /programs and the booking wizard's quote calculator both read from
 * here, so the number a principal sees on the pricing section and the number
 * the wizard quotes them can never disagree.
 *
 * All amounts are whole dollars.
 *
 * If a rate changes, change it here and nowhere else.
 */

/** Flat rate for the whole school assembly. Includes up to two back-to-back sessions. */
export const ASSEMBLY_PRICE = 1500;

/** Workshop rate for one or two grade levels, per grade level. */
export const WORKSHOP_RATE = 450;

/** Flat rate once three or more grade levels are booked in one visit. */
export const WORKSHOP_THREE_PLUS = 1200;

/** Each grade level beyond the third, on top of WORKSHOP_THREE_PLUS. */
export const WORKSHOP_ADDITIONAL = 300;

/** Student leadership program, one semester. */
export const LEADERSHIP_PRICE = 2400;

/** Staff professional development hour. */
export const STAFF_PD_PRICE = 750;

/** Evening family event. */
export const FAMILY_NIGHT_PRICE = 500;

/**
 * Price a workshop component by how many grade levels it runs for.
 *
 *   1 grade level   $450
 *   2 grade levels  $900
 *   3 grade levels  $1,200
 *   4 grade levels  $1,500
 *   5 grade levels  $1,800
 *   6 grade levels  $2,100
 *
 * The more of a building we cover in one visit, the less each additional grade
 * level costs.
 */
export function workshopPrice(gradeLevels) {
  const n = Math.max(0, Math.trunc(Number(gradeLevels) || 0));
  if (n === 0) return 0;
  if (n <= 2) return n * WORKSHOP_RATE;
  return WORKSHOP_THREE_PLUS + (n - 3) * WORKSHOP_ADDITIONAL;
}

/** Packages, priced as a single line item. */
export const PACKAGES = {
  starter: {
    key: 'starter',
    name: 'Starter',
    price: 3200,
    description: 'A full semester of work in one line item.',
    features: [
      'Whole school assembly',
      'One workshop round for up to three grade levels',
      'Staff professional development hour',
      'Pre and post student survey with summary report',
    ],
  },
  full_year: {
    key: 'full_year',
    name: 'Full Year',
    price: 6500,
    highlight: true,
    badge: 'Saves $1,050',
    description:
      'All five steps across up to three grade levels, including the student leader program and family night.',
    features: [
      'Whole school assembly',
      'The 10 Second Lab, up to three grade levels',
      'Group Chat Check, up to three grade levels',
      'Student Ambassadors or Student Leaders, one semester',
      'Staff professional development hour',
      'Family Night',
      'Pre and post student survey with summary report',
    ],
  },
};

/**
 * Grade bands. The same five steps run in every band, but they are named and
 * pitched differently, so the wizard shows a principal the language their own
 * building would actually hear.
 */
export const GRADE_BANDS = {
  elementary: {
    key: 'elementary',
    label: 'Elementary',
    grades: 'Grades K to 5',
    components: {
      assembly: {
        name: 'The Assembly: "One Good Word"',
        meta: '45 minutes, whole school',
        price: ASSEMBLY_PRICE,
      },
      workshop_one: {
        name: 'The Playground Lab',
        meta: '30 minutes, one grade level at a time',
        tiered: true,
      },
      workshop_two: {
        name: 'Words Stick',
        meta: '30 minutes, one grade level at a time',
        note: 'Grades K to 3 run Words Stick. Grades 4 and 5 run Group Chat Check instead, at the same rate.',
        tiered: true,
      },
      leadership: {
        name: 'The Kindness Crew',
        meta: 'One semester, 15 to 20 students',
        price: LEADERSHIP_PRICE,
      },
      staff_pd: {
        name: 'Staff Professional Development',
        meta: '60 minutes, can run on an existing PD day',
        price: STAFF_PD_PRICE,
      },
      family_night: {
        name: 'Family Night',
        meta: '60 minute evening event',
        price: FAMILY_NIGHT_PRICE,
      },
    },
  },
  middle: {
    key: 'middle',
    label: 'Middle School',
    grades: 'Grades 6 to 8',
    components: {
      assembly: {
        name: 'The Assembly: "One Good Word"',
        meta: '45 minutes, whole school',
        price: ASSEMBLY_PRICE,
      },
      workshop_one: {
        name: 'The 10 Second Lab',
        meta: '45 minutes, one grade level at a time',
        tiered: true,
      },
      workshop_two: {
        name: 'Group Chat Check',
        meta: '45 minutes, one grade level at a time',
        tiered: true,
      },
      leadership: {
        name: 'Student Ambassadors',
        meta: 'One semester, 15 to 20 students',
        price: LEADERSHIP_PRICE,
      },
      staff_pd: {
        name: 'Staff Professional Development',
        meta: '60 minutes, can run on an existing PD day',
        price: STAFF_PD_PRICE,
      },
      family_night: {
        name: 'Family Night',
        meta: '60 minute evening event',
        price: FAMILY_NIGHT_PRICE,
      },
    },
  },
  high: {
    key: 'high',
    label: 'High School',
    grades: 'Grades 9 to 12',
    components: {
      assembly: {
        name: 'The Assembly: "One Good Word"',
        meta: '45 minutes, whole school',
        price: ASSEMBLY_PRICE,
      },
      workshop_one: {
        name: 'The 10 Second Lab',
        meta: '45 minutes, one grade level at a time',
        tiered: true,
      },
      workshop_two: {
        name: 'Group Chat Check',
        meta: '45 minutes, one grade level at a time',
        tiered: true,
      },
      leadership: {
        name: 'Student Leaders',
        meta: 'One semester, 15 to 20 students',
        price: LEADERSHIP_PRICE,
      },
      staff_pd: {
        name: 'Staff Professional Development',
        meta: '60 minutes, can run on an existing PD day',
        price: STAFF_PD_PRICE,
      },
      family_night: {
        name: 'Family Night',
        meta: '60 minute evening event',
        price: FAMILY_NIGHT_PRICE,
      },
    },
  },
};

/** How many grade levels a band can have, for the stepper's upper bound. */
export const BAND_GRADE_LEVEL_MAX = {
  elementary: 6,
  middle: 3,
  high: 4,
};

/** Order the components appear in the wizard and on a quote. */
export const COMPONENT_ORDER = [
  'assembly',
  'workshop_one',
  'workshop_two',
  'leadership',
  'staff_pd',
  'family_night',
];

/**
 * Turn a wizard selection into itemized quote lines plus a total.
 *
 * selection = {
 *   gradeBand: 'elementary' | 'middle' | 'high',
 *   mode: 'package' | 'custom',
 *   packageKey: 'starter' | 'full_year' | null,
 *   items: { assembly: bool, workshop_one: n, workshop_two: n,
 *            leadership: bool, staff_pd: bool, family_night: bool }
 * }
 */
export function buildQuote(selection) {
  const lines = [];

  if (selection.mode === 'package') {
    const pkg = PACKAGES[selection.packageKey];
    if (!pkg) return { lines: [], total: 0 };
    lines.push({ key: pkg.key, name: `${pkg.name} Package`, detail: pkg.description, amount: pkg.price });
    return { lines, total: pkg.price };
  }

  const band = GRADE_BANDS[selection.gradeBand];
  if (!band) return { lines: [], total: 0 };
  const items = selection.items || {};

  for (const key of COMPONENT_ORDER) {
    const component = band.components[key];
    if (!component) continue;

    if (component.tiered) {
      const levels = Math.max(0, Math.trunc(Number(items[key]) || 0));
      if (levels > 0) {
        lines.push({
          key,
          name: component.name,
          detail: `${levels} grade level${levels === 1 ? '' : 's'}`,
          amount: workshopPrice(levels),
        });
      }
    } else if (items[key]) {
      lines.push({ key, name: component.name, detail: component.meta, amount: component.price });
    }
  }

  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  return { lines, total };
}

/** $1,200 rather than $1200. */
export function formatUSD(amount) {
  return `$${Number(amount || 0).toLocaleString('en-US')}`;
}

/**
 * Canonical, server-trusted price list for the One Good Word...One Good Deed shop.
 *
 * The browser NEVER sends a price. It sends { id, size, quantity } only, and
 * this file decides what Stripe charges. Anything not listed here cannot be
 * bought.
 *
 * KEEP IN SYNC: the ids and prices below must match the PRODUCTS array in
 * src/pages/Shop.jsx. That array is display only. This file is the money.
 * If the two ever disagree, this file wins and the shopper sees a price they
 * did not expect at Stripe, so change both together.
 */

export type CatalogItem = {
  /** Name shown on the Stripe checkout page. */
  name: string;
  /** Unit price in CENTS. 2500 = $25.00. */
  price_cents: number;
};

export const CATALOG: Record<string, CatalogItem> = {
  'ogw-ogd-colorful-shirt': { name: 'One Good Word One Good Deed T-Shirt', price_cents: 2500 },
};

/**
 * Flat shipping added to every order, in CENTS.
 * 700 = $7.00. Set to 0 to offer free shipping.
 * CONFIRM THIS NUMBER before taking live payments.
 */
export const SHIPPING_FLAT_CENTS = 700;

/** Most units of a single line a shopper can buy in one order. */
export const MAX_QUANTITY_PER_LINE = 20;

/** Most distinct lines allowed in one cart. */
export const MAX_LINES_PER_ORDER = 25;

/**
 * Hosts allowed as the Stripe return origin. The shopper's browser does not
 * get to choose where Stripe sends them back to, so a tampered request cannot
 * be turned into an open redirect.
 */
export const ALLOWED_RETURN_HOST_SUFFIXES = [
  'ogwogd.org',
  'base44.app',
  'base44.com',
  'localhost',
];

/** Used when the request origin is missing or not on the allowlist. */
export const DEFAULT_RETURN_ORIGIN = 'https://ogwogd.org';

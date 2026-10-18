/**
 * Organisation facts used across the site (contact links, footer, donation
 * card, JSON-LD). Edit values here — never hard-code them in components.
 *
 * Items marked `TODO(client)` were NOT supplied in the brief and must be
 * confirmed by OZ Spolu Vpred before launch.
 */
export const SITE = {
  name: "Spolu Vpred",
  legalName: "Občianske združenie Spolu Vpred",
  country: "Slovensko",
  city: "Bratislava",
  /** TODO(client): registered street address, shown in the footer when set. */
  street: undefined as string | undefined,
  /** TODO(client): IČO (company ID), shown in the footer when set. */
  ico: undefined as string | undefined,
  email: "info.spoluvpred@gmail.com",
  instagram: {
    handle: "@spoluvpred",
    url: "https://www.instagram.com/spoluvpred/",
  },
  facebook: {
    label: "Spolu Vpred",
    // TODO(client): replace with the direct page URL (facebook.com/<page>).
    // Until then this opens a Facebook search for the page name.
    url: "https://www.facebook.com/search/top?q=Spolu%20Vpred",
  },
} as const;

/** Placeholder IBAN — fails the mod-97 check on purpose, so it can never receive money. */
export const PLACEHOLDER_IBAN = "SK00 0000 0000 0000 0000 0000";

/**
 * Bank-transfer donation data.
 * TODO(client): replace `iban` with the association's real account. While the
 * placeholder is in place the donation card shows a visible notice.
 */
export const BANK = {
  accountHolder: "Občianske združenie Spolu Vpred",
  iban: PLACEHOLDER_IBAN,
  /** Payment note (správa pre prijímateľa) — exact text from the brief. */
  paymentNote: "Dar / Podpora projektu",
} as const;

export const IS_PLACEHOLDER_IBAN = BANK.iban === PLACEHOLDER_IBAN;

/** Section anchor ids (single source for nav, hero CTAs and footer links). */
export const SECTION_IDS = {
  about: "about",
  workshops: "workshops",
  schools: "schools",
  volunteering: "volunteering",
  support: "support",
  contact: "contact",
} as const;

export type SectionKey = keyof typeof SECTION_IDS;

/** Order of the primary navigation (labels live in `nav.*` messages). */
export const NAV_KEYS = [
  "about",
  "workshops",
  "schools",
  "volunteering",
  "support",
  "contact",
] as const satisfies readonly SectionKey[];

export type NavKey = (typeof NAV_KEYS)[number];

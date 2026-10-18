/**
 * OZ Spolu Vpred — Brand Manual tokens.
 *
 * Single source of truth for brand colours. Imported by `tailwind.config.ts`
 * (so utilities like `bg-brand-blue` / `text-ink` exist) and by components
 * that need raw hex values (SVG fills, CSS mesh gradients, confetti).
 */
export const BRAND = {
  /** Primary Blue — navigation links, key borders, highlights */
  blue: "#005285",
  /** Primary Red — high-visibility CTAs, interactive badges */
  red: "#DA0D3B",
  /** Dark Navy / Midnight — headings, footer background, deep containers */
  navy: "#082D70",
  /** Deep Burgundy — subtle accent badges and borders */
  burgundy: "#850A3A",
  /** Light Surface — card backgrounds, info panels */
  surface: "#F3F6FA",
  /** Pure White — page background, modal overlays */
  white: "#FFFFFF",
  /** Dark body text — WCAG AAA on white and on Light Surface */
  ink: "#202632",
} as const;

export type BrandAccent = "blue" | "red" | "navy" | "burgundy";

/** `#RRGGBB` + alpha (0–1) → `rgba(r, g, b, a)`. Used to build CSS mesh gradients. */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

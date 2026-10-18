import type { CSSProperties, ReactNode } from "react";
import { BRAND, withAlpha, type BrandAccent } from "@/lib/brand";
import { cn } from "@/lib/cn";

export type PlaceholderAccent = BrandAccent | "mixed";

interface BrandPlaceholderProps {
  accent?: PlaceholderAccent;
  className?: string;
  children?: ReactNode;
  /** Accessible description. Omit when the placeholder is purely decorative. */
  label?: string;
  /** Overlay the soft dot grid and sparkle shapes. */
  decorated?: boolean;
}

/** Layered radial gradients ("mesh") built only from brand-manual colours. */
function meshFor(accent: PlaceholderAccent): CSSProperties {
  const { blue, red, navy, burgundy } = BRAND;
  const layers: Record<PlaceholderAccent, string[]> = {
    mixed: [
      `radial-gradient(60% 55% at 8% 94%, ${withAlpha(navy, 1)} 0%, transparent 72%)`,
      `radial-gradient(55% 50% at 94% 10%, ${withAlpha(red, 0.95)} 0%, transparent 70%)`,
      `radial-gradient(60% 55% at 90% 94%, ${withAlpha(burgundy, 0.95)} 0%, transparent 72%)`,
      `radial-gradient(50% 40% at 40% 0%, ${withAlpha("#FFFFFF", 0.22)} 0%, transparent 70%)`,
    ],
    blue: [
      `radial-gradient(70% 70% at 15% 20%, ${withAlpha(navy, 0.9)} 0%, transparent 70%)`,
      `radial-gradient(60% 60% at 95% 100%, ${withAlpha(red, 0.5)} 0%, transparent 65%)`,
      `radial-gradient(50% 60% at 80% 0%, ${withAlpha("#FFFFFF", 0.22)} 0%, transparent 70%)`,
    ],
    red: [
      `radial-gradient(70% 70% at 10% 15%, ${withAlpha(burgundy, 0.95)} 0%, transparent 70%)`,
      `radial-gradient(60% 60% at 95% 100%, ${withAlpha(blue, 0.55)} 0%, transparent 65%)`,
      `radial-gradient(50% 60% at 80% 0%, ${withAlpha("#FFFFFF", 0.25)} 0%, transparent 70%)`,
    ],
    navy: [
      `radial-gradient(70% 70% at 12% 10%, ${withAlpha(blue, 0.85)} 0%, transparent 70%)`,
      `radial-gradient(60% 60% at 95% 100%, ${withAlpha(burgundy, 0.7)} 0%, transparent 65%)`,
      `radial-gradient(50% 60% at 85% 0%, ${withAlpha("#FFFFFF", 0.18)} 0%, transparent 70%)`,
    ],
    burgundy: [
      `radial-gradient(70% 70% at 10% 10%, ${withAlpha(red, 0.8)} 0%, transparent 70%)`,
      `radial-gradient(60% 60% at 95% 100%, ${withAlpha(navy, 0.8)} 0%, transparent 65%)`,
      `radial-gradient(50% 60% at 85% 0%, ${withAlpha("#FFFFFF", 0.18)} 0%, transparent 70%)`,
    ],
  };
  const base: Record<PlaceholderAccent, string> = {
    mixed: BRAND.blue,
    blue: BRAND.blue,
    red: BRAND.red,
    navy: BRAND.navy,
    burgundy: BRAND.burgundy,
  };
  return {
    backgroundColor: base[accent],
    backgroundImage: layers[accent].join(", "),
  };
}

/**
 * CSS-only mesh-gradient stand-in for photography and illustrations. It never
 * touches the network, so builds stay deterministic.
 */
export function BrandPlaceholder({
  accent = "mixed",
  className,
  children,
  label,
  decorated = true,
}: BrandPlaceholderProps) {
  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      style={meshFor(accent)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {decorated && (
        <svg
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <pattern id={`dots-${accent}`} width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="#FFFFFF" fillOpacity="0.22" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#dots-${accent})`} />
        </svg>
      )}
      {decorated && (
        <>
          <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full border-[14px] border-white/15" />
          <span className="pointer-events-none absolute -bottom-8 left-1/3 h-20 w-20 rounded-full bg-white/10" />
        </>
      )}
      {children}
    </div>
  );
}

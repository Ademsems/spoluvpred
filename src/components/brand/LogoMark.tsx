import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";

export type LogoVariant = "color" | "light";

interface LogoMarkProps {
  variant?: LogoVariant;
  className?: string;
  /** Gently pulse the star (disabled automatically for reduced-motion users via CSS). */
  animated?: boolean;
  /** Accessible name. Omit for a purely decorative mark. */
  title?: string;
}

/** Five-point star centred at (32, 11), outer radius 8, inner radius 3.4. */
const STAR_PATH =
  "M32 3 L34 8.25 L39.61 8.53 L35.23 12.05 L36.7 17.47 L32 14.4 L27.3 17.47 L28.77 12.05 L24.39 8.53 L30 8.25 Z";

/**
 * Inline SVG recreation of the Spolu Vpred mark: two stylised figures whose
 * raised arms meet beneath a star ("together, forward").
 */
export function LogoMark({
  variant = "color",
  className,
  animated = false,
  title,
}: LogoMarkProps) {
  const light = variant === "light";
  const left = light ? "#FFFFFF" : BRAND.blue;
  const right = light ? "rgba(255,255,255,0.82)" : BRAND.red;
  const star = light ? "#FFFFFF" : BRAND.navy;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path
        d={STAR_PATH}
        fill={star}
        stroke={star}
        strokeWidth="1.6"
        strokeLinejoin="round"
        className={cn(animated && "motion-safe:animate-twinkle")}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      {/* Left figure */}
      <circle cx="17" cy="30" r="5.5" fill={left} />
      <path
        d="M9 59 C9 47 14 41 20 40.5 C26 40 28.5 34 29.5 26"
        stroke={left}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right figure */}
      <circle cx="47" cy="30" r="5.5" fill={right} />
      <path
        d="M55 59 C55 47 50 41 44 40.5 C38 40 35.5 34 34.5 26"
        stroke={right}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

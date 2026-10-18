import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";

const SIZE = 25;
const FINDER = 7;

/** Deterministic pseudo-random module grid (same on server and client — no hydration drift). */
function buildModules(): string {
  let seed = 20240;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };

  const inFinderZone = (x: number, y: number) =>
    (x < FINDER + 1 && y < FINDER + 1) ||
    (x >= SIZE - FINDER - 1 && y < FINDER + 1) ||
    (x < FINDER + 1 && y >= SIZE - FINDER - 1);

  const finderOrigins: readonly (readonly [number, number])[] = [
    [0, 0],
    [SIZE - FINDER, 0],
    [0, SIZE - FINDER],
  ];

  const filled = new Set<string>();

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (!inFinderZone(x, y) && random() > 0.52) filled.add(`${x},${y}`);
    }
  }

  for (const [ox, oy] of finderOrigins) {
    for (let dy = 0; dy < FINDER; dy++) {
      for (let dx = 0; dx < FINDER; dx++) {
        const ring = dx === 0 || dy === 0 || dx === FINDER - 1 || dy === FINDER - 1;
        const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        if (ring || core) filled.add(`${ox + dx},${oy + dy}`);
      }
    }
  }

  return Array.from(filled)
    .map((key) => {
      const [x, y] = key.split(",");
      return `M${x} ${y}h1v1h-1z`;
    })
    .join("");
}

const MODULES_PATH = buildModules();

interface PayBySquareMockProps {
  className?: string;
  /** Accessible description (it is a non-functional placeholder). */
  label: string;
  /** Text shown inside the badge under the code. */
  badge: string;
}

/**
 * Non-scannable SVG placeholder for the "PAY by square" QR code. Swap for the
 * real generated code once the association's IBAN is confirmed.
 */
export function PayBySquareMock({ className, label, badge }: PayBySquareMockProps) {
  return (
    <figure className={cn("inline-flex flex-col items-center", className)}>
      <svg
        viewBox="-3 -3 31 31"
        role="img"
        aria-label={label}
        className="h-full w-full rounded-2xl bg-white"
        shapeRendering="crispEdges"
      >
        {/* PAY by square style corner brackets */}
        <g fill="none" stroke={BRAND.red} strokeWidth="0.9" strokeLinecap="square">
          <path d="M-2.2 1.4V-2.2H1.4" />
          <path d="M26.2 1.4V-2.2H22.6" transform="translate(-1.2 0)" />
          <path d="M-2.2 22.6V26.2H1.4" />
          <path d="M25 22.6V26.2H21.4" />
        </g>
        <path d={MODULES_PATH} fill={BRAND.navy} />
      </svg>
      <figcaption className="mt-2 rounded-full bg-brand-navy px-3 py-1 text-xs font-extrabold tracking-wide text-white">
        {badge}
      </figcaption>
    </figure>
  );
}

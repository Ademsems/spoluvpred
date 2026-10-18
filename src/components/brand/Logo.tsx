import { cn } from "@/lib/cn";
import { LogoMark, type LogoVariant } from "@/components/brand/LogoMark";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  /** Show the "občianske združenie" caption under the wordmark. */
  showCaption?: boolean;
}

/** Brand lockup: figures-and-star mark + "Spolu Vpred" wordmark (live text, so it uses the site font). */
export function Logo({ variant = "color", className, showCaption = false }: LogoProps) {
  const light = variant === "light";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark variant={variant} className="h-10 w-10 sm:h-11 sm:w-11" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.375rem] font-extrabold tracking-tight sm:text-2xl",
            light ? "text-white" : "text-brand-navy",
          )}
        >
          Spolu <span className={light ? "text-white/85" : "text-brand-red"}>Vpred</span>
        </span>
        {showCaption && (
          <span
            className={cn(
              "mt-1 whitespace-nowrap text-[0.6875rem] font-bold uppercase tracking-[0.16em] max-[400px]:hidden",
              light ? "text-white/75" : "text-brand-blue",
            )}
          >
            občianske združenie
          </span>
        )}
      </span>
    </span>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  id?: string;
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  align?: "left" | "center";
  /** Use on dark backgrounds. */
  invert?: boolean;
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = "left",
  invert = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <span
        className={cn(
          "eyebrow",
          invert && "bg-white/15 text-white",
          align === "center" && "mx-auto",
        )}
      >
        {eyebrow}
      </span>
      <h2
        id={id}
        className={cn(
          "mt-4 text-balance text-3xl leading-[1.15] sm:text-4xl lg:text-[2.75rem]",
          invert && "!text-white",
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-4 text-pretty text-lg leading-relaxed",
            invert ? "text-white/90" : "text-ink/80",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

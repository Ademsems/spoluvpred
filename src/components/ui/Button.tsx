import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "navy" | "ghost" | "light";
export type ButtonSize = "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-red text-white shadow-cta hover:bg-[#c00b34] hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-white text-brand-navy border-2 border-brand-navy/20 hover:border-brand-blue hover:text-brand-blue hover:-translate-y-0.5",
  navy: "bg-brand-navy text-white hover:bg-brand-blue hover:-translate-y-0.5",
  ghost: "bg-transparent text-brand-blue hover:bg-brand-blue/10",
  light: "bg-white text-brand-navy hover:bg-surface hover:-translate-y-0.5",
};

const SIZES: Record<ButtonSize, string> = {
  md: "min-h-[2.75rem] px-5 py-2.5 text-[0.9375rem]",
  lg: "min-h-[3.25rem] px-7 py-3.5 text-base",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full text-center font-bold leading-tight transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 motion-reduce:transform-none motion-reduce:transition-none",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type ButtonProps = StyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof StyleProps>;

/** Pill `<button>` (defaults to `type="button"`). */
export function Button({
  variant,
  size,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

type ButtonLinkProps = StyleProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof StyleProps | "href"
  >;

/** Pill `<a>` for in-page anchors and external links. */
export function ButtonLink({
  variant,
  size,
  className,
  children,
  href,
  ...rest
}: ButtonLinkProps) {
  return (
    <a href={href} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </a>
  );
}

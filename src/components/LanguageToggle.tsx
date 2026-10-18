"use client";

import { useLanguage, type Lang } from "@/context/LanguageContext";
import { cn } from "@/lib/cn";

const OPTIONS: readonly { lang: Lang; label: string }[] = [
  { lang: "sk", label: "SK" },
  { lang: "en", label: "EN" },
];

/** SK | EN segmented switch. The choice persists via LanguageContext → localStorage. */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t("a11y.languageSwitch")}
      className={cn(
        "inline-flex items-center rounded-full border-2 border-brand-navy/15 bg-white p-0.5",
        className,
      )}
    >
      {OPTIONS.map((option) => {
        const active = lang === option.lang;
        return (
          <button
            key={option.lang}
            type="button"
            lang={option.lang}
            aria-pressed={active}
            aria-label={option.lang === "sk" ? t("a11y.switchToSk") : t("a11y.switchToEn")}
            onClick={() => setLang(option.lang)}
            className={cn(
              "min-h-[2.25rem] min-w-[2.75rem] rounded-full px-3 text-sm font-extrabold transition-colors",
              active
                ? "bg-brand-navy text-white"
                : "text-brand-navy hover:bg-brand-blue/10",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useLanguage } from "@/context/LanguageContext";

/** First tabbable element: lets keyboard users jump past the navigation. */
export function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main"
      className="sr-only z-[100] rounded-full bg-brand-navy px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {t("a11y.skipToContent")}
    </a>
  );
}

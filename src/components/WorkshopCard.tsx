"use client";

import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useInquiry } from "@/context/InquiryContext";
import { BrandPlaceholder } from "@/components/brand/BrandPlaceholder";
import { Button } from "@/components/ui/Button";
import type { BrandAccent } from "@/lib/brand";
import { CATEGORY_ACCENT, type WorkshopMeta } from "@/lib/workshops";

// Literal class names so Tailwind's JIT can see them.
const ACCENT_TEXT: Record<BrandAccent, string> = {
  red: "text-brand-red",
  blue: "text-brand-blue",
  navy: "text-brand-navy",
  burgundy: "text-brand-burgundy",
};

export function WorkshopCard({ workshop }: { workshop: WorkshopMeta }) {
  const { t, messages } = useLanguage();
  const { requestWorkshop } = useInquiry();

  const { id, icon: Icon, category } = workshop;
  const accent = CATEGORY_ACCENT[category];
  const copy = messages.workshops.items[id];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-navy/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:transform-none">
      <BrandPlaceholder accent={accent} className="h-28 shrink-0">
        <span className="absolute right-4 top-4 rounded-full border border-brand-burgundy/30 bg-white px-3 py-1 text-xs font-extrabold text-brand-burgundy">
          {t("workshops.ageBadge")}
        </span>
      </BrandPlaceholder>

      <div className="flex flex-1 flex-col px-6 pb-6">
        <span className="relative z-10 -mt-9 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border border-brand-navy/10 bg-white shadow-soft transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none">
          <Icon className={`h-9 w-9 ${ACCENT_TEXT[accent]}`} aria-hidden="true" />
        </span>

        <p
          className={`mt-4 text-xs font-extrabold uppercase tracking-[0.12em] ${ACCENT_TEXT[accent]}`}
        >
          {copy.topic}
        </p>
        <h3 className="mt-1.5 text-xl leading-snug">{copy.title}</h3>
        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink/80">
          {copy.description}
        </p>

        <Button
          variant="secondary"
          className="mt-6 w-full"
          onClick={() => requestWorkshop(id)}
        >
          {t("workshops.cta")}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">: {copy.title}</span>
        </Button>
      </div>
    </article>
  );
}

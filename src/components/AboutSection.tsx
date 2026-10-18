"use client";

import { Compass, Hand, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";
import { useLanguage, type Messages } from "@/context/LanguageContext";
import { BrandPlaceholder } from "@/components/brand/BrandPlaceholder";
import { LogoMark } from "@/components/brand/LogoMark";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { SECTION_IDS } from "@/lib/site";

type DifferentiatorKey = keyof Messages["about"]["differentiators"];

const DIFFERENTIATORS: readonly {
  key: DifferentiatorKey;
  icon: LucideIcon;
  tone: string;
}[] = [
  { key: "participation", icon: Hand, tone: "bg-brand-red text-white" },
  { key: "skills", icon: Wrench, tone: "bg-brand-blue text-white" },
  { key: "safeSpace", icon: ShieldCheck, tone: "bg-brand-navy text-white" },
];

export function AboutSection() {
  const { t, messages } = useLanguage();

  return (
    <section
      id={SECTION_IDS.about}
      aria-labelledby="about-title"
      className="section-y bg-white"
    >
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <BrandPlaceholder
              accent="navy"
              className="aspect-[4/3] rounded-3xl shadow-lift"
              label={t("hero.visualAlt")}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <LogoMark variant="light" className="h-3/5 w-3/5 drop-shadow-lg" />
              </div>
              <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-brand-navy shadow-soft">
                <Compass className="h-4 w-4 text-brand-red" aria-hidden="true" />
                {t("hero.tagline")}
              </span>
            </BrandPlaceholder>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <SectionHeading
              id="about-title"
              eyebrow={t("about.eyebrow")}
              title={t("about.title")}
            />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink">
              <p>{t("about.paragraph1")}</p>
              <p>{t("about.paragraph2")}</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 sm:mt-20">
          <h3 className="text-center text-2xl sm:text-3xl">
            {t("about.differentiatorsTitle")}
          </h3>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {DIFFERENTIATORS.map(({ key, icon: Icon, tone }, index) => {
              const item = messages.about.differentiators[key];
              return (
                <li key={key}>
                  <Reveal delay={index * 0.08} className="h-full">
                    <article className="h-full rounded-3xl border border-brand-navy/10 bg-surface p-7 transition-shadow hover:shadow-soft">
                      <span
                        className={cn(
                          "flex h-14 w-14 items-center justify-center rounded-2xl shadow-soft",
                          tone,
                        )}
                      >
                        <Icon className="h-7 w-7" aria-hidden="true" />
                      </span>
                      <h4 className="mt-5 text-xl leading-snug">{item.title}</h4>
                      <p className="mt-3 text-base leading-relaxed text-ink/80">
                        {item.text}
                      </p>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

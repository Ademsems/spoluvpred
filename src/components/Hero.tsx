"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, GraduationCap, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { BrandPlaceholder } from "@/components/brand/BrandPlaceholder";
import { LogoMark } from "@/components/brand/LogoMark";
import { ButtonLink } from "@/components/ui/Button";
import { SECTION_IDS } from "@/lib/site";

export function Hero() {
  const { t, messages } = useLanguage();

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-gradient-to-b from-surface via-white to-white"
    >
      {/* Soft decorative blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl" />
        <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-brand-red/10 blur-3xl" />
      </div>

      <div className="container-page relative grid items-center gap-12 py-14 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-brand-burgundy/25 bg-white px-4 py-2 text-sm font-extrabold text-brand-burgundy shadow-sm">
            <Sparkles className="h-4 w-4 text-brand-red" aria-hidden="true" />
            {t("hero.tagline")}
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-balance text-4xl leading-[1.08] sm:text-5xl lg:text-[3.5rem]"
          >
            <span className="block text-brand-red">{t("hero.brand")}</span>
            <span className="sr-only"> — </span>
            <span className="mt-2 block">{t("hero.headlineLine1")}</span>
            <span className="block text-brand-blue">{t("hero.headlineLine2")}</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink sm:text-xl">
            {t("hero.description")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`#${SECTION_IDS.contact}`} size="lg">
              {t("hero.ctaPrimary")}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={`#${SECTION_IDS.about}`} variant="secondary" size="lg">
              {t("hero.ctaSecondary")}
            </ButtonLink>
          </div>

          <ul className="mt-9 flex flex-wrap gap-2.5">
            {messages.hero.chips.map((chip) => (
              <li
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border border-brand-navy/10 bg-white px-4 py-2 text-sm font-bold text-brand-navy shadow-sm"
              >
                <BadgeCheck className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                {chip}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg"
        >
          <BrandPlaceholder
            accent="mixed"
            label={t("hero.visualAlt")}
            className="aspect-[5/5] rounded-[2rem] shadow-lift sm:rounded-[2.5rem]"
          >
            <div className="absolute inset-[14%] flex items-center justify-center rounded-[2rem] bg-white/95 shadow-soft">
              <LogoMark animated className="h-[78%] w-[78%]" />
            </div>
          </BrandPlaceholder>

          <span className="absolute -left-3 top-[12%] rounded-full bg-brand-blue px-4 py-2 text-sm font-extrabold text-white shadow-soft motion-safe:animate-float sm:-left-6">
            {t("hero.pillCreate")}
          </span>
          <span
            className="absolute -right-2 top-[30%] rounded-full bg-brand-red px-4 py-2 text-sm font-extrabold text-white shadow-cta motion-safe:animate-float sm:-right-6"
            style={{ animationDelay: "1.2s" }}
          >
            {t("hero.pillConnect")}
          </span>
          <span
            className="absolute -bottom-3 right-[18%] rounded-full bg-brand-navy px-4 py-2 text-sm font-extrabold text-white shadow-soft motion-safe:animate-float"
            style={{ animationDelay: "2.4s" }}
          >
            {t("hero.pillDiscover")}
          </span>

          <div className="absolute -bottom-5 left-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lift sm:-left-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-burgundy/10 text-brand-burgundy">
              <GraduationCap className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="leading-tight">
              <span className="block text-2xl font-extrabold text-brand-navy">
                {t("hero.statValue")}
              </span>
              <span className="block text-xs font-bold text-ink/80">
                {t("hero.statLabel")} · {t("hero.statAge")}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

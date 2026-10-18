"use client";

import { ArrowRight, CircleCheck, HandHeart, School } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useInquiry } from "@/context/InquiryContext";
import { BrandPlaceholder } from "@/components/brand/BrandPlaceholder";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SECTION_IDS } from "@/lib/site";

/**
 * "Pre školy" and "Dobrovoľníctvo" — the destinations of the two matching
 * navigation links. Each CTA pre-selects the matching contact-form category.
 */
export function AudienceSection() {
  const { messages } = useLanguage();
  const { requestCategory } = useInquiry();
  const schools = messages.audience.schools;
  const volunteering = messages.audience.volunteering;

  return (
    <div className="section-y bg-white">
      <div className="container-page grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* For schools */}
        <section
          id={SECTION_IDS.schools}
          aria-labelledby="schools-title"
          className="h-full"
        >
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-3xl border-2 border-brand-blue/20 bg-surface p-7 sm:p-10">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-soft">
                <School className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="eyebrow mt-6 self-start">{schools.eyebrow}</p>
              <h2 id="schools-title" className="mt-4 text-balance text-3xl leading-tight">
                {schools.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink">{schools.text}</p>
              <ul className="mt-6 space-y-3">
                {schools.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 font-semibold text-brand-navy">
                    <CircleCheck
                      className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className="mt-8 self-start"
                onClick={() => requestCategory("schools")}
              >
                {schools.cta}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </Reveal>
        </section>

        {/* Volunteering */}
        <section
          id={SECTION_IDS.volunteering}
          aria-labelledby="volunteering-title"
          className="h-full"
        >
          <Reveal className="h-full" delay={0.1}>
            <BrandPlaceholder
              accent="navy"
              className="flex h-full flex-col rounded-3xl p-7 text-white sm:p-10"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-red shadow-soft">
                <HandHeart className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="eyebrow mt-6 self-start !bg-white/15 !text-white">
                {volunteering.eyebrow}
              </p>
              <h2
                id="volunteering-title"
                className="mt-4 text-balance text-3xl leading-tight !text-white"
              >
                {volunteering.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white">{volunteering.text}</p>
              <ul className="mt-6 space-y-3">
                {volunteering.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 font-semibold text-white">
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-white" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <Button
                variant="light"
                size="lg"
                className="mt-8 self-start"
                onClick={() => requestCategory("other")}
              >
                {volunteering.cta}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </BrandPlaceholder>
          </Reveal>
        </section>
      </div>
    </div>
  );
}

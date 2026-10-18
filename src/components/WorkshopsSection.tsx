"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchX, Search, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { WorkshopCard } from "@/components/WorkshopCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { SECTION_IDS } from "@/lib/site";
import {
  WORKSHOPS,
  WORKSHOP_FILTERS,
  normalizeText,
  type WorkshopFilter,
} from "@/lib/workshops";

export function WorkshopsSection() {
  const { t, messages } = useLanguage();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<WorkshopFilter>("all");

  const visible = useMemo(() => {
    const needle = normalizeText(query);
    return WORKSHOPS.filter((workshop) => {
      if (filter !== "all" && workshop.category !== filter) return false;
      if (!needle) return true;
      const copy = messages.workshops.items[workshop.id];
      const haystack = normalizeText(
        `${copy.title} ${copy.topic} ${copy.description}`,
      );
      return haystack.includes(needle);
    });
  }, [query, filter, messages]);

  const isFiltered = query.trim() !== "" || filter !== "all";
  const reset = () => {
    setQuery("");
    setFilter("all");
  };

  return (
    <section
      id={SECTION_IDS.workshops}
      aria-labelledby="workshops-title"
      className="section-y bg-surface"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="workshops-title"
            eyebrow={t("workshops.eyebrow")}
            title={t("workshops.title")}
            lead={t("workshops.lead")}
          />
        </Reveal>

        {/* Search + category filters */}
        <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label={t("workshops.filtersLabel")} className="flex flex-wrap gap-2">
            {WORKSHOP_FILTERS.map((value) => {
              const active = filter === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(value)}
                  className={cn(
                    "min-h-[2.75rem] rounded-full border-2 px-5 text-sm font-bold transition-colors",
                    active
                      ? "border-brand-navy bg-brand-navy text-white"
                      : "border-brand-navy/15 bg-white text-brand-navy hover:border-brand-blue hover:text-brand-blue",
                  )}
                >
                  {t(`workshops.categories.${value}`)}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <label htmlFor="workshop-search" className="sr-only">
              {t("workshops.searchLabel")}
            </label>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-blue"
              aria-hidden="true"
            />
            <input
              id="workshop-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("workshops.searchPlaceholder")}
              autoComplete="off"
              className="field !rounded-full !pl-12 !pr-12"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t("workshops.clearSearch")}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-brand-navy hover:bg-brand-blue/10"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <p
          className="mt-6 text-sm font-bold text-ink/80"
          role="status"
          aria-live="polite"
        >
          {t("workshops.resultsCount", { count: visible.length })}
        </p>

        {visible.length > 0 ? (
          <ul className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((workshop) => (
                <motion.li
                  key={workshop.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                >
                  <WorkshopCard workshop={workshop} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="mt-6 rounded-3xl border-2 border-dashed border-brand-navy/20 bg-white px-6 py-14 text-center">
            <SearchX className="mx-auto h-10 w-10 text-brand-burgundy" aria-hidden="true" />
            <h3 className="mt-4 text-xl">{t("workshops.emptyTitle")}</h3>
            <p className="mt-2 text-ink/80">{t("workshops.emptyText")}</p>
            {isFiltered && (
              <Button variant="navy" className="mt-6" onClick={reset}>
                {t("workshops.resetFilters")}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

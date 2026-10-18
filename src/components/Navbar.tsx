"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mail, Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Logo } from "@/components/brand/Logo";
import { FacebookIcon, InstagramIcon } from "@/components/brand/SocialIcons";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { NAV_KEYS, SECTION_IDS, SITE } from "@/lib/site";

const NAV_IDS = NAV_KEYS.map((key) => SECTION_IDS[key]);

export function Navbar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useActiveSection(NAV_IDS);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the mobile menu; the menu also closes when the viewport grows to desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <>
      {/* Slim utility bar (desktop only) */}
      <div className="hidden bg-brand-navy text-[0.8125rem] text-white md:block">
        <div className="container-page flex h-10 items-center justify-between">
          <p className="font-semibold text-white/90">{t("topbar.tagline")}</p>
          <ul className="flex items-center gap-5">
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-1.5 font-semibold hover:underline"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={SITE.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold hover:underline"
              >
                <InstagramIcon className="h-4 w-4" />
                {SITE.instagram.handle}
                <span className="sr-only">{t("a11y.externalLink")}</span>
              </a>
            </li>
            <li>
              <a
                href={SITE.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold hover:underline"
              >
                <FacebookIcon className="h-4 w-4" />
                {SITE.facebook.label}
                <span className="sr-only">{t("a11y.externalLink")}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow",
          scrolled ? "border-brand-navy/10 shadow-soft" : "border-transparent",
        )}
      >
        <nav
          aria-label={t("a11y.mainNavigation")}
          className="container-page flex h-[4.5rem] items-center justify-between gap-4"
        >
          <a href="#top" aria-label={t("a11y.logoLabel")} className="rounded-xl">
            <Logo showCaption />
          </a>

          <ul className="hidden items-center gap-1 xl:flex">
            {NAV_KEYS.map((key) => {
              const id = SECTION_IDS[key];
              const active = activeId === id;
              return (
                <li key={key}>
                  <a
                    href={`#${id}`}
                    aria-current={active ? "location" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[0.9375rem] font-bold transition-colors",
                      active
                        ? "bg-brand-blue/10 text-brand-blue"
                        : "text-brand-blue hover:bg-brand-blue/10 hover:text-brand-navy",
                    )}
                  >
                    {t(`nav.${key}`)}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ButtonLink
              href={`#${SECTION_IDS.contact}`}
              className="hidden md:inline-flex"
              size="md"
            >
              {t("nav.cta")}
            </ButtonLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t("a11y.closeMenu") : t("a11y.openMenu")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand-navy/15 text-brand-navy transition-colors hover:bg-brand-blue/10 xl:hidden"
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-brand-navy/10 bg-white xl:hidden"
            >
              <ul className="container-page flex flex-col gap-1 py-4">
                {NAV_KEYS.map((key) => {
                  const id = SECTION_IDS[key];
                  const active = activeId === id;
                  return (
                    <li key={key}>
                      <a
                        href={`#${id}`}
                        onClick={close}
                        aria-current={active ? "location" : undefined}
                        className={cn(
                          "flex min-h-[3rem] items-center justify-between rounded-2xl px-4 text-lg font-bold",
                          active
                            ? "bg-brand-blue/10 text-brand-blue"
                            : "text-brand-navy hover:bg-surface",
                        )}
                      >
                        {t(`nav.${key}`)}
                        <ArrowRight className="h-5 w-5 text-brand-red" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
                <li className="pt-2">
                  <ButtonLink
                    href={`#${SECTION_IDS.contact}`}
                    onClick={close}
                    size="lg"
                    className="w-full"
                  >
                    {t("nav.cta")}
                  </ButtonLink>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

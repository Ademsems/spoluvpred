"use client";

import { ArrowUp, HandHeart, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useInquiry } from "@/context/InquiryContext";
import { Logo } from "@/components/brand/Logo";
import { FacebookIcon, InstagramIcon } from "@/components/brand/SocialIcons";
import { Button } from "@/components/ui/Button";
import { NAV_KEYS, SECTION_IDS, SITE } from "@/lib/site";

export function Footer() {
  const { t } = useLanguage();
  const { requestCategory } = useInquiry();

  const linkClass =
    "inline-flex min-h-[2.25rem] items-center font-semibold text-white/90 underline-offset-4 hover:text-white hover:underline";

  return (
    <footer className="bg-brand-navy text-white">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_1fr_1.1fr]">
          {/* Identity */}
          <div>
            <a href="#top" aria-label={t("a11y.logoLabel")} className="inline-block rounded-xl">
              <Logo variant="light" showCaption />
            </a>
            <p className="mt-5 max-w-xs leading-relaxed text-white/90">{t("footer.about")}</p>
            <address className="mt-5 space-y-1 text-sm not-italic text-white/90">
              <p className="font-extrabold text-white">{t("footer.legalName")}</p>
              {SITE.street && <p>{SITE.street}</p>}
              <p className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {t("footer.location")}
              </p>
              {SITE.ico && <p>{t("footer.ico", { value: SITE.ico })}</p>}
            </address>
          </div>

          {/* Navigation */}
          <nav aria-labelledby="footer-nav-title">
            <h2 id="footer-nav-title" className="text-sm uppercase tracking-[0.14em] !text-white/80">
              {t("footer.navTitle")}
            </h2>
            <ul className="mt-4 space-y-1">
              {NAV_KEYS.map((key) => (
                <li key={key}>
                  <a href={`#${SECTION_IDS[key]}`} className={linkClass}>
                    {t(`nav.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + social */}
          <div>
            <h2 className="text-sm uppercase tracking-[0.14em] !text-white/80">
              {t("footer.contactTitle")}
            </h2>
            <ul className="mt-4 space-y-1">
              <li>
                <a href={`mailto:${SITE.email}`} className={`${linkClass} gap-2 break-all`}>
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {SITE.email}
                </a>
              </li>
            </ul>
            <h2 className="mt-6 text-sm uppercase tracking-[0.14em] !text-white/80">
              {t("footer.followTitle")}
            </h2>
            <ul className="mt-4 space-y-1">
              <li>
                <a
                  href={SITE.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} gap-2`}
                >
                  <InstagramIcon className="h-4 w-4 shrink-0" />
                  {SITE.instagram.handle}
                  <span className="sr-only">{t("a11y.externalLink")}</span>
                </a>
              </li>
              <li>
                <a
                  href={SITE.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} gap-2`}
                >
                  <FacebookIcon className="h-4 w-4 shrink-0" />
                  {SITE.facebook.label}
                  <span className="sr-only">{t("a11y.externalLink")}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Volunteer callout */}
          <div className="self-start rounded-3xl bg-white/10 p-6 ring-1 ring-white/20">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-red">
              <HandHeart className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-xl !text-white">{t("footer.volunteerTitle")}</h2>
            <p className="mt-2 leading-relaxed text-white/90">{t("footer.volunteerText")}</p>
            <Button
              variant="light"
              className="mt-5 w-full"
              onClick={() => requestCategory("other")}
            >
              {t("footer.volunteerCta")}
            </Button>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/20 pt-6 text-sm text-white/90 sm:flex-row sm:items-center sm:justify-between">
          <p suppressHydrationWarning>
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-5">
            <p className="font-extrabold text-white">{t("footer.madeWith")}</p>
            <a
              href="#top"
              className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-full border-2 border-white/30 px-4 font-bold hover:bg-white/10"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
              {t("a11y.backToTop")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Heart, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { BrandPlaceholder } from "@/components/brand/BrandPlaceholder";
import { PayBySquareMock } from "@/components/brand/PayBySquareMock";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { BANK, IS_PLACEHOLDER_IBAN, SECTION_IDS } from "@/lib/site";

type CopyKey = "iban" | "note";

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for insecure contexts / older browsers.
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }
}

interface CopyRowProps {
  label: string;
  value: string;
  copyLabel: string;
  copied: boolean;
  onCopy: () => void;
  mono?: boolean;
}

function CopyRow({ label, value, copyLabel, copied, onCopy, mono }: CopyRowProps) {
  const { t } = useLanguage();
  return (
    <div className="rounded-2xl bg-surface p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/80">{label}</p>
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p
          className={cn(
            "min-w-0 break-words text-lg font-extrabold text-brand-navy",
            mono && "font-mono text-base tracking-wide sm:text-lg",
          )}
        >
          {value}
        </p>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copyLabel}
          className={cn(
            "inline-flex min-h-[2.75rem] shrink-0 items-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition-colors",
            copied
              ? "border-brand-blue bg-brand-blue text-white"
              : "border-brand-navy/20 bg-white text-brand-navy hover:border-brand-blue hover:text-brand-blue",
          )}
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {copied ? t("donate.copied") : t("donate.copy")}
        </button>
      </div>
    </div>
  );
}

export function DonateSection() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState<CopyKey | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (key: CopyKey, text: string, label: string) => {
      const ok = await writeToClipboard(text);
      setAnnouncement(ok ? t("donate.copiedAnnounce", { label }) : t("donate.copyFailed"));
      if (!ok) return;
      setCopied(key);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), 2200);
    },
    [t],
  );

  return (
    <section
      id={SECTION_IDS.support}
      aria-labelledby="support-title"
      className="section-y bg-white"
    >
      <div className="container-page">
        <Reveal>
          <BrandPlaceholder
            accent="blue"
            className="rounded-[2rem] p-6 shadow-lift sm:p-10 lg:p-14"
          >
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
              <div>
                <SectionHeading
                  id="support-title"
                  invert
                  eyebrow={t("donate.eyebrow")}
                  title={t("donate.title")}
                  lead={t("donate.lead")}
                />
                <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-brand-burgundy">
                  <Heart className="h-4 w-4 fill-brand-red text-brand-red" aria-hidden="true" />
                  {t("donate.thanks")}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-lift sm:p-7">
                <h3 className="text-xl">{t("donate.cardTitle")}</h3>

                {IS_PLACEHOLDER_IBAN && (
                  <p className="mt-4 flex items-start gap-2 rounded-xl border border-brand-burgundy/30 bg-brand-burgundy/5 px-3.5 py-2.5 text-sm font-bold text-brand-burgundy">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {t("donate.placeholderNotice")}
                  </p>
                )}

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl bg-surface p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/80">
                      {t("donate.holder")}
                    </p>
                    <p className="mt-1.5 text-lg font-extrabold text-brand-navy">
                      {BANK.accountHolder}
                    </p>
                  </div>
                  <CopyRow
                    mono
                    label={t("donate.iban")}
                    value={BANK.iban}
                    copyLabel={t("donate.copyIban")}
                    copied={copied === "iban"}
                    onCopy={() =>
                      copy("iban", BANK.iban.replace(/\s/g, ""), t("donate.iban"))
                    }
                  />
                  <CopyRow
                    label={t("donate.note")}
                    value={BANK.paymentNote}
                    copyLabel={t("donate.copyNote")}
                    copied={copied === "note"}
                    onCopy={() => copy("note", BANK.paymentNote, t("donate.note"))}
                  />
                </div>

                <div className="mt-3 flex items-center gap-5 rounded-2xl bg-surface p-4">
                  <PayBySquareMock
                    className="w-28 shrink-0"
                    label={t("donate.qrAlt")}
                    badge={t("donate.qrTitle")}
                  />
                  <div>
                    <p className="font-extrabold text-brand-navy">{t("donate.qrCaption")}</p>
                    <p className="mt-1.5 text-sm font-semibold text-ink/80">{t("donate.qrMock")}</p>
                  </div>
                </div>

                <p className="sr-only" role="status" aria-live="polite">
                  {announcement}
                </p>
              </div>
            </div>
          </BrandPlaceholder>
        </Reveal>
      </div>
    </section>
  );
}

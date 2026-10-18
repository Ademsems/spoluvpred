"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CONTACT_FORM_ID, useInquiry } from "@/context/InquiryContext";
import { FacebookIcon, InstagramIcon } from "@/components/brand/SocialIcons";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BRAND } from "@/lib/brand";
import { SECTION_IDS, SITE } from "@/lib/site";
import {
  INQUIRY_CATEGORIES,
  LIMITS,
  hasErrors,
  isOrganizationRequired,
  validateInquiry,
  type FieldError,
  type InquiryField,
  type InquiryInput,
} from "@/lib/validation";
import { WORKSHOPS, isWorkshopId } from "@/lib/workshops";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY_VALUES = {
  name: "",
  organization: "",
  email: "",
  phone: "",
  message: "",
  /** Honeypot — hidden from people, tempting for bots. */
  website: "",
};

/** Visual order of the fields, used to focus the first invalid one. */
const FIELD_ORDER: readonly InquiryField[] = [
  "name",
  "organization",
  "email",
  "phone",
  "workshop",
  "message",
];

async function celebrate() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { default: confetti } = await import("canvas-confetti");
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.75 },
      colors: [BRAND.blue, BRAND.red, BRAND.navy, BRAND.burgundy],
      disableForReducedMotion: true,
    });
  } catch {
    /* purely decorative */
  }
}

interface FieldShellProps {
  field: InquiryField;
  label: string;
  required?: boolean;
  requiredText: string;
  error?: string;
  children: ReactNode;
}

function FieldShell({ field, label, required, requiredText, error, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={`contact-${field}`} className="mb-1.5 block text-sm font-extrabold text-brand-navy">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ml-1 text-brand-red">
              *
            </span>
            <span className="sr-only"> ({requiredText})</span>
          </>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`contact-${field}-error`}
          className="mt-1.5 flex items-start gap-1.5 text-sm font-bold text-brand-burgundy"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactSection() {
  const { t, lang, messages } = useLanguage();
  const { category, setCategory, workshop, setWorkshop, focusTick } = useInquiry();

  const [values, setValues] = useState(EMPTY_VALUES);
  const [touched, setTouched] = useState<Partial<Record<InquiryField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const successRef = useRef<HTMLDivElement>(null);

  const input: InquiryInput = {
    category,
    name: values.name,
    organization: values.organization,
    email: values.email,
    phone: values.phone,
    workshop,
    message: values.message,
  };
  const errors = validateInquiry(input);
  const showSummary = submitted && hasErrors(errors);

  /** Errors are revealed per field after blur, and for every field after a submit attempt. */
  const visibleError = (field: InquiryField): string | undefined => {
    const error: FieldError | undefined = errors[field];
    if (!error || !(submitted || touched[field])) return undefined;
    return t(`contact.errors.${error.code}`, {
      min: error.limit ?? "",
      max: error.limit ?? "",
    });
  };

  const controlProps = (field: InquiryField) => {
    const error = visibleError(field);
    return {
      id: `contact-${field}`,
      name: field,
      "aria-invalid": error ? (true as const) : undefined,
      "aria-describedby": error ? `contact-${field}-error` : undefined,
      onBlur: () => setTouched((prev) => ({ ...prev, [field]: true })),
    };
  };

  const setValue = (field: keyof typeof EMPTY_VALUES, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  // A workshop card / audience CTA asked us to pre-fill the form: move focus into it
  // once the smooth scroll has (mostly) arrived.
  useEffect(() => {
    if (focusTick === 0) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(
        category === "schools" && workshop ? "contact-workshop" : "contact-name",
      );
      target?.focus({ preventScroll: true });
    }, 650);
    return () => window.clearTimeout(timer);
    // Only react to new requests, not to every keystroke-driven re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTick]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setSubmitted(true);

    if (hasErrors(errors)) {
      setStatus("idle");
      const first = FIELD_ORDER.find((field) => errors[field]);
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, website: values.website, lang }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setValues(EMPTY_VALUES);
      setTouched({});
      setSubmitted(false);
      setWorkshop("");
      setStatus("success");
      void celebrate();
    } catch {
      setStatus("error");
    }
  }

  const organizationLabel =
    category === "schools"
      ? t("contact.fields.organization.labelSchools")
      : category === "companies"
        ? t("contact.fields.organization.labelCompanies")
        : t("contact.fields.organization.labelOther");

  const messagePlaceholder =
    category === "schools"
      ? t("contact.fields.message.placeholderSchools")
      : category === "companies"
        ? t("contact.fields.message.placeholderCompanies")
        : t("contact.fields.message.placeholderOther");

  const requiredText = t("contact.required");

  // Make the e-mail in the failure message clickable.
  const sendError = t("contact.errors.send", { email: SITE.email });
  const [sendErrorBefore, sendErrorAfter] = sendError.split(SITE.email);

  return (
    <section
      id={SECTION_IDS.contact}
      aria-labelledby="contact-title"
      className="section-y bg-surface"
    >
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <Reveal>
          <SectionHeading
            id="contact-title"
            eyebrow={t("contact.eyebrow")}
            title={t("contact.title")}
            lead={t("contact.lead")}
          />

          <div className="mt-10">
            <h3 className="text-lg">{t("contact.direct.title")}</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="group flex items-center gap-4 rounded-2xl border border-brand-navy/10 bg-white p-4 transition-shadow hover:shadow-soft"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red text-white">
                    <Mail className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-extrabold uppercase tracking-wider text-ink/80">
                      {t("contact.direct.email")}
                    </span>
                    <span className="block break-all font-bold text-brand-navy group-hover:text-brand-blue">
                      {SITE.email}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={SITE.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-brand-navy/10 bg-white p-4 transition-shadow hover:shadow-soft"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-burgundy text-white">
                    <InstagramIcon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-extrabold uppercase tracking-wider text-ink/80">
                      {t("contact.direct.instagram")}
                    </span>
                    <span className="block font-bold text-brand-navy group-hover:text-brand-blue">
                      {SITE.instagram.handle}
                    </span>
                  </span>
                  <span className="sr-only">{t("a11y.externalLink")}</span>
                </a>
              </li>
              <li>
                <a
                  href={SITE.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-brand-navy/10 bg-white p-4 transition-shadow hover:shadow-soft"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-white">
                    <FacebookIcon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-extrabold uppercase tracking-wider text-ink/80">
                      {t("contact.direct.facebook")}
                    </span>
                    <span className="block font-bold text-brand-navy group-hover:text-brand-blue">
                      {SITE.facebook.label}
                    </span>
                  </span>
                  <span className="sr-only">{t("a11y.externalLink")}</span>
                </a>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            id={CONTACT_FORM_ID}
            className="scroll-mt-32 rounded-3xl border border-brand-navy/10 bg-white p-5 shadow-soft sm:p-8"
          >
            {status === "success" ? (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                className="flex flex-col items-center px-2 py-10 text-center focus:outline-none"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <CheckCircle2 className="h-11 w-11" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-2xl">{t("contact.success.title")}</h3>
                <p className="mt-3 max-w-md text-lg text-ink/80">
                  {t("contact.success.text")}
                </p>
                <Button
                  variant="secondary"
                  className="mt-8"
                  onClick={() => setStatus("idle")}
                >
                  {t("contact.success.again")}
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                {/* Category selector */}
                <fieldset>
                  <legend className="mb-2 text-sm font-extrabold text-brand-navy">
                    {t("contact.categoryLabel")}
                  </legend>
                  <div className="grid gap-1.5 rounded-2xl bg-surface p-1.5 sm:grid-cols-3">
                    {INQUIRY_CATEGORIES.map((value) => (
                      <label key={value} className="relative block cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={value}
                          checked={category === value}
                          onChange={() => setCategory(value)}
                          className="peer sr-only"
                        />
                        <span className="flex min-h-[3.5rem] items-center justify-center rounded-xl px-3 py-2 text-center text-sm font-extrabold leading-snug text-brand-navy transition-colors hover:bg-white peer-checked:bg-brand-navy peer-checked:text-white peer-checked:shadow-soft peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-blue">
                          {t(`contact.categories.${value}`)}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <p className="mt-3 text-sm font-semibold text-ink/80" aria-live="polite">
                  {t(`contact.categoryHints.${category}`)}
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <FieldShell
                    field="name"
                    label={
                      category === "other"
                        ? t("contact.fields.name.label")
                        : t("contact.fields.name.labelContact")
                    }
                    required
                    requiredText={requiredText}
                    error={visibleError("name")}
                  >
                    <input
                      {...controlProps("name")}
                      type="text"
                      autoComplete="name"
                      aria-required="true"
                      value={values.name}
                      onChange={(e) => setValue("name", e.target.value)}
                      placeholder={t("contact.fields.name.placeholder")}
                      className="field"
                    />
                  </FieldShell>

                  <FieldShell
                    field="organization"
                    label={organizationLabel}
                    required={isOrganizationRequired(category)}
                    requiredText={requiredText}
                    error={visibleError("organization")}
                  >
                    <input
                      {...controlProps("organization")}
                      type="text"
                      autoComplete="organization"
                      aria-required={isOrganizationRequired(category) ? "true" : undefined}
                      value={values.organization}
                      onChange={(e) => setValue("organization", e.target.value)}
                      placeholder={t("contact.fields.organization.placeholder")}
                      className="field"
                    />
                  </FieldShell>

                  <FieldShell
                    field="email"
                    label={t("contact.fields.email.label")}
                    required
                    requiredText={requiredText}
                    error={visibleError("email")}
                  >
                    <input
                      {...controlProps("email")}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      aria-required="true"
                      value={values.email}
                      onChange={(e) => setValue("email", e.target.value)}
                      placeholder={t("contact.fields.email.placeholder")}
                      className="field"
                    />
                  </FieldShell>

                  <FieldShell
                    field="phone"
                    label={t("contact.fields.phone.label")}
                    requiredText={requiredText}
                    error={visibleError("phone")}
                  >
                    <input
                      {...controlProps("phone")}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(e) => setValue("phone", e.target.value)}
                      placeholder={t("contact.fields.phone.placeholder")}
                      className="field"
                    />
                  </FieldShell>

                  {category === "schools" && (
                    <div className="sm:col-span-2">
                      <FieldShell
                        field="workshop"
                        label={t("contact.fields.workshop.label")}
                        requiredText={requiredText}
                        error={visibleError("workshop")}
                      >
                        <div className="relative">
                          <select
                            {...controlProps("workshop")}
                            value={workshop}
                            onChange={(e) =>
                              setWorkshop(isWorkshopId(e.target.value) ? e.target.value : "")
                            }
                            className="field appearance-none !pr-12"
                          >
                            <option value="">{t("contact.fields.workshop.none")}</option>
                            {WORKSHOPS.map(({ id }) => (
                              <option key={id} value={id}>
                                {messages.workshops.items[id].title}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-blue"
                            aria-hidden="true"
                          />
                        </div>
                      </FieldShell>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <FieldShell
                      field="message"
                      label={t("contact.fields.message.label")}
                      required
                      requiredText={requiredText}
                      error={visibleError("message")}
                    >
                      <textarea
                        {...controlProps("message")}
                        rows={5}
                        aria-required="true"
                        value={values.message}
                        onChange={(e) => setValue("message", e.target.value)}
                        placeholder={messagePlaceholder}
                        className="field resize-y"
                      />
                      <p
                        className="mt-1 text-right text-xs font-bold text-ink/80"
                        aria-hidden="true"
                      >
                        {t("contact.fields.message.counter", {
                          count: values.message.length,
                          max: LIMITS.messageMax,
                        })}
                      </p>
                    </FieldShell>
                  </div>
                </div>

                {/* Honeypot (hidden from people and assistive tech) */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Website
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={values.website}
                      onChange={(e) => setValue("website", e.target.value)}
                    />
                  </label>
                </div>

                {showSummary && (
                  <p
                    role="alert"
                    className="mt-5 flex items-start gap-2 rounded-xl border-2 border-brand-red/40 bg-brand-red/5 px-4 py-3 text-sm font-bold text-brand-burgundy"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    {t("contact.errors.summary")}
                  </p>
                )}

                {status === "error" && (
                  <p
                    role="alert"
                    className="mt-5 flex items-start gap-2 rounded-xl border-2 border-brand-burgundy/40 bg-brand-burgundy/5 px-4 py-3 text-sm font-bold text-brand-burgundy"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>
                      {sendErrorBefore}
                      {sendErrorAfter !== undefined && (
                        <a href={`mailto:${SITE.email}`} className="underline">
                          {SITE.email}
                        </a>
                      )}
                      {sendErrorAfter}
                    </span>
                  </p>
                )}

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-ink/80">{t("contact.privacy")}</p>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === "submitting"}
                    aria-busy={status === "submitting"}
                    className="sm:min-w-[13rem]"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                        {t("contact.submitting")}
                      </>
                    ) : (
                      <>
                        {t("contact.submit")}
                        <Send className="h-5 w-5" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

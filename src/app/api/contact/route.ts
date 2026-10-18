import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import {
  hasErrors,
  isInquiryCategory,
  validateInquiry,
  type InquiryInput,
} from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

const CATEGORY_LABEL = {
  schools: "Školy (ZŠ a SŠ)",
  companies: "Firmy a organizácie",
  other: "Dobrovoľníctvo & Iné dopyty",
} as const;

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Strip CR/LF so user input can never break out of a single-line field. */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/**
 * POST /api/contact — validates the inquiry and e-mails it to the association
 * through Resend's REST API (no SDK dependency).
 *
 * Env (see .env.example): RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL.
 * Without RESEND_API_KEY the endpoint answers 503 in production (so the form
 * shows its "write to us directly" fallback instead of silently losing the
 * message) and only logs the inquiry in development.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real visitors never fill the hidden "website" field. Pretend success.
  if (str(body.website).trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (!isInquiryCategory(body.category)) {
    return NextResponse.json({ ok: false, error: "invalid_category" }, { status: 422 });
  }

  const input: InquiryInput = {
    category: body.category,
    name: oneLine(str(body.name)),
    organization: oneLine(str(body.organization)),
    email: oneLine(str(body.email)),
    phone: oneLine(str(body.phone)),
    workshop: oneLine(str(body.workshop)),
    message: str(body.message).trim(),
  };

  const errors = validateInquiry(input);
  if (hasErrors(errors)) {
    return NextResponse.json({ ok: false, error: "validation", errors }, { status: 422 });
  }

  const lang = body.lang === "en" ? "en" : "sk";
  const subject = `[Spolu Vpred web] ${CATEGORY_LABEL[input.category]} — ${input.name}`;
  const text = [
    `Kategória: ${CATEGORY_LABEL[input.category]}`,
    `Meno / kontaktná osoba: ${input.name}`,
    `Škola / organizácia: ${input.organization || "—"}`,
    `E-mail: ${input.email}`,
    `Telefón: ${input.phone || "—"}`,
    `Workshop: ${input.workshop || "—"}`,
    `Jazyk stránky: ${lang}`,
    "",
    input.message,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY not set — dev mode, inquiry not sent:\n" + text);
      return NextResponse.json({ ok: true, delivered: false });
    }
    console.error("[contact] RESEND_API_KEY is not configured");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Spolu Vpred web <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL || SITE.email],
        reply_to: input.email,
        subject: oneLine(subject),
        text,
      }),
    });

    if (!response.ok) {
      console.error("[contact] Resend error", response.status, await response.text());
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[contact] Delivery request failed", error);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}

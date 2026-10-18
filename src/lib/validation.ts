/**
 * Inquiry-form validation, shared by the browser (inline feedback) and the
 * `/api/contact` route (authoritative check). Returns error *codes*; the UI
 * maps them to localised messages (`contact.errors.*`).
 */
import { isWorkshopId } from "@/lib/workshops";

export const INQUIRY_CATEGORIES = ["schools", "companies", "other"] as const;
export type InquiryCategory = (typeof INQUIRY_CATEGORIES)[number];

export const LIMITS = {
  nameMin: 2,
  nameMax: 100,
  organizationMax: 150,
  emailMax: 254,
  phoneMax: 30,
  phoneMinDigits: 7,
  phoneMaxDigits: 15,
  messageMin: 10,
  messageMax: 2000,
} as const;

export interface InquiryInput {
  category: InquiryCategory;
  name: string;
  organization: string;
  email: string;
  phone: string;
  /** Workshop id, or "" for "not sure yet". Only meaningful for schools. */
  workshop: string;
  message: string;
}

export type InquiryField = keyof Omit<InquiryInput, "category">;

export type ErrorCode =
  | "required"
  | "tooShort"
  | "tooLong"
  | "invalidEmail"
  | "invalidPhone";

export interface FieldError {
  code: ErrorCode;
  /** Numeric limit for `tooShort` / `tooLong`, used in the message. */
  limit?: number;
}

export type InquiryErrors = Partial<Record<InquiryField, FieldError>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_RE = /^\+?[\d\s().\-/]+$/;

export function isInquiryCategory(value: unknown): value is InquiryCategory {
  return (
    typeof value === "string" &&
    (INQUIRY_CATEGORIES as readonly string[]).includes(value)
  );
}

/** Organisation is mandatory for schools and companies, optional otherwise. */
export function isOrganizationRequired(category: InquiryCategory): boolean {
  return category !== "other";
}

export function validateInquiry(input: InquiryInput): InquiryErrors {
  const errors: InquiryErrors = {};
  const name = input.name.trim();
  const organization = input.organization.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const message = input.message.trim();

  if (!name) errors.name = { code: "required" };
  else if (name.length < LIMITS.nameMin)
    errors.name = { code: "tooShort", limit: LIMITS.nameMin };
  else if (name.length > LIMITS.nameMax)
    errors.name = { code: "tooLong", limit: LIMITS.nameMax };

  if (!organization) {
    if (isOrganizationRequired(input.category))
      errors.organization = { code: "required" };
  } else if (organization.length > LIMITS.organizationMax) {
    errors.organization = { code: "tooLong", limit: LIMITS.organizationMax };
  }

  if (!email) errors.email = { code: "required" };
  else if (email.length > LIMITS.emailMax || !EMAIL_RE.test(email))
    errors.email = { code: "invalidEmail" };

  if (phone) {
    const digits = phone.replace(/\D/g, "").length;
    if (
      phone.length > LIMITS.phoneMax ||
      !PHONE_CHARS_RE.test(phone) ||
      digits < LIMITS.phoneMinDigits ||
      digits > LIMITS.phoneMaxDigits
    ) {
      errors.phone = { code: "invalidPhone" };
    }
  }

  if (input.workshop && !isWorkshopId(input.workshop)) {
    // A tampered select value; treat as missing rather than inventing a message.
    errors.workshop = { code: "required" };
  }

  if (!message) errors.message = { code: "required" };
  else if (message.length < LIMITS.messageMin)
    errors.message = { code: "tooShort", limit: LIMITS.messageMin };
  else if (message.length > LIMITS.messageMax)
    errors.message = { code: "tooLong", limit: LIMITS.messageMax };

  return errors;
}

export function hasErrors(errors: InquiryErrors): boolean {
  return Object.keys(errors).length > 0;
}

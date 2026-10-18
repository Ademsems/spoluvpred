"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { WorkshopId } from "@/lib/workshops";
import type { InquiryCategory } from "@/lib/validation";
import { SECTION_IDS } from "@/lib/site";

/**
 * Shared state that lets any section (workshop cards, audience cards, footer)
 * pre-fill the contact form and scroll to it.
 */
interface InquiryContextValue {
  category: InquiryCategory;
  workshop: WorkshopId | "";
  /** Bumped on every programmatic request so the form can move focus. */
  focusTick: number;
  setCategory: (category: InquiryCategory) => void;
  setWorkshop: (workshop: WorkshopId | "") => void;
  /** Pre-select a workshop (switches to the Schools category) and scroll to the form. */
  requestWorkshop: (id: WorkshopId) => void;
  /** Pre-select a form category and scroll to the form. */
  requestCategory: (category: InquiryCategory) => void;
}

const InquiryContext = createContext<InquiryContextValue | null>(null);

/** Anchor id of the form card — prefill requests land on the form itself, not the section heading. */
export const CONTACT_FORM_ID = "contact-form";

function scrollToContact() {
  const el =
    document.getElementById(CONTACT_FORM_ID) ??
    document.getElementById(SECTION_IDS.contact);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [category, setCategoryState] = useState<InquiryCategory>("schools");
  const [workshop, setWorkshopState] = useState<WorkshopId | "">("");
  const [focusTick, setFocusTick] = useState(0);

  const setCategory = useCallback((next: InquiryCategory) => {
    setCategoryState(next);
    // The workshop dropdown only exists for schools.
    if (next !== "schools") setWorkshopState("");
  }, []);

  const requestWorkshop = useCallback((id: WorkshopId) => {
    setCategoryState("schools");
    setWorkshopState(id);
    setFocusTick((n) => n + 1);
    scrollToContact();
  }, []);

  const requestCategory = useCallback(
    (next: InquiryCategory) => {
      setCategory(next);
      setFocusTick((n) => n + 1);
      scrollToContact();
    },
    [setCategory],
  );

  const value = useMemo<InquiryContextValue>(
    () => ({
      category,
      workshop,
      focusTick,
      setCategory,
      setWorkshop: setWorkshopState,
      requestWorkshop,
      requestCategory,
    }),
    [category, workshop, focusTick, setCategory, requestWorkshop, requestCategory],
  );

  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>;
}

export function useInquiry(): InquiryContextValue {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error("useInquiry must be used inside <InquiryProvider>");
  return ctx;
}

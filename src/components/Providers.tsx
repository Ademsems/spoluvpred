"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { InquiryProvider } from "@/context/InquiryContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <InquiryProvider>{children}</InquiryProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}

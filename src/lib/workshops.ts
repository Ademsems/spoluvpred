import {
  Home,
  HeartPulse,
  Landmark,
  Leaf,
  Handshake,
  MessagesSquare,
  Mic,
  Newspaper,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { Messages } from "@/context/LanguageContext";
import type { BrandAccent } from "@/lib/brand";

export type WorkshopId = keyof Messages["workshops"]["items"];
export type WorkshopCategory = "prevention" | "mental" | "society";
export type WorkshopFilter = "all" | WorkshopCategory;

export interface WorkshopMeta {
  id: WorkshopId;
  icon: LucideIcon;
  category: WorkshopCategory;
}

/** Visual accent per category: red = prevention, blue = mental health, navy = society. */
export const CATEGORY_ACCENT: Record<WorkshopCategory, BrandAccent> = {
  prevention: "red",
  mental: "blue",
  society: "navy",
};

export const WORKSHOP_FILTERS: readonly WorkshopFilter[] = [
  "all",
  "prevention",
  "mental",
  "society",
];

/**
 * Catalog order follows the client's list. Titles / descriptions live in
 * `messages/*.json` under `workshops.items.<id>`; this file only holds the
 * language-independent metadata (icon + category).
 */
export const WORKSHOPS: readonly WorkshopMeta[] = [
  { id: "bullying", icon: ShieldCheck, category: "prevention" },
  { id: "wellbeing", icon: HeartPulse, category: "mental" },
  { id: "critical", icon: Newspaper, category: "society" },
  { id: "nature", icon: Leaf, category: "society" },
  { id: "respect", icon: Handshake, category: "society" },
  { id: "trafficking", icon: ShieldAlert, category: "prevention" },
  { id: "homelessness", icon: Home, category: "society" },
  { id: "racism", icon: Scale, category: "prevention" },
  { id: "extremism", icon: Landmark, category: "prevention" },
  { id: "assertive", icon: MessagesSquare, category: "mental" },
  { id: "digital", icon: Smartphone, category: "mental" },
  { id: "speaking", icon: Mic, category: "mental" },
];

export function isWorkshopId(value: string): value is WorkshopId {
  return WORKSHOPS.some((w) => w.id === value);
}

/** Lower-case and strip diacritics so "sikana" matches "šikana". */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

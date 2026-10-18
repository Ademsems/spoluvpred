"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import skJson from "@/messages/sk.json";
import enJson from "@/messages/en.json";

/** Slovak is the source of truth for the dictionary shape. */
export type Messages = typeof skJson;

/** Compile-time guard: en.json must have exactly the same keys as sk.json. */
const sk: Messages = skJson;
const en: Messages = enJson;

export type Lang = "sk" | "en";

export const LANGUAGES: readonly Lang[] = ["sk", "en"];
export const DEFAULT_LANG: Lang = "sk";
export const LANG_STORAGE_KEY = "spoluvpred.lang";

const DICTIONARIES: Record<Lang, Messages> = { sk, en };

/** Dot-path union of every string leaf, e.g. `"hero.tagline"`. Arrays are excluded. */
type Leaves<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends readonly unknown[]
      ? never
      : Leaves<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type MessageKey = Leaves<Messages>;
export type TranslateVars = Record<string, string | number>;

function isLang(value: unknown): value is Lang {
  return value === "sk" || value === "en";
}

function lookup(dict: Messages, key: string): string | undefined {
  let node: unknown = dict;
  for (const part of key.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Translate a dot-path key, with optional `{placeholder}` values. */
  t: (key: MessageKey, vars?: TranslateVars) => string;
  /** Whole typed dictionary for the active language (use for arrays / dynamic keys). */
  messages: Messages;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start in the default language so server HTML and first client
  // render match; the stored preference is applied right after hydration.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (isLang(stored)) setLangState(stored);
    } catch {
      /* storage unavailable (private mode / blocked) — keep default */
    }

    // Keep several open tabs in sync.
    const onStorage = (event: StorageEvent) => {
      if (event.key === LANG_STORAGE_KEY && isLang(event.newValue)) {
        setLangState(event.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Reflect the language on <html lang>, the tab title and meta description.
  useEffect(() => {
    const dict = DICTIONARIES[lang];
    document.documentElement.lang = lang;
    document.title = dict.meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", dict.meta.description);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const messages = DICTIONARIES[lang];
    const t = (key: MessageKey, vars?: TranslateVars) => {
      const found = lookup(messages, key) ?? lookup(DICTIONARIES[DEFAULT_LANG], key);
      if (found === undefined) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[i18n] Missing translation key: ${key}`);
        }
        return key;
      }
      return interpolate(found, vars);
    };
    return { lang, setLang, t, messages };
  }, [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}

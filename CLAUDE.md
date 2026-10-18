# CLAUDE.md — OZ Spolu Vpred website

Bilingual (Slovak default / English) one-page marketing site for the Slovak civic association **Občianske združenie Spolu Vpred** (SpoluVpred o.z., Bratislava), which runs interactive workshops and prevention activities for primary and secondary schools (ZŠ a SŠ).

Built by DunajMedia. Read this file before changing anything — it documents the architecture, design tokens, i18n conventions, form rules, donation data, and the things that are **still placeholders**.

---

## 1. Status and open items (read first)

The site builds and lints clean (`npm run build`, `npm run lint`, `tsc --noEmit` all exit 0). The following were **not supplied by the client** and must be confirmed before launch:

| # | Item | Where | Current state |
|---|------|-------|---------------|
| 1 | **Donation IBAN** | `src/lib/site.ts` → `BANK.iban` | Placeholder `SK00 0000 0000 0000 0000 0000` (fails the mod‑97 check on purpose, so it can never receive money). The donation card shows a visible "sample data" notice while the placeholder is in place; the notice disappears automatically once a real IBAN is set. |
| 2 | **PAY by square QR** | `src/components/brand/PayBySquareMock.tsx` | Non‑scannable SVG mock‑up, labelled as a placeholder in the UI. Replace with a generated PAY by square code once the IBAN is known. |
| 3 | **Facebook page URL** | `src/lib/site.ts` → `SITE.facebook.url` | Only the name "Spolu Vpred" was supplied, so the link is a Facebook *search* for that name. Replace with the direct page URL. |
| 4 | **Registered address and IČO** | `src/lib/site.ts` → `SITE.street`, `SITE.ico` | `undefined`; the footer renders them automatically once set. |
| 5 | **Contact‑form email delivery** | `.env.local` → `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` | Not configured. In production, without a key `/api/contact` returns 503 and the form shows an honest "write to us directly" fallback. See §8. |
| 6 | **Copy review** | `src/messages/*.json` | Client‑supplied text is used verbatim (nav labels, hero tagline/headline/description/CTAs/chips, the 12 workshop titles, form category names, `Dar / Podpora projektu`, e‑mail, `@spoluvpred`). **Everything else — About copy, all 12 workshop descriptions, Audience section, form labels/errors, donation copy, footer, and all English text beyond the supplied labels — was drafted by DunajMedia and needs review by a Slovak speaker and the client.** |
| 7 | **Logo** | `src/components/brand/LogoMark.tsx` | Hand‑built SVG approximation of the figures‑reaching‑for‑a‑star mark. Swap in the official vector from the brand manual when available. |
| 8 | **Workshop categories** | `src/lib/workshops.ts` | The mapping of the 12 workshops to the 3 filter categories is a DunajMedia proposal. |

Search `TODO(client)` in `src/lib/site.ts` for the in‑code markers.

---

## 2. Commands

```bash
npm ci               # install (lockfile is committed)
npm run dev          # http://localhost:3000
npm run build        # production build — must exit 0
npm run lint         # next lint — must report 0 warnings/errors
npx tsc --noEmit     # strict type-check
npm run start        # serve the production build
```

**Standing rule (DunajMedia):** before committing, `npm run build` and `npm run lint` must both be clean. Do not run `next build` while `next dev` is running from the same folder — they share `.next/`; stop the dev server first.

`next build` fetches Nunito Sans from Google Fonts at build time (`next/font/google`), so the **build needs internet access** (or a populated font cache). No other network access is needed to build.

---

## 3. Stack

| Concern | Choice |
|---------|--------|
| Framework | Next.js **14.2** App Router, React 18, TypeScript `strict` |
| Styling | Tailwind CSS 3.4 (+ `clsx` and `tailwind-merge` via `cn()`) |
| Motion | Framer Motion 14 (`MotionConfig reducedMotion="user"`) |
| Icons | `lucide-react` 1.x + two inline SVG glyphs (see below) |
| Font | `next/font/google` **Nunito Sans** → CSS var `--font-sans` |
| Confetti | `canvas-confetti` (form success only, skipped for reduced motion) |

Notes:
- `lucide-react` 1.x **no longer ships `Instagram` / `Facebook`** icons. They are drawn inline in `src/components/brand/SocialIcons.tsx`.
- **Zero broken assets rule:** the site loads **no external images**. All visuals are inline SVG or CSS gradients (`BrandPlaceholder`, `LogoMark`, `PayBySquareMock`, `app/icon.svg`). Never add a remote `<Image src="https://…">`.
- `tailwind-merge` 3.x targets Tailwind 4 but is only used for harmless class de‑duplication here; it does not drop v3 classes.

---

## 4. Folder structure

```
.
├── CLAUDE.md                      ← this file
├── README.md                      ← short public readme
├── .env.example                   ← env var template (no secrets)
├── .eslintrc.json                 ← "root": true (see §12)
├── next.config.mjs                ← strict mode, security headers, no X-Powered-By
├── tailwind.config.ts             ← brand colours imported from src/lib/brand.ts
└── src/
    ├── app/
    │   ├── layout.tsx             ← font, <html lang>, metadata, JSON-LD, <Providers>
    │   ├── page.tsx               ← composes the sections (server component)
    │   ├── globals.css            ← Tailwind layers, .container-page/.section-y/.eyebrow/.field
    │   ├── icon.svg               ← favicon (logo mark)
    │   └── api/contact/route.ts   ← POST: validate + e-mail the inquiry
    ├── components/
    │   ├── Providers.tsx          ← MotionConfig > LanguageProvider > InquiryProvider
    │   ├── SkipLink.tsx
    │   ├── Navbar.tsx             ← utility top bar + sticky header + mobile menu
    │   ├── LanguageToggle.tsx     ← SK | EN switch
    │   ├── Hero.tsx
    │   ├── AboutSection.tsx
    │   ├── WorkshopsSection.tsx   ← search + category filters + grid
    │   ├── WorkshopCard.tsx
    │   ├── AudienceSection.tsx    ← "Pre školy" + "Dobrovoľníctvo" cards
    │   ├── ContactSection.tsx     ← segmented form
    │   ├── DonateSection.tsx      ← bank transfer card, copy buttons, QR mock
    │   ├── Footer.tsx
    │   ├── brand/
    │   │   ├── LogoMark.tsx       ← figures + star SVG (variants: color | light)
    │   │   ├── Logo.tsx           ← mark + "Spolu Vpred" wordmark lockup
    │   │   ├── BrandPlaceholder.tsx ← CSS mesh-gradient stand-in for imagery
    │   │   ├── PayBySquareMock.tsx
    │   │   └── SocialIcons.tsx
    │   └── ui/
    │       ├── Button.tsx         ← Button + ButtonLink (pill, 5 variants)
    │       ├── SectionHeading.tsx
    │       └── Reveal.tsx         ← scroll-in fade/rise
    ├── context/
    │   ├── LanguageContext.tsx    ← lang state, t(), typed dictionary
    │   └── InquiryContext.tsx     ← shared contact-form category/workshop + prefill/scroll
    ├── hooks/useActiveSection.ts  ← IntersectionObserver for nav highlighting
    ├── lib/
    │   ├── brand.ts               ← BRAND colour tokens, withAlpha()
    │   ├── site.ts                ← org facts, BANK data, SECTION_IDS, NAV_KEYS
    │   ├── workshops.ts           ← 12 workshops: id, icon, category
    │   ├── validation.ts          ← form rules (shared client + server)
    │   └── cn.ts
    └── messages/
        ├── sk.json                ← source of truth for the dictionary shape
        └── en.json                ← must mirror sk.json exactly (compile-time checked)
```

### Component tree

```
RootLayout (server) ── <Providers> (client)
└── Home (server)
    ├── SkipLink
    ├── Navbar ── LanguageToggle, Logo, ButtonLink(cta), mobile menu
    ├── <main id="main">
    │   ├── Hero               #top        ── BrandPlaceholder + LogoMark
    │   ├── AboutSection       #about
    │   ├── WorkshopsSection   #workshops  ── WorkshopCard ×12 (BrandPlaceholder header)
    │   ├── AudienceSection    #schools, #volunteering
    │   ├── ContactSection     #contact (#contact-form = the form card)
    │   └── DonateSection      #support    ── CopyRow ×2, PayBySquareMock
    └── Footer
```

Only `layout.tsx`, `page.tsx` and `api/contact/route.ts` are server code; every component is a client component because they all read the language context.

---

## 5. Design tokens

Source of truth: **`src/lib/brand.ts`** (imported by `tailwind.config.ts` and by components needing raw hex).

| Token | Hex | Tailwind | Role |
|-------|-----|----------|------|
| Primary Blue | `#005285` | `brand-blue` | Navigation links, key borders, highlights |
| Primary Red | `#DA0D3B` | `brand-red` | High-visibility CTAs, interactive badges |
| Dark Navy / Midnight | `#082D70` | `brand-navy` | Headings, footer background, deep containers |
| Deep Burgundy | `#850A3A` | `brand-burgundy` | Subtle accent badges, borders, error text |
| Light Surface | `#F3F6FA` | `surface` | Card backgrounds, info panels |
| Pure White | `#FFFFFF` | `white` | Page background, overlays |
| Dark Body Text | `#202632` | `ink` | Body text (use `text-ink` or `text-ink/80`) |

Use opacity modifiers for tints (`bg-brand-blue/10`). Do not introduce colours outside this palette.

### Verified contrast (computed with the WCAG 2.x formula)

| Pair | Ratio | Level |
|------|------:|-------|
| ink on white | 15.17 | AAA |
| ink on surface | 13.99 | AAA |
| ink/80 on white / on surface (secondary text — **the lightest text allowed**) | 7.94 / 7.49 | AAA |
| navy on white / surface | 12.97 / 11.96 | AAA |
| blue on white / surface | 8.25 / 7.61 | AAA |
| blue on blue/10 (eyebrow badge) | 7.03 | AAA |
| white on navy | 12.97 | AAA |
| white/90 on navy (footer body) | 10.75 | AAA |
| burgundy on white | 9.99 | AAA |
| **red on white / white on red (CTA)** | **5.12** | **AA only** |
| red on surface | 4.72 | AA only |
| **red on navy** | **2.53** | **FAIL — never put red text on navy** |

So "AAA" holds for body text, headings, links and the footer; **red text/buttons are AA (5.1:1)** — acceptable for bold/large text and buttons, but do not use red for small light text. Placeholder text is `text-ink/70`.

### Typography

- Brand typeface is **Avenir Next**; the web stand‑in is **Nunito Sans** loaded with `next/font/google` (`subsets: ["latin", "latin-ext"]` — `latin-ext` is required for ľ š č ž ť ď ň ĺ ŕ ô ä).
- `layout.tsx` exposes it as `--font-sans`; `tailwind.config.ts` aliases `font-sans` to
  `var(--font-sans), "Avenir Next", Avenir, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
  The Nunito Sans web font always wins; Avenir Next/system fonts are only fallbacks while it loads.
- `adjustFontFallback: false` is deliberate (next/font has no metrics entry for Nunito Sans and would log an error).
- Headings: `font-extrabold tracking-tight text-brand-navy` (set globally in `globals.css`). Body: regular, `text-ink`.

### Shape, spacing, motion

- Cards `rounded-3xl`, inner tiles/inputs `rounded-2xl`/`rounded-xl`, buttons/chips fully rounded (`rounded-full`).
- Shadows: `shadow-soft`, `shadow-lift`, `shadow-cta` (custom, navy/red‑tinted).
- Layout helpers in `globals.css`: `.container-page` (max‑w‑7xl), `.section-y`, `.eyebrow`, `.field` (inputs).
- Sections alternate backgrounds: hero (surface→white) / about (white) / workshops (surface) / audience (white) / contact (surface) / donate (white) / footer (navy).
- Motion: `Reveal` fades/rises on scroll, hero pills float, logo star twinkles. `MotionConfig reducedMotion="user"` plus `motion-safe:` / `motion-reduce:` classes disable movement for users who prefer reduced motion; CSS smooth scrolling is turned off under `prefers-reduced-motion`.

### `BrandPlaceholder` (mesh gradients)

`<BrandPlaceholder accent="mixed|blue|red|navy|burgundy" label? decorated? />` renders layered `radial-gradient`s built from brand colours plus an inline‑SVG dot grid. Pass `label` to expose it as `role="img"`; otherwise it is `aria-hidden`. Workshop cards use the category accent: **red = Prevention & Safety, blue = Mental Health & Growth, navy = Society & Responsibility** (`CATEGORY_ACCENT` in `src/lib/workshops.ts`).

---

## 6. Internationalisation

### Mechanism

- `src/context/LanguageContext.tsx` — client context. `lang` is `"sk"` (default) or `"en"`.
- The provider **always starts in `sk`** so server HTML and the first client render match; the stored choice is applied in an effect right after hydration. Consequence: an English visitor sees Slovak for a brief moment on first paint. That is the accepted trade‑off of a client‑only i18n (no cookies/routes, per the brief).
- Persistence: `localStorage` key **`spoluvpred.lang`** (wrapped in `try/catch`; works when storage is blocked). The `storage` event syncs other open tabs.
- Side effects on change: `document.documentElement.lang`, `document.title`, `<meta name="description">`.
- API: `const { lang, setLang, t, messages } = useLanguage();`
  - `t("hero.tagline")` → string. Keys are **type‑checked**: `MessageKey` is the union of all dot‑paths that end in a string.
  - `t("workshops.resultsCount", { count: 12 })` → replaces `{count}`. Unknown placeholders are left as‑is.
  - `messages` is the whole typed dictionary for the active language — use it for **arrays** (`messages.hero.chips`) and dynamic lookups (`messages.workshops.items[id]`).
  - Missing key → falls back to Slovak; logs a warning in development; never throws.

### Dictionaries

- `src/messages/sk.json` defines the shape; `src/messages/en.json` is assigned to `typeof sk` in `LanguageContext.tsx`, so **a key present in one file and missing/extra in the other fails `tsc` and `next build`**.
- Keys are camelCase, grouped by section, mirroring the component: `meta`, `a11y`, `topbar`, `nav`, `hero`, `about`, `workshops`, `audience`, `contact`, `donate`, `footer`.
- Conventions:
  - Leaf = string. A list of plain strings is a JSON array (`hero.chips`, `audience.*.points`).
  - Per‑item copy is an object keyed by a stable id (`workshops.items.<id>.{title,topic,description}`, `about.differentiators.<key>.{title,text}`).
  - Placeholders use `{name}` (`{count}`, `{min}`, `{max}`, `{email}`, `{year}`, `{value}`, `{label}`).
  - **Avoid number+noun plurals** (Slovak declension): use "Nájdené workshopy: {count}" and "Minimálny počet znakov: {min}" — number after a colon.
  - Accessibility strings live under `a11y.*`.
  - Nav labels are `nav.<key>` where `<key>` ∈ `NAV_KEYS` in `src/lib/site.ts`.
- Exact client text (do not edit without the client): `nav.*`, `hero.tagline`, `hero.brand`, `hero.headlineLine1/2`, `hero.description`, `hero.ctaPrimary/Secondary`, `hero.chips`, the 12 `workshops.items.*.title` (Slovak), `workshops.categories.*` (Slovak), `contact.categories.*` (Slovak), `donate.noteValue` / `BANK.paymentNote`.

### Adding a language

1. Copy `sk.json` → `de.json`, translate.
2. In `LanguageContext.tsx`: add `"de"` to `Lang`, `LANGUAGES`, `isLang`, `DICTIONARIES`.
3. Add a button in `LanguageToggle.tsx` and the two `a11y.switchTo*` strings.

### Adding or changing a workshop

1. Add its id to `workshops.items` in **both** JSON files (`title`, `topic`, `description`).
2. Add `{ id, icon, category }` to `WORKSHOPS` in `src/lib/workshops.ts` (the `WorkshopId` type is derived from the JSON, so the compiler tells you if you forget one side).
3. Search, filters, the prefill dropdown and the API's allowed ids update automatically.

---

## 7. Sections and behaviour

- **Navbar** — slim navy utility bar (desktop: e‑mail, Instagram, Facebook) + sticky white header: logo lockup, six links (`About, Workshops, For Schools, Volunteering, Support Us, Contact`) shown inline from `xl` (≥1280px), hamburger below. Active link follows scroll (`useActiveSection`, `aria-current="location"`). Mobile menu: `aria-expanded`/`aria-controls`, closes on Escape / link click / growing to desktop, scrolls if taller than the viewport. Language toggle always visible. Header CTA "Mám záujem o spoluprácu" → `#contact`.
- **Hero** — tagline badge, H1 (`Spolu Vpred` + two headline lines; an sr‑only em dash keeps the exact client sentence for screen readers), description, CTAs (`#contact`, `#about`), four trust chips, mesh‑gradient visual with logo mark, floating "Tvoríme / Spájame / Objavujeme" pills and a "12 workshop topics · ZŠ a SŠ" stat.
- **About** — narrative + three differentiators (active participation, practical skills, safe space).
- **Workshops** — 12 cards. Category filter (`Všetky`, `Prevencia & Bezpečnosť`, `Duševné zdravie & Rozvoj`, `Spoločnosť & Zodpovednosť`, 4 per category) combined with a live search over title + topic + description in the **active language**, **diacritics‑insensitive** ("sikana" finds "šikana"). Result count is an `aria-live` status; empty state with reset. Each card has an icon tile, topic, title, description, "ZŠ a SŠ" badge, and **"Mám záujem o tento workshop"**.
- **Audience** (destination of the "Pre školy" and "Dobrovoľníctvo" nav links) — two cards whose CTAs pre‑select the contact category (`schools` / `other`).
- **Contact** — see §8.
- **Donate** — see §9.
- **Footer** — legal identity, nav, contact + social links, volunteer callout (pre‑selects the `other` category), dynamic copyright year (`suppressHydrationWarning`), back‑to‑top.

### Prefill flow (`InquiryContext`)

`requestWorkshop(id)` sets category = `schools`, workshop = `id`, bumps `focusTick`, and smooth‑scrolls to **`#contact-form`** (the form card, not the section heading — on one‑column layouts the heading is far above the form). `requestCategory(cat)` does the same for a category. `ContactSection` reacts to `focusTick` by moving focus (after ~650 ms, `preventScroll`) to the workshop select if one was chosen, otherwise to the name field. Switching to a non‑school category clears the workshop.

---

## 8. Contact form

### Categories (segmented control = native radio inputs)

| Value | Label (SK) | Organisation field | Workshop dropdown |
|-------|------------|--------------------|-------------------|
| `schools` (default) | Školy (ZŠ a SŠ) | "Názov školy" — **required** | shown |
| `companies` | Firmy a organizácie | "Názov firmy alebo organizácie" — **required** | hidden |
| `other` | Dobrovoľníctvo & Iné dopyty | "Organizácia (nepovinné)" — optional | hidden |

### Validation rules (`src/lib/validation.ts` — used by the browser **and** `/api/contact`)

| Field | Rule |
|-------|------|
| `name` | required; 2–100 chars (trimmed) |
| `organization` | required for `schools` and `companies`; max 150 chars |
| `email` | required; max 254; `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` |
| `phone` | optional; if present: only `+ digits space ( ) . - /`, max 30 chars, **7–15 digits** |
| `workshop` | optional; if present must be a known workshop id |
| `message` | required; 10–2000 chars (trimmed); live `n / 2000` counter |
| `website` | **honeypot** — hidden field; a non‑empty value is silently accepted and discarded |

The validator returns **error codes** (`required | tooShort | tooLong | invalidEmail | invalidPhone`); the UI maps them to `contact.errors.*`.

### UX behaviour

- `noValidate` form; errors appear per field after blur and for all fields after a submit attempt.
- Invalid controls get `aria-invalid="true"` + `aria-describedby` → the error `<p>`; focus jumps to the first invalid field; a `role="alert"` summary appears above the button.
- States: `idle → submitting` (spinner, button disabled, `aria-busy`) `→ success` (replaces the form with a `role="status"` panel that receives focus, plus confetti unless reduced motion; "Odoslať ďalšiu správu" resets) **or** `→ error` (`role="alert"` with a clickable `mailto:` fallback; typed values are kept).

### `POST /api/contact` (`src/app/api/contact/route.ts`)

Body JSON: `{ category, name, organization, email, phone, workshop, message, website, lang }`.

| Case | Response |
|------|----------|
| body > 16 KB | 413 `too_large` |
| not a JSON object | 400 `invalid_json` |
| honeypot filled | 200 `{ok:true}` (silent) |
| bad `category` | 422 `invalid_category` |
| validation fails | 422 `{error:"validation", errors}` |
| no `RESEND_API_KEY`, **production** | 503 `not_configured` (form shows the fallback) |
| no `RESEND_API_KEY`, **development** | 200 `{ok:true, delivered:false}` and the inquiry is logged to the server console |
| delivery OK / fails | 200 `{ok:true, delivered:true}` / 502 `delivery_failed` |

Delivery uses Resend's REST API (`fetch`, no SDK): plain‑text body, `reply_to` = the visitor's address, CR/LF stripped from single‑line fields. Env (see `.env.example`):

```
RESEND_API_KEY=         # required for real delivery
CONTACT_FROM_EMAIL=     # sender on a domain verified in Resend
CONTACT_TO_EMAIL=       # defaults to info.spoluvpred@gmail.com
NEXT_PUBLIC_SITE_URL=   # canonical origin for metadataBase / Open Graph
```

There is **no rate limiting** beyond the honeypot and size/validation checks. If spam appears, add Cloudflare Turnstile or an edge rate limiter.

---

## 9. Donation / bank data

Single source of truth: `src/lib/site.ts`.

```ts
BANK = {
  accountHolder: "Občianske združenie Spolu Vpred",
  iban: "SK00 0000 0000 0000 0000 0000",   // PLACEHOLDER — replace before launch
  paymentNote: "Dar / Podpora projektu",   // exact client text
}
IS_PLACEHOLDER_IBAN  // true while iban === PLACEHOLDER_IBAN → card shows a visible notice
```

- `DonateSection` shows recipient, IBAN (monospace) and payment note. Each of IBAN and note has a **copy‑to‑clipboard** button: `navigator.clipboard.writeText` with a hidden‑textarea `execCommand` fallback; the button flips to "Skopírované/Copied" for ~2.2 s and a polite live region announces the result (or a failure message).
- The **IBAN is copied without spaces** (banking apps accept both; compact is safest); it is displayed in groups of four.
- `PayBySquareMock` is a deterministic (seeded) pseudo‑QR with finder patterns and red corner brackets, captioned as a placeholder. It must be replaced with a real PAY by square code (generated from IBAN + amount + variable symbol/note) before launch.

---

## 10. Accessibility checklist (implemented)

- Skip link; landmarks (`header`, `nav` with label, `main#main`, `footer`); single `h1`; ordered headings; every section `aria-labelledby`.
- `<html lang>` follows the language toggle; language buttons carry `lang` and `aria-pressed`.
- Visible focus ring everywhere (`:focus-visible`, 3px blue); ≥44px touch targets; native radios/select/inputs with real `<label>`s; required fields marked visually (`*`) and with sr‑only "(povinné)".
- Decorative SVG/icons are `aria-hidden`; informative visuals have `role="img"` + label; external links announce "(otvorí sa v novom okne)" and use `rel="noopener noreferrer"`.
- Live regions: workshop result count, copy confirmation, form summary/errors/success.
- Honours `prefers-reduced-motion` (Framer Motion, CSS animation, smooth scroll, confetti).
- Contrast: see §5 (red is AA, everything else AAA).

---

## 11. SEO / metadata

`layout.tsx`: Slovak `title`/`description` (from `sk.json`), Open Graph (`sk_SK`, alternate `en_US`), `metadataBase` from `NEXT_PUBLIC_SITE_URL`, theme colour navy, and `NGO` JSON‑LD (name, e‑mail, Bratislava, Instagram). The title and description switch language client‑side after hydration. There is no OG image, sitemap or robots file yet (single page; add when the domain is known).

---

## 12. Gotchas

- **`.eslintrc.json` has `"root": true`.** This repo is often checked out as a git worktree *inside* the main checkout (`.claude/worktrees/...`); without `root`, ESLint also loads the parent folder's config and fails with "Plugin @next/next was conflicted".
- **Don't edit JSON dictionaries while testing a form in `next dev`** — the hot reload remounts the client tree and wipes typed form state.
- `lucide-react` 1.x has no brand icons — extend `SocialIcons.tsx` instead of importing from lucide.
- Tailwind only sees complete class strings: map accents to literal classes (see `ACCENT_TEXT` in `WorkshopCard.tsx`), never build `text-brand-${x}` dynamically.
- `t()` keys are typed — building a key from a union (`` t(`nav.${key}`) ``) works only when every member of the union exists in the dictionary.
- The Reveal animation moves content 24px after scroll; anchors that target revealed content need extra `scroll-margin` (`#contact-form` uses `scroll-mt-32`).

---

## 13. Verification log (initial delivery)

- `npx tsc --noEmit` — 0 errors. `npm run lint` — 0 warnings/errors. `npm run build` — exit 0 (routes: `/` static, `/api/contact` dynamic, `/icon.svg`).
- Browser‑tested on the dev and production servers: all sections at 375 / 582 / 1024 / 1440 px (no horizontal overflow); filter/search (counts 4/4/4, diacritic‑insensitive match, empty state) and rapid filter switching; workshop → form prefill + focus; validation (required, too‑short, invalid e‑mail/phone, first‑invalid focus); successful submit (dev), failed submit (prod, no key → fallback alert with mailto); SK↔EN switch with persistence across reload; mobile menu open/Escape‑close; IBAN copy.
- API tested with curl: 503 / 200 (honeypot) / 422 (validation, bad category) / 400 / 413 / 405; security headers present.
- **Not tested:** real e‑mail delivery through Resend (no key available), real screen‑reader runs, Safari/Firefox.

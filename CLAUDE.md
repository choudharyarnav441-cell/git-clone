# CLAUDE.md — Clayo design system & Figma integration rules

Rules for turning Figma designs (via the Figma MCP server) into code in this repo.
The repo holds a Shopify Online Store 2.0 landing page for the **Clayo Heat & Massage Belt**.

> **Two states to keep apart.**
> - **Current** = what is in the repo today (one generated section, `clayo-landing`).
> - **Target** = the Clayo build brief (multi-section OS 2.0 theme, new tokens, `.clayo-` scoping).
>
> New work follows **Target**. Touch **Current** only to migrate it. Where they conflict, Target wins.

---

## 1. Project structure

### Current

```
src/landing.html                        ← the ONLY hand-edited source (markup + <style> + <script>)
build.mjs                               ← `node build.mjs` fills __TOKENS__ and writes the two outputs
preview/index.html                      ← GENERATED: standalone preview with sample data
shopify/sections/clayo-landing.liquid   ← GENERATED: OS 2.0 section with {% schema %}
shopify/templates/product.clayo.json    ← product template → one section "clayo-landing"
assets/clayo-hero.webp                  ← source image (copied to shopify/assets/ by build)
shopify/assets/clayo-hero.webp          ← GENERATED copy
```

- No `package.json`, no dependencies, no bundler. Node ≥18 runs `build.mjs` (ESM, `node:fs` only).
- Never edit `preview/` or `shopify/sections/clayo-landing.liquid` by hand; the build overwrites them.
- Build placeholders in `src/landing.html` look like `__PRICE__`, `__COMPARE_BLOCK__`, `__VARIANT_ID__`,
  `__HERO_IMG__`, `__RATING_TEXT__`, `__FREE_SHIP__`. `build.mjs` swaps them for sample
  values (preview) or Liquid expressions (section):

```js
// build.mjs
const fill = (tokens) => src.replace(/__([A-Z_]+)__/g, (m, k) => (k in tokens ? tokens[k] : m));
const liquid = fill({
  PRICE: money('p.price'),
  VARIANT_ID: '{{ p.selected_or_first_available_variant.id }}',
  // …
});
```

### Target (brief §22): standard Shopify theme folders, one file per concern

```
shopify/
  assets/     clayo-base.css · clayo-buybox.js · clayo-cart.js · images
  sections/   clayo-announcement · clayo-header · clayo-footer · clayo-product-hero ·
              clayo-marquee · clayo-ratings-line · clayo-photo-reviews · clayo-how-to ·
              clayo-faq · clayo-reviews-grid · clayo-research · clayo-features ·
              clayo-comparison · clayo-guarantee · clayo-newsletter · clayo-sticky-atc   (.liquid)
  snippets/   clayo-cart-drawer.liquid · clayo-seo.liquid · (icons: clayo-icon.liquid)
  templates/  product.clayo.json   ← sections in the EXACT page order below
pixel/        clayo-custom-pixel.js ← pasted into Shopify Admin → Customer events (never in theme)
```

Page order in `templates/product.clayo.json` (never reorder):

1 announcement · 2 header · 3 product-hero · 4 marquee · 5 ratings-line · 6 photo-reviews ·
7 how-to · 8 faq · 9 reviews-grid · 10 research · 11 features · 12 comparison ·
13 guarantee · 14 newsletter · 15 footer · 16 sticky-atc

In a real theme, announcement/header/footer usually live in `sections/header-group.json` /
`footer-group.json`. For this funnel they are listed in the product template so the page is
self-contained. The theme's own header/footer groups are hidden on the `clayo` template.

When migrating: split `src/landing.html` into these files, then remove `build.mjs`, `src/` and
`preview/`, or keep `build.mjs` only for preview. Do not keep two sources of truth.

---

## 2. Frameworks & libraries

| Concern   | Rule |
|-----------|------|
| Templating | Shopify Liquid, OS 2.0 JSON templates, sections with `{% schema %}` (settings, blocks, presets) |
| JS | Vanilla ES2017+, no jQuery, no frameworks, no external libraries. ≤10 KB per section where practical. Load with `defer`. |
| CSS | Hand-written, mobile-first, scoped under `.clayo-`. No Tailwind, no CSS-in-JS, no preprocessor. |
| Build | None in Target. Shopify serves `assets/` through its CDN. Current: `node build.mjs`. |
| Cart | Shopify AJAX only: `/cart.js`, `/cart/add.js`, `/cart/change.js`, `/cart/update.js` (note). |
| Analytics | `Shopify.analytics.publish('clayo_bundle_selected', …)` from theme; forwarding lives in the Custom Pixel. |

**Figma MCP output is React + Tailwind by default. Always translate it**: JSX → Liquid/HTML,
Tailwind classes → `.clayo-*` classes using the tokens below, React state → vanilla JS. Never
paste Tailwind classes, `className`, or component imports into this repo.

---

## 3. Design tokens

### Where they live
- **Current:** CSS custom properties on `.clayo` at the top of `src/landing.html`
  (`--clay`, `--ink`, `--paper`, `--sans: "Inter Tight"` …). These are **outdated**: they do not match the brief.
- **Target:** one `:root`-free block scoped to `.clayo-root` at the top of `shopify/assets/clayo-base.css`.
  No token transformation pipeline (no Style Dictionary). Figma variables map to these names by hand.

### Target token block (source of truth)

```css
.clayo-root {
  /* colour */
  --clayo-cream: #F7F1E8;      /* page background */
  --clayo-sand: #EBDDC9;       /* alt section bg, card fill */
  --clayo-blush: #F1D9CB;      /* highlight cells, chips */
  --clayo-terracotta: #B04E30; /* primary CTA, links, accents */
  --clayo-terracotta-hover: #8F3E25;
  --clayo-espresso: #2B1E17;   /* body text, borders, marquee bg */
  --clayo-cocoa: #3B2A21;      /* footer, newsletter card */
  --clayo-sage: #5F7A55;       /* ticks, verified chips */
  --clayo-marker: #F3D98B;     /* hand-drawn highlight only */

  /* type */
  --clayo-font-head: "Fraunces", Georgia, serif;          /* 600 */
  --clayo-font-body: "DM Sans", "Helvetica Neue", Arial, sans-serif; /* 400/500/700 */
  --clayo-font-hand: "Caveat", "Comic Sans MS", cursive;  /* 600, tiny annotations ONLY */
  --clayo-h1: clamp(30px, 2.2vw + 22px, 44px);
  --clayo-h2: clamp(26px, 1.8vw + 18px, 38px);
  --clayo-h3: clamp(19px, .6vw + 16px, 22px);
  --clayo-body: clamp(15px, .25vw + 14px, 17px);

  /* space: 8px scale */
  --clayo-s1: 8px; --clayo-s2: 16px; --clayo-s3: 24px; --clayo-s4: 32px;
  --clayo-s5: 40px; --clayo-s6: 48px; --clayo-s8: 64px;
  --clayo-section-y: clamp(56px, 8vw, 112px);
  --clayo-container: 1200px;
  --clayo-gutter: 16px;

  /* shape */
  --clayo-radius: 16px;
  --clayo-radius-pill: 999px;
  --clayo-border: 1.5px solid var(--clayo-espresso);
  --clayo-shadow: 0 10px 30px -14px rgba(59, 42, 33, .28);   /* warm, soft */
  --clayo-shadow-lift: 0 18px 40px -18px rgba(59, 42, 33, .35);
  --clayo-focus: 0 0 0 3px var(--clayo-cream), 0 0 0 5px var(--clayo-espresso);
}
```

### Figma → token mapping
- Match Figma colour variables/styles to the nearest token **by name first, hex second**. If a Figma hex
  is not in the palette, do not add it. Use the nearest token and note the difference in the PR.
- Spacing values snap to the 8px scale (e.g. Figma 22px → 24px).
- Font sizes become the `clamp()` tokens, not fixed px.

### Contrast (WCAG AA, measured)
| Pair | Ratio | Use |
|---|---|---|
| espresso on cream / sand / blush | 14.4 / 12.1 / 11.9 | body text anywhere ✅ |
| cream on cocoa / espresso | 12.2 / 14.4 | footer, marquee ✅ |
| white on terracotta | 5.28 | CTA label ✅ |
| white on terracotta-hover | 7.28 | CTA hover ✅ |
| terracotta on cream | 4.70 | links, small text ✅ |
| sage on cream | 4.25 | **large/bold text or icons only** |
| terracotta on blush / sand | 3.90 / 3.95 | **≥24px or bold ≥19px only**, or icons |
| sage on blush | 3.53 | ticks/icons only (non-text 3:1) |
| grey `#9A9088` on cream | 2.78 | ❌ never for text; crosses must also carry a visually-hidden label |

---

## 4. Typography

- Load fonts once, in `clayo-header` or `layout`, with `display=swap` and preconnect:
  `Fraunces:wght@600`, `DM Sans:wght@400;500;700`, `Caveat:wght@600`.
  (Current build loads Fraunces 400/500 + Inter Tight. Replace them.)
- Headings: Fraunces 600, `letter-spacing: -0.01em`, `line-height: 1.1`.
- **Exactly one `<h1>` on the page**, in the hero buy box. All other section titles are `<h2>`.
- Caveat is only for tiny handwritten notes (gift annotation, "most popular" scribbles), never body copy.
- One word per heading gets the hand-drawn underline/circle. Mark it up like this:

```liquid
<h2 class="clayo-h2">How to use Clayo in three <span class="clayo-mark">simple</span> steps</h2>
```
```css
.clayo-mark { position: relative; white-space: nowrap; }
.clayo-mark::after { content: ""; position: absolute; left: -2%; right: -2%; bottom: -.18em; height: .32em;
  background: url("data:image/svg+xml,…hand-drawn path…") no-repeat center / 100% 100%; pointer-events: none; }
```

---

## 5. Component library

There is no Storybook and no component package. **Components = Liquid sections + snippets + `.clayo-*` CSS
patterns.** The theme editor preview is the documentation. Each section must have a `presets` entry so it
appears in "Add section".

### Section anatomy (every section follows this)

```liquid
{%- comment -%} sections/clayo-guarantee.liquid {%- endcomment -%}
<section class="clayo-root clayo-guarantee" id="clayo-guarantee-{{ section.id }}"
         aria-labelledby="clayo-guarantee-title-{{ section.id }}">
  <div class="clayo-container">
    <h2 id="clayo-guarantee-title-{{ section.id }}" class="clayo-h2">{{ section.settings.heading }}</h2>
    {%- for block in section.blocks -%}
      <span class="clayo-chip" {{ block.shopify_attributes }}>{{ block.settings.text | escape }}</span>
    {%- endfor -%}
    <a class="clayo-btn" href="#buy">{{ section.settings.cta_label | escape }}</a>
  </div>
</section>

{% schema %}
{
  "name": "Clayo guarantee",
  "tag": "div",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "90 days to try it. Really." },
    { "type": "text", "id": "cta_label", "label": "Button label", "default": "Get Clayo now" }
  ],
  "blocks": [{ "type": "chip", "name": "Chip", "settings": [{ "type": "text", "id": "text", "label": "Text" }] }],
  "presets": [{ "name": "Clayo guarantee",
    "blocks": [{ "type": "chip", "settings": { "text": "90 days to try it" } },
               { "type": "chip", "settings": { "text": "Hassle-free refund" } }] }]
}
{% endschema %}
```

Rules:
- Root element carries `clayo-root` (token scope) + `clayo-<section>`. IDs include `section.id`.
- Pre-fill every text setting's `default` with **final Clayo copy** from the brief (UK English).
- Put `{{ block.shopify_attributes }}` on every block wrapper.
- Section-only CSS goes in a `{% stylesheet %}` tag or at the bottom of `clayo-base.css` under a comment
  header. Section-only JS goes in `{% javascript %}` or a deferred asset. Never inline tracking scripts.
- Components talk through DOM events on `document`, never through globals:
  `clayo:bundle-changed` (detail: `{ variantId, price, compareAt, units, title }`) and
  `clayo:cart-updated` (detail: `{ cart }`).

### Shared UI primitives (classes in `clayo-base.css`)

| Figma component | Class | Notes |
|---|---|---|
| Primary button | `.clayo-btn` | pill, terracotta, white text, min-height 48px, `:hover` → terracotta-hover |
| Secondary button | `.clayo-btn--ghost` | transparent, 1.5px espresso border |
| Card | `.clayo-card` | radius 16px, 1.5px espresso border, cream/sand fill, warm shadow |
| Chip | `.clayo-chip` | pill, blush fill, 14px DM Sans 500 |
| Sticker badge | `.clayo-sticker` | circle, marker/terracotta, rotated −8°, Fraunces 600 |
| Polaroid | `.clayo-polaroid` | white frame, 12px padding (bottom 40px), `rotate(±1.5deg)` via `:nth-child` |
| Washi tape | `.clayo-tape` | pseudo-element strip, marker 60% opacity, rotated corner |
| Blob crop | `.clayo-blob` | `border-radius: 58% 42% 47% 53% / 45% 52% 48% 55%` + `overflow:hidden` |
| Wavy divider | `.clayo-wave` | inline SVG path, `fill: currentColor`, `aria-hidden="true"` |
| Radio card (bundle) | `.clayo-bundle` | real `<input type="radio">` inside `<label>`, `:has(:checked)` styling |
| Accordion | `.clayo-acc` | `<details>`/`<summary>` or button + `aria-expanded`/`aria-controls` |
| Tabs | `.clayo-tabs` | `role="tablist"`, arrow-key roving tabindex; ≤768px renders as accordion |
| Carousel | `.clayo-carousel` | CSS scroll-snap track, prev/next buttons, dots, **no autoplay** |
| Drawer | `.clayo-drawer` | `role="dialog" aria-modal="true"`, focus trap, ESC closes, restores focus |

Paper grain: add an inline SVG `feTurbulence` noise as a `background-image` data URI on
`.clayo-grain::before` (opacity ≈ .06, `pointer-events:none`). No PNG textures.

---

## 6. Styling approach

- **Methodology:** BEM-ish flat classes with the `clayo-` prefix: `.clayo-hero`, `.clayo-hero__media`,
  `.clayo-btn--ghost`, state via `.is-active` / ARIA attributes (`[aria-expanded="true"]`, `[aria-selected]`).
  Current code uses a `c-` prefix. **Rename to `clayo-` when touching it.**
- **Global styles:** none leak out. Resets apply only inside `.clayo-root`
  (`box-sizing`, `img{max-width:100%;height:auto;display:block}`). Never style bare `body`, `h1`, `a` globally.
- **Responsive:** mobile-first; `min-width` breakpoints only:

```css
/* base = 360px+ */
@media (min-width: 768px)  { /* tablet */ }
@media (min-width: 990px)  { /* hero 55/45 split, sticky buy box, desktop arrows */ }
@media (min-width: 1280px) { /* wide */ }
```
  (Current CSS is desktop-first with `max-width: 960px / 560px`. Invert it when migrating.)
- Container: `.clayo-container { width: min(var(--clayo-container), 100% - 2 * var(--clayo-gutter)); margin-inline: auto; }`
- Sections: `padding-block: var(--clayo-section-y)`.
- Hero from 990px: `grid-template-columns: 55fr 45fr`; buy box `position: sticky; top: calc(header + 16px)`.
- No horizontal scroll at 360/375/390/768/1280. Wide tables scroll **inside** `.clayo-table-scroll`
  with `position: sticky; left: 0` row labels.
- Touch targets ≥44×44px. Focus: `:focus-visible { outline: none; box-shadow: var(--clayo-focus); }`.
- Motion: every animation/transition sits behind
  `@media (prefers-reduced-motion: no-preference)` **or** is cancelled in a `reduce` block (marquee stops, reveal shows instantly).
- **Banned:** purple/blue gradients, glassmorphism/`backdrop-filter` (Current header uses it, so remove it),
  neon, emoji or Unicode glyph icons (`✓ ★ ✺ →` in Current: replace with SVG), stock-photo gloss,
  perfectly symmetrical grids in every section (vary: staggered cards, offset images, rotated polaroids).

---

## 7. Icon system

- **Inline SVG only.** No icon fonts, no sprite files from CDNs, no `<img src="icon.svg">`.
- Target: one snippet `snippets/clayo-icon.liquid` with a `case` per icon:

```liquid
{%- comment -%} {% render 'clayo-icon', name: 'tick', size: 20, class: 'clayo-tick' %} {%- endcomment -%}
<svg class="clayo-icon {{ class }}" width="{{ size | default: 24 }}" height="{{ size | default: 24 }}"
     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  {%- case name -%}
    {%- when 'tick' -%}<path d="M4.5 12.5c2 1.6 3.3 3 4.4 4.8C11.6 12 15 8.2 19.5 5.5"/>
    {%- when 'cross' -%}<path d="M6 6l12 12M18 6L6 18"/>
    {%- when 'flame' -%}<path d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z"/>
  {%- endcase -%}
</svg>
```

- Style: 24×24 viewBox, **2px stroke, round caps/joins**, `stroke="currentColor"` (colour via CSS `color`).
  Ticks are slightly wobbly hand-drawn paths, not geometric checkmarks.
- Naming: lowercase kebab-case nouns: `tick`, `cross`, `flame`, `wave`, `battery`, `usb-c`, `strap`,
  `truck`, `shield`, `cart`, `arrow-left`, `arrow-right`, `play`, `close`, `menu`, `star`, `star-half`.
  Payment marks: `pay-visa`, `pay-mastercard`, `pay-amex`, `pay-apple`, `pay-google`, `pay-shop`, `pay-paypal`
  (these may use brand fill colours and their own viewBox).
- Decorative icons get `aria-hidden="true"`. Meaningful icons (star rating, tick/cross in comparison) get
  visually-hidden text next to them (`<span class="clayo-vh">Included</span>`).
- From Figma: export the vector (`get_design_context` / `download_assets`), strip `fill`/fixed colours,
  normalise to 24×24 + 2px stroke, then add it as a new `when` branch. Never ship Figma's raw
  multi-layer SVG or any `localhost` asset URL.

---

## 8. Asset management

- **Current:** one image, `assets/clayo-hero.webp` (146 KB), copied into `shopify/assets/` by the build and
  used as the fallback when neither the section setting nor the product has an image.
- **Target:**
  - Product photos/videos come from `product.media` (uploaded in Shopify admin). Lifestyle/section images
    come from `image_picker` settings. Theme `assets/` is for CSS/JS and small fallbacks only.
  - **No external image URLs.** No hot-linking, including Figma MCP asset URLs. Download Figma exports and
    upload them to Shopify Files or product media.
  - Always render through Shopify's CDN with responsive `srcset`:

```liquid
{{ image | image_url: width: 1400
         | image_tag: widths: '360, 540, 720, 990, 1200, 1400',
                      sizes: '(min-width: 990px) 55vw, 100vw',
                      loading: 'lazy', alt: image.alt | default: section.settings.image_alt }}
```

  - LCP image (first hero media): `loading: 'eager'`, `fetchpriority: 'high'`, no lazy loading. Everything else is lazy.
  - Always emit `width`/`height` (image_tag does this) to keep CLS < 0.1.
  - Video: `{{ media | video_tag: controls: true, preload: 'none', image_size: '1200x' }}`; show a play-icon overlay on thumbnails.
  - Format: WebP/AVIF handled by Shopify CDN. Source uploads ≥2400px long edge, sRGB.
  - Alt text is mandatory and descriptive ("Woman on a sofa wearing the Clayo belt over a loose T-shirt").
    Never "image", never the filename.
  - Imagery style: candid, natural light, warm tones, real skin/fabric texture. No glossy stock.

---

## 9. Content & trust rules (non-negotiable; check every Figma import against these)

Figma mock-ups often contain placeholder stars, review counts, "Only 3 left!", before/after
images or medical wording. **Do not carry them into code.**

1. **Product facts (only these):** 5 heat levels up to 60°C · 5 massage modes · massage with or without heat ·
   heats within seconds · USB-C rechargeable · cordless · up to ~8 h battery depending on settings ·
   adjustable elastic strap · slim under loose clothing · box: belt, USB-C cable, user guide.
2. **Pricing:** 1 Belt £54.99 · 2 Belts £89.99 (compare-at £109.98, save £19.99, MOST POPULAR, default) ·
   3 Belts £119.99 (compare-at £164.97, save £44.98, BEST VALUE). Gift box `clayo-gift-box` £3.99.
   Prices always come from variant data (`| money`), never hard-coded in markup.
3. **Reviews/ratings:** real data only, from `product.metafields.reviews.rating` /
   `reviews.rating_count` or merchant-filled blocks with `is_sample = false`. Sample blocks render **only**
   when `request.design_mode` is true, with a visible "SAMPLE — replace with a real review" ribbon.
   No AggregateRating JSON-LD unless the genuine count ≥1. "Excellent" only when rating ≥4.5 and count ≥10.
4. **No fake urgency:** no countdowns, stock counters, "X people viewing", pulsing "live" dots.
5. **Claims:** comfort/soothing/warmth only. Never diagnose/treat/cure/prevent. No condition names in
   headlines or benefits. No before/after. Disclaimer in footer: "Clayo is a comfort product, not a medical
   device, and is not intended to diagnose, treat or cure any condition."
6. **Delivery/guarantee:** free tracked delivery; dispatch 1–2 business days; UK 5–9, AU/CA 7–14 working days;
   90-day money-back guarantee (three full cycles).
7. UK English, warm, honest, slightly playful. No hype. No lorem ipsum.

### Known violations in Current code (fix when migrating)
- `rating_text` default "4.8 / 5 average rating" + static ★★★★★ → fake rating.
- Three "Review placeholder" cards marked **Verified** that also render on the live storefront.
- "60-night comfort trial", "1-year warranty", "$50 free-shipping threshold" → contradict brief (90 days, free delivery always).
- Heat dial shows 3 levels (45/50/55°) and "4 modes"; comparison claims "auto shut-off" / timer → not in fact list.
- Pulsing red "Heating" dot + floating chips → fake-live styling.
- USD sample prices ($49/$79) → store is GBP.
- `backdrop-filter` header (glassmorphism) and Unicode glyph icons → banned styles.

---

## 10. JavaScript conventions

- IIFE or ES module per file, `'use strict'`, no globals except `window.ClayoCart` (drawer API: `open()`, `refresh()`).
- Query within the section root (`section.querySelector`), never document-wide IDs without `section.id`.
- Bundle change → update hidden `name="id"` input, price, CTA text ("Add to cart — £89.99"),
  `history.replaceState` `?variant=`, dispatch `clayo:bundle-changed`, and
  `Shopify.analytics?.publish('clayo_bundle_selected', {...})`. **Never reload.**
- Add to cart → one `fetch('/cart/add.js', { items: [belt, giftBox?] })` with a
  `properties: { _linked_to: '<belt variant id>' }` on the gift line; CTA states `idle → loading → added | error`
  announced in an `aria-live="polite"` region; then dispatch `clayo:cart-updated` and `ClayoCart.open()`,
  or `location.href = '/cart'` if the drawer is missing.
- Money formatting in JS: use `Shopify.formatMoney` if present; otherwise `Intl.NumberFormat('en-GB', { style: 'currency', currency: Shopify.currency.active })`.
- No `console.log` in shipped code; no errors at load.

---

## 11. Figma MCP workflow (follow in order)

1. `get_design_context` on the exact frame/node (not the whole page). If the result is too large, call
   `get_metadata` first, then fetch child nodes one by one.
2. `get_screenshot` of the same node as the visual reference.
3. `get_variable_defs` to confirm colours/spacing and map them to `--clayo-*` tokens (§3).
4. Download images/icons (`download_assets`). Upload images to Shopify, and turn icons into `clayo-icon` branches (§7).
5. Translate React/Tailwind → Liquid section + `.clayo-*` CSS + vanilla JS (§2, §5, §6).
6. Swap every placeholder string for brief copy; apply trust rules (§9).
7. Check against the screenshot at 360, 390, 768, 1280px. Check keyboard-only use, reduced motion, and one `<h1>`.
8. Validate schema JSON (`shopify theme check` if Shopify CLI is available) before committing.

**1:1 fidelity** means layout, spacing rhythm, type scale, colour and decoration match the frame.
It does **not** mean copying placeholder content, off-palette colours or banned styles.

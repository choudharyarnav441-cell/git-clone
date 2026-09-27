# clayo — landing page

Product landing page for the clayo Warmth Belt (cordless period heat + massage belt).

- `src/landing.html` — single source (markup, CSS, JS)
- `build.mjs` — `node build.mjs` generates:
  - `preview/index.html` — standalone preview with sample data
  - `shopify/sections/clayo-landing.liquid` — Shopify OS 2.0 section bound to a product
- `shopify/templates/product.clayo.json` — product template using the section
- `design-md/` — 74 DESIGN.md design systems from [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) for AI agents to style pages from; see [`design-md/README.md`](design-md/README.md) for the index and usage

## Install on Shopify
1. Copy `shopify/sections/clayo-landing.liquid` into your theme's `sections/`, `shopify/templates/product.clayo.json` into `templates/`, and `shopify/assets/clayo-hero.webp` into `assets/`.
2. On the product in admin, set **Theme template** to `clayo`.
3. The section has its own nav and footer; hide the theme header/footer for that template if you want a clean funnel.

Before launch: replace the placeholder reviews and rating text, and confirm specs (temperatures, battery life, trial/warranty terms) match the real product.

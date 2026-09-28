# clayo — landing page

Product landing page for the clayo Warmth Belt (cordless period heat + massage belt).

- `src/landing.html` — single source (markup, CSS, JS)
- `build.mjs` — `node build.mjs` generates:
  - `preview/index.html` — standalone preview with sample data
  - `shopify/sections/clayo-landing.liquid` — Shopify OS 2.0 section bound to a product
- `shopify/templates/product.clayo.json` — product template using the section

## Design system
All styles use the tokens declared at the top of `src/landing.html` (`--color-1…10`, `--text-xs…4xl`, `--space-1…24`, `--radius-sm/md/lg/xl`, motion durations) with Poppins as the typeface. Sentence case throughout, no shadows, one primary CTA per view (the mobile sticky bar hides while the final CTA is on screen). Add-to-cart buttons have hover, focus-visible, active, loading ("Adding…") and disabled ("Sold out") states; the heat/massage selectors are radio groups with arrow-key support.

## Install on Shopify
1. Copy `shopify/sections/clayo-landing.liquid` into your theme's `sections/`, `shopify/templates/product.clayo.json` into `templates/`, and `shopify/assets/clayo-hero.webp` into `assets/`.
2. On the product in admin, set **Theme template** to `clayo`.
3. The section has its own nav and footer; hide the theme header/footer for that template if you want a clean funnel.

Before launch: replace the placeholder reviews and rating text, and confirm specs (temperatures, massage mode names, battery life, trial/warranty terms) match the real product. The numbered hotspots in the details section are positioned for the bundled `clayo-hero.webp` photo; adjust their `left`/`top` if you swap that image.

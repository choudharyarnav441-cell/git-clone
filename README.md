# clayo — landing page

Product landing page for the clayo Warmth Belt (cordless period heat + massage belt).

- `src/landing.html` — single source (markup, CSS, JS)
- `build.mjs` — `node build.mjs` generates:
  - `preview/index.html` — standalone preview with sample data
  - `shopify/sections/clayo-landing.liquid` — Shopify OS 2.0 section bound to a product
- `shopify/templates/product.clayo.json` — product template using the section

## Install on Shopify
1. Copy `shopify/sections/clayo-landing.liquid` into your theme's `sections/`, `shopify/templates/product.clayo.json` into `templates/`, and `shopify/assets/clayo-hero.webp` into `assets/`.
2. On the product in admin, set **Theme template** to `clayo`.
3. The section has its own nav and footer; hide the theme header/footer for that template if you want a clean funnel.

Before launch: replace the placeholder reviews and rating text, and confirm specs (temperatures, battery life, trial/warranty terms) match the real product.

---

# Earthline Naturals — molecular hydrogen tablets landing page

Product landing page for Earthline Naturals 12 PPM molecular hydrogen tablets.

- `src/earthline.html` — single source (markup, CSS, JS). All colors, type, spacing, radius and motion values are CSS tokens at the top of the file, taken from the Earthline design system.
- `assets/earthline/*.svg` — product illustrations (pouch, fizzing glass, tablets, ritual) used when the product has no photos.
- `build-earthline.mjs` — `node build-earthline.mjs` generates:
  - `preview/earthline.html` — standalone preview with sample data
  - `shopify/sections/earthline-landing.liquid` — Shopify OS 2.0 section bound to a product
  - `shopify/templates/product.earthline.json` — product template with the FAQ pre-filled

Page sections: product gallery + purchase box (flavor, 1/2/3-pouch quantity, AJAX add to cart), how it works with an animated fizz demo, benefits, video reviews, daily ritual steps, comparison table, reviews, FAQ, final CTA, sticky mobile add-to-cart, and the FDA disclaimer.

## Install on Shopify
1. Copy `shopify/sections/earthline-landing.liquid` into your theme's `sections/`, `shopify/templates/product.earthline.json` into `templates/`, and `shopify/assets/earthline-*.svg` into `assets/`.
2. On the product in admin, set **Theme template** to `earthline`.
3. In the theme editor, open the Earthline landing section and add:
   - **Review** blocks (stars, title, text, name, flavor, verified) — or an app block from your reviews app (Judge.me, Loox, etc.).
   - **Video review** blocks — upload a video (9:16 works best) or paste a YouTube/Vimeo link, plus name and a pull quote. The video section stays hidden until at least one is added.
   - Optional photos for the three daily-ritual steps.
4. The section has its own nav and footer; hide the theme header/footer for that template if you want a clean funnel.

Data comes from the product: images, variants (flavor), price and compare-at price, description, and stock. The star rating uses the standard `reviews.rating` / `reviews.rating_count` product metafields that review apps write, with section settings as a fallback; it is hidden when neither is set.

Before launch: the preview's reviews, video reviews, rating and $39.99 price are samples only. Confirm the benefit copy (marked with *) and FAQ answers match your approved label claims, and check the Supplement Facts image is in the product photos.

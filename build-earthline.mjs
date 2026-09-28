// Builds the Earthline Naturals landing page from src/earthline.html into:
//   preview/earthline.html                     – standalone page with sample data
//   shopify/sections/earthline-landing.liquid  – Shopify OS 2.0 section bound to a product
//   shopify/templates/product.earthline.json   – product template with default FAQ blocks
// Repeating parts (gallery, variants, reviews, video reviews, FAQ) are rendered by the
// card functions below, once with sample data and once with Liquid expressions.
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';

const src = readFileSync('src/earthline.html', 'utf8');
const fonts =
  '<link rel="preconnect" href="https://api.fontshare.com" crossorigin>\n' +
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
  '<link href="https://api.fontshare.com/v2/css?f[]=clash-grotesk@500,600,700&f[]=satoshi@400,500,700&display=swap" rel="stylesheet">\n' +
  '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">\n';

const fill = (tokens) =>
  src.replace(/__([A-Z0-9_]+)__/g, (m, k) => {
    if (!(k in tokens)) throw new Error(`Unfilled token ${m}`);
    return tokens[k];
  });

const IMAGES = ['earthline-pouch.svg', 'earthline-glass.svg', 'earthline-tablets.svg', 'earthline-ritual.svg'];
const IMAGE_ALTS = [
  'Earthline Naturals molecular hydrogen tablets pouch',
  'A hydrogen tablet fizzing in a glass of water',
  'Close-up of Earthline effervescent hydrogen tablets',
  'Earthline pouch next to a glass of hydrogen water',
];

// ---------- Shared markup ----------
const playIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';
const checkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';

const galleryMain = (src, alt) =>
  `<img id="e-main-img" class="e-main-img" src="${src}" alt="${alt}" width="1200" height="1200" fetchpriority="high">`;

const thumb = ({ src, full, srcset = '', alt, label, current }) =>
  `<button type="button" class="e-thumb" data-src="${full}"${srcset ? ` data-srcset="${srcset}"` : ''} data-alt="${alt}" aria-label="${label}" aria-current="${current}">` +
  `<img src="${src}" alt="" width="76" height="76" loading="lazy"></button>`;

const thumbsWrap = (inner) => `<div class="e-thumbs" role="group" aria-label="Product images">${inner}</div>`;

const svgThumbs = (url) =>
  thumbsWrap(
    IMAGES.map((f, i) =>
      thumb({ src: url(f), full: url(f), alt: IMAGE_ALTS[i], label: `Show image ${i + 1} of ${IMAGES.length}`, current: i === 0 })
    ).join('')
  );

const variantPicker = (legend, options) =>
  `<fieldset class="e-field"><legend>${legend}</legend><div class="e-opts">${options}</div></fieldset>`;

const variantOption = ({ id, title, price, compare, available, checked, disabled }) =>
  `<label class="e-opt"><input type="radio" name="e-variant" value="${id}" data-title="${title}" data-price="${price}" data-compare="${compare}" data-available="${available}"${checked}${disabled}>` +
  `<span>${title}</span></label>`;

const reviewCard = (r) =>
  `<li class="e-review"${r.attrs || ''}>` +
  `<span class="e-stars" style="--rating: ${r.rating}" role="img" aria-label="${r.rating} out of 5 stars"></span>` +
  `${r.title}<blockquote><p>${r.body}</p></blockquote>` +
  `<footer><b>${r.name}</b>${r.detail}${r.verified}</footer></li>`;

const reviewGrid = (cards) =>
  `<ul class="e-review-grid" id="e-review-grid">${cards}</ul>` +
  `<div class="e-more" hidden><button class="e-btn e-btn--secondary" type="button" id="e-more-btn" aria-expanded="false" aria-controls="e-review-grid">Show more reviews</button></div>`;

const reviewSummary = (rating, count) =>
  `<div class="e-summary e-reveal"><b>${rating}</b>` +
  `<span class="e-stars" style="--rating: ${rating}" role="img" aria-label="${rating} out of 5 stars"></span>` +
  `<span>${count}</span></div>`;

const ratingLink = (rating, text) =>
  `<a class="e-rating" href="#reviews"><span class="e-stars" style="--rating: ${rating}" role="img" aria-label="Rated ${rating} out of 5"></span><span>${text}</span></a>`;

const videoCard = (v) =>
  `<li class="e-vcard"${v.attrs || ''}><div class="e-vmedia">` +
  `<button class="e-vplay" type="button" aria-label="Play video review from ${v.name}">${v.poster}<span class="e-vplay-icon" aria-hidden="true">${playIcon}</span></button>` +
  `<template>${v.player}</template></div>` +
  `<p class="e-vquote">“${v.quote}”</p><p class="e-vname">${v.name}${v.detail}</p></li>`;

const initialPoster = (initial) => `<span class="e-vposter" aria-hidden="true"><span class="e-vinitial">${initial}</span></span>`;

const faqItem = (f) => `<details${f.attrs || ''}><summary>${f.question}</summary><div class="e-faq-a">${f.answer}</div></details>`;

const sampleNote = (what) => `<p class="e-sample">Sample ${what} for layout preview — replace with real customer ${what}.</p>`;

// ---------- Content shared by preview + default template ----------
const FAQ = [
  {
    question: 'What is molecular hydrogen?',
    answer:
      '<p>Molecular hydrogen (H₂) is two hydrogen atoms bonded together — the smallest molecule there is. It acts as a selective antioxidant, and its tiny size lets it move easily into cells.*</p>',
  },
  {
    question: 'How do I take the tablets?',
    answer:
      '<p>Drop 1 tablet into a glass of cold, still water once a day. Wait until it has fully dissolved, then drink right away. Hydrogen gradually escapes from open water, so fresh is best.</p>',
  },
  {
    question: 'When is the best time to drink it?',
    answer: '<p>Whenever it fits your routine. Many people make it their first glass of the morning; others use it as an afternoon reset.</p>',
  },
  {
    question: 'What does it taste like?',
    answer:
      '<p>Unflavored tastes close to plain water. Raspberry adds a light fruit flavor. Both are sugar-free and calorie-free.</p>',
  },
  {
    question: "What's in each tablet?",
    answer: '<p>The full ingredient list and Supplement Facts panel are printed on the pouch and shown in the product photos.</p>',
  },
  {
    question: 'Is it right for me?',
    answer:
      '<p>If you are pregnant, nursing, taking medication, or have a medical condition, check with your healthcare professional before use.</p>',
  },
  {
    question: 'How does shipping and returns work?',
    answer:
      '<p>Delivery times and return terms are listed in our <a href="/policies/shipping-policy">shipping policy</a> and <a href="/policies/refund-policy">refund policy</a>.</p>',
  },
];

const SAMPLE_REVIEWS = [
  { rating: 5, title: 'Easiest habit I’ve kept', body: 'I leave the pouch next to my water bottle and drop one in every morning. Takes a minute and I actually look forward to it.', name: 'Maya R.', detail: 'Unflavored' },
  { rating: 5, title: 'No weird aftertaste', body: 'Unflavored really does taste like water. The fizz is kind of fun to watch, too.', name: 'Daniel K.', detail: 'Unflavored' },
  { rating: 5, title: 'Raspberry is my soda swap', body: 'Light fruit flavor without the sugar. It’s replaced my afternoon can of soda.', name: 'Priya S.', detail: 'Raspberry' },
  { rating: 4, title: 'Great for travel', body: 'Brought the pouch on a two-week trip. So much easier than hauling hydrogen water cans around.', name: 'Chris M.', detail: 'Unflavored' },
  { rating: 5, title: 'Replaced my second coffee', body: 'I feel more on top of my hydration, and this has quietly replaced my second coffee of the day.', name: 'Alana P.', detail: 'Raspberry' },
  { rating: 5, title: 'Good value per glass', body: 'Cheaper per serving than the hydrogen water I used to buy, and no cans to recycle.', name: 'Jordan T.', detail: 'Unflavored' },
  { rating: 5, title: 'Whole family uses it', body: 'We keep a pouch on the kitchen counter. Resealable zip keeps the tablets dry.', name: 'Sofia L.', detail: 'Raspberry' },
  { rating: 4, title: 'Wish I found it sooner', body: 'Simple, clean, no sugar. Would love a bigger pouch size.', name: 'Ben W.', detail: 'Unflavored' },
];

const SAMPLE_VIDEOS = [
  { name: 'Alyssa', detail: ' · Unflavored', quote: 'My first glass every morning, before anything else.' },
  { name: 'Marcus', detail: ' · Unflavored', quote: 'I keep a pouch in my gym bag. Zero effort.' },
  { name: 'Hannah', detail: ' · Raspberry', quote: 'Raspberry is my 3pm soda swap now.' },
  { name: 'Theo', detail: ' · Unflavored', quote: 'Way easier to travel with than cans.' },
  { name: 'Grace', detail: ' · Raspberry', quote: 'I love watching it fizz — feels like a ritual.' },
];

const SAMPLE_DESCRIPTION =
  '<p>Earthline Naturals Molecular Hydrogen Tablets are effervescent tablets that dissolve in water to make a hydrogen-rich drink at 12 PPM.</p>' +
  '<ul><li>12 PPM molecular hydrogen per tablet</li><li>Zero sugar, zero calories</li><li>30 tablets per resealable stand-up pouch (30-day supply)</li><li>Available in Unflavored and Raspberry</li></ul>';

// ---------- Preview ----------
const previewUrl = (f) => `../assets/earthline/${f}`;
const SAMPLE_PRICE = 3999;
const previewMoney = (c) => `$${(c / 100).toFixed(2)}`;

const preview = fill({
  PREVIEW: 'true',
  MAIN_TAG: 'main',
  CURRENCY: 'USD',
  CART_URL: '#',
  ROOT_URL: '#',
  CART_ADD_URL: '#',
  CART_COUNT: '0',
  ANNOUNCE: 'Zero sugar · Zero calories · 12 PPM molecular hydrogen',
  GALLERY_MAIN: galleryMain(previewUrl(IMAGES[0]), IMAGE_ALTS[0]),
  GALLERY_THUMBS: svgThumbs(previewUrl),
  RATING_BLOCK: ratingLink('4.8', '4.8 · sample rating'),
  VARIANTS: variantPicker(
    'Flavor',
    [
      { id: '1', title: 'Unflavored', checked: ' checked' },
      { id: '2', title: 'Raspberry', checked: '' },
    ]
      .map((v) => variantOption({ ...v, price: SAMPLE_PRICE, compare: 0, available: 'true', disabled: '' }))
      .join('')
  ),
  VARIANT_ID: '1',
  PRICE: previewMoney(SAMPLE_PRICE),
  PRICE_CENTS: String(SAMPLE_PRICE),
  COMPARE_CENTS: '0',
  COMPARE_BLOCK: '',
  AVAILABLE: 'true',
  ADD_LABEL: `Add to cart · ${previewMoney(SAMPLE_PRICE)}`,
  ADD_DISABLED: '',
  ASSURE_1: 'Secure checkout',
  ASSURE_2: 'Ships in a resealable pouch',
  ASSURE_3: 'Easy returns',
  DESCRIPTION: SAMPLE_DESCRIPTION,
  VIDEOS_OPEN: '',
  VIDEOS_CLOSE: '',
  SAMPLE_NOTE_VIDEOS: sampleNote('videos'),
  VIDEOS: SAMPLE_VIDEOS.map((v) =>
    videoCard({
      ...v,
      poster: initialPoster(v.name[0]),
      player: '<div class="e-vempty">Preview only. In Shopify, upload this customer’s video (or paste a YouTube/Vimeo link) in the “Video review” block.</div>',
    })
  ).join(''),
  IMG_POUCH: previewUrl('earthline-pouch.svg'),
  IMG_GLASS: previewUrl('earthline-glass.svg'),
  IMG_RITUAL: previewUrl('earthline-ritual.svg'),
  SAMPLE_NOTE_REVIEWS: sampleNote('reviews'),
  REVIEW_SUMMARY: reviewSummary('4.8', 'Sample rating'),
  REVIEWS: reviewGrid(
    SAMPLE_REVIEWS.map((r) =>
      reviewCard({
        ...r,
        title: `<h3>${r.title}</h3>`,
        detail: `<span>${r.detail}</span>`,
        verified: `<span class="e-verified">${checkIcon}Verified buyer</span>`,
      })
    ).join('')
  ),
  CONTACT_LINE: '<p>Still curious? <a href="/pages/contact">Contact our team</a> — we’re happy to help.</p>',
  FAQ: FAQ.map((f, i) => faqItem({ ...f, attrs: i === 0 ? ' open' : '' })).join(''),
  STICKY_META: `1 pouch · ${previewMoney(SAMPLE_PRICE)}`,
});

mkdirSync('preview', { recursive: true });
writeFileSync(
  'preview/earthline.html',
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Earthline Naturals — Molecular Hydrogen Tablets</title>
${fonts}<style>html{scroll-behavior:smooth}body{margin:0;background:#F2F3EA}@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}}</style>
</head>
<body>
${preview}
</body>
</html>
`
);

// ---------- Shopify section ----------
const asset = (f) => `{{ '${f}' | asset_url }}`;
const esc = (expr) => `{{ ${expr} | escape }}`;
const imgSetting = (id, fallback) =>
  `{%- if section.settings.${id} != blank -%}{{ section.settings.${id} | image_url: width: 800 }}{%- else -%}${asset(fallback)}{%- endif -%}`;

const liquid = fill({
  PREVIEW: 'false',
  MAIN_TAG: 'div', // the theme already provides <main>
  CURRENCY: '{{ cart.currency.iso_code }}',
  CART_URL: '{{ routes.cart_url }}',
  ROOT_URL: '{{ routes.root_url }}',
  CART_ADD_URL: '{{ routes.cart_add_url }}',
  CART_COUNT: '{{ cart.item_count }}',
  ANNOUNCE: esc('section.settings.announcement'),
  GALLERY_MAIN:
    '{%- if p.images.size > 0 -%}' +
    '<img id="e-main-img" class="e-main-img" src="{{ p.featured_image | image_url: width: 1200 }}" ' +
    'srcset="{{ p.featured_image | image_url: width: 600 }} 600w, {{ p.featured_image | image_url: width: 1200 }} 1200w" ' +
    'sizes="(min-width: 990px) 50vw, 100vw" width="1200" height="1200" alt="{{ p.featured_image.alt | default: p.title | escape }}" fetchpriority="high">' +
    `{%- else -%}${galleryMain(asset(IMAGES[0]), IMAGE_ALTS[0])}{%- endif -%}`,
  GALLERY_THUMBS:
    '{%- if p.images.size > 1 -%}' +
    thumbsWrap(
      '{%- for img in p.images limit: 10 -%}' +
        thumb({
          src: '{{ img | image_url: width: 160 }}',
          full: '{{ img | image_url: width: 1200 }}',
          srcset: '{{ img | image_url: width: 600 }} 600w, {{ img | image_url: width: 1200 }} 1200w',
          alt: '{{ img.alt | default: p.title | escape }}',
          label: 'Show image {{ forloop.index }} of {{ forloop.length }}',
          current: '{{ forloop.first }}',
        }) +
        '{%- endfor -%}'
    ) +
    `{%- elsif p.images.size == 0 -%}${svgThumbs(asset)}{%- endif -%}`,
  RATING_BLOCK:
    '{%- if rating != blank -%}' +
    ratingLink('{{ rating }}', '{{ rating }}{% if rating_count != blank %} · {{ rating_count }} reviews{% endif %}') +
    '{%- endif -%}',
  VARIANTS:
    '{%- unless p.has_only_default_variant -%}' +
    variantPicker(
      esc('p.options.first'),
      '{%- for v in p.variants -%}' +
        variantOption({
          id: '{{ v.id }}',
          title: '{{ v.title | escape }}',
          price: '{{ v.price }}',
          compare: '{{ v.compare_at_price | default: 0 }}',
          available: '{{ v.available }}',
          checked: '{% if v.id == v_sel.id %} checked{% endif %}',
          disabled: '{% unless v.available %} disabled{% endunless %}',
        }) +
        '{%- endfor -%}'
    ) +
    '{%- endunless -%}',
  VARIANT_ID: '{{ v_sel.id }}',
  PRICE: '{{ v_sel.price | money }}',
  PRICE_CENTS: '{{ v_sel.price }}',
  COMPARE_CENTS: '{{ v_sel.compare_at_price | default: 0 }}',
  COMPARE_BLOCK:
    '{%- if v_sel.compare_at_price > v_sel.price -%}<s>{{ v_sel.compare_at_price | money }}</s> ' +
    '<span class="e-save">Save {{ v_sel.compare_at_price | minus: v_sel.price | money }}</span>{%- endif -%}',
  AVAILABLE: '{{ v_sel.available }}',
  ADD_LABEL: '{%- if v_sel.available -%}Add to cart · {{ v_sel.price | money }}{%- else -%}Sold out{%- endif -%}',
  ADD_DISABLED: '{% unless v_sel.available %}disabled{% endunless %}',
  ASSURE_1: esc('section.settings.assure_1'),
  ASSURE_2: esc('section.settings.assure_2'),
  ASSURE_3: esc('section.settings.assure_3'),
  DESCRIPTION: `{%- if p.description != blank -%}{{ p.description }}{%- else -%}${SAMPLE_DESCRIPTION}{%- endif -%}`,
  VIDEOS_OPEN: '{%- if video_blocks.size > 0 or request.design_mode -%}',
  VIDEOS_CLOSE: '{%- endif -%}',
  SAMPLE_NOTE_VIDEOS: '',
  VIDEOS:
    '{%- for block in video_blocks -%}' +
    videoCard({
      attrs: ' {{ block.shopify_attributes }}',
      name: esc('block.settings.name'),
      detail: '{% if block.settings.detail != blank %} · {{ block.settings.detail | escape }}{% endif %}',
      quote: esc('block.settings.quote'),
      poster:
        '{%- if block.settings.poster != blank -%}<img src="{{ block.settings.poster | image_url: width: 640 }}" alt="" width="640" height="1138" loading="lazy">' +
        '{%- elsif block.settings.video.preview_image != blank -%}<img src="{{ block.settings.video.preview_image | image_url: width: 640 }}" alt="" width="640" height="1138" loading="lazy">' +
        '{%- elsif block.settings.video_url.type == "youtube" -%}<img src="https://i.ytimg.com/vi/{{ block.settings.video_url.id }}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy">' +
        `{%- else -%}${initialPoster('{{ block.settings.name | slice: 0 | upcase | escape }}')}{%- endif -%}`,
      player:
        "{%- if block.settings.video != blank -%}{{ block.settings.video | video_tag: controls: true, autoplay: true, playsinline: true, preload: 'metadata' }}" +
        '{%- elsif block.settings.video_url.type == "youtube" -%}<iframe src="https://www.youtube-nocookie.com/embed/{{ block.settings.video_url.id }}?autoplay=1&rel=0&playsinline=1" title="Video review from {{ block.settings.name | escape }}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>' +
        '{%- elsif block.settings.video_url.type == "vimeo" -%}<iframe src="https://player.vimeo.com/video/{{ block.settings.video_url.id }}?autoplay=1" title="Video review from {{ block.settings.name | escape }}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>' +
        '{%- else -%}<div class="e-vempty">Video coming soon.</div>{%- endif -%}',
    }) +
    '{%- else -%}<li class="e-empty"><b>No video reviews yet</b><span>Add “Video review” blocks in the theme editor. This message is only visible while editing.</span></li>' +
    '{%- endfor -%}',
  IMG_POUCH: imgSetting('step_image_1', 'earthline-pouch.svg'),
  IMG_GLASS: imgSetting('step_image_2', 'earthline-glass.svg'),
  IMG_RITUAL: imgSetting('step_image_3', 'earthline-ritual.svg'),
  SAMPLE_NOTE_REVIEWS: '',
  REVIEW_SUMMARY:
    '{%- if rating != blank -%}' +
    reviewSummary('{{ rating }}', '{% if rating_count != blank %}Based on {{ rating_count }} reviews{% endif %}') +
    '{%- endif -%}',
  REVIEWS:
    '{%- if review_blocks.size > 0 -%}' +
    reviewGrid(
      '{%- for block in review_blocks -%}' +
        reviewCard({
          attrs: ' {{ block.shopify_attributes }}',
          rating: '{{ block.settings.rating }}',
          title: '{% if block.settings.title != blank %}<h3>{{ block.settings.title | escape }}</h3>{% endif %}',
          body: '{{ block.settings.body | escape | newline_to_br }}',
          name: esc('block.settings.name'),
          detail: '{% if block.settings.detail != blank %}<span>{{ block.settings.detail | escape }}</span>{% endif %}',
          verified: `{% if block.settings.verified %}<span class="e-verified">${checkIcon}Verified buyer</span>{% endif %}`,
        }) +
        '{%- endfor -%}'
    ) +
    '{%- endif -%}' +
    "{%- for block in section.blocks -%}{%- if block.type == '@app' -%}<div {{ block.shopify_attributes }}>{% render block %}</div>{%- endif -%}{%- endfor -%}" +
    '{%- if review_blocks.size == 0 and app_blocks.size == 0 -%}' +
    '<div class="e-empty"><b>Reviews are on their way</b><span>Be one of the first to share how Earthline fits your routine.</span></div>' +
    '{%- endif -%}',
  CONTACT_LINE:
    '{%- if section.settings.contact_email != blank -%}<p>Still curious? Email <a href="mailto:{{ section.settings.contact_email | escape }}">{{ section.settings.contact_email | escape }}</a> — we’re happy to help.</p>' +
    '{%- else -%}<p>Still curious? <a href="/pages/contact">Contact our team</a> — we’re happy to help.</p>{%- endif -%}',
  FAQ:
    '{%- for block in faq_blocks -%}' +
    faqItem({ attrs: ' {{ block.shopify_attributes }}{% if forloop.first %} open{% endif %}', question: esc('block.settings.question'), answer: '{{ block.settings.answer }}' }) +
    '{%- endfor -%}',
  STICKY_META: '1 pouch · {{ v_sel.price | money }}',
});

const schema = {
  name: 'Earthline landing',
  tag: 'section',
  class: 'earthline-landing',
  settings: [
    { type: 'product', id: 'product', label: 'Product', info: 'Defaults to the current product on product templates.' },
    { type: 'text', id: 'announcement', label: 'Announcement bar', default: 'Zero sugar · Zero calories · 12 PPM molecular hydrogen' },
    { type: 'header', content: 'Rating' },
    {
      type: 'text',
      id: 'rating',
      label: 'Average rating (fallback)',
      info: "Used only when the product has no reviews.rating metafield (set by most review apps). Leave blank to hide the rating.",
    },
    { type: 'text', id: 'rating_count', label: 'Review count (fallback)', info: 'Used only when the product has no reviews.rating_count metafield.' },
    { type: 'header', content: 'Purchase box' },
    { type: 'text', id: 'assure_1', label: 'Assurance 1', default: 'Secure checkout' },
    { type: 'text', id: 'assure_2', label: 'Assurance 2', default: 'Ships in a resealable pouch' },
    { type: 'text', id: 'assure_3', label: 'Assurance 3', default: 'Easy returns' },
    { type: 'header', content: 'Daily ritual images' },
    { type: 'image_picker', id: 'step_image_1', label: 'Step 1 image', info: 'Defaults to an illustration.' },
    { type: 'image_picker', id: 'step_image_2', label: 'Step 2 image' },
    { type: 'image_picker', id: 'step_image_3', label: 'Step 3 image' },
    { type: 'header', content: 'FAQ' },
    { type: 'text', id: 'contact_email', label: 'Contact email', info: 'Shown under the FAQ heading. Falls back to /pages/contact.' },
  ],
  blocks: [
    { type: '@app' },
    {
      type: 'review',
      name: 'Review',
      settings: [
        { type: 'range', id: 'rating', label: 'Stars', min: 1, max: 5, step: 1, default: 5 },
        { type: 'text', id: 'title', label: 'Title' },
        { type: 'textarea', id: 'body', label: 'Review' },
        { type: 'text', id: 'name', label: 'Customer name', info: 'First name and last initial.' },
        { type: 'text', id: 'detail', label: 'Detail', info: 'For example the flavor they bought.' },
        { type: 'checkbox', id: 'verified', label: 'Verified buyer', default: false },
      ],
    },
    {
      type: 'video',
      name: 'Video review',
      settings: [
        { type: 'video', id: 'video', label: 'Uploaded video', info: 'Vertical (9:16) works best.' },
        { type: 'video_url', id: 'video_url', label: 'Or YouTube / Vimeo link', accept: ['youtube', 'vimeo'] },
        { type: 'image_picker', id: 'poster', label: 'Thumbnail', info: "Defaults to the video's preview image." },
        { type: 'text', id: 'name', label: 'Customer name' },
        { type: 'text', id: 'detail', label: 'Detail', info: 'For example the flavor they use.' },
        { type: 'text', id: 'quote', label: 'Pull quote' },
      ],
    },
    {
      type: 'faq',
      name: 'FAQ',
      settings: [
        { type: 'text', id: 'question', label: 'Question' },
        { type: 'richtext', id: 'answer', label: 'Answer' },
      ],
    },
  ],
  presets: [{ name: 'Earthline landing', blocks: FAQ.map((f) => ({ type: 'faq', settings: f })) }],
};

mkdirSync('shopify/sections', { recursive: true });
mkdirSync('shopify/templates', { recursive: true });
mkdirSync('shopify/assets', { recursive: true });
writeFileSync(
  'shopify/sections/earthline-landing.liquid',
  `{%- comment -%} Generated by build-earthline.mjs from src/earthline.html — edit the source, not this file. {%- endcomment -%}
{%- liquid
  assign p = product
  if section.settings.product != blank
    assign p = section.settings.product
  endif
  assign v_sel = p.selected_or_first_available_variant
  assign rating = p.metafields.reviews.rating.value.rating | default: section.settings.rating
  if rating != blank
    assign rating = rating | times: 1.0 | round: 1
  endif
  assign rating_count = p.metafields.reviews.rating_count.value | default: section.settings.rating_count
  assign review_blocks = section.blocks | where: 'type', 'review'
  assign video_blocks = section.blocks | where: 'type', 'video'
  assign faq_blocks = section.blocks | where: 'type', 'faq'
  assign app_blocks = section.blocks | where: 'type', '@app'
-%}
{%- if p == blank -%}
  <p style="padding:24px;text-align:center">Choose a product for the Earthline landing section.</p>
{%- else -%}
${fonts}${liquid}
{%- endif -%}
{% schema %}
${JSON.stringify(schema, null, 2)}
{% endschema %}
`
);

const template = {
  sections: {
    main: {
      type: 'earthline-landing',
      blocks: Object.fromEntries(FAQ.map((f, i) => [`faq-${i + 1}`, { type: 'faq', settings: f }])),
      block_order: FAQ.map((_, i) => `faq-${i + 1}`),
      settings: {},
    },
  },
  order: ['main'],
};
writeFileSync('shopify/templates/product.earthline.json', JSON.stringify(template, null, 2) + '\n');

for (const f of IMAGES) copyFileSync(`assets/earthline/${f}`, `shopify/assets/${f}`);
console.log('Built preview/earthline.html, shopify/sections/earthline-landing.liquid and shopify/templates/product.earthline.json');

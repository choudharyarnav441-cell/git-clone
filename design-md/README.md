# DESIGN.md library

74 design systems from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (commit `f696123`, 2026-09-21), MIT licensed — see [LICENSE](LICENSE).

Each `<site>/DESIGN.md` describes one site's visual language — colors, type scale, components, spacing, elevation, do's and don'ts, responsive rules — in plain markdown written for AI agents. Most follow the [Google Stitch DESIGN.md format](https://stitch.withgoogle.com/docs/design-md/specification/), with design tokens in YAML front matter.

## Using one

Name the file in your request, e.g.

> Restyle `src/landing.html` using `design-md/notion/DESIGN.md`, then run `node build.mjs`.

To make one the project-wide default, copy it to the repo root as `DESIGN.md` (the upstream convention). Claude Code doesn't read `DESIGN.md` on its own, so also add a `CLAUDE.md` containing `@DESIGN.md`.

These describe other companies' brands, and many name proprietary fonts — use the substitutes each file suggests, and keep clayo's own name and logo.

## Index

### AI & LLM Platforms

- [**Claude**](claude/DESIGN.md) - Anthropic's AI assistant. Warm terracotta accent, clean editorial layout
- [**Cohere**](cohere/DESIGN.md) - Enterprise AI platform. Vibrant gradients, data-rich dashboard aesthetic
- [**ElevenLabs**](elevenlabs/DESIGN.md) - AI voice platform. Dark cinematic UI, audio-waveform aesthetics
- [**Minimax**](minimax/DESIGN.md) - AI model provider. Bold dark interface with neon accents
- [**Mistral AI**](mistral.ai/DESIGN.md) - Open-weight LLM provider. French-engineered minimalism, purple-toned
- [**Ollama**](ollama/DESIGN.md) - Run LLMs locally. Terminal-first, monochrome simplicity
- [**OpenCode AI**](opencode.ai/DESIGN.md) - AI coding platform. Developer-centric dark theme
- [**Replicate**](replicate/DESIGN.md) - Run ML models via API. Clean white canvas, code-forward
- [**Runway**](runwayml/DESIGN.md) - AI creative-tools platform with an editorial film-festival aesthetic — cinematic dark heroes, paper-white reading bands, single proprietary sans, and pure black pill CTAs.
- [**Together AI**](together.ai/DESIGN.md) - Open-source AI infrastructure. Technical, blueprint-style design
- [**VoltAgent**](voltagent/DESIGN.md) - AI agent framework. Void-black canvas, emerald accent, terminal-native
- [**xAI**](x.ai/DESIGN.md) - Elon Musk's AI lab. Stark monochrome, futuristic minimalism

### Developer Tools & IDEs

- [**Cursor**](cursor/DESIGN.md) - AI-first code editor. Sleek dark interface, gradient accents
- [**Expo**](expo/DESIGN.md) - React Native platform. Dark theme, tight letter-spacing, code-centric
- [**Lovable**](lovable/DESIGN.md) - AI full-stack builder. Playful gradients, friendly dev aesthetic
- [**Raycast**](raycast/DESIGN.md) - Productivity launcher. Sleek dark chrome, vibrant gradient accents
- [**Superhuman**](superhuman/DESIGN.md) - Fast email client. Premium dark UI, keyboard-first, purple glow
- [**Vercel**](vercel/DESIGN.md) - Frontend deployment platform. Black and white precision, Geist font
- [**Warp**](warp/DESIGN.md) - Modern terminal. Dark IDE-like interface, block-based command UI

### Backend, Database & DevOps

- [**ClickHouse**](clickhouse/DESIGN.md) - Fast analytics database. Yellow-accented, technical documentation style
- [**Composio**](composio/DESIGN.md) - Tool integration platform. Modern dark with colorful integration icons
- [**HashiCorp**](hashicorp/DESIGN.md) - Infrastructure automation. Enterprise-clean, black and white
- [**MongoDB**](mongodb/DESIGN.md) - Document database. Green leaf branding, developer documentation focus
- [**PostHog**](posthog/DESIGN.md) - Product analytics. Playful hedgehog branding, developer-friendly dark UI
- [**Sanity**](sanity/DESIGN.md) - Headless content platform with a dark-first editorial marketing surface — 112px display type, IBM Plex Mono technical eyebrows, and a single coral-red accent reserved for the highest-priority CTA.
- [**Sentry**](sentry/DESIGN.md) - Error monitoring. Dark dashboard, data-dense, pink-purple accent
- [**Supabase**](supabase/DESIGN.md) - Open-source Firebase alternative. Dark emerald theme, code-first

### Productivity & SaaS

- [**Cal.com**](cal/DESIGN.md) - Open-source scheduling. Clean neutral UI, developer-oriented simplicity
- [**Intercom**](intercom/DESIGN.md) - Customer messaging. Friendly blue palette, conversational UI patterns
- [**Linear**](linear.app/DESIGN.md) - Project management for engineers. Ultra-minimal, precise, purple accent
- [**Mintlify**](mintlify/DESIGN.md) - Documentation platform. Clean, green-accented, reading-optimized
- [**Notion**](notion/DESIGN.md) - All-in-one workspace. Warm minimalism, serif headings, soft surfaces
- [**Resend**](resend/DESIGN.md) - Email API for developers. Minimal dark theme, monospace accents
- [**Slack**](slack/DESIGN.md) - Workplace messaging. Deep aubergine primary, cream-lavender hero gradients, pill CTAs
- [**Zapier**](zapier/DESIGN.md) - Automation platform. Warm orange, friendly illustration-driven

### Design & Creative Tools

- [**Airtable**](airtable/DESIGN.md) - Spreadsheet-database hybrid. Colorful, friendly, structured data aesthetic
- [**Clay**](clay/DESIGN.md) - Creative agency. Organic shapes, soft gradients, art-directed layout
- [**Figma**](figma/DESIGN.md) - Collaborative design tool. Vibrant multi-color, playful yet professional
- [**Framer**](framer/DESIGN.md) - Website builder. Bold black and blue, motion-first, design-forward
- [**Miro**](miro/DESIGN.md) - Visual collaboration. Bright yellow accent, infinite canvas aesthetic
- [**Webflow**](webflow/DESIGN.md) - Visual web builder. Blue-accented, polished marketing site aesthetic

### Fintech & Crypto

- [**Binance**](binance/DESIGN.md) - Crypto exchange. Bold Binance Yellow on monochrome, trading-floor urgency
- [**Coinbase**](coinbase/DESIGN.md) - Crypto exchange. Clean blue identity, trust-focused, institutional feel
- [**Kraken**](kraken/DESIGN.md) - Crypto trading platform. Purple-accented dark UI, data-dense dashboards
- [**Mastercard**](mastercard/DESIGN.md) - Global payments network. Warm cream canvas, orbital pill shapes, editorial warmth
- [**Revolut**](revolut/DESIGN.md) - Digital banking. Sleek dark interface, gradient cards, fintech precision
- [**Stripe**](stripe/DESIGN.md) - Payment infrastructure. Signature purple gradients, weight-300 elegance
- [**Wise**](wise/DESIGN.md) - International money transfer. Bright green accent, friendly and clear

### E-commerce & Retail

- [**Airbnb**](airbnb/DESIGN.md) - Travel marketplace. Warm coral accent, photography-driven, rounded UI
- [**Meta**](meta/DESIGN.md) - Tech retail store. Photography-first, binary light/dark surfaces, Meta Blue CTAs
- [**Nike**](nike/DESIGN.md) - Athletic retail. Monochrome UI, massive uppercase Futura, full-bleed photography
- [**Shopify**](shopify/DESIGN.md) - E-commerce platform. Dark-first cinematic, neon green accent, ultra-light display type
- [**Starbucks**](starbucks/DESIGN.md) - Coffee retail flagship. Four-tier earth-green system, warm cream canvas, proprietary SoDoSans typography

### Media & Consumer Tech

- [**Apple**](apple/DESIGN.md) - Consumer electronics. Premium white space, SF Pro, cinematic imagery
- [**HP**](hp/DESIGN.md) - PC and printer maker. Pure white canvas, HP Electric Blue signal CTA, geometric Forma DJR Micro, blue chevron decorations
- [**IBM**](ibm/DESIGN.md) - Enterprise technology. Carbon design system, structured blue palette
- [**NVIDIA**](nvidia/DESIGN.md) - GPU computing. Green-black energy, technical power aesthetic
- [**Pinterest**](pinterest/DESIGN.md) - Visual discovery platform. Red accent, masonry grid, image-first
- [**PlayStation**](playstation/DESIGN.md) - Gaming console retail. Three-surface channel layout, cyan hover-scale interaction
- [**SpaceX**](spacex/DESIGN.md) - Space technology. Stark black and white, full-bleed imagery, futuristic
- [**Spotify**](spotify/DESIGN.md) - Music streaming. Vibrant green on dark, bold type, album-art-driven
- [**The Verge**](theverge/DESIGN.md) - Tech editorial media. Acid-mint and ultraviolet accents, Manuka display type
- [**Uber**](uber/DESIGN.md) - Mobility platform. Bold black and white, tight type, urban energy
- [**Vodafone**](vodafone/DESIGN.md) - Global telecom brand. Monumental uppercase display, Vodafone Red chapter bands
- [**WIRED**](wired/DESIGN.md) - Tech magazine. Paper-white broadsheet density, custom serif, ink-blue links

### Automotive

- [**BMW**](bmw/DESIGN.md) - Luxury automotive. Dark premium surfaces, precise German engineering aesthetic
- [**BMW M**](bmw-m/DESIGN.md) - Performance automotive. Motorsport-inspired contrast, M color accents, precision-driven layout
- [**Bugatti**](bugatti/DESIGN.md) - Luxury hypercar. Cinema-black canvas, monochrome austerity, monumental display type
- [**Ferrari**](ferrari/DESIGN.md) - Luxury automotive. Chiaroscuro black-white editorial, Ferrari Red with extreme sparseness
- [**Lamborghini**](lamborghini/DESIGN.md) - Luxury automotive. True black cathedral, gold accent, LamboType custom Neo-Grotesk
- [**Renault**](renault/DESIGN.md) - French automotive. Vivid aurora gradients, NouvelR proprietary typeface, zero-radius buttons
- [**Tesla**](tesla/DESIGN.md) - Electric vehicles. Radical subtraction, cinematic full-viewport photography, Universal Sans

### Retro Web · DESIGN.md Nostalgia

A Saturday series — DESIGN.md files extracted from the web of the 1990s. Drop one in and tell your AI agent to build a period-accurate vintage UI.

- [**Dell (1996)**](dell-1996/DESIGN.md) - Catalog-era enterprise web. Literal black page frame, flat color-block "ribbon cards", chunky Helvetica-Black titles over Times Roman body, and hand-cut GIF stickers (NEW! bursts, award seals, beveled product photos).
- [**Nintendo.com (2001)**](nintendo-2001/DESIGN.md) - Y2K "console chrome" web. Brushed-periwinkle beveled metal panels, a halftone-dotted carbon nav glowing amber, outlined Arial-Black box-art wordmarks over circuit-board hero fields, and a pixel Mario welcome bubble.

## Updating

```sh
tmp=$(mktemp -d) && git clone --depth 1 https://github.com/VoltAgent/awesome-design-md "$tmp"
for f in "$tmp"/design-md/*/DESIGN.md; do
  d="design-md/$(basename "$(dirname "$f")")"; mkdir -p "$d" && cp "$f" "$d/"
done
```

Then add any new sites to the index above and update the commit reference at the top.

# Frontend Take-Home — Bundle Builder

React prototype of a multi-step security **bundle builder** with a live review panel.

Desktop layout uses a two-column experience; tablet/mobile stay usable and coherent.

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (starts at **http://localhost:8081/**; if busy, tries 8082, 8083, …).

```bash
npm run build
npm run preview
```

## What’s implemented

### Builder (left)
- 4-step accordion: cameras (open on load) → plan → sensors → extra protection
- Header: `STEP X OF 4`, icon, title, **N selected**, chevron
- **Next: …** advances to the following step
- Data-driven product cards from `src/data/products.json` (optional badge / variants)

### Variant quantities (critical)
- Each color variant stores its **own** quantity (`productId::variantId`)
- Card stepper is bound to the **active** variant only
- Switching White → Black shows Black’s count (often `0`) without clearing White
- Review panel lists **every variant with qty > 0** as its own line (e.g. `Wyze Cam v4 (White)`)

### Review panel (right)
- Groups: Cameras, Sensors, Accessories, Plan
- Line: thumbnail, name, synced quantity stepper, pricing
- Shipping (FREE), satisfaction badge, financing chip, struck compare-at + total, savings callout
- **Checkout** → simple confirmation placeholder
- **Save my system for later** → `localStorage` persist + restore on reload

### Seeded state
Loads with cameras, sensors, accessory, and plan pre-populated in the review panel.

## Tech

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Context + `useReducer` (single source of truth)
- Local JSON catalog (no backend required)

## Architecture

```
src/
  components/   Accordion, ProductCard, QuantityStepper, VariantSelector,
                ReviewPanel, SummaryItem, Button, icons
  context/      BundleContext.tsx
  hooks/        useLocalStorage.ts
  data/         products.json, variantImages.ts
  types/
  utils/        pricing.ts, storage.ts
  pages/        Home.tsx
  App.tsx
```

UI never manually syncs — cards, steppers, accordion counts, review rows, and totals all derive from bundle state.

## Decisions & tradeoffs

1. **Normalized quantities** — `quantities[productId::variantId]` keeps variant isolation simple and review-panel friendly.
2. **Active variant is UI-only** — changing chips never overwrites sibling variant counts.
3. **Pricing** — one utility (`utils/pricing.ts`) owns subtotal, compare-at, shipping savings, financing, and final total.
4. **Plan row** — keeps the shield treatment, but includes a quantity stepper so card ↔ review stay in sync (brief requirement).
5. **Fonts** — Gilroy primary, with Plus Jakarta Sans fallback.
6. **Checkout** — no payment backend; confirmation message only, as allowed by the brief.

## Not finished / future

- Real checkout API
- Automated visual regression tests
- Unit tests for pricing + variant isolation

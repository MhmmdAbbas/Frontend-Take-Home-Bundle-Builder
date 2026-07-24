# Frontend Take-Home — Bundle Builder

React prototype of a multi-step security **bundle builder** with a live review panel beside it.

Two-column desktop layout (builder left, review right). Smaller viewports stay usable and coherent down to phone size.

---

## Quick start

```bash
npm install
npm run dev
```

That starts:

| Process | URL |
| --- | --- |
| API (product catalog) | `http://localhost:3001` |
| Vite app | `http://localhost:8081` (auto-bumps if busy) |

Open the **Vite** URL in the browser. The app proxies `/api/*` to the API.

### Other scripts

```bash
npm run dev:server   # API only
npm run dev:client   # Vite only (API must already be running)
npm run build        # production build
npm run start:api    # API for preview / production-style check
npm run preview      # serve the built app (keep API running)
```

---

## What’s included

### Builder (left)
- 4-step accordion: cameras (open on load) → plan → sensors → extra protection
- Header: `STEP X OF 4`, icon, title, **N selected**, chevron
- **Next: …** advances to the following step
- Data-driven product cards (badge / variants / pricing only when present in data)

### Variant quantities
- Each color variant has its **own** quantity (`productId::variantId`)
- Card stepper is bound to the **active** variant only
- Switching White → Black shows Black’s count (often `0`) without clearing White
- Review panel lists **every variant with qty > 0** as its own line

### Review panel (right)
- Groups: Cameras, Sensors, Accessories, Plan
- Line: thumbnail, name, synced quantity stepper, pricing
- Shipping (FREE), satisfaction badge, financing chip, struck compare-at + total, savings callout
- **Checkout** → simple confirmation placeholder
- **Save my system for later** → `localStorage` persist + restore on reload

### Seeded state
Loads with cameras, sensors, accessory, and plan pre-populated so the review panel matches the design on first visit (until you save a different configuration).

### Bonus — product catalog API
Catalog lives in `src/data/products.json` and is served by a small Node HTTP server:

- `GET /api/products` — full catalog
- `GET /api/health` — `{ "ok": true }`

The UI fetches the catalog over HTTP on load (loading / error + retry states included).

---

## Tech

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Context + `useReducer` (single source of truth)
- Node HTTP API (`server/index.mjs`) — no extra backend dependencies

---

## Project layout

```
server/         Node API — GET /api/products, GET /api/health
scripts/        dev.mjs starts API + Vite together
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

---

## Decisions & tradeoffs

1. **Normalized quantities** — `quantities[productId::variantId]` keeps variant isolation simple and review-panel friendly.
2. **Active variant is UI-only** — changing chips never overwrites sibling variant counts.
3. **Pricing** — one utility (`utils/pricing.ts`) owns subtotal, compare-at, shipping savings, financing, and final total.
4. **Plan row** — keeps the shield treatment, but includes a quantity stepper so card ↔ review stay in sync.
5. **Fonts** — Gilroy primary, with Plus Jakarta Sans fallback.
6. **Checkout** — no payment backend; confirmation message only, as allowed by the brief.
7. **Catalog API (bonus)** — JSON stays in-repo; a tiny Node server exposes it so the client fetches over HTTP instead of bundling the file.

---

## Troubleshooting

### `EADDRINUSE: address already in use :::3001`

Something else is already using the API port (often a previous `npm run dev` that didn’t exit).

**Windows (PowerShell):**

```powershell
Get-NetTCPConnection -LocalPort 3001 | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

**macOS / Linux:**

```bash
lsof -i :3001
kill <PID>
```

Or pick another port:

```bash
# Terminal 1
API_PORT=3002 npm run start:api

# Terminal 2 — point the Vite proxy at that port, or stop conflicting process and use defaults
```

Prefer stopping the old process, then run `npm run dev` again.

### App shows “Couldn’t load the product catalog”

The Vite app is up but the API isn’t. Run `npm run dev` (both processes), or start the API with `npm run start:api` / `npm run dev:server`, then click **Retry**.

### Vite port already in use

Vite starts at **8081** and bumps automatically (`8082`, `8083`, …). Use the URL printed in the terminal.

---

## Not finished / future

- Real checkout API
- Automated visual regression tests
- Unit tests for pricing + variant isolation

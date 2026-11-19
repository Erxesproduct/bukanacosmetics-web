# Bukana Cosmetics web store

Next.js 16 storefront that replaces the Zochil shop at bukanacosmetics.mn (handmade false lashes since 2016, eye, lip
and face makeup). «Blush Bubble» design: cotton-candy pink, lilac and peach, morphing blobs, rising bubbles,
twinkling sparkles, a blinking-eye mascot and lashes that flutter (all still for reduced motion). 45 products from the
Zochil shop, a lash picker that compares length and wears from the shop's own text, checkout with QPay (through erxes),
Ulaanbaatar delivery, eBarimt details, the partner shops in the city and the aimags.

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000   # order API checks (add --send for one real test order in erxes)
npm run export:erxes   # docs/erxes/bukana-*.csv for the erxes product import
```

- Catalog: `src/data/catalog.json` (server) and `src/data/lite.json` (cart, hearts), built from Zochil shop 6234.
  Photos in `public/images/p/`.
- Business rules (6,000₮ delivery, free above 50,000₮, 11:00 same-day cut-off, QPay only, partner shops, statuses):
  `src/content/business.ts`.
- Orders: `POST /api/orders` validates against catalog prices and stock, records the order in erxes (form → Sales
  card), then creates the QPay invoice in erxes. Env vars: `.env.example`.
- erxes admin work (payments, eBarimt, pipeline, import) and open questions: `docs/erxes/MANUAL-STEPS.md`.

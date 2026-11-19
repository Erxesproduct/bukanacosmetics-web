# Bukana Cosmetics: erxes manual steps

Owner of every step below: **Terbish**, with Bukana Cosmetics for credentials and decisions.

These steps happen in the erxes 3.0 admin (and at QPay / ebarimt.mn), not in code. The website reads the results
through the environment variables in `.env.example`. Never commit their values; set them in
**Vercel → bukanacosmetics-web → Settings → Environment Variables** and redeploy.

There is no erxes instance for Bukana yet ("erxes 3.0: NOT SET"). Create the workspace first.

| Task | Website | erxes / external (manual) |
| --- | --- | --- |
| [1.1] Products, categories, prices | done: 45 products, 5 groups, MNT prices, up to 5 photos each, imported from Zochil | import the CSVs (1.1) |
| [1.2] QPay | done: QPay invoice + status check through the erxes payment plugin | **blocked**: QPay merchant credentials, erxes payment method (1.2) |
| [1.3] eBarimt | done: person / company choice, registry number validated | **blocked**: PosAPI registration, TIN; receipts are issued by erxes (1.3) |
| [1.4] Delivery, fees, statuses | done: Ulaanbaatar 6,000₮, free above 50,000₮, 11:00 cut-off; status list | delivery product, pipeline stages (1.4) |
| [1.5] Full journey test | validation verified (29 checks, `npm run test:order`) | **blocked**: a real order needs the env vars and 1.2 / 1.3 (1.5) |

---

## 1.1 Products, categories, prices

Source: bukanacosmetics.mn (Zochil shop 6234), read 2026-11-19: **45 products**, MNT prices 2,000₮–100,000₮, up to
5 photos each (pre-sized WebP on the website), 1 banner, logo, about text, FAQ.

- Groups (from the 14 Zochil categories, plus 6 products that had none): Наадаг сормуус 18 (17 lashes + glue),
  Нүд 5, Уруул 10, Нүүр 8, Хэрэгсэл & бэлэг 4.
- Lashes: length in mm, number of wears and «who it suits» are read from the shop's own product text (for example
  «9-12мм уусгалттай», «20-30 удаа хэрэглэнэ»). Tags (first-timers, everyday, natural, volume, events,
  self-adhesive) come from keywords in that text. Nothing is invented: a lash without a written length shows none.
  The «Сормуус сонгогч» page (`/lashes`) filters and compares them.
- The lists of partner shops («Бэлэн байгаа (гэрээт) салбарууд») were repeated in many product texts; they are cut out
  of the product pages and shown once, de-duplicated by phone number, on `/info#stores` (28 shops; open question 4).
- Stock: every product tracks stock on Zochil. 6 are at 0 (Shine, Jelly blush #1 / #2, Уруул хүрээлэгч #2, black and
  white eye pencil): shown as «Дууссан», not orderable. No variants, no sale prices.
- Old Zochil URLs (`/products/<category>/<id>`, category pages, `/about`, `/checkout`, …) redirect to the new pages.

Files (made by `npm run export:erxes` from `src/data/catalog.json`):

- `docs/erxes/bukana-categories.csv`: `BK` → `BK-LASHES`, `BK-EYES`, `BK-LIPS`, `BK-FACE`, `BK-EXTRAS`, `BK-DELIVERY`.
- `docs/erxes/bukana-products.csv`: 45 rows, code `BK-<zochilId>`, name, category, unit price, shade, lash length,
  lash wears, Zochil stock, photo path.

Steps:

1. **Products & services → Categories**: import `bukana-categories.csv` (parents first; already ordered).
2. **Settings → Import & Export → Import → Products**: upload `bukana-products.csv`. Map `code → Code`,
   `name → Name`, `category code → Category code`, `unit price → Unit price`, `type → Type`. Keep the codes: website
   orders name every line with its `BK-…` code.
3. **Inventories → Remainders**: enter real stock.
4. Photos: upload from `public/images/p/` (path in the CSV) if erxes should show them too.

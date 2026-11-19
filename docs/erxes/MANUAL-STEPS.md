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

## 1.2 Payment (QPay)

On Zochil `has_qpay` is on (merchant `Z_BUKANA_COSMET`), but the QPay2 method shows `checkout_status: disabled` and the
payment rule is empty (open question 1). The website offers **QPay only**, through erxes.

How the website uses erxes (erxes 3.0 source, `backend/plugins/payment_api`):

- `generateInvoiceUrl` (public) creates the invoice after the order is saved in erxes; the customer pays on the erxes
  payment page and returns to `/order/<reference>`. `invoicesCheck` (public) is asked every 5 s there.
- No order is sent to QPay unless it was first recorded in erxes (no money asked for an order staff cannot see).

Steps:

1. Get Bukana's QPay merchant credentials (`client_id`, `client_secret`, `invoice_code`); ask QPay / Zochil whether
   the current merchant can be used outside Zochil.
2. **Settings → Payments → Add → QPay (v2)**: enter them. Make a 100₮ test invoice in erxes.
3. Copy the payment method's `_id` into Vercel as `ERXES_PAYMENT_IDS`.
4. **Not yet tested**: nothing has been run against a real QPay merchant. Do not call payments working until step 2
   and section 1.5 pass with authorized credentials.

## 1.3 eBarimt

The website never makes a receipt. The checkout asks «Хувь хүн» or «Байгууллага» (7-digit registry number, checked on
the server) and writes it on the order. The receipt is issued in erxes by staff (or the POS) after payment.

1. Collect from Bukana: company / individual TIN (Zochil has none), district code, VAT status, product
   classification codes (cosmetics).
2. Register for **PosAPI 3.0** (ebarimt.mn) and install the PosAPI service.
3. **Settings → eBarimt**: PosAPI URL, TIN, district code, VAT switches; assign it to the website pipeline.
4. For every paid order: issue the receipt once (check the card first) and send the lottery number by SMS / email.

## 1.4 Delivery zones, fees and order statuses

Website (done), from Zochil shop 6234:

| Option | Fee | Rule |
| --- | --- | --- |
| Улаанбаатар (Zochil «Үндсэн хүргэлт», id 172) | 6,000₮, free when goods are above 50,000₮ | before 11:00 the same day, otherwise next day; district, khoroo 1–45, address |
| Орон нутаг | not offered online | Zochil has the countryside switch on but no countryside option; the site points to the partner shops in the aimags and the phone (open question 2) |

- The delivery rule is word for word from the shop. No day off and no zone limits are given (open question 3).
- The header and checkout show «Одоо захиалбал: Өнөөдөр / Маргааш хүргэнэ» and the minutes left before 11:00, in
  Ulaanbaatar time.
- Fees and rules live in `src/content/business.ts`; change them there and in the erxes delivery product.

erxes:

1. Import `docs/erxes/bukana-delivery.csv` (`BK-DELIVERY-172` Улаанбаатар 6,000₮).
2. **Sales → Boards → «Онлайн захиалга» → pipeline «Вэбсайт»**, stages (as on the website order page):
   Хүлээгдэж байна → Баталгаажсан → Бэлтгэж байна → Хүргэлтэд гарсан → Хүргэгдсэн, plus Цуцлагдсан.
3. **Frontline → Forms → (order form) → Settings**: create a sales card in «Хүлээгдэж байна» for every submission.
   Staff move it to «Баталгаажсан» when the erxes invoice shows paid.

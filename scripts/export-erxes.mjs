// node scripts/export-erxes.mjs → docs/erxes/bukana-{categories,products,delivery}.csv
// Files for erxes Products & Services import (Settings → Import). Every row comes from src/data/catalog.json.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const c = JSON.parse(readFileSync(path.join(root, "src/data/catalog.json"), "utf8"));
const out = path.join(root, "docs/erxes");
mkdirSync(out, { recursive: true });

const cell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows) => "﻿" + rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";
const code = (id) => `BK-${id.toUpperCase()}`;

// categories: BK → the 5 groups (lashes, eyes, lips, face, extras) → delivery
const cats = [["code", "name", "parent code"], ["BK", "Bukana Cosmetics", ""]];
for (const g of c.groups) cats.push([code(g.id), g.name, "BK"]);
cats.push(["BK-DELIVERY", "Хүргэлт", "BK"]);
writeFileSync(path.join(out, "bukana-categories.csv"), csv(cats));

const rows = [["code", "name", "category code", "type", "unit price", "price before sale", "shade", "lash length mm", "lash wears", "stock (Zochil)", "zochil product id", "image (website path)"]];
for (const p of c.products)
  for (const v of p.variants)
    rows.push([
      `BK-${v.id}`,
      [p.title, p.shade].filter(Boolean).join(" · ").slice(0, 200),
      code(p.group),
      "product",
      v.price,
      v.compareAt ?? "",
      p.shade ?? "",
      p.lash?.mm ? `${p.lash.mm.min}-${p.lash.mm.max}` : "",
      p.lash?.uses ? `${p.lash.uses.min}-${p.lash.uses.max}` : "",
      v.stock ?? "",
      p.id,
      p.images[0]?.src ?? "",
    ]);
writeFileSync(path.join(out, "bukana-products.csv"), csv(rows));

const d = c.shop.delivery;
writeFileSync(
  path.join(out, "bukana-delivery.csv"),
  csv([
    ["code", "name", "category code", "type", "unit price", "free above (goods total)", "source"],
    ...d.map((x) => [`BK-DELIVERY-${x.id}`, `Хүргэлт: ${x.title}`, "BK-DELIVERY", "service", x.price, x.freeFrom ?? "", `Zochil delivery option ${x.id} «${x.note}»`]),
  ]),
);
console.log(`categories ${cats.length - 1}, products ${rows.length - 1}, delivery ${d.length}`);

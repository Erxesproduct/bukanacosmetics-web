import "server-only";

import data from "@/data/catalog.json";

export type Variant = {
  /** Zochil product id. erxes product code BK-<id>. */
  id: string;
  label: string | null;
  price: number;
  compareAt: number | null;
  /** Zochil stock; null = not counted (orderable). */
  stock: number | null;
};
export type Photo = { src: string; w: number; h: number; thumb: { src: string; w: number; h: number } };
export type Range = { min: number; max: number };
/** Read from the shop's own lash text: length in mm, how many wears, who it suits, keyword tags. */
export type Lash = { mm: Range | null; uses: Range | null; tags: string[]; who: string | null; glue: boolean };
export type Product = {
  id: number;
  slug: string;
  title: string;
  /** lashes | eyes | lips | face | extras */
  group: string;
  /** shade or tone written in the product name («гүн бор») */
  shade: string | null;
  /** the shop's own product text, line by line (partner store lists removed: they live on /info) */
  lines: string[];
  lash: Lash | null;
  variants: Variant[];
  orders: number;
  featured: boolean;
  /** place on the shop's own bestseller list, -1 when not on it */
  best: number;
  createdAt: string;
  images: Photo[];
};
export type Group = { id: string; name: string; line: string; count: number };
export type LashTag = { id: string; name: string; count: number };
export type Store = { line: string; phone: string; ub: boolean };

export const products = data.products as Product[];
export const groups = data.groups as Group[];
export const lashTags = (data.lashTags as LashTag[]).filter((t) => t.count > 0);
export const banners = data.banners as { src: string; w: number; h: number; title: string }[];
export const catalogInfo = { source: data.source, shopId: data.shopId, updatedAt: data.updatedAt };

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byVariant = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }] as const)));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getVariant = (id: string) => byVariant.get(id);
export const groupName = (id: string) => groups.find((g) => g.id === id)?.name ?? "";
/** Title with its shade («Уруул хүрээлэгч #1 · гүн бор»). */
export const fullName = (p: Pick<Product, "title" | "shade">) => (p.shade ? `${p.title} · ${p.shade}` : p.title);
export const sku = (id: string) => `BK-${id}`;
export const mmLabel = (r: Range | null) => (r ? (r.min === r.max ? `${r.min} мм` : `${r.min}–${r.max} мм`) : null);
export const usesLabel = (r: Range | null) => (r ? `${r.min}–${r.max} удаа` : null);

export const soldOut = (v: Pick<Variant, "stock">) => v.stock === 0;
export const available = (p: Product) => p.variants.some((v) => !soldOut(v));
export const fromPrice = (p: Product) => p.variants[0].price;
export const onSale = (p: Product) => p.variants.some((v) => v.compareAt);
export const lashes = products.filter((p) => p.lash && !p.lash.glue);
/** The shop's own glue (2,000₮): lashes come without it. */
export const glue = products.find((p) => p.lash?.glue) ?? null;

/** In stock first, then the shop's bestseller order, then most ordered on Zochil. */
const rank = (p: Product) => (p.best < 0 ? 999 : p.best);
export const byPopularity = (a: Product, b: Product) => Number(available(b)) - Number(available(a)) || rank(a) - rank(b) || b.orders - a.orders || Number(b.featured) - Number(a.featured);
export const popular = [...products].sort(byPopularity);

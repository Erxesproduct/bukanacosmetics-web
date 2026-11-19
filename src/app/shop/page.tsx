import type { Metadata } from "next";
import Link from "next/link";
import { Blob, Bubbles, Lash } from "@/components/deco";
import { CloseIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { available, byPopularity, fromPrice, groups, onSale, products, type Product } from "@/lib/catalog";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const KEYS = ["g", "q", "sale"] as const;

const SORTS = [
  ["popular", "Эрэлттэй"],
  ["new", "Шинэ"],
  ["price-asc", "Хямдаас"],
  ["price-desc", "Үнэтэйгээс"],
] as const;

function titleOf(q: Record<string, string>) {
  if (q.q) return `«${q.q}»`;
  if (q.g) return groups.find((g) => g.id === q.g)?.name;
  if (q.sale) return "Хямдрал";
  return null;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const q = Object.fromEntries(KEYS.map((k) => [k, one(sp[k])]));
  const t = titleOf(q);
  return { title: t ? `${t}: дэлгүүр` : "Дэлгүүр", alternates: { canonical: "/shop" } };
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-zа-яёөү0-9#]+/gi, " ").trim();

export default async function Shop({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = Object.fromEntries([...KEYS, "sort"].map((k) => [k, one(sp[k]).slice(0, 60)]));
  const sort = SORTS.some(([id]) => id === q.sort) ? q.sort : "popular";

  const match = (p: Product, skip?: string) =>
    (skip === "g" || !q.g || p.group === q.g) &&
    (!q.sale || onSale(p)) &&
    (!q.q || norm(`${p.title} ${p.shade ?? ""} ${groups.find((g) => g.id === p.group)?.name ?? ""} ${p.lines.join(" ")}`).includes(norm(q.q)));

  const list = products.filter((p) => match(p));
  list.sort((a, b) => {
    const av = Number(available(b)) - Number(available(a));
    if (av) return av;
    if (sort === "new") return b.createdAt.localeCompare(a.createdAt);
    if (sort === "price-asc") return fromPrice(a) - fromPrice(b);
    if (sort === "price-desc") return fromPrice(b) - fromPrice(a);
    return byPopularity(a, b);
  });

  const href = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...q, ...patch })) if (v) next.set(k, v);
    const s = next.toString();
    return s ? `/shop?${s}` : "/shop";
  };
  const title = titleOf(q) ?? "Бүх бараа";
  const active = KEYS.filter((k) => q[k]);
  const label = (k: string) => (k === "sale" ? "Хямдрал" : k === "q" ? `«${q.q}»` : titleOf({ [k]: q[k] }));

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-blush-3 to-cream">
        <Blob className="-top-20 -right-16 h-[260px] w-[260px] opacity-70" color="var(--color-lilac-2)" />
        <Bubbles color="rgb(242 112 156 / 0.15)" />
        <div className="wrap relative py-9 md:py-12">
          <nav className="text-[13px] font-bold text-ink-2" aria-label="Зам">
            <Link href="/" className="hover:text-berry">
              Нүүр
            </Link>{" "}
            /{" "}
            <Link href="/shop" className="hover:text-berry">
              Дэлгүүр
            </Link>
          </nav>
          <h1 className="display mt-2 text-[36px] leading-tight md:text-[52px]">{title}</h1>
          <p className="mt-1 font-bold text-ink-2">{list.length} бараа</p>
          {active.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {active.map((k) => (
                <Link key={k} href={href({ [k]: null })} className="chip !bg-ink !text-white" scroll={false}>
                  {label(k)} <CloseIcon size={14} />
                </Link>
              ))}
              <Link href="/shop" className="chip">
                Бүгдийг арилгах
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="wrap mt-4 space-y-1.5">
        <Scroller label="Төрөл" small className="no-bar flex gap-2 overflow-x-auto py-1.5">
          <span className="eyebrow mr-1 shrink-0 self-center !text-[12px] text-ink-3">Төрөл</span>
          {groups.map((g) => {
            const n = products.filter((p) => match(p, "g") && p.group === g.id).length;
            if (!n && q.g !== g.id) return null;
            return (
              <Link key={g.id} href={href({ g: q.g === g.id ? null : g.id })} aria-current={q.g === g.id} className="chip shrink-0" scroll={false}>
                {g.name}
                <span className="text-[12px] opacity-60">{n}</span>
              </Link>
            );
          })}
        </Scroller>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="eyebrow mr-1 !text-[12px] text-ink-3">Эрэмбэ</span>
          {SORTS.map(([id, name]) => (
            <Link key={id} href={href({ sort: id === "popular" ? null : id })} aria-current={sort === id} className="chip" scroll={false}>
              {name}
            </Link>
          ))}
          {products.some(onSale) && (
            <Link href={href({ sale: q.sale ? null : "1" })} aria-pressed={!!q.sale} className="chip" scroll={false}>
              Хямдралтай
            </Link>
          )}
        </div>
      </div>

      {(!q.g || q.g === "lashes") && !q.q && (
        <div className="wrap mt-6">
          <Link href="/lashes" className="lift flutter-hover flex items-center gap-4 rounded-[26px] bg-lilac-2 p-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white">
              <Lash width={36} color="#6a46c2" />
            </span>
            <span className="min-w-0">
              <b className="block">Аль сормуус тохирохоо мэдэхгүй байна уу?</b>
              <span className="text-[14px] text-ink-2">Анх наах, өдөр тутам, гоёл… урт, эдэлгээгээр нь харьцуулаарай →</span>
            </span>
          </Link>
        </div>
      )}

      <section className="wrap mt-8">
        {list.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {list.map((p, i) => (
              <ProductCard key={p.slug} p={p} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="card mx-auto max-w-md p-10 text-center">
            <Lash width={90} open className="mx-auto" />
            <p className="display mt-3 text-[26px]">Олдсонгүй</p>
            <p className="mt-2 text-ink-2">Шүүлтүүрээ багасгаад үзээрэй, эсвэл бидэнтэй холбогдоорой.</p>
            <Link href="/shop" className="btn btn-pink mt-6">
              Бүх бараа
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

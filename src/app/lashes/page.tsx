import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CardActions } from "@/components/card-actions";
import { Blob, Bubbles, Lash, Sparkles } from "@/components/deco";
import { LashSpecs, TAG_NAMES } from "@/components/lash-specs";
import { Reveal } from "@/components/reveal";
import { business } from "@/content/business";
import { available, glue, lashes, lashTags, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Сормуус сонгогч",
  description: "Bukana наадаг сормуусыг урт, зүүх удаа, хэнд тохирохоор нь харьцуулж сонгоорой.",
  alternates: { canonical: "/lashes" },
};

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const SORTS = [
  ["popular", "Эрэлттэй"],
  ["short", "Богиноос"],
  ["long", "Уртаас"],
  ["uses", "Олон удаа зүүх"],
] as const;

export default async function LashesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const tag = lashTags.some((t) => t.id === one(sp.t)) ? one(sp.t) : "";
  const sort = SORTS.some(([id]) => id === one(sp.s)) ? one(sp.s) : "popular";
  const len = (p: Product) => p.lash?.mm?.max ?? null;

  const list = lashes.filter((p) => !tag || p.lash!.tags.includes(tag));
  list.sort((a, b) => {
    const av = Number(available(b)) - Number(available(a));
    if (av) return av;
    // lashes without a written length go last when sorting by length
    if (sort === "short") return (len(a) ?? 99) - (len(b) ?? 99);
    if (sort === "long") return (len(b) ?? -1) - (len(a) ?? -1);
    if (sort === "uses") return (b.lash?.uses?.max ?? -1) - (a.lash?.uses?.max ?? -1);
    return 0; // `lashes` is already in the shop's bestseller order
  });
  const href = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries({ t: tag, s: sort === "popular" ? "" : sort, ...patch })) if (v) next.set(k, v);
    const s = next.toString();
    return s ? `/lashes?${s}` : "/lashes";
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-lilac-2 via-blush-3 to-peach-2">
        <Blob className="-top-24 -left-20 h-[300px] w-[300px] opacity-70" color="#fff" />
        <Bubbles dense />
        <Sparkles />
        <div className="wrap relative grid items-center gap-6 py-10 md:grid-cols-[1fr_auto] md:py-14">
          <div>
            <p className="hand text-[28px] leading-none text-blush">аль нь надад тохирох вэ?</p>
            <h1 className="display mt-1 text-[36px] leading-tight md:text-[52px]">Сормуус сонгогч</h1>
            <p className="mt-2 max-w-xl text-ink-2">Доорх шошгоос өөрт ойрыг нь сонго. Урт, зүүх удаа, хэнд тохирох нь бүгд манай тайлбараас.</p>
          </div>
          <span className="mx-auto grid h-36 w-36 place-items-center rounded-full bg-white shadow-[0_20px_40px_-20px_rgb(150_110_230/0.8)] md:h-44 md:w-44">
            <Lash width={110} open />
          </span>
        </div>
      </section>

      <div className="wrap mt-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Хэнд, хэзээ">
          <Link href={href({ t: null })} aria-current={!tag} className="chip" scroll={false}>
            Бүгд <span className="text-[12px] opacity-60">{lashes.length}</span>
          </Link>
          {lashTags.map((t) => (
            <Link key={t.id} href={href({ t: tag === t.id ? null : t.id })} aria-current={tag === t.id} className="chip" scroll={false}>
              {t.name} <span className="text-[12px] opacity-60">{t.count}</span>
            </Link>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1 !text-[12px] text-ink-3">Эрэмбэ</span>
          {SORTS.map(([id, name]) => (
            <Link key={id} href={href({ s: id === "popular" ? null : id })} aria-current={sort === id} className="chip !min-h-9 !text-[13.5px]" scroll={false}>
              {name}
            </Link>
          ))}
        </div>
      </div>

      <section className="wrap mt-8">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => {
            const ok = available(p);
            return (
              <Reveal as="li" key={p.slug} delay={(i % 3) * 70}>
                <article className="card lift flutter-hover relative flex h-full flex-col overflow-hidden">
                  <Link href={`/p/${p.slug}`} className="relative m-2 block aspect-[4/3] overflow-hidden rounded-[24px] bg-blush-3" tabIndex={-1} aria-hidden>
                    {p.images[0] && <Image src={p.images[0].thumb.src} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className={`object-cover transition duration-700 hover:scale-105 ${ok ? "" : "opacity-60 grayscale"}`} />}
                    {!ok && <span className="absolute right-3 bottom-3 rounded-full bg-white px-3 py-1 text-[12.5px] font-bold">Дууссан</span>}
                  </Link>
                  <div className="flex flex-1 flex-col px-5 pt-2 pb-5">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/p/${p.slug}`} className="display text-[20px] leading-tight hover:text-berry">
                        {p.title}
                      </Link>
                      <span className="display shrink-0 text-[18px] text-berry">{formatPrice(p.variants[0].price)}</span>
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {p.lash!.tags.map((t) => (
                        <li key={t} className={`rounded-full px-2.5 py-0.5 text-[12px] font-bold ${t === tag ? "bg-blush text-white" : "bg-blush-3 text-berry"}`}>
                          {TAG_NAMES[t]}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3">
                      <LashSpecs lash={p.lash!} compact />
                    </div>
                    {(p.lash!.who ?? p.lines[1] ?? p.lines[0]) && <p className="mt-3 line-clamp-3 text-[13.5px] text-ink-2">♡ {p.lash!.who ?? p.lines[1] ?? p.lines[0]}</p>}
                    <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                      <Link href={`/p/${p.slug}`} className="text-[14px] font-bold text-berry hover:underline">
                        Дэлгэрэнгүй →
                      </Link>
                      <CardActions slug={p.slug} variantId={ok ? p.variants[0].id : null} />
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
        {!list.length && (
          <div className="card mx-auto max-w-md p-10 text-center">
            <p className="display text-[24px]">Энэ шошготой сормуус алга</p>
            <Link href="/lashes" className="btn btn-pink mt-6">
              Бүгдийг харах
            </Link>
          </div>
        )}
      </section>

      <section className="wrap mt-12">
        <div className="card flex flex-col items-start gap-4 bg-butter p-6 sm:flex-row sm:items-center md:p-8">
          <span className="text-[34px]" aria-hidden>
            ✿
          </span>
          <div className="flex-1">
            <b className="display block text-[20px]">Цавууны талаар</b>
            <p className="mt-1 text-ink-2">{business.rules.glue}</p>
          </div>
          {glue && available(glue) && (
            <Link href={`/p/${glue.slug}`} className="btn btn-white">
              Цавуу {formatPrice(glue.variants[0].price)} →
            </Link>
          )}
        </div>
      </section>
    </>
  );
}

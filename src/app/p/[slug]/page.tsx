import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/buy-box";
import { Lash } from "@/components/deco";
import { EtaLine } from "@/components/delivery-eta";
import { Gallery } from "@/components/gallery";
import { QrIcon, TruckIcon } from "@/components/icons";
import { LashSpecs, TAG_NAMES } from "@/components/lash-specs";
import { ProductCard, TINT } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { available, byPopularity, fullName, getProduct, glue, groups, mmLabel, products, sku } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const name = fullName(p);
  const desc = [p.lash?.mm && mmLabel(p.lash.mm), formatPrice(p.variants[0].price), p.lines[0]].filter(Boolean).join(" · ").slice(0, 160);
  return { title: name, description: desc, alternates: { canonical: `/p/${p.slug}` }, openGraph: { images: p.images[0] ? [{ url: p.images[0].src }] : undefined } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const name = fullName(p);
  const group = groups.find((g) => g.id === p.group);
  const city = business.delivery[0];
  const v = p.variants[0];
  const isLash = !!p.lash && !p.lash.glue;
  const lines = p.lines.filter((l) => l !== p.lash?.who);

  // same group and shared lash tags first, then what sells
  const related = products
    .filter((x) => x.slug !== p.slug && available(x))
    .map((x) => ({ x, score: (x.group === p.group ? 3 : 0) + (x.lash?.tags.filter((t) => p.lash?.tags.includes(t)).length ?? 0) }))
    .sort((a, b) => b.score - a.score || byPopularity(a.x, b.x))
    .slice(0, 10)
    .map(({ x }) => x);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku: sku(v.id),
    brand: { "@type": "Brand", name: business.brand },
    image: p.images.map((m) => absoluteUrl(m.src)),
    description: p.lines.join(" ") || undefined,
    offers: { "@type": "Offer", priceCurrency: "MNT", price: v.price, sku: sku(v.id), availability: available(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: absoluteUrl(`/p/${p.slug}`) },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="wrap pt-6 md:pt-10">
        <nav className="flex flex-wrap gap-x-1.5 text-[13px] font-bold text-ink-2" aria-label="Зам">
          <Link href="/shop" className="hover:text-berry">
            Дэлгүүр
          </Link>
          {group && (
            <>
              /
              <Link href={`/shop?g=${group.id}`} className="hover:text-berry">
                {group.name}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-5 grid gap-8 md:grid-cols-2 lg:gap-14">
          <div className="md:sticky md:top-32 md:self-start">
            <Gallery photos={p.images} alt={name} tint={TINT[p.group]} dim={!available(p)} />
          </div>

          <div>
            <p className="hand text-[26px] leading-none text-blush">{group?.name.toLowerCase()}</p>
            <h1 className="display mt-1 text-[32px] leading-tight md:text-[44px]">{p.title}</h1>
            {p.shade && <p className="mt-1 text-[17px] font-bold text-ink-2">{p.shade}</p>}

            {p.lash && p.lash.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.lash.tags.map((t) => (
                  <li key={t}>
                    <Link href={`/lashes?t=${t}`} className="flex items-center rounded-full bg-blush-3 px-3.5 py-1.5 text-[14px] font-bold text-berry transition hover:bg-blush hover:text-white">
                      ♡ {TAG_NAMES[t]}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {isLash && (p.lash!.mm || p.lash!.uses || p.lash!.who) && (
              <div className="card mt-5 grid items-center gap-5 p-5 sm:grid-cols-[auto_1fr]">
                <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blush-3">
                  <Lash width={62} open />
                </span>
                <div>
                  <LashSpecs lash={p.lash!} />
                  {p.lash!.who && <p className="mt-3 rounded-[18px] bg-lilac-2 px-3.5 py-2.5 text-[14px]">♡ {p.lash!.who}</p>}
                </div>
              </div>
            )}

            <div className="mt-5">
              <BuyBox slug={p.slug} variants={p.variants} phone={business.phone.display} />
            </div>

            {isLash && glue && (
              <Link href={`/p/${glue.slug}`} className="lift mt-4 flex items-center gap-3 rounded-[24px] bg-butter px-4 py-3 text-[14px]">
                <span className="text-[22px]" aria-hidden>
                  ✿
                </span>
                <span>
                  <b>Сормуус цавуугүй ирдэг.</b> {available(glue) ? `Манай цавуу ${formatPrice(glue.variants[0].price)} →` : business.rules.glue}
                </span>
              </Link>
            )}

            <ul className="mt-4 grid gap-2 text-[14.5px]">
              <li className="flex items-start gap-3 rounded-[22px] bg-white px-4 py-3 shadow-[0_0_0_1.5px_var(--color-line)]">
                <TruckIcon size={20} className="mt-0.5 shrink-0 text-berry" />
                <span>
                  <EtaLine className="font-bold" />. Улаанбаатарт {formatPrice(city.fee)}, {formatPrice(city.freeFrom)}-өөс дээш үнэгүй.
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-[22px] bg-white px-4 py-3 shadow-[0_0_0_1.5px_var(--color-line)]">
                <QrIcon size={20} className="mt-0.5 shrink-0 text-[#6a46c2]" />
                <span>QPay-ээр төлнө. И-баримт олгоно.</span>
              </li>
            </ul>

            {lines.length > 0 && (
              <section className="mt-8">
                <h2 className="display text-[22px]">Тайлбар</h2>
                <ul className="mt-3 grid gap-2 text-[15px] text-ink-2">
                  {lines.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <span className="mt-[3px] text-blush" aria-hidden>
                        ♡
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <p className="mt-6 text-[12.5px] text-ink-3">Код: {sku(v.id)}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="wrap mt-20">
          <p className="hand text-[26px] leading-none text-blush">танд таалагдаж магадгүй</p>
          <h2 className="display text-[30px] leading-tight md:text-[38px]">Хамт авдаг</h2>
          <Scroller label="Хамт авдаг" className="no-bar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pt-2 pb-6">
            {related.map((x) => (
              <div key={x.slug} className="w-[220px] shrink-0 snap-start md:w-[250px]">
                <ProductCard p={x} />
              </div>
            ))}
          </Scroller>
        </section>
      )}
    </>
  );
}

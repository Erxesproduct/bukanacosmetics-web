import Image from "next/image";
import Link from "next/link";
import { available, mmLabel, onSale, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { CardActions } from "./card-actions";
import { Lash } from "./deco";

/** Soft tint per group, so the grid reads at a glance. */
export const TINT: Record<string, string> = {
  lashes: "var(--color-blush-3)",
  eyes: "var(--color-lilac-2)",
  lips: "#ffe3ea",
  face: "var(--color-peach-2)",
  extras: "var(--color-butter)",
};

export function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const v = p.variants[0];
  const img = p.images[0];
  const second = p.images[1];
  const ok = available(p);
  return (
    <article className="group card lift flutter-hover relative flex h-full flex-col overflow-hidden">
      <Link href={`/p/${p.slug}`} className="relative m-2 block aspect-square overflow-hidden rounded-[24px]" style={{ background: TINT[p.group] }} tabIndex={-1} aria-hidden>
        {img && <Image src={img.thumb.src} alt="" fill priority={priority} sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw" className={`object-cover transition duration-700 group-hover:scale-[1.06] ${ok ? "" : "opacity-60 grayscale"} ${second ? "group-hover:opacity-0" : ""}`} />}
        {/* the second photo fades in on hover */}
        {second && ok && <Image src={second.thumb.src} alt="" fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw" className="scale-[1.06] object-cover opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100" />}
        {p.lash?.mm && ok && (
          <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-white/90 py-1 pr-2.5 pl-1.5 text-[12px] font-bold text-berry backdrop-blur">
            <Lash width={24} color="var(--color-berry)" /> {mmLabel(p.lash.mm)}
          </span>
        )}
        {p.lash?.tags.includes("selfstick") && ok && <span className="absolute bottom-2.5 left-2.5 rounded-full bg-lilac px-2.5 py-1 text-[12px] font-bold text-white">Өөрөөс цавуутай</span>}
        {!ok && <span className="absolute right-2.5 bottom-2.5 rounded-full bg-white px-3 py-1 text-[12.5px] font-bold">Дууссан</span>}
        {onSale(p) && ok && <span className="absolute top-2.5 left-2.5 rounded-full bg-berry px-3 py-1 text-[12.5px] font-bold text-white">Хямдрал</span>}
      </Link>
      <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
        <Link href={`/p/${p.slug}`} className="display line-clamp-2 text-[16px] leading-snug transition hover:text-berry">
          {p.title}
        </Link>
        {p.shade && <span className="mt-0.5 text-[13px] text-ink-2">{p.shade}</span>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span>
            <span className="display block text-[20px] leading-none text-berry">{formatPrice(v.price)}</span>
            {v.compareAt && <s className="text-[13px] text-ink-3">{formatPrice(v.compareAt)}</s>}
          </span>
          <CardActions slug={p.slug} variantId={ok ? v.id : null} />
        </div>
      </div>
    </article>
  );
}

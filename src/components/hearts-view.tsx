"use client";

import Image from "next/image";
import Link from "next/link";
import { cart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { liteProducts } from "@/lib/lite";
import { hearts, useHearts } from "@/lib/wishlist";
import { HeartIcon, PlusIcon } from "./icons";

export function HeartsView() {
  const slugs = useHearts();
  const list = slugs.flatMap((s) => liteProducts.filter((p) => p.s === s));
  if (!list.length)
    return (
      <div className="card mx-auto mt-10 max-w-md p-8 text-center">
        <span className="beat mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush-2 text-blush">
          <HeartIcon size={28} filled />
        </span>
        <p className="display mt-5 text-[28px]">Одоохондоо хоосон</p>
        <p className="mt-2 text-ink-2">Таалагдсан барааныхаа ♥ дээр дараад энд хадгалаарай. Энэ төхөөрөмж дээр хадгалагдана.</p>
        <Link href="/shop" className="btn btn-pink mt-6">
          Дэлгүүр
        </Link>
      </div>
    );
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((p) => (
        <li key={p.s} className="card lift flex gap-4 p-3">
          <Link href={`/p/${p.s}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[18px] bg-blush-3">
            {p.t && <Image src={p.t} alt="" fill sizes="96px" className="object-cover" />}
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            {p.b && <span className="text-[12.5px] text-ink-2">{p.b}</span>}
            <Link href={`/p/${p.s}`} className="line-clamp-2 leading-snug font-bold hover:text-berry">
              {p.n}
            </Link>
            <span className="mt-auto flex items-center gap-2 pt-1">
              <b className="display mr-auto text-[18px]">{formatPrice(p.p)}</b>
              <button type="button" onClick={() => hearts.toggle(p.s)} className="grid h-10 w-10 place-items-center rounded-full bg-blush-2 text-blush" aria-label="Хадгалснаас хасах">
                <HeartIcon size={17} filled />
              </button>
              {!p.a ? (
                <span className="text-[13px] font-bold text-ink-3">Дууссан</span>
              ) : p.v ? (
                <button type="button" onClick={() => cart.add(p.v!)} className="grid h-10 w-10 place-items-center rounded-full bg-blush text-white" aria-label="Сагсанд нэмэх">
                  <PlusIcon size={17} />
                </button>
              ) : (
                <Link href={`/p/${p.s}`} className="rounded-full bg-blush px-3 py-2 text-[13px] font-bold text-white">
                  Сонгох
                </Link>
              )}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

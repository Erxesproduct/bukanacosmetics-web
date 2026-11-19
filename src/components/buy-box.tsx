"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cart, maxQty } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { hearts, useHearts } from "@/lib/wishlist";
import { HeartBurst } from "./card-actions";
import { CheckIcon, HeartIcon, MinusIcon, PlusIcon } from "./icons";

type V = { id: string; label: string | null; price: number; compareAt: number | null; stock: number | null };

export function BuyBox({ slug, variants, phone }: { slug: string; variants: V[]; phone: string }) {
  const router = useRouter();
  const v = variants[0];
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(0);
  const [likes, setLikes] = useState(0);
  const liked = useHearts().includes(slug);
  const out = v.stock === 0;
  const cap = Math.max(1, maxQty(v.id) || Math.min(10, v.stock ?? 10));
  const few = v.stock != null && v.stock > 0 && v.stock <= 5;

  const add = () => {
    cart.add(v.id, qty);
    setAdded((n) => n + 1);
  };

  return (
    <div className="card p-5 md:p-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="display text-[38px] leading-none text-berry">{formatPrice(v.price)}</span>
        {v.compareAt && <s className="text-[17px] text-ink-3">{formatPrice(v.compareAt)}</s>}
        {few && <span className="rounded-full bg-peach-2 px-3 py-1 text-[13px] font-bold text-[#b4532a]">Сүүлийн {v.stock} ширхэг</span>}
      </div>

      {out ? (
        <p className="mt-5 rounded-[20px] bg-blush-3 px-4 py-3 font-bold">Одоогоор дууссан. Ирэх хугацааг {phone} дугаараас лавлаарай.</p>
      ) : (
        <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-3">
          <div className="flex h-14 items-center rounded-full bg-blush-3 px-1">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-10 place-items-center rounded-full hover:bg-white" aria-label="Цөөлөх">
              <MinusIcon size={18} />
            </button>
            <span className="display w-8 text-center text-[20px]" aria-live="polite">
              {qty}
            </span>
            <button type="button" onClick={() => setQty((q) => Math.min(cap, q + 1))} disabled={qty >= cap} className="grid h-11 w-10 place-items-center rounded-full hover:bg-white disabled:opacity-30" aria-label="Нэмэх">
              <PlusIcon size={18} />
            </button>
          </div>
          <button type="button" onClick={add} className={`btn relative h-14 !px-4 text-[16px] ${added ? "btn-lilac" : "btn-pink"}`}>
            <span key={added} className={`flex items-center gap-2 ${added ? "pop-in" : ""}`}>
              {added ? <CheckIcon size={20} /> : <PlusIcon size={20} />}
              {added ? "Нэмэгдлээ" : "Сагсанд нэмэх"}
            </span>
            <HeartBurst n={added} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (!liked) setLikes((n) => n + 1);
              hearts.toggle(slug);
            }}
            aria-pressed={liked}
            aria-label={liked ? "Хадгалснаас хасах" : "Хадгалах"}
            className={`relative grid h-14 w-14 place-items-center justify-self-center rounded-full bg-white shadow-[0_0_0_2px_var(--color-blush-2)_inset] transition hover:scale-105 ${liked ? "text-blush" : ""}`}
          >
            <HeartIcon size={22} filled={liked} className={liked ? "beat" : ""} />
            <HeartBurst n={likes} />
          </button>
          <button
            type="button"
            onClick={() => {
              add();
              router.push("/cart");
            }}
            className="btn btn-ink h-14 !px-4"
          >
            Шууд захиалах →
          </button>
        </div>
      )}
    </div>
  );
}

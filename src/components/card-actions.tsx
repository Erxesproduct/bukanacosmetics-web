"use client";

import Link from "next/link";
import { useState } from "react";
import { cart } from "@/lib/cart";
import { hearts, useHearts } from "@/lib/wishlist";
import { Heart } from "./deco";
import { CheckIcon, HeartIcon, PlusIcon } from "./icons";

/** Little hearts that float up when something is liked or added. */
export function HeartBurst({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span key={n} className="pointer-events-none absolute top-1/2 left-1/2" aria-hidden>
      {[
        [-18, -20, "var(--color-blush)"],
        [0, 8, "var(--color-lilac)"],
        [18, 22, "var(--color-peach)"],
      ].map(([x, r, c], i) => (
        <span key={i} className="heart-up absolute top-0 left-0" style={{ ["--x" as string]: `${x}px`, ["--r" as string]: `${r}deg`, animationDelay: `${i * 70}ms` }}>
          <Heart size={14} color={c as string} />
        </span>
      ))}
    </span>
  );
}

/** Heart (top right of the card) and a round «+» that adds straight to the cart. */
export function CardActions({ slug, variantId, choose = false }: { slug: string; variantId: string | null; choose?: boolean }) {
  const liked = useHearts().includes(slug);
  const [done, setDone] = useState(0);
  const [likes, setLikes] = useState(0);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!liked) setLikes((n) => n + 1);
          hearts.toggle(slug);
        }}
        aria-pressed={liked}
        aria-label={liked ? "Хадгалснаас хасах" : "Хадгалах"}
        className={`absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-[0_6px_16px_-8px_rgb(194_54_107/0.6)] backdrop-blur transition hover:scale-110 ${liked ? "text-blush" : "text-ink-2"}`}
      >
        <HeartIcon size={19} filled={liked} className={liked ? "beat" : ""} />
        <HeartBurst n={likes} />
      </button>
      {variantId ? (
        <button
          type="button"
          onClick={() => {
            cart.add(variantId);
            setDone((n) => n + 1);
          }}
          aria-label="Сагсанд нэмэх"
          className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition hover:scale-110 hover:rotate-90 ${done ? "bg-lilac" : "btn-pink"}`}
        >
          <span key={done} className={done ? "pop-in" : ""}>
            {done ? <CheckIcon size={20} /> : <PlusIcon size={20} />}
          </span>
          <HeartBurst n={done} />
        </button>
      ) : choose ? (
        <Link href={`/p/${slug}`} className="btn btn-pink !min-h-11 shrink-0 !px-4 !text-[14px]">
          Сонгох
        </Link>
      ) : null}
    </>
  );
}

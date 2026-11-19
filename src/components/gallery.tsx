"use client";

import Image from "next/image";
import { useState } from "react";
import { Sparkles } from "./deco";

type Photo = { src: string; w: number; h: number; thumb: { src: string; w: number; h: number } };

/** Product photos: a big one with a soft cross-fade and round thumbnails under it. */
export function Gallery({ photos, alt, tint, dim = false }: { photos: Photo[]; alt: string; tint: string; dim?: boolean }) {
  const [i, setI] = useState(0);
  const p = photos[i];
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[36px]" style={{ background: tint }}>
        {p && <Image key={p.src} src={p.src} alt={`${alt}${photos.length > 1 ? ` (${i + 1}/${photos.length})` : ""}`} fill priority={i === 0} sizes="(min-width: 768px) 50vw, 100vw" className={`pop-in object-cover ${dim ? "opacity-60 grayscale" : ""}`} />}
        <Sparkles colors={["#fff", "var(--color-blush-2)", "#fff"]} />
      </div>
      {photos.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2.5" role="group" aria-label="Зургууд">
          {photos.map((x, n) => (
            <button
              key={x.src}
              type="button"
              onClick={() => setI(n)}
              aria-pressed={n === i}
              aria-label={`Зураг ${n + 1}`}
              className={`relative h-16 w-16 overflow-hidden rounded-[20px] transition duration-300 md:h-[74px] md:w-[74px] ${n === i ? "scale-105 shadow-[0_0_0_3px_#fff,0_0_0_5.5px_var(--color-blush)]" : "opacity-75 hover:-translate-y-0.5 hover:opacity-100"}`}
              style={{ background: tint }}
            >
              <Image src={x.thumb.src} alt="" fill sizes="74px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

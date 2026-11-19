import type { Lash as LashSpec } from "@/lib/catalog";

const MM = { from: 5, to: 14 };
const USES = { from: 0, to: 30 };
const pct = (v: number, r: { from: number; to: number }) => ((v - r.from) / (r.to - r.from)) * 100;

export const TAG_NAMES: Record<string, string> = {
  first: "Анх наах гэж буй",
  daily: "Өдөр тутам",
  natural: "Натурал, хөнгөн",
  volume: "Өтгөн, дэрвэгэр",
  party: "Гоёл, арга хэмжээ",
  selfstick: "Өөрөөс цавуутай",
};

/** Two soft bars: length (mm) and how many wears, both as the shop wrote them. Nothing is shown for a missing value. */
export function LashSpecs({ lash, compact = false }: { lash: LashSpec; compact?: boolean }) {
  const rows = [
    lash.mm && { name: "Урт", value: lash.mm.min === lash.mm.max ? `${lash.mm.min} мм` : `${lash.mm.min}–${lash.mm.max} мм`, a: pct(lash.mm.min, MM), b: pct(lash.mm.max, MM), color: "var(--color-blush)" },
    lash.uses && { name: "Зүүх удаа", value: `${lash.uses.min}–${lash.uses.max} удаа`, a: pct(lash.uses.min, USES), b: pct(lash.uses.max, USES), color: "var(--color-lilac)" },
  ].filter(Boolean) as { name: string; value: string; a: number; b: number; color: string }[];
  if (!rows.length) return null;
  return (
    <dl className={`grid ${compact ? "gap-2" : "gap-3"}`}>
      {rows.map((r) => (
        <div key={r.name}>
          <div className="flex items-baseline justify-between gap-2 text-[13px]">
            <dt className="font-bold text-ink-2">{r.name}</dt>
            <dd className="display font-bold text-ink">{r.value}</dd>
          </div>
          <div className={`relative mt-1 overflow-hidden rounded-full bg-blush-3 ${compact ? "h-2" : "h-3"}`} aria-hidden>
            <span className="absolute inset-y-0 rounded-full transition-[left,width] duration-700" style={{ left: `${Math.min(r.a, r.b - 6)}%`, width: `${Math.max(6, r.b - r.a)}%`, background: r.color }} />
          </div>
        </div>
      ))}
    </dl>
  );
}

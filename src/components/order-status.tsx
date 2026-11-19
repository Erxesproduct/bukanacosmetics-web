"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { business, ORDER_STATUSES } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { localOrders, useLocalOrders } from "@/lib/local-orders";
import { Bubbles, Lash, Sparkles } from "./deco";
import { CheckIcon, ClockIcon, CloseIcon, PhoneIcon } from "./icons";

const LABEL: Record<string, { title: string; text: string; tone: "ok" | "wait" | "bad" }> = {
  paid: { title: "Төлбөр төлөгдлөө", text: business.rules.delivery, tone: "ok" },
  pending: { title: "Төлбөр хүлээгдэж байна", text: "QPay-ээр төлсний дараа энэ хуудас өөрөө шинэчлэгдэнэ.", tone: "wait" },
  failed: { title: "Төлбөр амжилтгүй", text: "Төлбөр хийгдсэнгүй. Дахин оролдох эсвэл бидэнтэй холбогдоно уу.", tone: "bad" },
  cancelled: { title: "Нэхэмжлэл цуцлагдсан", text: "Шинэ нэхэмжлэл авахаар бидэнтэй холбогдоно уу.", tone: "bad" },
  rejected: { title: "Төлбөр татгалзсан", text: "Банк төлбөрийг татгалзсан. Бидэнтэй холбогдоно уу.", tone: "bad" },
  expired: { title: "Нэхэмжлэлийн хугацаа дууссан", text: "Шинэ нэхэмжлэл авахаар бидэнтэй холбогдоно уу.", tone: "bad" },
  refunded: { title: "Төлбөр буцаагдсан", text: "Төлбөрийг буцаан шилжүүлсэн.", tone: "bad" },
};
const TERMINAL = ["paid", "failed", "cancelled", "rejected", "expired", "refunded"];
const TONE = { ok: "bg-mint text-mint-2", wait: "bg-butter", bad: "bg-blush-3" };

export function OrderStatus({ reference }: { reference: string }) {
  const orders = useLocalOrders();
  const order = orders.find((o) => o.reference === reference) ?? null;
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const tries = useRef(0);

  const check = useCallback(async () => {
    const o = localOrders.get(reference);
    if (!o?.invoiceId) return;
    setChecking(true);
    try {
      const res = await fetch("/api/payments/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoiceId: o.invoiceId }) });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        localOrders.setStatus(reference, json.status);
        setCheckError(null);
      } else setCheckError(json?.error === "not_configured" ? "Төлбөрийн систем холбогдоогүй байна." : "Төлбөр шалгахад алдаа гарлаа.");
    } catch {
      setCheckError("Интернэт холболтоо шалгана уу.");
    } finally {
      setChecking(false);
    }
  }, [reference]);

  // check on arrival (also when coming back from the QPay page), then every 5 s while pending and visible, for 10 min
  const status = order?.status ?? null;
  useEffect(() => {
    if (!order?.invoiceId || (status && TERMINAL.includes(status))) return;
    const first = window.setTimeout(check, 300);
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (++tries.current > 120) return window.clearInterval(id);
      check();
    }, 5000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [order?.invoiceId, status, check]);

  if (!order)
    return (
      <div className="card mx-auto max-w-xl p-8 text-center md:p-12">
        <p className="display text-[30px]">{reference}</p>
        <p className="mt-3 text-ink-2">Энэ захиалга энэ төхөөрөмж дээр хадгалагдаагүй байна. Захиалгынхаа явцыг утсаар лавлана уу.</p>
        <a href={`tel:${business.phone.tel}`} className="btn btn-pink mt-8">
          <PhoneIcon size={16} /> {business.phone.display}
        </a>
      </div>
    );

  const s = status ? (LABEL[status] ?? LABEL.pending) : null;
  const paid = status === "paid";

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="card pop-in overflow-hidden">
        <div className="relative overflow-hidden bg-gradient-to-br from-blush to-lilac p-8 text-white md:p-10">
          <Bubbles />
          <Sparkles colors={["#fff", "var(--color-butter)", "#fff"]} />
          <span className="absolute top-6 right-6 grid h-20 w-20 place-items-center rounded-full bg-white/90 md:h-24 md:w-24">
            <Lash width={58} open />
          </span>
          <p className="hand relative text-[26px] leading-none">захиалга хүлээн авлаа</p>
          <h1 className="display relative mt-1 text-[40px] leading-tight md:text-[54px]">Баярлалаа!</h1>
          <p className="relative mt-2 text-white/90">
            Захиалгын код: <b className="display text-[20px]">{order.reference}</b>
          </p>
        </div>
        <div className="p-6 md:p-10">
          {s ? (
            <div className={`flex gap-4 rounded-[20px] p-4 ${TONE[s.tone]}`} role="status" aria-live="polite">
              <span className="mt-0.5">{s.tone === "ok" ? <CheckIcon size={20} /> : s.tone === "bad" ? <CloseIcon size={20} /> : <ClockIcon size={20} />}</span>
              <span>
                <span className="block font-bold text-ink">{s.title}</span>
                <span className="block text-[14px] text-ink-2">{s.text}</span>
              </span>
            </div>
          ) : (
            <div className="rounded-[20px] bg-butter p-4 text-[14px]" role="status">
              <b className="block">Төлбөрийн нэхэмжлэл үүсээгүй</b>
              Захиалга бүртгэгдсэн. QPay нэхэмжлэлийг бид таны утас руу илгээнэ, эсвэл {business.phone.display} дугаарт залгана уу.
            </div>
          )}
          {order.payUrl && !paid && status && !TERMINAL.includes(status) && (
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={order.payUrl} className="btn btn-pink">
                QPay-ээр төлөх
              </a>
              <button type="button" onClick={check} disabled={checking} className="btn btn-white">
                {checking ? "Шалгаж байна…" : "Төлбөр шалгах"}
              </button>
            </div>
          )}
          {checkError && <p className="mt-3 text-[13.5px] font-bold text-berry">{checkError}</p>}

          <ul className="mt-8 space-y-2.5 text-[14.5px]">
            {order.lines.map((l) => (
              <li key={`${l.name}|${l.label}`} className="flex justify-between gap-4">
                <span className="text-ink-2">
                  {l.name}
                  {l.label ? ` (${l.label})` : ""} × {l.qty}
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(l.total)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4">
              <span className="text-ink-2">Хүргэлт</span>
              <span className="tabular-nums">{order.deliveryFee === 0 ? "Үнэгүй" : formatPrice(order.deliveryFee)}</span>
            </li>
            <li className="display flex justify-between gap-4 border-t-2 border-line pt-4 text-[24px]">
              <span>Нийт</span>
              <span className="tabular-nums">{formatPrice(order.total)}</span>
            </li>
          </ul>
          <p className="mt-6 text-[13.5px] text-ink-2">{business.rules.ebarimt}</p>
        </div>
      </div>
      <aside className="card self-start p-6 md:p-8">
        <p className="hand text-[26px] leading-none text-blush">захиалгын явц</p>
        <ol className="mt-6 space-y-5">
          {ORDER_STATUSES.filter((x) => x.id !== "cancelled").map((x, i) => {
            const reached = i === 0 || (paid && i === 1);
            return (
              <li key={x.id} className="flex gap-4">
                <span className={`display mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[15px] ${reached ? "bg-blush text-white" : "bg-blush-3 text-ink-3"}`}>{reached ? <CheckIcon size={16} /> : i + 1}</span>
                <span>
                  <span className={`block text-[15px] ${reached ? "font-bold" : "text-ink-2"}`}>{x.name}</span>
                  <span className="block text-[13px] text-ink-3">{x.note}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-8 text-[13px] text-ink-2">Төлбөрөөс хойших шатуудыг (бэлтгэх, хүргэлтэд гарах) бид утсаар мэдэгдэнэ.</p>
        <Link href="/shop" className="btn btn-white mt-6">
          Дэлгүүр хэсэх →
        </Link>
      </aside>
    </div>
  );
}

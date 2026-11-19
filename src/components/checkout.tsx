"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { business, deliveryFee } from "@/content/business";
import { cart, cartSubtotal, maxQty, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { getLiteVariant } from "@/lib/lite";
import { localOrders } from "@/lib/local-orders";
import { DISTRICTS } from "@/lib/orders/places";
import type { OrderErrors } from "@/lib/orders/schema";
import { Blob, Bubbles, Lash } from "./deco";
import { EtaLine } from "./delivery-eta";
import { MinusIcon, PhoneIcon, PlusIcon, QrIcon, TrashIcon, TruckIcon } from "./icons";

const KEY = "bukana.checkout-key";
/** One idempotency key per checkout attempt, kept until the order goes through. */
function checkoutKey() {
  try {
    const k = sessionStorage.getItem(KEY);
    if (k) return k;
    const n = crypto.randomUUID();
    sessionStorage.setItem(KEY, n);
    return n;
  } catch {
    return crypto.randomUUID();
  }
}

const city = business.delivery[0];

export function Checkout() {
  const items = useCart();
  const router = useRouter();
  const delivery = "city" as const;
  const [receiptType, setReceiptType] = useState<"person" | "company">("person");
  const [errors, setErrors] = useState<OrderErrors>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const lines = items.flatMap((i) => {
    const v = getLiteVariant(i.id);
    return v ? [{ ...i, v }] : [];
  });
  const subtotal = cartSubtotal(items);
  const fee = deliveryFee(delivery, subtotal);
  const total = subtotal + fee;
  const toFree = subtotal <= city.freeFrom ? city.freeFrom - subtotal : -1;
  const progress = Math.min(100, Math.round((subtotal / (city.freeFrom + 1)) * 100));

  if (!lines.length)
    return (
      <div className="card relative mx-auto max-w-lg overflow-hidden px-8 py-14 text-center">
        <Blob className="-top-16 -left-16 h-[200px] w-[200px] opacity-70" color="var(--color-blush-3)" />
        <span className="relative mx-auto grid h-24 w-24 place-items-center rounded-full bg-blush-2">
          <Lash width={64} open />
        </span>
        <p className="display relative mt-6 text-[30px]">Сагс хоосон байна</p>
        <p className="relative mt-2 text-ink-2">Өөрт тохирох сормуусаа сормуус сонгогчоор хэдхэн секундэд олоорой.</p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/lashes" className="btn btn-pink">
            Сормуус сонгогч
          </Link>
          <Link href="/shop" className="btn btn-white">
            Дэлгүүр
          </Link>
        </div>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setNotice(null);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: checkoutKey(),
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          delivery,
          area: f.get("area"),
          khoroo: Number(f.get("khoroo")),
          address: f.get("address") ?? "",
          payment: "qpay",
          receiptType,
          regNo: f.get("regNo") ?? "",
          note: f.get("note"),
          website: f.get("website"),
          items: items.map(({ id, qty }) => ({ id, qty })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        localOrders.save({
          reference: json.reference,
          createdAt: new Date().toISOString(),
          subtotal: json.subtotal,
          deliveryFee: json.deliveryFee,
          total: json.total,
          lines: lines.map((l) => ({ name: l.v.b ? `${l.v.n} · ${l.v.b}` : l.v.n, label: l.v.z, qty: l.qty, total: l.v.p * l.qty })),
          method: "qpay",
          invoiceId: json.payment?.invoiceId ?? null,
          payUrl: json.payment?.url ?? null,
          status: json.payment ? "pending" : null,
        });
        try {
          sessionStorage.removeItem(KEY);
        } catch {}
        cart.clear();
        router.push(`/order/${json.reference}`);
        return;
      }
      if (res.status === 422 && json?.errors) {
        setErrors(json.errors);
        setNotice("Улаанаар тэмдэглэсэн хэсгийг шалгаад дахин дарна уу.");
      } else if (json?.error === "not_configured") {
        setNotice(`Онлайн захиалга одоогоор холбогдоогүй байна. Захиалгаа ${business.phone.display} дугаарт өгнө үү (код ${json.reference}, нийт ${formatPrice(json.total ?? total)}). Таны сагс хадгалагдсан.`);
      } else {
        setNotice(`Захиалга илгээхэд алдаа гарлаа. Дахин оролдох эсвэл ${business.phone.display} дугаарт залгана уу.`);
      }
    } catch {
      setNotice("Интернэт холболтоо шалгаад дахин оролдоно уу.");
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof OrderErrors) =>
    errors[k] && (
      <p className="pop-in mt-1.5 text-[13.5px] font-bold text-berry" id={`e-${k}`}>
        {errors[k]}
      </p>
    );
  const step = (n: number, t: string, bg: string) => (
    <h2 className="flex items-center gap-3">
      <span className="display grid h-11 w-11 place-items-center rounded-full text-[20px] text-white" style={{ background: bg }}>
        {n}
      </span>
      <span className="display text-[24px]">{t}</span>
    </h2>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-10">
      <div className="space-y-8">
        <section aria-label="Сагсны бараа" className="card p-4 md:p-6">
          <div className="rounded-[22px] bg-blush-3 p-4">
            <p className="flex items-center gap-2 text-[14.5px] font-bold">
              <TruckIcon size={18} className="text-berry" />
              {toFree >= 0 ? (
                <span>
                  Дахиад <b className="text-berry">{formatPrice(toFree)}</b>-өөс илүү бараа нэмбэл хүргэлт үнэгүй
                </span>
              ) : (
                <span className="text-mint-2">Хүргэлт үнэгүй боллоо! ♡</span>
              )}
            </p>
            <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Үнэгүй хүргэлт хүртэл">
              <div className={`h-full rounded-full transition-[width] duration-700 ${toFree >= 0 ? "bg-gradient-to-r from-blush to-lilac" : "bg-mint-2"}`} style={{ width: `${progress}%` }} />
            </div>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {lines.map(({ id, qty, v }) => (
              <li key={id} className="flex gap-4 py-4 first:pt-1 last:pb-1">
                <Link href={`/p/${v.s}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[20px] bg-blush-3">
                  {v.t && <Image src={v.t} alt="" fill sizes="96px" className="object-cover" />}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={`/p/${v.s}`} className="line-clamp-2 leading-snug font-bold hover:text-berry">
                    {v.n}
                    {v.b && <span className="font-normal text-ink-2"> · {v.b}</span>}
                  </Link>
                  <span className="text-[13.5px] text-ink-2">
                    {v.z ? <b className="text-berry">{v.z} · </b> : null}
                    {formatPrice(v.p)}
                  </span>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center rounded-full bg-blush-3">
                      <button type="button" onClick={() => cart.setQty(id, qty - 1)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white" aria-label="Цөөлөх">
                        <MinusIcon size={15} />
                      </button>
                      <span className="w-7 text-center font-bold tabular-nums">{qty}</span>
                      <button type="button" onClick={() => cart.setQty(id, qty + 1)} disabled={qty >= maxQty(id)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white disabled:opacity-30" aria-label="Нэмэх">
                        <PlusIcon size={15} />
                      </button>
                    </div>
                    <span className="display text-[19px] tabular-nums">{formatPrice(v.p * qty)}</span>
                    <button type="button" onClick={() => cart.setQty(id, 0)} className="grid h-10 w-10 place-items-center rounded-full text-ink-3 hover:bg-blush-3 hover:text-berry" aria-label={`${v.n}: хасах`}>
                      <TrashIcon size={17} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5 md:p-7">
          {step(1, "Таны мэдээлэл", "var(--color-blush)")}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="label">
              Нэр
              <input name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} className="field" />
              {err("name")}
            </label>
            <label className="label">
              Утас
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="99112233" required aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "e-phone" : undefined} className="field" />
              {err("phone")}
            </label>
            <label className="label sm:col-span-2">
              Имэйл <span className="font-normal text-ink-3">(заавал биш)</span>
              <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className="field" />
              {err("email")}
            </label>
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        </section>

        <section className="card p-5 md:p-7">
          {step(2, "Хаана хүргэх вэ?", "var(--color-lilac)")}
          <div className="mt-5 flex items-center justify-between gap-3 rounded-[22px] bg-lilac-2 p-4">
            <span>
              <b className="display block text-[18px]">{city.name}</b>
              <span className="text-[13.5px] text-ink-2">{city.note}</span>
            </span>
            <b className="shrink-0">{deliveryFee(delivery, subtotal) === 0 ? "Үнэгүй" : formatPrice(city.fee)}</b>
          </div>
          <p className="mt-3 text-[13.5px] text-ink-2">
            {business.rules.countryside}{" "}
            <Link href="/info#stores" className="font-bold text-berry underline">
              Дэлгүүрүүд
            </Link>
          </p>
          {(
            <>
              <p className="mt-4 rounded-[18px] bg-blush-3 px-4 py-2.5 text-[14px]">
                <EtaLine />
              </p>
              <div key="city" className="mt-5 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
                <label className="label">
                  Дүүрэг
                  <select name="area" required defaultValue="" aria-invalid={!!errors.area} className="field">
                    <option value="" disabled>
                      Сонгох
                    </option>
                    {DISTRICTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                  {err("area")}
                </label>
                <label className="label">
                  Хороо
                  <input name="khoroo" type="number" inputMode="numeric" min={1} max={45} required aria-invalid={!!errors.khoroo} className="field" />
                  {err("khoroo")}
                </label>
                <label className="label sm:col-span-2">
                  Хаяг
                  <textarea name="address" rows={2} required aria-invalid={!!errors.address} placeholder="Байр, орц, давхар, тоот, орцны код" className="field" />
                  {err("address")}
                </label>
              </div>
            </>
          )}
        </section>

        <section className="card p-5 md:p-7">
          {step(3, "Төлбөр, и-баримт", "var(--color-peach)")}
          <div className="mt-5 flex items-center gap-4 rounded-[22px] bg-gradient-to-r from-blush to-lilac p-4 text-white">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-white text-berry">
              <QrIcon size={24} />
            </span>
            <span>
              <b className="display block text-[19px]">QPay</b>
              <span className="block text-[13.5px] text-white/80">{business.payments[0].note}</span>
            </span>
          </div>
          {err("payment")}
          <p className="mt-5 text-[14.5px] font-bold">И-баримт хэнд авах вэ?</p>
          <div className="mt-2 flex gap-2" role="radiogroup" aria-label="И-баримтын төрөл">
            {(
              [
                ["person", "Хувь хүн"],
                ["company", "Байгууллага"],
              ] as const
            ).map(([id, text]) => (
              <button key={id} type="button" role="radio" aria-checked={receiptType === id} onClick={() => setReceiptType(id)} className="chip">
                {text}
              </button>
            ))}
          </div>
          {receiptType === "company" ? (
            <label className="label mt-4">
              Байгууллагын регистр
              <input name="regNo" inputMode="numeric" maxLength={7} placeholder="1234567" aria-invalid={!!errors.regNo} className="field" />
              {err("regNo")}
            </label>
          ) : (
            <p className="mt-3 text-[13.5px] text-ink-2">И-баримтыг таны утасны дугаараар бүртгэнэ.</p>
          )}
          <label className="label mt-5">
            Нэмэлт тайлбар <span className="font-normal text-ink-3">(заавал биш)</span>
            <textarea name="note" rows={2} className="field" />
          </label>
        </section>
      </div>

      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blush to-[#e65b8c] p-6 text-white md:p-8">
          <Bubbles />
          <div className="relative">
            <p className="hand text-[28px] leading-none">төлөх дүн</p>
            <dl className="mt-4 space-y-3 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="text-white/80">Бараа</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/80">Хүргэлт</dt>
                <dd className="tabular-nums">{fee === 0 ? "Үнэгүй" : formatPrice(fee)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t-2 border-white/25 pt-4">
                <dt className="font-bold">Нийт</dt>
                <dd className="display text-[34px] tabular-nums">{formatPrice(total)}</dd>
              </div>
            </dl>
            <ul className="mt-4 space-y-1.5 text-[13.5px] leading-snug text-white/85">
              <li>• {business.rules.payment}</li>
              <li>• {business.rules.delivery}</li>
            </ul>
            {notice && (
              <p role="alert" className="pop-in mt-5 rounded-[16px] bg-white px-4 py-3 text-[14px] text-ink">
                {notice}
              </p>
            )}
            {errors.items && <p className="mt-4 rounded-[16px] bg-berry px-4 py-2.5 text-[14px]">{errors.items}</p>}
            <button type="submit" disabled={busy} className="btn btn-white mt-6 h-14 w-full text-[16.5px] !text-berry">
              {busy ? "Илгээж байна…" : "Захиалах, QPay-ээр төлөх"}
            </button>
            <a href={`tel:${business.phone.tel}`} className="mt-5 inline-flex items-center gap-2 text-[14px] text-white/90 hover:text-white">
              <PhoneIcon size={16} /> Тусламж: {business.phone.display}
            </a>
          </div>
        </div>
      </aside>
    </form>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { Blob, Bubbles, Lash } from "@/components/deco";
import { EtaCard } from "@/components/delivery-eta";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, QrIcon, TruckIcon } from "@/components/icons";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Хүргэлт, төлбөр, дэлгүүрүүд",
  description: "Bukana Cosmetics: хүргэлтийн үнэ, хугацаа, QPay төлбөр, и-баримт, гэрээт дэлгүүрүүд, түгээмэл асуулт, бидний тухай.",
  alternates: { canonical: "/info" },
};

const LINKS = [
  ["#delivery", "Хүргэлт"],
  ["#payment", "Төлбөр"],
  ["#stores", "Дэлгүүрүүд"],
  ["#faq", "Асуулт"],
  ["#about", "Бидний тухай"],
  ["#contact", "Холбоо барих"],
] as const;

const icon = (bg: string) => `grid h-12 w-12 place-items-center rounded-full text-white ${bg}`;

export default function InfoPage() {
  const city = business.delivery[0];
  const ub = business.stores.filter((s) => s.ub);
  const aimag = business.stores.filter((s) => !s.ub);
  const tel = (phone: string) => `tel:+976${phone}`;
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-blush-3 to-cream">
        <Blob className="-top-24 -right-20 h-[280px] w-[280px] opacity-70" color="var(--color-lilac-2)" />
        <Bubbles color="rgb(242 112 156 / 0.15)" />
        <div className="wrap relative pt-10 pb-10 md:pt-14">
          <p className="hand text-[28px] leading-none text-blush">хэрэгтэй мэдээлэл</p>
          <h1 className="display mt-1 text-[36px] leading-tight md:text-[52px]">Хүргэлт, төлбөр, дэлгүүр</h1>
          <nav className="no-bar mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Хэсгүүд">
            {LINKS.map(([href, name]) => (
              <a key={href} href={href} className="chip shrink-0">
                {name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="wrap mt-6 space-y-16">
        <section id="delivery" className="scroll-mt-32">
          <h2 className="display flex items-center gap-3 text-[28px]">
            <span className={icon("bg-blush")}>
              <TruckIcon size={24} />
            </span>
            Хүргэлт
          </h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="card p-6">
              <p className="hand text-[24px] leading-none text-blush">{city.name}</p>
              <p className="display mt-2 text-[32px] leading-none">{formatPrice(city.fee)}</p>
              <p className="mt-2 font-bold text-mint-2">{formatPrice(city.freeFrom)}-өөс дээш захиалгад үнэгүй</p>
            </div>
            <div className="card p-6">
              <EtaCard />
            </div>
            <div className="card p-6">
              <p className="hand text-[24px] leading-none text-[#6a46c2]">орон нутаг</p>
              <p className="mt-2 text-[14.5px] text-ink-2">{business.rules.countryside}</p>
              <a href="#stores" className="mt-2 inline-block font-bold text-berry hover:underline">
                Аймгийн дэлгүүрүүд ↓
              </a>
            </div>
          </div>
          <p className="mt-4 rounded-[24px] bg-white px-5 py-4 shadow-[0_0_0_1.5px_var(--color-line)]">{business.rules.delivery}</p>
        </section>

        <section id="payment" className="scroll-mt-32">
          <h2 className="display flex items-center gap-3 text-[28px]">
            <span className={icon("bg-lilac")}>
              <QrIcon size={24} />
            </span>
            Төлбөр, и-баримт
          </h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            <li className="card p-5">
              <b className="display block text-[19px]">QPay</b>
              <p className="mt-1 text-[14.5px] text-ink-2">{business.payments[0].note}</p>
              <p className="mt-1 text-[14.5px] text-ink-2">{business.rules.payment}</p>
            </li>
            <li className="card p-5">
              <b className="display block text-[19px]">И-баримт</b>
              <p className="mt-1 text-[14.5px] text-ink-2">{business.rules.ebarimt}</p>
            </li>
          </ul>
        </section>

        <section id="stores" className="scroll-mt-32">
          <h2 className="display flex items-center gap-3 text-[28px]">
            <span className={icon("bg-mint-2")}>
              <PinIcon size={24} />
            </span>
            Гэрээт дэлгүүрүүд
          </h2>
          <p className="mt-2 max-w-2xl text-ink-2">Bukana бүтээгдэхүүн бэлэн байдаг (гэрээт) цэгүүд, манай барааны тайлбарт бичсэнээр. Очихын өмнө утсаар лавлаарай.</p>
          {[
            ["Улаанбаатар", ub, "var(--color-blush-3)"],
            ["Хөдөө орон нутаг", aimag, "var(--color-lilac-2)"],
          ].map(([name, list, bg]) => (
            <div key={name as string} className="mt-6">
              <h3 className="hand text-[26px] leading-none text-blush">{name as string}</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(list as typeof ub).map((s) => (
                  <li key={s.line} className="flex items-start gap-3 rounded-[24px] p-4" style={{ background: bg as string }}>
                    <span className="mt-0.5 text-blush" aria-hidden>
                      ♡
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] leading-snug">{s.line.replace(/\s*(Утас|утас)\s*:?\s*\d{8}.*$|\s*\d{8}.*$/, "").replace(/[.,]\s*$/, "")}</span>
                      <a href={tel(s.phone)} className="mt-1 inline-flex items-center gap-1.5 text-[14px] font-bold text-berry hover:underline">
                        <PhoneIcon size={14} /> {s.phone.replace(/(\d{4})(\d{4})/, "$1-$2")}
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section id="faq" className="scroll-mt-32">
          <h2 className="display text-[28px]">Түгээмэл асуулт</h2>
          <div className="mt-5 space-y-3">
            {business.faq.map((f) => (
              <details key={f.q} className="card group p-5 open:shadow-[0_0_0_2px_var(--color-blush)]" open>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush-2 text-berry transition duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="about" className="grid scroll-mt-32 gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[36px]">
            <Image src="/brand/about.webp" alt="Bukana сормуус, нүдний тен, будаг" width={1290} height={863} sizes="(min-width: 1024px) 45vw, 100vw" className="h-auto w-full" />
            <span className="absolute right-4 bottom-4 grid h-20 w-20 place-items-center rounded-full bg-white/90">
              <Lash width={52} open />
            </span>
          </div>
          <div>
            <p className="hand text-[26px] leading-none text-blush">бидний тухай</p>
            <h2 className="display mt-1 text-[28px] leading-tight">{business.tagline}</h2>
            <div className="prose-bk mt-3 text-ink-2">
              {business.about.map((t) => (
                <p key={t.slice(0, 20)}>{t}</p>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-32">
          <h2 className="display text-[28px]">Холбоо барих</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <a href={`tel:${business.phone.tel}`} className="card lift flex items-center gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush text-white">
                <PhoneIcon size={20} />
              </span>
              <b className="display text-[19px]">{business.phone.display}</b>
            </a>
            <a href={`mailto:${business.email}`} className="card lift flex min-w-0 items-center gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lilac text-white">
                <MailIcon size={20} />
              </span>
              <b className="truncate text-[15px]">{business.email}</b>
            </a>
            <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="card lift flex items-center gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#7b8cf0] text-white">
                <FacebookIcon size={20} />
              </span>
              <b>Facebook</b>
            </a>
            <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="card lift flex items-center gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-peach to-blush text-white">
                <InstagramIcon size={20} />
              </span>
              <b>Instagram</b>
            </a>
            <div className="card flex items-start gap-3 p-5 sm:col-span-2 lg:col-span-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-peach text-ink">
                <PinIcon size={20} />
              </span>
              <span>
                <span className="block text-[13px] text-ink-2">Хаяг</span>
                <b>{business.address}</b>
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

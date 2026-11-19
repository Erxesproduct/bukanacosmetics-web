import Image from "next/image";
import Link from "next/link";
import { Blob, Bubbles, Heart, Lash, Sparkle, Sparkles } from "@/components/deco";
import { EtaCard } from "@/components/delivery-eta";
import { ArrowIcon, LashIcon, PhoneIcon, QrIcon, TruckIcon } from "@/components/icons";
import { ProductCard, TINT } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { available, banners, glue, groups, lashes, lashTags, mmLabel, popular } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const STEPS = [
  { icon: LashIcon, title: "Сормуусаа сонго", text: "Анх наах, өдөр тутам, гоёл: хүссэнээрээ шүүгээд урт, эдэлгээг нь харьцуул.", color: "var(--color-blush)" },
  { icon: QrIcon, title: "QPay-ээр төл", text: "Сагсандаа хийгээд аль ч банкны аппаар QR уншуулна.", color: "var(--color-lilac)" },
  { icon: TruckIcon, title: "Гэртээ ав", text: "11 цагаас өмнө бол өдөртөө, үгүй бол маргааш нь.", color: "var(--color-peach)" },
];
const WORDS = ["Гар аргаар урласан", "2016 оноос", "Монгол бүсгүйчүүдийн нүдэнд", "11 төрлийн сормуус", "21 аймагт", "Bukana"];
const TAG_COLOR: Record<string, string> = { first: "var(--color-mint)", daily: "var(--color-blush-2)", natural: "var(--color-peach-2)", volume: "var(--color-lilac-2)", party: "var(--color-butter)", selfstick: "#e3f1ff" };

export default function Home() {
  const best = popular.filter((p) => available(p)).slice(0, 10);
  const city = business.delivery[0];
  const cover = (g: string) => popular.find((p) => p.group === g && p.images[0])?.images[0].thumb.src;
  const hero = banners[0];
  // three hero stickers: the shop's top lash, a palette and a lip colour, as they sell best
  const stickers = ["lashes", "eyes", "lips"].map((g) => popular.find((p) => p.group === g && available(p) && p.images[0])!).filter(Boolean);
  const lashCount = lashes.length;
  const lowest = Math.min(...lashes.map((p) => p.variants[0].price));

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blush-3 via-cream to-cream">
        <Blob className="-top-24 -left-24 h-[340px] w-[340px] opacity-70" color="var(--color-blush-2)" />
        <Blob className="top-[30%] -right-28 h-[300px] w-[300px] opacity-60" color="var(--color-lilac-2)" style={{ animationDelay: "-5s" }} />
        <Bubbles color="rgb(242 112 156 / 0.16)" dense />
        <div className="wrap relative z-10 grid items-center gap-10 pt-10 pb-16 md:pt-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="rise inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13.5px] font-bold text-berry shadow-[0_8px_20px_-12px_rgb(194_54_107/0.6)]">
              <Heart size={15} className="beat" /> 2016 оноос гар аргаар урлаж байна
            </p>
            <h1 className="display rise mt-5 text-[38px] leading-[1.12] text-ink sm:text-[50px] lg:text-[60px]" style={{ animationDelay: "80ms" }}>
              Нүд чинь <span className="relative inline-block text-blush">
                гэрэлтэг
                <Sparkle size={22} color="var(--color-lilac)" className="twinkle absolute -top-3 -right-5" />
              </span>
              <span className="hand mt-1 block text-[44px] font-normal text-berry sm:text-[56px] lg:text-[66px]">Bukana-тай хамт</span>
            </h1>
            <p className="rise mt-4 max-w-xl text-[17px] text-ink-2" style={{ animationDelay: "160ms" }}>
              {business.tagline}.
            </p>
            <div className="rise mt-7 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
              <Link href="/lashes" className="btn btn-pink flutter-hover h-14 text-[16.5px]">
                <Lash width={30} color="#fff" /> Сормуусаа олох
              </Link>
              <Link href="/shop" className="btn btn-white h-14 text-[16.5px]">
                Бүх бараа <ArrowIcon size={18} />
              </Link>
            </div>
            <ul className="rise mt-8 flex flex-wrap gap-2 text-[13px] font-bold" style={{ animationDelay: "320ms" }}>
              <li className="rounded-full bg-white/90 px-3 py-1.5 text-berry">♡ {lashCount} загвар сормуус, {formatPrice(lowest)}-өөс</li>
              <li className="rounded-full bg-white/90 px-3 py-1.5 text-[#6a46c2]">♡ QPay</li>
              <li className="rounded-full bg-white/90 px-3 py-1.5 text-mint-2">♡ {formatPrice(city.freeFrom)}-өөс дээш хүргэлт үнэгүй</li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[500px]">
            {/* the shop's own flat-lay in a soft blob that slowly changes shape */}
            <div className="relative aspect-square">
              <span className="blob absolute inset-[3%] bg-gradient-to-br from-blush to-lilac opacity-30 blur-2xl" aria-hidden />
              {hero && (
                <div className="blob absolute inset-[6%] overflow-hidden shadow-[0_30px_60px_-30px_rgb(194_54_107/0.7)]" style={{ animationDuration: "18s" }}>
                  <Image src={hero.src} alt="Bukana сормуус, нүдний тен, будаг" fill priority sizes="(min-width: 1024px) 480px, 90vw" className="scale-110 object-cover" />
                </div>
              )}
              <Sparkles />
              {stickers.map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/p/${p.slug}`}
                  className={`float absolute flex items-center gap-2 rounded-full bg-white/95 py-1.5 pr-3.5 pl-1.5 shadow-[0_14px_30px_-14px_rgb(194_54_107/0.7)] backdrop-blur transition hover:scale-105 ${["top-[6%] -left-2 md:-left-8", "top-[46%] -right-2 md:-right-6", "bottom-[4%] left-[6%]"][i]}`}
                  style={{ animationDelay: `${i * -1.6}s`, ["--r" as string]: `${[-3, 3, -2][i]}deg` }}
                >
                  <span className="relative h-11 w-11 overflow-hidden rounded-full" style={{ background: TINT[p.group] }}>
                    <Image src={p.images[0].thumb.src} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                  <span className="leading-tight">
                    <b className="block max-w-[130px] truncate text-[13px]">{p.title}</b>
                    <span className="display text-[13px] text-berry">{formatPrice(p.variants[0].price)}</span>
                  </span>
                </Link>
              ))}
              {/* the blinking eye mascot */}
              <span className="absolute -top-2 right-[8%] grid h-[74px] w-[74px] place-items-center rounded-full bg-white shadow-[0_14px_30px_-14px_rgb(194_54_107/0.7)]" aria-hidden>
                <Lash width={48} open />
              </span>
            </div>
            <div className="card relative mx-auto mt-4 max-w-[360px] p-4">
              <EtaCard />
            </div>
          </div>
        </div>
        <div className="wave-edge" style={{ ["--wave" as string]: "var(--color-blush)" }} />
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden bg-blush py-3 text-white" aria-hidden>
        <div className="marquee flex w-max gap-8">
          {[...WORDS, ...WORDS, ...WORDS, ...WORDS].map((w, i) => (
            <span key={i} className="flex items-center gap-8 text-[15px] font-bold whitespace-nowrap">
              {w} <Sparkle size={14} color="#fff" />
            </span>
          ))}
        </div>
      </div>

      {/* LASH PICKER TEASER */}
      <section className="wrap mt-16">
        <Reveal className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-lilac-2 via-blush-3 to-peach-2 p-6 md:p-10">
          <Sparkles />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <span className="inline-grid h-[86px] w-[86px] place-items-center rounded-full bg-white shadow-[0_14px_30px_-14px_rgb(150_110_230/0.8)]">
                <Lash width={58} open />
              </span>
              <h2 className="display mt-4 text-[30px] leading-tight md:text-[38px]">Аль сормуус надад тохирох вэ?</h2>
              <p className="mt-2 max-w-md text-ink-2">Сормуус бүрийн урт, хэдэн удаа зүүх, хэнд тохирохыг манай тайлбараас шууд харьцуулж харуулна.</p>
              <Link href="/lashes" className="btn btn-lilac mt-6">
                Сормуус сонгогч <ArrowIcon size={18} />
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {lashTags.map((t, i) => (
                <Reveal as="li" key={t.id} delay={i * 60}>
                  <Link href={`/lashes?t=${t.id}`} className="group lift flutter-hover flex h-full items-center gap-3 rounded-[24px] bg-white p-3.5 md:p-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full transition group-hover:rotate-[-10deg]" style={{ background: TAG_COLOR[t.id] }}>
                      <Lash width={30} color="var(--color-berry)" />
                    </span>
                    <span className="leading-tight">
                      <b className="block text-[14.5px]">{t.name}</b>
                      <span className="text-[12.5px] text-ink-2">{t.count} сормуус</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* CATEGORIES */}
      <section className="wrap mt-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="hand text-[26px] leading-none text-blush">юу хайж байна?</p>
            <h2 className="display text-[30px] leading-tight md:text-[38px]">Ангиллаар</h2>
          </div>
          <Link href="/shop" className="font-bold text-berry hover:underline">
            Бүгдийг үзэх →
          </Link>
        </Reveal>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {groups.map((g, i) => (
            <Reveal as="li" key={g.id} delay={i * 70} className={i === 0 ? "col-span-2 md:col-span-1" : ""}>
              <Link href={`/shop?g=${g.id}`} className="group lift relative flex h-full flex-col items-center overflow-hidden rounded-[30px] p-4 text-center md:p-5" style={{ background: TINT[g.id] }}>
                {cover(g.id) && (
                  <span className="blob relative block h-[110px] w-[110px] overflow-hidden shadow-[0_0_0_5px_#fff] md:h-[130px] md:w-[130px]" style={{ animationDelay: `${i * -3}s` }}>
                    <Image src={cover(g.id)!} alt="" fill sizes="130px" className="object-cover transition duration-700 group-hover:scale-110" />
                  </span>
                )}
                <b className="display mt-4 text-[18px] leading-tight md:text-[20px]">{g.name}</b>
                <span className="mt-1 text-[12.5px] text-ink-2">{g.line}</span>
                <span className="mt-auto pt-3 text-[12.5px] font-bold text-berry">{g.count} бараа →</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* BESTSELLERS */}
      <section className="mt-20">
        <Reveal className="wrap flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="hand text-[26px] leading-none text-blush">бүсгүйчүүдийн сонголт</p>
            <h2 className="display text-[30px] leading-tight md:text-[38px]">Хамгийн их захиалдаг</h2>
          </div>
          <Link href="/shop" className="font-bold text-berry hover:underline">
            Дэлгүүр →
          </Link>
        </Reveal>
        <div className="wrap mt-6">
          <Scroller label="Хамгийн их захиалдаг" className="no-bar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pt-2 pb-6">
            {best.map((p, i) => (
              <div key={p.slug} className="w-[220px] shrink-0 snap-start md:w-[250px]">
                <ProductCard p={p} priority={i < 2} />
              </div>
            ))}
          </Scroller>
        </div>
      </section>

      {/* GLUE NOTE: the shop's FAQ answer, with its own 2,000₮ glue */}
      <section className="wrap mt-10">
        <Reveal className="card relative flex flex-col items-start gap-5 overflow-hidden p-6 sm:flex-row sm:items-center md:p-8">
          <Blob className="-right-16 -bottom-20 h-[200px] w-[200px] opacity-60" color="var(--color-peach-2)" />
          {glue?.images[0] && (
            <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[26px] bg-butter">
              <Image src={glue.images[0].thumb.src} alt="" fill sizes="96px" className="object-cover" />
            </span>
          )}
          <div className="relative flex-1">
            <p className="hand text-[24px] leading-none text-blush">жижиг зөвлөгөө</p>
            <h2 className="display mt-1 text-[22px] leading-snug md:text-[26px]">Сормуус цавуугүй ирдэг</h2>
            <p className="mt-1 text-ink-2">{business.rules.glue}</p>
          </div>
          {glue && available(glue) && (
            <Link href={`/p/${glue.slug}`} className="btn btn-white relative">
              Цавуу {formatPrice(glue.variants[0].price)} →
            </Link>
          )}
        </Reveal>
      </section>

      {/* HOW TO ORDER */}
      <section className="relative mt-20 overflow-hidden bg-blush-3 py-16">
        <Bubbles color="rgb(183 156 240 / 0.22)" />
        <div className="wrap relative">
          <Reveal className="text-center">
            <p className="hand text-[26px] leading-none text-blush">амархан</p>
            <h2 className="display text-[30px] leading-tight md:text-[38px]">Захиалах нь 3 алхам</h2>
          </Reveal>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 110} className="card lift relative p-6 text-center">
                <span className="float relative mx-auto grid h-16 w-16 place-items-center rounded-full text-white" style={{ background: s.color, animationDelay: `${i * -1.2}s` }}>
                  <s.icon size={28} />
                </span>
                <b className="display absolute top-4 left-5 text-[42px] leading-none text-blush-2">{i + 1}</b>
                <b className="display mt-4 block text-[19px]">{s.title}</b>
                <span className="mt-1 block text-[14.5px] text-ink-2">{s.text}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ABOUT */}
      <section className="wrap mt-20 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal className="relative mx-auto w-full max-w-[460px]">
          <div className="blob relative aspect-square overflow-hidden bg-blush-2 shadow-[0_0_0_10px_#fff,0_30px_60px_-30px_rgb(194_54_107/0.7)]">
            <Image src="/brand/logo.png" alt="Bukana лого" fill sizes="(min-width: 1024px) 460px, 90vw" className="object-cover" />
          </div>
          <Sparkles />
        </Reveal>
        <Reveal delay={100}>
          <p className="hand text-[26px] leading-none text-blush">бидний тухай</p>
          <h2 className="display mt-1 text-[30px] leading-tight md:text-[38px]">Монголд анхны гар аргын наадаг сормуус</h2>
          {business.about.map((a) => (
            <p key={a} className="mt-3 text-ink-2">
              {a}
            </p>
          ))}
          <ul className="mt-6 grid grid-cols-3 gap-3">
            {business.facts.map((f, i) => (
              <li key={f.big} className="rounded-[24px] p-4 text-center" style={{ background: [TINT.lashes, TINT.eyes, TINT.face][i] }}>
                <b className="display block text-[30px] leading-none text-berry md:text-[36px]">{f.big}</b>
                <span className="mt-1 block text-[12.5px] leading-snug text-ink-2">{f.line}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* DELIVERY + PARTNER STORES */}
      <section className="wrap mt-20 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-blush to-[#e65b8c] p-7 text-white md:p-10">
          <Bubbles />
          <div className="relative">
            <p className="hand text-[28px] leading-none text-white/90">хүргэлт</p>
            <h2 className="display mt-1 text-[30px] leading-tight md:text-[38px]">
              Улаанбаатарт {formatPrice(city.fee)}
              <span className="mt-1 block text-[20px] md:text-[26px]">
                <span className="whitespace-nowrap">{formatPrice(city.freeFrom)}-өөс</span> дээш бол үнэгүй ♡
              </span>
            </h2>
            <p className="mt-3 max-w-lg text-white/90">{business.rules.delivery}</p>
            <Link href="/info#delivery" className="btn btn-white mt-6">
              Дэлгэрэнгүй
            </Link>
          </div>
        </Reveal>
        <Reveal delay={100} className="card relative overflow-hidden p-7 md:p-8">
          <Blob className="-top-16 -right-16 h-[180px] w-[180px] opacity-70" color="var(--color-mint)" />
          <div className="relative">
            <p className="hand text-[26px] leading-none text-mint-2">орон нутагт</p>
            <h2 className="display mt-1 text-[24px] leading-snug">Гэрээт {business.stores.length} дэлгүүрээс авах</h2>
            <p className="mt-2 text-[14.5px] text-ink-2">{business.rules.countryside}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5 text-[12.5px] font-bold">
              {[...new Set(business.stores.filter((s) => !s.ub).map((s) => s.line.split(/[ ,.(]/)[0]))].slice(0, 9).map((a) => (
                <li key={a} className="rounded-full bg-mint px-2.5 py-1 text-mint-2">
                  {a}
                </li>
              ))}
            </ul>
            <Link href="/info#stores" className="mt-5 inline-block font-bold text-berry hover:underline">
              Бүх дэлгүүр, утас →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="wrap mt-20 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <p className="hand text-[26px] leading-none text-blush">асуулт байна уу?</p>
          <h2 className="display text-[30px] leading-tight md:text-[38px]">Түгээмэл асуулт</h2>
          <p className="mt-2 text-ink-2">Өөр асуух зүйл байвал залгаарай.</p>
          <a href={`tel:${business.phone.tel}`} className="btn btn-pink mt-5">
            <PhoneIcon size={18} /> {business.phone.display}
          </a>
        </Reveal>
        <Reveal delay={100} className="space-y-3">
          {[...business.faq, { q: "Хэдэн удаа зүүж болох вэ?", a: `Загвараасаа хамаарна: манай тайлбарт ${[...new Set(lashes.map((p) => p.lash?.uses && `${p.lash.uses.min}–${p.lash.uses.max}`).filter(Boolean))].join(", ")} удаа гэж бичсэн. Сормуус сонгогч дээр загвар бүрээр нь харьцуулж болно.` }, { q: "Сормуусны урт хэд вэ?", a: `Манай сормуус ${mmLabel({ min: Math.min(...lashes.flatMap((p) => (p.lash?.mm ? [p.lash.mm.min] : []))), max: Math.max(...lashes.flatMap((p) => (p.lash?.mm ? [p.lash.mm.max] : []))) })} хооронд уусгалттай. Урт бүрийг сормуус сонгогч дээр харна уу.` }].map((f) => (
            <details key={f.q} className="card group p-5 open:shadow-[0_0_0_2px_var(--color-blush)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush-2 text-berry transition duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-ink-2">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </section>
    </>
  );
}

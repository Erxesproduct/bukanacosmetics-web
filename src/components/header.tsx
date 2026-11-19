import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { Sparkle } from "./deco";
import { EtaLine } from "./delivery-eta";
import { HeaderTools } from "./header-tools";
import { LashIcon, TruckIcon } from "./icons";
import { Scroller } from "./scroller";

export const NAV = [
  { href: "/shop?g=lashes", label: "Сормуус" },
  { href: "/shop?g=eyes", label: "Нүд" },
  { href: "/shop?g=lips", label: "Уруул" },
  { href: "/shop?g=face", label: "Нүүр" },
  { href: "/shop?g=extras", label: "Бэлэг" },
];

export function Header() {
  const city = business.delivery[0];
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-gradient-to-r from-blush via-[#f58bb0] to-lilac text-white">
        <div className="wrap flex h-9 items-center justify-between gap-4 text-[13px] font-bold">
          <span className="flex min-w-0 items-center gap-2">
            <TruckIcon size={16} className="shrink-0" />
            <EtaLine className="truncate" />
          </span>
          <span className="hidden shrink-0 items-center gap-1.5 sm:flex">
            <Sparkle size={12} color="#fff" className="twinkle" /> {formatPrice(city.freeFrom)}-өөс дээш хүргэлт үнэгүй
          </span>
        </div>
      </div>
      <div className="border-b border-line bg-white/90 backdrop-blur-md">
        <div className="wrap flex h-[66px] items-center gap-3 md:h-[78px]">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${business.name}: нүүр хуудас`}>
            <Image src="/brand/logo.png" alt="" width={480} height={480} priority className="h-[44px] w-[44px] rounded-full shadow-[0_0_0_3px_#fff,0_0_0_5px_var(--color-blush-2)] transition duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 md:h-[52px] md:w-[52px]" />
            <span className="leading-none">
              <span className="hand block text-[30px] text-berry md:text-[34px]">Bukana</span>
              <span className="eyebrow -mt-0.5 block !text-[9.5px] !tracking-[0.3em] text-ink-3">cosmetics</span>
            </span>
          </Link>
          <nav aria-label="Үндсэн цэс" className="ml-6 hidden flex-1 items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-full px-3.5 py-2 text-[15px] font-bold text-ink transition hover:bg-blush-3 hover:text-berry">
                {n.label}
              </Link>
            ))}
            <Link href="/lashes" className="flutter-hover ml-1 flex items-center gap-1.5 rounded-full bg-lilac-2 px-4 py-2 text-[15px] font-bold text-[#6a46c2] transition hover:bg-lilac hover:text-white">
              <LashIcon size={18} /> Сормуус сонгогч
            </Link>
          </nav>
          <HeaderTools />
        </div>
        <Scroller as="nav" label="Ангилал" small className="no-bar wrap flex gap-2 overflow-x-auto pb-3 lg:hidden">
          <Link href="/lashes" className="chip shrink-0 !bg-lilac-2 !text-[#6a46c2]">
            <LashIcon size={17} /> Сормуус сонгогч
          </Link>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="chip shrink-0">
              {n.label}
            </Link>
          ))}
        </Scroller>
      </div>
    </header>
  );
}

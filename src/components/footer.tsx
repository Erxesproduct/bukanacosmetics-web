import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { Bubbles, Heart, Lash } from "./deco";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";

export function Footer() {
  return (
    <footer className="relative mt-24 pb-24 md:pb-0">
      <div className="wave-edge" style={{ ["--wave" as string]: "var(--color-blush-2)" }} />
      <div className="relative overflow-hidden bg-blush-2">
        <Bubbles />
        <Lash width={150} className="absolute -right-6 bottom-24 rotate-[-12deg] opacity-15" />
        <div className="wrap relative grid gap-10 py-14 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <span className="flex items-center gap-3">
              <Image src="/brand/logo.png" alt="" width={480} height={480} className="h-16 w-16 rounded-full shadow-[0_0_0_4px_#fff]" />
              <span className="hand text-[44px] leading-none text-berry">Bukana</span>
            </span>
            <p className="display mt-5 max-w-sm text-[20px] leading-snug text-ink">{business.tagline}</p>
            <div className="mt-6 flex gap-3">
              <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="grid h-12 w-12 place-items-center rounded-full bg-white text-berry transition hover:-translate-y-1 hover:bg-blush hover:text-white" aria-label="Facebook">
                <FacebookIcon size={20} />
              </a>
              <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="grid h-12 w-12 place-items-center rounded-full bg-white text-berry transition hover:-translate-y-1 hover:bg-blush hover:text-white" aria-label="Instagram">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href={`tel:${business.phone.tel}`} className="card lift flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blush text-white">
                <PhoneIcon size={22} />
              </span>
              <span>
                <span className="block text-[13px] text-ink-2">Утас</span>
                <b className="display text-[22px]">{business.phone.display}</b>
              </span>
            </a>
            <a href={`mailto:${business.email}`} className="card lift flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lilac text-white">
                <MailIcon size={22} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] text-ink-2">Имэйл</span>
                <b className="block truncate text-[15px]">{business.email}</b>
              </span>
            </a>
            <div className="card flex items-start gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-peach text-ink">
                <PinIcon size={22} />
              </span>
              <span>
                <span className="block text-[13px] text-ink-2">Хаяг</span>
                <b className="block text-[15px]">{business.address}</b>
              </span>
            </div>
            <Link href="/info#stores" className="card lift flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-mint text-mint-2">
                <Heart size={22} color="currentColor" />
              </span>
              <span>
                <span className="block text-[13px] text-ink-2">Гэрээт дэлгүүрүүд</span>
                <b className="block text-[15px]">{business.stores.length} цэг, хот, аймагт →</b>
              </span>
            </Link>
          </div>
        </div>
        <div className="wrap relative flex flex-wrap items-center justify-between gap-3 border-t border-white/70 py-6 text-[14px] text-ink-2">
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Доод холбоос">
            <Link href="/shop" className="hover:text-berry">
              Дэлгүүр
            </Link>
            <Link href="/lashes" className="hover:text-berry">
              Сормуус сонгогч
            </Link>
            <Link href="/info#delivery" className="hover:text-berry">
              Хүргэлт
            </Link>
            <Link href="/info#faq" className="hover:text-berry">
              Түгээмэл асуулт
            </Link>
            <Link href="/info#about" className="hover:text-berry">
              Бидний тухай
            </Link>
          </nav>
          <span className="flex items-center gap-1.5">
            © {new Date().getFullYear()} {business.name} <Heart size={14} className="beat" />
          </span>
        </div>
      </div>
    </footer>
  );
}

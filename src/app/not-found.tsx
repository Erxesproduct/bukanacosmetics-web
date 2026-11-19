import Link from "next/link";
import { Blob, Lash } from "@/components/deco";

export default function NotFound() {
  return (
    <div className="wrap relative py-20 text-center">
      <div className="relative mx-auto grid h-[200px] w-[200px] place-items-center">
        <Blob className="inset-0" color="var(--color-blush-2)" />
        <span className="relative">
          <Lash width={110} open />
          <span className="display mt-2 block text-[40px] text-berry">404</span>
        </span>
      </div>
      <h1 className="display mt-6 text-[34px] md:text-[48px]">Хуудас олдсонгүй</h1>
      <p className="mt-2 text-ink-2">Хаяг буруу эсвэл бараа шилжсэн байж магадгүй.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-pink">
          Дэлгүүр
        </Link>
        <Link href="/" className="btn btn-white">
          Нүүр хуудас
        </Link>
      </div>
    </div>
  );
}

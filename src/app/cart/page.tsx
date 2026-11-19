import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Сагс", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="wrap pt-8 pb-10 md:pt-12">
      <p className="hand text-[28px] leading-none text-blush">бараг л болчихлоо</p>
      <h1 className="display mb-6 text-[38px] leading-tight md:text-[52px]">Сагс, захиалга</h1>
      <Checkout />
    </div>
  );
}

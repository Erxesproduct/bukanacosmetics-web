import type { Metadata } from "next";
import { HeartsView } from "@/components/hearts-view";

export const metadata: Metadata = { title: "Хадгалсан", robots: { index: false } };

export default function HeartsPage() {
  return (
    <div className="wrap pt-8 md:pt-12">
      <p className="hand text-[28px] leading-none text-blush">♡ миний жагсаалт</p>
      <h1 className="display text-[38px] leading-tight md:text-[52px]">Хадгалсан</h1>
      <HeartsView />
    </div>
  );
}

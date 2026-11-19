import { Balsamiq_Sans, Caveat, M_PLUS_Rounded_1c } from "next/font/google";

// All three have Ө ө Ү ү (checked in the Google Fonts cmap).
/** Headings and prices: soft, hand-drawn, with plain Cyrillic letter shapes (easy to read). */
export const display = Balsamiq_Sans({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "700"], variable: "--font-display", display: "swap" });
/** Body text: rounded ends, easy to read. */
export const body = M_PLUS_Rounded_1c({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "500", "700", "800"], variable: "--font-body", display: "swap" });
/** Little hand-written notes («handmade with love»). */
export const hand = Caveat({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["600"], variable: "--font-hand", display: "swap" });

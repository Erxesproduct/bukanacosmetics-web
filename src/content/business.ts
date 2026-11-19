import data from "@/data/catalog.json";
import type { Store } from "@/lib/catalog";

/**
 * Business facts from bukanacosmetics.mn (Zochil shop 6234: shop settings, delivery rule and option, FAQ, about page,
 * product texts), read on 2026-11-19. Nothing here is invented; open points are in docs/erxes/MANUAL-STEPS.md.
 */
const shop = data.shop;
const zone = shop.delivery[0];

export const business = {
  name: "Bukana Cosmetics",
  brand: "Bukana",
  domain: "bukanacosmetics.mn",
  /** The shop's own description, word for word. */
  tagline: shop.slogan,
  description: "Монгол бүсгүйчүүдийн нүдний онцлогт тохируулан гар аргаар урласан Bukana наадаг сормуус, нүд, уруул, нүүрний будаг. Улаанбаатарт 11 цагаас өмнө захиалбал өдөртөө хүргэнэ.",
  phone: { display: "9955-9628", tel: "+97699559628" },
  email: shop.email,
  facebook: "https://www.facebook.com/profile.php?id=100064542108669",
  instagram: shop.instagram,
  /** Zochil shop address (no opening hours are given). */
  address: shop.address,
  /** About page: handmade lashes since 2016, a cosmetics brand since 2021, resellers across the country. */
  about: shop.about,
  /** Facts from the about page, kept short for the home page. */
  facts: [
    { big: "2016", line: "оноос хойш сормуус урлаж байна" },
    { big: "11", line: "төрлийн сормуус" },
    { big: "21", line: "аймагт 51 борлуулагч" },
  ],
  /** QPay is the only method the shop has (has_qpay); the Zochil payment rule is empty (open question 1). */
  payments: [{ id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө. Захиалга өгсний дараа төлбөрийн хуудас нээгдэнэ." }],
  /** Zochil delivery option «Үндсэн хүргэлт»: Ulaanbaatar, 6,000₮, free above 50,000₮. No countryside option is set (open question 2). */
  delivery: [{ id: "city", name: "Улаанбаатар", note: "Хаяг дээр тань хүргэнэ", fee: zone?.price ?? 6000, freeFrom: zone?.freeFrom ?? 50000 }],
  /** Zochil delivery rule: before 11:00 same day, after 11:00 next day. No day off is stated. */
  schedule: { cutoffHour: 11, dayOff: null as number | null },
  rules: {
    payment: "QPay-ээр төлбөрөө төлснөөр захиалга баталгаажна.",
    delivery: "11 цагаас өмнө хийгдсэн захиалга тухайн өдөртөө хүргэгдэнэ. 11 цагаас хойш хийгдсэн захиалга дараа өдөртөө багтаж хүргэгдэнэ.",
    countryside: "Онлайн захиалга одоогоор зөвхөн Улаанбаатарт хүргэгдэнэ. Орон нутагт манай гэрээт борлуулагчдаас аваарай, эсвэл утсаар холбогдоорой.",
    glue: "Сормуус цавуугүй ирдэг. 2,000₮-ийн жижиг хар цавуу эсвэл Америк Duo цавуу тохирно.",
    ebarimt: "И-баримтыг төлбөр баталгаажсаны дараа erxes-ээс албан ёсоор олгоно. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
  },
  faq: shop.faq,
  /** Partner shops listed under «Бэлэн байгаа (гэрээт) салбарууд» in the product texts (open question 4: is it current?). */
  stores: shop.stores as Store[],
} as const;

export type DeliveryId = (typeof business.delivery)[number]["id"];
export type PaymentId = (typeof business.payments)[number]["id"];
export const deliveryOption = (id: DeliveryId) => business.delivery.find((d) => d.id === id) ?? business.delivery[0];
export const paymentOption = (id: PaymentId) => business.payments.find((p) => p.id === id)!;

/** Zochil: 6,000₮; 0₮ when the goods are above 50,000₮. */
export function deliveryFee(id: DeliveryId, subtotal: number): number {
  const d = deliveryOption(id);
  return d.freeFrom && subtotal > d.freeFrom ? 0 : d.fee;
}

/** When an order placed at `now` arrives: same day before 11:00 (Ulaanbaatar time), otherwise the next day. */
export function deliveryDay(now: Date) {
  const { cutoffHour, dayOff } = business.schedule;
  const ub = new Date(now.getTime() + 8 * 3600_000); // Ulaanbaatar is UTC+8 all year
  const day = new Date(Date.UTC(ub.getUTCFullYear(), ub.getUTCMonth(), ub.getUTCDate()));
  if (ub.getUTCHours() >= cutoffHour || ub.getUTCDay() === dayOff) day.setUTCDate(day.getUTCDate() + 1);
  while (day.getUTCDay() === dayOff) day.setUTCDate(day.getUTCDate() + 1);
  const today = Date.UTC(ub.getUTCFullYear(), ub.getUTCMonth(), ub.getUTCDate());
  return { date: day, days: Math.round((day.getTime() - today) / 86400_000), beforeCutoff: ub.getUTCHours() < cutoffHour && ub.getUTCDay() !== dayOff, ubHour: ub.getUTCHours(), ubMinute: ub.getUTCMinutes() };
}
export const WEEKDAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];

/** Order statuses staff move an order through (erxes Sales pipeline stages, see MANUAL-STEPS.md). */
export const ORDER_STATUSES = [
  { id: "pending", name: "Хүлээгдэж байна", note: "Захиалга ирсэн, төлбөр хүлээгдэж байна" },
  { id: "confirmed", name: "Баталгаажсан", note: "QPay төлбөр орсон" },
  { id: "packing", name: "Бэлтгэж байна", note: "Сормуус, будгийг тань савлаж байна" },
  { id: "shipped", name: "Хүргэлтэд гарсан", note: "11 цагаас өмнө бол өдөртөө, үгүй бол маргааш" },
  { id: "delivered", name: "Хүргэгдсэн", note: "Хүлээн авсан" },
  { id: "cancelled", name: "Цуцлагдсан", note: "Төлбөр төлөгдөөгүй" },
] as const;

"use client";

import { useEffect, useState } from "react";
import { business, deliveryDay, WEEKDAYS } from "@/content/business";

const CUT = business.schedule.cutoffHour;

/**
 * «Order now → it arrives …» from the shop's rule: before 11:00 (Ulaanbaatar time) the same day, otherwise the next day.
 * Computed in the browser after load (the server never guesses the visitor's clock).
 */
export function useEta() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 30_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  if (!now) return null;
  const d = deliveryDay(now);
  const day = WEEKDAYS[d.date.getUTCDay()];
  const when = d.days === 0 ? "Өнөөдөр" : d.days === 1 ? "Маргааш" : `${day} гарагт`;
  const left = d.beforeCutoff ? (CUT - d.ubHour) * 60 - d.ubMinute : null;
  return { when, day, days: d.days, left, date: `${d.date.getUTCMonth() + 1}/${d.date.getUTCDate()}` };
}

export function EtaLine({ className = "" }: { className?: string }) {
  const eta = useEta();
  return (
    <span className={className} aria-live="polite">
      {eta ? (
        <>
          Одоо захиалбал: <b>{eta.when}</b>
          {eta.days > 0 && ` (${eta.day})`} хүргэнэ
        </>
      ) : (
        `${CUT} цагаас өмнө захиалбал өдөртөө хүргэнэ`
      )}
    </span>
  );
}

/** Bigger card with the cut-off countdown. */
export function EtaCard() {
  const eta = useEta();
  return (
    <div className="flex items-center gap-4">
      <span className="display grid h-16 w-16 shrink-0 place-items-center rounded-[22px] bg-gradient-to-br from-blush-2 to-lilac-2 text-center text-[13px] leading-tight text-berry">
        {eta ? (
          <span>
            <span className="block text-[22px] leading-none">{eta.date}</span>
            {eta.day}
          </span>
        ) : (
          "…"
        )}
      </span>
      <span>
        <span className="display block text-[22px] leading-tight">{eta ? `${eta.when} хүргэнэ` : "Маргааш нь хүргэнэ"}</span>
        <span className="block text-[14.5px] opacity-85">
          {eta?.left != null ? `Өдөртөө авахад ${Math.floor(eta.left / 60) ? `${Math.floor(eta.left / 60)} цаг ` : ""}${eta.left % 60} минут үлдлээ` : `${CUT} цагаас өмнө захиалбал өдөртөө хүргэнэ.`}
        </span>
      </span>
    </div>
  );
}

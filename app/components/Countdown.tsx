"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CELEBRATION_START } from "../lib/invite";

function remaining() {
  const diff = Math.max(0, CELEBRATION_START - Date.now());
  const s = Math.floor(diff / 1000);
  return { done: diff === 0, d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

function Digit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flip-tile">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="block"
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
        <span className="flip-seam" aria-hidden="true" />
      </div>
      <span className="font-display text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[var(--gold-pale)]/80">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const [t, setT] = useState<ReturnType<typeof remaining> | null>(null);

  useEffect(() => {
    const tick = () => setT(remaining());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  if (t?.done) {
    return <p className="font-script text-5xl leading-[1.3] gold-foil text-center px-[0.3em] py-[0.15em]">The celebration has begun!</p>;
  }

  return (
    <div className="flex justify-center gap-3 sm:gap-6" role="timer" aria-label="Time until the celebrations">
      <Digit value={t?.d ?? 0} label="Days" />
      <Digit value={t?.h ?? 0} label="Hours" />
      <Digit value={t?.m ?? 0} label="Minutes" />
      <Digit value={t?.s ?? 0} label="Seconds" />
    </div>
  );
}

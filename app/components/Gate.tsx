"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ARRIVAL, INVOCATION, COUPLE, DATE_LONG, VENUE } from "../lib/invite";
import "./gate.css";
import { Mandala } from "./Ornaments";

function Door({ side, open, upper, lower }: { side: "left" | "right"; open: boolean; upper: React.ReactNode; lower: React.ReactNode }) {
  const isLeft = side === "left";
  return (
    <motion.div
      className={`door door-${side}`}
      style={{ transformOrigin: isLeft ? "left center" : "right center" }}
      initial={false}
      animate={open ? { rotateY: isLeft ? -105 : 105 } : { rotateY: 0 }}
      transition={{ duration: 2.2, ease: [0.6, 0.02, 0.2, 1], delay: 0.35 }}
    >
      <div className="door-panel">
        <div className="door-arch" />
        <div className="door-inset">{upper}</div>
        <div className="door-inset lower">{lower}</div>
        <span className="door-stud-row" />
      </div>
      <span className={`door-knocker ${isLeft ? "right-3" : "left-3"}`} />
    </motion.div>
  );
}

export default function Gate({ onOpen }: { onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);

  const enter = () => {
    if (open) return;
    setOpen(true);
    onOpen();
    setTimeout(() => setGone(true), 2600);
  };

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ perspective: 1600 }}
        >
          {/* Light pouring in behind the doors */}
          <motion.div
            className="absolute inset-0 gate-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 1.6, delay: 0.5 }}
          />
          <Door
            side="left"
            open={open}
            upper={
              <>
                <p lang="hi" className="door-hi">आप सपरिवार सादर आमंत्रित हैं</p>
                <p className="door-en">You &amp; your family are cordially invited</p>
              </>
            }
            lower={
              <>
                <p className="door-title">Ring Ceremony <span lang="hi" className="font-hindi">· सगाई</span></p>
                <p className="door-en">{DATE_LONG} · {ARRIVAL}</p>
              </>
            }
          />
          <Door
            side="right"
            open={open}
            upper={
              <>
                <p className="door-names">{COUPLE.bride} &amp; {COUPLE.groom}</p>
                <p className="door-en">{VENUE.name}, {VENUE.locality}</p>
              </>
            }
            lower={
              <>
                <p lang="hi" className="door-hi">आपकी गरिमामयी उपस्थिति के हम सदैव आभारी रहेंगे</p>
                <p className="door-en">We shall be ever grateful for your gracious presence</p>
                <p lang="hi" className="door-family">दर्शनाभिलाषी — समस्त परिवार</p>
              </>
            }
          />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center max-sm:justify-start max-sm:pt-[13svh] px-4 text-center pointer-events-none"
            animate={open ? { opacity: 0, scale: 1.15 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <motion.p
              lang="hi"
              className="font-hindi text-[clamp(18px,4.6vw,28px)] text-[var(--gold-light)] drop-shadow-[0_2px_10px_rgba(0,0,0,.6)]"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.3 }}
            >
              {INVOCATION}
            </motion.p>

            <motion.button
              type="button"
              onClick={enter}
              aria-label="Open the invitation"
              className="pointer-events-auto relative mt-8 max-sm:mt-4 grid place-items-center size-[min(46vw,260px)] rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--gold-light)] focus-visible:outline-offset-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Mandala className="absolute inset-0 size-full animate-[spin_60s_linear_infinite] opacity-90" />
              <span className="medallion">
                {/* SVG text so the monogram is centred on the medallion exactly */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
                  <text
                    className="monogram"
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="url(#gold)"
                  >
                    {COUPLE.bride[0]}
                    <tspan fontSize="0.6em" dx="1" dy="-2">&amp;</tspan>
                    <tspan dx="1" dy="2">{COUPLE.groom[0]}</tspan>
                  </text>
                </svg>
              </span>
              <span className="pulse-ring" />
            </motion.button>

            <motion.p
              className="mt-8 max-sm:mt-3 font-display text-[12px] tracking-[0.4em] uppercase text-[var(--gold-pale)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: 1.6 }}
            >
              Tap to enter
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  BENEDICTION,
  BENEDICTION_EN,
  CEREMONIES,
  CLOSING,
  COUPLE,
  DATE_LONG,
  DATE_SHORT,
  INVOCATION,
  INVOCATION_EN,
  MAP_DIRECTIONS,
  MAP_EMBED,
  MAP_OPEN,
  VENUE,
  downloadIcs,
  ARRIVAL,
  ARRIVAL_NOTE,
  type Ceremony,
} from "../lib/invite";
import { bell, flourish, pauseForVisibility, setSound } from "../lib/sound";
import Atmosphere from "./Atmosphere";
import Blessings from "./Blessings";
import Countdown from "./Countdown";
import Gate from "./Gate";
import { Divider, Feather, GoldDefs, Lotus, Mandala, RingsIcon, Thali } from "./Ornaments";

const RingsScene = dynamic(() => import("./RingsScene"), {
  ssr: false,
  loading: () => <div className="size-full grid place-items-center"><span className="loader-ring" /></div>,
});

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.2, 0.8, 0.2, 1] as const } },
};

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div variants={fadeUp} className="text-center">
      <p className="font-display text-[11px] sm:text-xs tracking-[0.45em] uppercase text-[var(--gold)]">{eyebrow}</p>
      <h2 className="mt-3 font-display text-[clamp(28px,6vw,46px)] tracking-[0.08em] gold-foil">{title}</h2>
      <Divider className="mt-5" />
    </motion.div>
  );
}

/* ------------------------------ Hero ------------------------------ */

function Hero({ revealed }: { revealed: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mandalaRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const lift = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stagger = (d: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(8px)" },
    animate: revealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
    transition: { duration: 1.4, delay: d, ease: [0.2, 0.8, 0.2, 1] as const },
  });

  return (
    <section ref={ref} className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-4 pt-16 pb-24">
      <motion.div style={{ rotate: mandalaRotate }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[58%] w-[min(140vw,900px)] aspect-square opacity-25 pointer-events-none">
        <Mandala className="size-full animate-[spin_120s_linear_infinite]" />
      </motion.div>
      <div className="absolute inset-0 hero-glow pointer-events-none" />

      <motion.div style={{ y: lift, opacity: fade }} className="relative z-10 flex flex-col items-center text-center w-full">
        <motion.div {...stagger(0.2)}>
          <Lotus className="w-24 sm:w-28 mx-auto drop-shadow-[0_6px_18px_rgba(201,80,106,.45)]" />
        </motion.div>
        <motion.p {...stagger(0.4)} lang="hi" className="mt-3 font-hindi text-[clamp(18px,4.4vw,28px)] text-[var(--gold-light)]">
          {INVOCATION}
        </motion.p>
        <motion.p {...stagger(0.55)} className="italic text-[var(--gold-pale)]/80 text-base sm:text-lg">
          {INVOCATION_EN}
        </motion.p>

        <motion.div {...stagger(0.7)} className="relative w-full max-w-[640px] h-[clamp(200px,36vh,340px)] -my-2">
          {revealed && <RingsScene />}
          <span className="absolute -bottom-1 right-2 sm:right-6 font-display text-[10px] tracking-[0.35em] uppercase text-[var(--gold-pale)]/50 pointer-events-none">
            Drag to turn the rings
          </span>
        </motion.div>

        <motion.p {...stagger(0.9)} className="mt-4 font-display text-[11px] sm:text-sm tracking-[0.5em] uppercase text-[var(--gold-pale)]">
          The Ring Ceremony of
        </motion.p>
        <motion.h1 {...stagger(1.05)} className="mt-1 font-script font-normal leading-[1.25] text-[clamp(50px,13.5vw,140px)] gold-foil px-[0.25em] py-[0.1em] drop-shadow-[0_6px_24px_rgba(0,0,0,.45)]">
          {COUPLE.bride}
          <span className="mx-3 sm:mx-5 text-[0.55em] align-middle">&amp;</span>
          {COUPLE.groom}
        </motion.h1>
        <motion.p {...stagger(1.25)} lang="hi" className="mt-2 font-hindi text-2xl sm:text-3xl text-[var(--rose-light)]">
          सगाई समारोह
        </motion.p>

        <motion.div {...stagger(1.4)} className="mt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-[var(--ivory)]">
          <span className="font-display tracking-[0.18em] text-sm sm:text-base">{DATE_LONG}</span>
          <span className="hidden sm:block size-1.5 rotate-45 bg-[var(--gold)]" />
          <span className="font-display tracking-[0.18em] text-sm sm:text-base">{ARRIVAL}</span>
        </motion.div>
        <motion.p {...stagger(1.5)} className="mt-1 italic text-[var(--gold-pale)]/85 text-lg">
          {VENUE.name}, {VENUE.locality}
        </motion.p>
      </motion.div>

      <motion.a
        href="#blessing"
        aria-label="Scroll to continue"
        className="absolute bottom-6 z-10 flex flex-col items-center gap-2 text-[var(--gold-pale)]/70"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 2.2, duration: 1 }}
      >
        <span className="font-display text-[10px] tracking-[0.4em] uppercase">Scroll</span>
        <motion.span className="block h-10 w-px bg-gradient-to-b from-[var(--gold)] to-transparent" animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.a>
    </section>
  );
}

/* --------------------------- Benediction --------------------------- */

function Benediction() {
  return (
    <motion.section
      id="blessing"
      className="relative px-4 py-28 sm:py-36"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={{ show: { transition: { staggerChildren: 0.18 } } }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <SectionTitle eyebrow="Ashirvachan" title="Divine Blessing" />
        <div className="relative mt-12">
          <span className="absolute -top-14 left-1/2 -translate-x-1/2 font-script text-[140px] leading-none text-[var(--gold)]/20 select-none" aria-hidden="true">“</span>
          {BENEDICTION.map((line, li) => (
            <motion.p
              key={li}
              lang="hi"
              className="font-hindi text-[clamp(22px,5vw,38px)] leading-relaxed text-[var(--ivory)]"
              variants={{ show: { transition: { staggerChildren: 0.09 } } }}
            >
              {line.split(" ").map((word, wi) => (
                <motion.span
                  key={wi}
                  className="inline-block mr-[0.3em]"
                  variants={{
                    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
                    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8 } },
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          ))}
          <motion.p variants={fadeUp} className="mt-8 italic text-lg sm:text-xl text-[var(--gold-pale)]/80">
            “{BENEDICTION_EN}”
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}

/* ---------------------------- Ceremonies ---------------------------- */

function CeremonyCard({ c, index }: { c: Ceremony; index: number }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });
  const [shine, setShine] = useState({ x: 50, y: 30 });

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    ry.set((x - 0.5) * 14);
    rx.set((0.5 - y) * 12);
    setShine({ x: x * 100, y: y * 100 });
  };
  const onLeave = () => { rx.set(0); ry.set(0); };
  const Icon = c.icon === "rings" ? RingsIcon : Thali;
  const featured = c.icon === "rings";

  return (
    <motion.div variants={fadeUp} className="h-full perspective-[1200px]">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className={`jharokha h-full ${featured ? "jharokha-featured" : ""}`}
      >
        <div className="jharokha-shine" style={{ background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,.5), transparent 45%)` }} />
        <Feather className="absolute bottom-5 left-4 w-8 -rotate-12 opacity-80" />
        <Feather className="absolute bottom-5 right-4 w-8 rotate-12 -scale-x-100 opacity-80" />

        <div className="relative flex flex-col items-center text-center px-6 pt-16 pb-10" style={{ transform: "translateZ(40px)" }}>
          <span className="font-display text-xs tracking-[0.4em] text-[var(--gold)]">{["I", "II", "III"][index]}</span>
          <div className="mt-2 grid place-items-center size-24 rounded-full bg-[radial-gradient(circle,#fff7e3,#f3e2bb)] ring-1 ring-[var(--gold)]/60 shadow-[0_10px_30px_-12px_rgba(122,20,36,.6)]">
            <Icon className="size-16" />
          </div>
          <p lang="hi" className="mt-5 font-hindi text-[clamp(28px,6vw,36px)] text-[var(--maroon)] leading-tight">{c.hindi}</p>
          <h3 className="mt-1 font-display text-lg sm:text-xl tracking-[0.08em] text-[var(--burgundy)]">{c.name}</h3>
          <p className="mt-2 italic text-[var(--ink-soft)] text-lg max-w-[18rem]">{c.blurb}</p>
          <span className="mt-5 rounded-full border border-[var(--gold)]/60 bg-[var(--gold-pale)]/40 px-5 py-1.5 font-display text-sm tracking-[0.14em] text-[var(--burgundy)]">
            {c.time}
          </span>
          <button
            type="button"
            onClick={() => { downloadIcs(c); bell(1046.5, 0, 0.08); }}
            className="btn-royal mt-7"
            aria-label={`Add ${c.name} to calendar`}
          >
            <CalendarGlyph /> Add to Calendar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Ceremonies() {
  return (
    <motion.section
      className="relative px-4 py-24 sm:py-32"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ show: { transition: { staggerChildren: 0.2 } } }}
    >
      <div className="mx-auto max-w-5xl">
        <SectionTitle eyebrow="Order of Celebrations" title="The Ceremonies" />
        <motion.p variants={fadeUp} className="mt-5 text-center italic text-lg text-[var(--gold-pale)]/80">
          {DATE_LONG} · {VENUE.name}, {VENUE.locality}
        </motion.p>
        <motion.p variants={fadeUp} className="mx-auto mt-4 w-fit rounded-full border border-[var(--gold)]/60 bg-[var(--night)]/40 px-5 py-2 text-center font-display text-xs sm:text-sm tracking-[0.14em] text-[var(--gold-light)]">
          {ARRIVAL_NOTE}
        </motion.p>
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {CEREMONIES.map((c, i) => <CeremonyCard key={c.id} c={c} index={i} />)}
        </div>
      </div>
    </motion.section>
  );
}

/* ----------------------------- Countdown ----------------------------- */

function CountdownSection() {
  return (
    <motion.section
      className="relative px-4 py-24 sm:py-32"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ show: { transition: { staggerChildren: 0.2 } } }}
    >
      <SectionTitle eyebrow="The auspicious day approaches" title="Counting the Moments" />
      <motion.div variants={fadeUp} className="mt-12">
        <Countdown />
      </motion.div>
    </motion.section>
  );
}

/* ------------------------------- Venue ------------------------------- */

function Venue() {
  return (
    <motion.section
      className="relative px-4 py-14 sm:py-20"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ show: { transition: { staggerChildren: 0.18 } } }}
    >
      <div className="mx-auto max-w-2xl">
        <SectionTitle eyebrow="The Venue" title={VENUE.name} />
        <motion.p variants={fadeUp} className="mt-4 text-center italic text-lg text-[var(--gold-pale)]/85">
          {VENUE.locality}, {VENUE.state}
        </motion.p>
        <motion.div variants={fadeUp} className="map-arch mt-8">
          <iframe
            title="Map of Rudra Resort, Lalganj, Raebareli"
            src={MAP_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="size-full border-0"
          />
        </motion.div>
        <motion.div variants={fadeUp} className="mt-7 flex flex-wrap justify-center gap-3">
          <a href={MAP_DIRECTIONS} target="_blank" rel="noopener" className="btn-royal">
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
            Get Directions
          </a>
          <a href={MAP_OPEN} target="_blank" rel="noopener" className="btn-ghost">
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></g></svg>
            Open in Google Maps
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ------------------------------- Footer ------------------------------- */

function Footer() {
  return (
    <motion.footer
      className="relative px-4 pt-16 pb-28 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4 }}
    >
      <Lotus className="w-20 mx-auto" />
      <p lang="hi" className="mt-4 font-hindi text-2xl sm:text-3xl text-[var(--gold-light)]">{CLOSING}</p>
      <p className="mt-3 font-display tracking-[0.18em] text-sm sm:text-base text-[var(--gold-pale)]/80">
        {DATE_SHORT} • {VENUE.name}, {VENUE.locality}
      </p>
    </motion.footer>
  );
}

/* ------------------------------ Controls ------------------------------ */

function CalendarGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
      </g>
    </svg>
  );
}

function SoundToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      aria-label={on ? "Mute music" : "Play music"}
      className="fixed z-[70] right-4 bottom-[max(16px,env(safe-area-inset-bottom))] grid place-items-center size-12 rounded-full border border-[var(--gold)] bg-[var(--night)]/70 backdrop-blur text-[var(--gold-pale)] shadow-[0_10px_30px_-10px_rgba(0,0,0,.7)] cursor-pointer"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
    >
      {on ? (
        <span className="flex items-end gap-[3px] h-4" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <motion.span key={i} className="w-[3px] rounded-full bg-current" animate={{ height: ["30%", "100%", "45%", "80%", "30%"] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }} />
          ))}
        </span>
      ) : (
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></g></svg>
      )}
    </motion.button>
  );
}

/* ------------------------------- Page ------------------------------- */

export default function Invitation() {
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState(0);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const onVis = () => pauseForVisibility(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = revealed ? "" : "hidden";
  }, [revealed]);

  // Never restore an old scroll position on refresh: guests always start at the top.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const open = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setSound(true);
    setSoundOn(true);
    flourish();
    setTimeout(() => setBurst((b) => b + 1), 900);
    setTimeout(() => setRevealed(true), 1400);
  };

  const shower = useCallback(() => {
    setBurst((b) => b + 1);
    [783.99, 1046.5, 1318.5].forEach((f, i) => bell(f, i * 0.2, 0.07));
  }, []);

  const toggleSound = () => {
    setSound(!soundOn);
    setSoundOn(!soundOn);
  };

  return (
    <>
      <GoldDefs />
      <Gate onOpen={open} />
      <Atmosphere burstKey={burst} />
      {revealed && <SoundToggle on={soundOn} onToggle={toggleSound} />}

      <main className="relative z-10 velvet">
        <Hero revealed={revealed} />
        <Benediction />
        <Blessings onShower={shower} />
        <CountdownSection />
        <Ceremonies />
        <Venue />
        <Footer />
      </main>
    </>
  );
}

"use client";

import { AnimatePresence, motion, useAnimate, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { COUPLE } from "../lib/invite";
import { bell } from "../lib/sound";
import "./blessings.css";

const EASE = [0.2, 0.8, 0.2, 1] as const;

function BlessingHand({ flip = false }: { flip?: boolean }) {
  // An elder's sleeve and open palm, drawn reaching down from the upper-left.
  return (
    <g transform={flip ? "scale(-1 1)" : undefined}>
      <path
        d="M-150 -170 C-90 -120 -50 -70 -14 -22"
        stroke="#e9d2a2"
        strokeWidth="46"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M-150 -170 C-90 -120 -50 -70 -14 -22"
        stroke="#c99a3a"
        strokeWidth="46"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="2 14"
        opacity=".35"
      />
      <path
        d="M-168 -150 C-108 -100 -68 -52 -34 -8"
        stroke="#b8862c"
        strokeWidth="3"
        fill="none"
        opacity=".7"
      />
      {/* bangles */}
      {[0, 7, 14].map((d) => (
        <ellipse
          key={d}
          cx={-26 + d * 0.55}
          cy={-34 + d * 0.75}
          rx="6"
          ry="17"
          transform={`rotate(-40 ${-26 + d * 0.55} ${-34 + d * 0.75})`}
          fill="none"
          stroke={d === 7 ? "#b3243c" : "#d9a441"}
          strokeWidth="3.5"
        />
      ))}
      {/* palm resting on the head */}
      <path
        d="M-16 -26 C0 -34 26 -30 44 -14 C56 -4 58 6 50 10 C40 14 22 10 6 8 C-8 6 -22 -6 -16 -26Z"
        fill="#e2a982"
      />
      <g stroke="#c98b64" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M14 -12 C26 -8 38 -2 48 6" />
        <path d="M10 -2 C22 0 34 4 44 10" />
        <path d="M18 -22 C30 -18 40 -10 50 -2" />
      </g>
    </g>
  );
}

function Eyes({
  cx,
  cy,
  gap,
  lashes = false,
}: {
  cx: number;
  cy: number;
  gap: number;
  lashes?: boolean;
}) {
  return (
    <motion.g
      style={{ transformOrigin: `${cx}px ${cy}px` }}
      animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
      transition={{
        duration: 4.5,
        times: [0, 0.9, 0.93, 0.96, 1],
        repeat: Infinity,
      }}
    >
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={cx + s * gap} cy={cy} rx="6.5" ry="8" fill="#2a1712" />
          <circle cx={cx + s * gap + 2} cy={cy - 3} r="2.2" fill="#fff" />
          {lashes && (
            <path
              d={`M${cx + s * gap + s * 5} ${cy - 5} l${s * 5} -3`}
              stroke="#2a1712"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </g>
      ))}
    </motion.g>
  );
}

function CoupleIllustration({
  play,
  blessings,
}: {
  play: boolean;
  blessings: number;
}) {
  const [scope, animate] = useAnimate<SVGSVGElement>();

  // Each blessing: the elders' hands pat down, then the couple nods in thanks.
  useEffect(() => {
    if (blessings === 0) return;
    animate(
      ".elder-hand",
      { y: [0, -26, 4, -14, 0] },
      { duration: 1.1, ease: "easeInOut" },
    );
    animate(
      ".bride-head",
      { rotate: [0, 8, -2, 7, 0], y: [0, 9, 0, 7, 0] },
      { duration: 1.5, delay: 0.7, ease: "easeInOut" },
    );
    animate(
      ".groom-head",
      { rotate: [0, -8, 2, -7, 0], y: [0, 9, 0, 7, 0] },
      { duration: 1.5, delay: 0.8, ease: "easeInOut" },
    );
  }, [blessings, animate]);

  const frame =
    "M40 640 V240 C40 115 160 30 300 30 C440 30 560 115 560 240 V640Z";
  return (
    <svg
      ref={scope}
      viewBox="0 0 600 640"
      className="w-full h-auto"
      role="img"
      aria-label={`Elders blessing ${COUPLE.bride} and ${COUPLE.groom}, who stand arm in arm`}
    >
      <defs>
        <radialGradient id="halo" cx=".5" cy=".4" r=".55">
          <stop offset="0" stopColor="#fff1cf" />
          <stop offset=".6" stopColor="#f7dca6" stopOpacity=".5" />
          <stop offset="1" stopColor="#f7dca6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lehenga" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4532f" />
          <stop offset="1" stopColor="#9c3a22" />
        </linearGradient>
        <linearGradient id="chunri" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9592f" />
          <stop offset="1" stopColor="#b8401f" />
        </linearGradient>
        <linearGradient id="sherwani" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f7eedf" />
          <stop offset="1" stopColor="#e6d8bf" />
        </linearGradient>
        <pattern
          id="butti"
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
        >
          <rect width="14" height="14" fill="#a8242f" />
          <circle cx="7" cy="7" r="2.6" fill="#9cb85a" />
          <circle cx="7" cy="7" r="1.1" fill="#f2d77a" />
        </pattern>
        <clipPath id="frame">
          <path d={frame} />
        </clipPath>
      </defs>

      <path d={frame} fill="#fff8ea" />
      <g clipPath="url(#frame)">
        <motion.circle
          cx="300"
          cy="250"
          r="250"
          fill="url(#halo)"
          animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "300px 250px" }}
        />
        <motion.g
          style={{ transformOrigin: "300px 230px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          opacity=".2"
        >
          {Array.from({ length: 18 }, (_, i) => (
            <path
              key={i}
              d="M300 230 L292 -60 L308 -60Z"
              fill="#e8c877"
              transform={`rotate(${i * 20} 300 230)`}
            />
          ))}
        </motion.g>
        <ellipse
          cx="300"
          cy="618"
          rx="210"
          ry="16"
          fill="#e8c877"
          opacity=".35"
        />

        {/* ---- the couple, arm in arm ---- */}
        <motion.g
          initial={{ opacity: 0, y: 50 }}
          animate={play ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <motion.g
            style={{ transformOrigin: "300px 620px" }}
            animate={{ rotate: [-0.8, 0.8, -0.8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* ===== Bride (Bobby) ===== */}
            {/* chunri flowing behind her */}
            <path
              d="M168 168 C160 110 290 104 284 168 C300 300 318 470 330 612 L118 612 C128 470 150 300 168 168Z"
              fill="url(#chunri)"
            />
            <path
              d="M168 168 C150 300 128 470 118 612 M284 168 C300 300 318 470 330 612"
              stroke="#f2c14e"
              strokeWidth="5"
              fill="none"
            />

            {/* lehenga */}
            <path
              d="M186 338 L268 338 C292 420 318 520 326 606 L124 606 C132 520 160 420 186 338Z"
              fill="url(#lehenga)"
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M${202 + i * 13} 350 C${196 + i * 13} 450 ${170 + i * 26} 540 ${160 + i * 30} 600`}
                stroke="#8a3019"
                strokeWidth="1.6"
                fill="none"
                opacity=".55"
              />
            ))}
            <path
              d="M130 560 C190 572 270 572 322 560 L326 606 L124 606Z"
              fill="#8a3019"
            />
            <path
              d="M130 560 C190 572 270 572 322 560"
              stroke="#f2c14e"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M126 590 C190 600 270 600 324 590"
              stroke="#f2c14e"
              strokeWidth="2"
              fill="none"
              strokeDasharray="2 5"
            />

            {/* blouse with butti print */}
            <path
              d="M190 262 C200 252 250 252 262 262 L272 340 L182 340Z"
              fill="url(#butti)"
            />
            {/* dupatta drape across */}
            <path
              d="M188 262 C220 300 262 360 300 470 L282 478 C250 380 214 318 180 282Z"
              fill="#c9502c"
              opacity=".92"
            />
            <path
              d="M188 262 C220 300 262 360 300 470"
              stroke="#f2c14e"
              strokeWidth="3"
              fill="none"
            />

            {/* bride's left arm, hand resting on lehenga */}
            <path
              d="M190 270 C172 300 170 360 192 404"
              stroke="url(#butti)"
              strokeWidth="24"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="196" cy="412" r="11" fill="#f3c19c" />
            <ellipse
              cx="190"
              cy="398"
              rx="11"
              ry="4"
              fill="none"
              stroke="#f2c14e"
              strokeWidth="3"
            />
            {/* bride's right arm, hooked through the groom's */}
            <path
              d="M262 272 C284 300 302 340 330 372"
              stroke="url(#butti)"
              strokeWidth="24"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse
              cx="324"
              cy="366"
              rx="5"
              ry="12"
              transform="rotate(-40 324 366)"
              fill="none"
              stroke="#f2c14e"
              strokeWidth="3"
            />

            {/* neck + necklace */}
            <rect x="214" y="238" width="24" height="24" fill="#f0bd97" />
            <path
              d="M206 258 C216 274 236 274 246 258"
              stroke="#f2c14e"
              strokeWidth="6"
              fill="none"
            />
            <path
              d="M210 262 C218 284 234 284 242 262"
              stroke="#c0392b"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="1 4"
              strokeLinecap="round"
            />

            <g className="nod-head bride-head">
              {/* head */}
              <ellipse cx="226" cy="202" rx="56" ry="53" fill="#f6caa5" />
              <path
                d="M170 206 C166 150 200 136 226 136 C252 136 286 150 282 206 C274 176 252 164 226 166 C200 164 178 176 170 206Z"
                fill="#2b1a14"
              />
              <path d="M226 138 V164" stroke="#c0392b" strokeWidth="3" />
              {/* chunri edge over her head */}
              <path
                d="M166 226 C150 150 192 112 226 112 C260 112 302 150 286 226"
                stroke="url(#chunri)"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M166 226 C150 150 192 112 226 112 C260 112 302 150 286 226"
                stroke="#f2c14e"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="1 6"
                strokeLinecap="round"
              />
              {/* matha patti */}
              <path
                d="M180 172 C200 186 252 186 272 172"
                stroke="#f2c14e"
                strokeWidth="3"
                fill="none"
              />
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <circle
                  key={i}
                  cx={186 + i * 13}
                  cy={176 + Math.sin((i / 6) * Math.PI) * 9}
                  r="2.6"
                  fill={i % 2 ? "#9cb85a" : "#c0392b"}
                />
              ))}
              <path d="M226 136 V176" stroke="#f2c14e" strokeWidth="2.4" />
              <path
                d="M218 178 L226 194 L234 178Z"
                fill="#f2c14e"
                stroke="#a87a26"
                strokeWidth=".8"
              />
              {/* face */}
              <Eyes cx={226} cy={214} gap={21} lashes />
              <path
                d="M216 240 C222 246 230 246 236 240 C230 236 222 236 216 240Z"
                fill="#d6455a"
              />
              <ellipse
                cx="190"
                cy="232"
                rx="10"
                ry="6"
                fill="#f08c8c"
                opacity=".45"
              />
              <ellipse
                cx="262"
                cy="232"
                rx="10"
                ry="6"
                fill="#f08c8c"
                opacity=".45"
              />
              <circle cx="226" cy="200" r="2.8" fill="#c0392b" />
              {/* jhumkas */}
              {[170, 282].map((x) => (
                <g key={x}>
                  <circle cx={x} cy={222} r="4" fill="#f2c14e" />
                  <path
                    d={`M${x - 7} 236 C${x - 7} 226 ${x + 7} 226 ${x + 7} 236Z`}
                    fill="#f2c14e"
                    stroke="#a87a26"
                    strokeWidth=".8"
                  />
                </g>
              ))}
            </g>

            {/* ===== Groom (Manish) ===== */}
            {/* churidar + juttis */}
            <rect x="352" y="560" width="24" height="44" fill="#ddd2bf" />
            <rect x="386" y="560" width="24" height="44" fill="#d5c9b4" />
            <ellipse cx="362" cy="608" rx="18" ry="7" fill="#7a4a2a" />
            <ellipse cx="400" cy="608" rx="18" ry="7" fill="#7a4a2a" />
            {/* sherwani */}
            <path
              d="M336 272 C346 260 364 256 381 256 C398 256 416 260 426 272 L446 566 L316 566Z"
              fill="url(#sherwani)"
            />
            <path d="M381 262 V566" stroke="#d4a646" strokeWidth="3" />
            {[300, 340, 380, 420, 460].map((y) => (
              <circle key={y} cx="381" cy={y} r="3" fill="#d4a646" />
            ))}
            <path
              d="M366 258 L381 272 L396 258"
              stroke="#9cb85a"
              strokeWidth="5"
              fill="none"
              strokeLinejoin="round"
            />
            {/* maroon stole over his shoulder */}
            <path
              d="M408 262 C424 330 428 450 432 560 L408 560 C404 450 398 340 388 268Z"
              fill="#8e1b2b"
            />
            <path
              d="M412 270 C424 340 426 450 428 556"
              stroke="#d94a5c"
              strokeWidth="4"
              fill="none"
            />
            {/* groom's right arm down, at his side */}
            <path
              d="M426 276 C442 320 448 400 448 456"
              stroke="#d6c4a2"
              strokeWidth="30"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M426 276 C442 320 448 400 448 456"
              stroke="#efe4d0"
              strokeWidth="25"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="448" cy="468" r="11" fill="#f3c19c" />
            {/* groom's left arm, bent, the bride's arm through it */}
            <path
              d="M338 278 C320 320 316 360 326 384 C340 396 360 398 378 392"
              stroke="#d6c4a2"
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M338 278 C320 320 316 360 326 384 C340 396 360 398 378 392"
              stroke="#f1e7d4"
              strokeWidth="25"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="384" cy="390" r="11" fill="#f3c19c" />
            {/* the stole draped over his forearm */}
            <path
              d="M346 392 C360 402 378 400 392 394 C397 420 399 452 392 482 C378 472 364 476 352 486 C350 452 348 420 346 392Z"
              fill="#8e1b2b"
            />
            <path
              d="M392 482 C378 472 364 476 352 486"
              stroke="#d94a5c"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M370 400 C371 430 371 460 370 478"
              stroke="#6e1220"
              strokeWidth="1.5"
              fill="none"
              opacity=".6"
            />
            {/* bride's hand resting on his arm */}
            <circle cx="336" cy="380" r="10" fill="#f3c19c" />

            {/* neck */}
            <rect x="369" y="232" width="24" height="28" fill="#f0bd97" />
            <g className="nod-head groom-head">
              {/* head */}
              <ellipse cx="381" cy="190" rx="60" ry="56" fill="#f6caa5" />
              <ellipse cx="322" cy="196" rx="9" ry="13" fill="#f0bd97" />
              <ellipse cx="440" cy="196" rx="9" ry="13" fill="#f0bd97" />
              <path
                d="M327 168 C328 180 330 186 332 192 M435 168 C434 180 432 186 430 192"
                stroke="#2b1a14"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <Eyes cx={381} cy={196} gap={22} />
              <path
                d="M352 178 q8 -5 16 0 M394 178 q8 -5 16 0"
                stroke="#2b1a14"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M368 222 Q381 234 394 222"
                stroke="#6b2a1f"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <ellipse
                cx="346"
                cy="214"
                rx="10"
                ry="6"
                fill="#f08c8c"
                opacity=".4"
              />
              <ellipse
                cx="416"
                cy="214"
                rx="10"
                ry="6"
                fill="#f08c8c"
                opacity=".4"
              />
              <path
                d="M381 156 V170"
                stroke="#c0392b"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* safa */}
              <path
                d="M318 160 C300 106 330 62 388 60 C446 58 466 106 446 160 C410 146 352 146 318 160Z"
                fill="#efe5d2"
              />
              {[0, 1, 2, 3, 4].map((i) => (
                <path
                  key={i}
                  d={`M${320 + i * 4} ${150 - i * 18} C${360} ${130 - i * 20} ${420} ${126 - i * 18} ${448 - i * 4} ${144 - i * 18}`}
                  stroke="#cfc0a3"
                  strokeWidth="2.4"
                  fill="none"
                />
              ))}
              <path
                d="M404 58 C416 40 440 44 438 62 C430 56 416 56 404 58Z"
                fill="#e2d6bf"
              />
              {/* kalgi brooch with pearl strings */}
              <path
                d="M424 98 C420 74 430 54 444 44 C440 62 436 80 430 98Z"
                fill="#9cb85a"
              />
              <circle
                cx="424"
                cy="106"
                r="12"
                fill="#f2c14e"
                stroke="#a87a26"
              />
              <circle cx="424" cy="106" r="6.5" fill="#1f4fa8" />
              <circle cx="424" cy="106" r="2.2" fill="#fff" />
              <path
                d="M412 112 C380 130 348 140 324 140"
                stroke="#f3efe6"
                strokeWidth="3.5"
                fill="none"
                strokeDasharray="0.1 6"
                strokeLinecap="round"
              />
              <path
                d="M414 120 C384 140 352 152 326 154"
                stroke="#9cb85a"
                strokeWidth="3.5"
                fill="none"
                strokeDasharray="0.1 6"
                strokeLinecap="round"
              />
            </g>
          </motion.g>
        </motion.g>

        {/* ---- elders' hands descend to bless ---- */}
        <motion.g
          initial={{ opacity: 0, x: -90, y: -110 }}
          animate={play ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 1.6, delay: 1, ease: EASE }}
        >
          <g transform="translate(212 104) rotate(4)">
            <g className="elder-hand">
              <BlessingHand />
            </g>
          </g>
        </motion.g>
        <motion.g
          initial={{ opacity: 0, x: 90, y: -110 }}
          animate={play ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 1.6, delay: 1.35, ease: EASE }}
        >
          <g transform="translate(396 64) rotate(-6)">
            <g className="elder-hand">
              <BlessingHand flip />
            </g>
          </g>
        </motion.g>

        {/* akshat & petals sprinkled from above */}
        {play &&
          Array.from({ length: 22 }, (_, i) => {
            const x = 140 + ((i * 53) % 320);
            const petal = i % 3 !== 0;
            return (
              <motion.g
                key={i}
                initial={{ y: -40, x, opacity: 0, rotate: 0 }}
                animate={{
                  y: [-40, 640],
                  opacity: [0, 1, 1, 0],
                  rotate: 360 * (i % 2 ? 1 : -1),
                }}
                transition={{
                  duration: 5 + (i % 5),
                  delay: 2.4 + i * 0.35,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {petal ? (
                  <path
                    d="M0 -6 C5 -3 6 3 0 7 C-6 3 -5 -3 0 -6Z"
                    fill={["#e98aa0", "#f6c6cf", "#e8962f", "#c9506a"][i % 4]}
                  />
                ) : (
                  <ellipse
                    rx="1.8"
                    ry="3.4"
                    fill="#fff3d0"
                    stroke="#e8c877"
                    strokeWidth=".6"
                  />
                )}
              </motion.g>
            );
          })}
      </g>

      <path
        d="M40 640 V240 C40 115 160 30 300 30 C440 30 560 115 560 240 V640"
        fill="none"
        stroke="url(#gold)"
        strokeWidth="3"
      />
      <path
        d="M54 640 V242 C54 127 168 44 300 44 C432 44 546 127 546 242 V640"
        fill="none"
        stroke="url(#gold)"
        strokeWidth="1"
        opacity=".6"
      />
    </svg>
  );
}

export default function Blessings({ onShower }: { onShower: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [blessings, setBlessings] = useState(0);
  const [thanks, setThanks] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(onShower, 2600);
    return () => clearTimeout(t);
  }, [inView, onShower]);

  const bless = useCallback(() => {
    setBlessings((n) => n + 1);
    [659.25, 783.99, 1046.5].forEach((f, i) => bell(f, i * 0.12, 0.09));
    setTimeout(onShower, 500);
    setTimeout(() => setThanks(Date.now()), 900);
  }, [onShower]);

  useEffect(() => {
    if (thanks === null) return;
    const t = setTimeout(() => setThanks(null), 2600);
    return () => clearTimeout(t);
  }, [thanks]);

  return (
    <section ref={ref} className="relative px-4 py-20 sm:py-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-[var(--gold)]/70 bg-[linear-gradient(135deg,#fffaf0,#f8ecd5)] text-[var(--ink)] shadow-[0_60px_90px_-50px_rgba(0,0,0,.9)]">
        <div className="pointer-events-none absolute inset-2 rounded-[22px] border border-[var(--gold)]/35" />
        <div className="grid items-center gap-6 md:grid-cols-[1.1fr_1fr]">
          <motion.div
            className="px-4 pt-8 md:pl-10 md:pt-10"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <div className="relative">
              <CoupleIllustration play={inView} blessings={blessings} />
              <AnimatePresence>
                {thanks !== null && (
                  <motion.div
                    key={thanks}
                    className="thanks-bubble"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    <span
                      lang="hi"
                      className="font-hindi text-xl text-[var(--maroon)]"
                    >
                      धन्यवाद! 🙏
                    </span>
                    <span className="block text-sm italic text-[var(--ink-soft)]">
                      Thank you for your blessings
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 mb-2 flex flex-col items-center gap-3">
              <motion.button
                type="button"
                onClick={bless}
                className="bless-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                animate={
                  inView && blessings === 0
                    ? {
                        boxShadow: [
                          "0 0 0 0 rgba(201,80,106,.55)",
                          "0 0 0 16px rgba(201,80,106,0)",
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 1.8,
                  repeat: blessings === 0 ? Infinity : 0,
                }}
              >
                <svg viewBox="0 0 48 48" className="size-7" aria-hidden="true">
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 40 V22 a3 3 0 0 1 6 0 V10 a3 3 0 0 1 6 0 v12 V12 a3 3 0 0 1 6 0 v14 v-8 a3 3 0 0 1 6 0 v10 c0 8-5 12-12 12 h-4 c-5 0-8-2-10-6 l-6-9 a3 3 0 0 1 5-3 z" />
                  </g>
                </svg>
                <span className="flex flex-col items-start leading-tight">
                  <span
                    lang="hi"
                    className="font-hindi text-xl normal-case tracking-normal"
                  >
                    आशीर्वाद दें
                  </span>
                  <span>Give Your Blessing</span>
                </span>
              </motion.button>
              <div className="text-center" aria-live="polite">
                {blessings === 0 ? (
                  <>
                    <p
                      lang="hi"
                      className="font-hindi text-lg text-[var(--maroon)]"
                    >
                      कृपया आशीर्वाद देने के लिए क्लिक करें
                    </p>
                    <p className="text-base italic text-[var(--ink-soft)]">
                      Please click to give blessing
                    </p>
                  </>
                ) : (
                  <p className="text-base italic text-[var(--ink-soft)]">
                    You have blessed them {blessings}{" "}
                    {blessings === 1 ? "time" : "times"} 🌸
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="px-7 pb-10 md:py-12 md:pr-12"
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={{
              show: {
                transition: { staggerChildren: 0.18, delayChildren: 0.4 },
              },
            }}
          >
            {[
              <div key="rule" className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-[var(--gold)]" />
                <span className="h-px flex-1 bg-gradient-to-r from-[var(--gold)] to-transparent" />
              </div>,
              <p
                key="eyebrow"
                className="mt-5 font-display text-[11px] tracking-[0.45em] uppercase text-[var(--gold)]"
              >
                Ashirwad · आशीर्वाद
              </p>,
              <h2 key="h" className="mt-3 leading-[1.05]">
                <span className="block font-display text-[clamp(30px,5.4vw,48px)] text-[var(--burgundy)]">
                  Blessings that
                </span>
                <span className="block font-script text-[clamp(46px,8vw,76px)] text-[#c45a6c]">
                  last a lifetime
                </span>
              </h2>,
              <p
                key="hi"
                lang="hi"
                className="mt-3 font-hindi text-xl text-[var(--maroon)]"
              >
                बड़ों का आशीर्वाद, जीवन भर का साथ
              </p>,
              <p
                key="p"
                className="mt-4 text-lg leading-relaxed text-[var(--ink-soft)]"
              >
                Hand in hand, {COUPLE.bride} &amp; {COUPLE.groom} seek the
                blessings of their elders as they begin a lifetime together.
              </p>,
              <div key="rule2" className="mt-8 flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-l from-[var(--gold)] to-transparent" />
                <span className="size-1.5 rounded-full bg-[var(--gold)]" />
              </div>,
            ].map((child) => (
              <motion.div
                key={child.key}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.9, ease: EASE },
                  },
                }}
              >
                {child}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

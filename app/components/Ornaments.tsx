import type { SVGProps } from "react";

export function GoldDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe7a8" />
          <stop offset=".45" stopColor="#d4a548" />
          <stop offset=".7" stopColor="#f6dc93" />
          <stop offset="1" stopColor="#8a6420" />
        </linearGradient>
        <linearGradient id="petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6a7b9" />
          <stop offset=".55" stopColor="#c23a57" />
          <stop offset="1" stopColor="#6e1022" />
        </linearGradient>
        <linearGradient id="petal-in" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde2e8" />
          <stop offset="1" stopColor="#d4607a" />
        </linearGradient>
        <radialGradient id="eye" cx=".5" cy=".55" r=".55">
          <stop offset="0" stopColor="#13265c" />
          <stop offset="1" stopColor="#2d58b8" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/** Concentric, procedurally drawn mandala in gold line-work. */
export function Mandala(props: SVGProps<SVGSVGElement>) {
  const ring = (count: number, render: (i: number, a: number) => React.ReactNode) =>
    Array.from({ length: count }, (_, i) => render(i, (360 / count) * i));
  return (
    <svg viewBox="-200 -200 400 400" fill="none" stroke="url(#gold)" aria-hidden="true" {...props}>
      <circle r="196" strokeWidth="1" />
      <circle r="188" strokeWidth=".6" strokeDasharray="2 5" />
      {ring(48, (i, a) => (
        <path key={`o${i}`} transform={`rotate(${a})`} d="M0 -186 C8 -176 8 -164 0 -154 C-8 -164 -8 -176 0 -186Z" strokeWidth=".9" />
      ))}
      <circle r="150" strokeWidth="1.2" />
      {ring(24, (i, a) => (
        <g key={`p${i}`} transform={`rotate(${a})`}>
          <path d="M0 -148 C18 -128 18 -102 0 -84 C-18 -102 -18 -128 0 -148Z" strokeWidth="1" />
          <path d="M0 -138 C9 -124 9 -106 0 -94 C-9 -106 -9 -124 0 -138Z" strokeWidth=".6" />
          <circle cy="-158" r="2.2" fill="url(#gold)" stroke="none" />
        </g>
      ))}
      <circle r="80" strokeWidth="1" />
      <circle r="74" strokeWidth=".6" strokeDasharray="1 4" />
      {ring(16, (i, a) => (
        <path key={`i${i}`} transform={`rotate(${a})`} d="M0 -72 C14 -58 14 -42 0 -30 C-14 -42 -14 -58 0 -72Z" strokeWidth="1" />
      ))}
      {ring(8, (i, a) => (
        <path key={`c${i}`} transform={`rotate(${a + 22.5})`} d="M0 -28 C7 -20 7 -10 0 -4 C-7 -10 -7 -20 0 -28Z" strokeWidth=".9" />
      ))}
      <circle r="5" fill="url(#gold)" stroke="none" />
    </svg>
  );
}

export function Lotus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 72" aria-hidden="true" {...props}>
      <g stroke="#c99a3a" strokeWidth="1.1">
        <path d="M60 64 C40 58 14 52 4 34 C24 32 46 44 60 64Z" fill="url(#petal)" />
        <path d="M60 64 C80 58 106 52 116 34 C96 32 74 44 60 64Z" fill="url(#petal)" />
        <path d="M60 64 C44 52 26 34 26 14 C44 22 56 42 60 64Z" fill="url(#petal)" />
        <path d="M60 64 C76 52 94 34 94 14 C76 22 64 42 60 64Z" fill="url(#petal)" />
        <path d="M60 64 C48 46 46 22 60 4 C74 22 72 46 60 64Z" fill="url(#petal-in)" />
      </g>
      <path d="M24 66 Q60 74 96 66" fill="none" stroke="url(#gold)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Feather(props: SVGProps<SVGSVGElement>) {
  const barbs = [70, 84, 98, 112, 126];
  return (
    <svg viewBox="0 0 60 160" aria-hidden="true" {...props}>
      <path d="M30 158 C30 120 30 90 31 40" stroke="#b58a32" strokeWidth="1.6" fill="none" />
      <g stroke="#3a9a73" strokeWidth=".9" fill="none" opacity=".85">
        {barbs.map((y, i) => (
          <g key={y}>
            <path d={`M30 ${y} C${18 + i * 2} ${y - 4} ${8 + i * 2} ${y - 12} ${4 + i * 2} ${y - 24 + i * 2}`} />
            <path d={`M30 ${y} C${42 - i * 2} ${y - 4} ${52 - i * 2} ${y - 12} ${56 - i * 2} ${y - 24 + i * 2}`} />
          </g>
        ))}
      </g>
      <ellipse cx="30" cy="40" rx="23" ry="34" fill="#1f8a6d" opacity=".92" />
      <ellipse cx="30" cy="42" rx="17" ry="25" fill="url(#gold)" />
      <ellipse cx="30" cy="44" rx="12" ry="17" fill="#0f6b68" />
      <path d="M30 30 C38 32 41 44 38 52 C35 58 25 58 22 52 C19 44 22 32 30 30Z" fill="url(#eye)" />
      <ellipse cx="30" cy="47" rx="3.5" ry="5" fill="#0b1a40" />
    </svg>
  );
}

export function Thali(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <ellipse cx="32" cy="44" rx="27" ry="9" fill="url(#gold)" stroke="#8a6420" />
      <ellipse cx="32" cy="42" rx="20" ry="5.5" fill="#f6e2b0" />
      <circle cx="22" cy="38" r="5" fill="#e3922c" />
      <circle cx="31" cy="35" r="6" fill="#c9506a" />
      <circle cx="41" cy="38" r="5" fill="#e3922c" />
      <path d="M31 29 C29 24 31 20 33 18 C34 22 35 25 31 29Z" fill="#f2a93b">
        <animate attributeName="d" dur="1.4s" repeatCount="indefinite"
          values="M31 29 C29 24 31 20 33 18 C34 22 35 25 31 29Z;M31 29 C28 23 32 19 32 16 C35 21 35 25 31 29Z;M31 29 C29 24 31 20 33 18 C34 22 35 25 31 29Z" />
      </path>
      <circle cx="27" cy="40" r="1.6" fill="#7a1424" />
      <circle cx="36" cy="40" r="1.6" fill="#7a1424" />
    </svg>
  );
}

export function RingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <circle cx="25" cy="40" r="14" fill="none" stroke="url(#gold)" strokeWidth="4" />
      <circle cx="39" cy="40" r="14" fill="none" stroke="url(#gold)" strokeWidth="4" />
      <path d="M39 22 L33 16 L36 10 H42 L45 16Z" fill="#fff3f6" stroke="#c9506a" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M33 16 H45" stroke="#c9506a" />
    </svg>
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent to-[var(--gold)]" />
      <svg viewBox="0 0 40 20" className="h-4 w-8">
        <path d="M20 2 L26 10 L20 18 L14 10Z" fill="url(#gold)" />
        <circle cx="6" cy="10" r="2" fill="url(#gold)" />
        <circle cx="34" cy="10" r="2" fill="url(#gold)" />
      </svg>
      <span className="h-px w-16 sm:w-28 bg-gradient-to-l from-transparent to-[var(--gold)]" />
    </div>
  );
}

export const COUPLE = { bride: "Bobby", groom: "Manish" };

export const INVOCATION = "॥ श्री राधा रानी की असीम कृपा से ॥";
export const INVOCATION_EN = "By the Infinite Grace of Shri Radha Rani";

export const BENEDICTION = [
  "जो कछु करै लाड़ली, लाड़ली कराये सो होय।",
  "लाड़ली करै सो होयगो, निर्भय होय के सोय॥",
];
export const BENEDICTION_EN =
  "Jo kachu karee ladali, ladali karaye so hoye; ladali kare so hoyego, nirbhav hoike soy.";

export const CLOSING ="॥ श्री राधा रानी सदा सहाय ॥";

export const DATE_LONG = "Thursday, 26th November 2026";
export const DATE_SHORT = "26th November 2026";
export const ARRIVAL = "Arrival 12:00 PM Sharp";
export const ARRIVAL_NOTE = "Kindly arrive by 12:00 PM sharp — the ceremonies begin thereafter";

export const VENUE = {
  name: "Rudra Resort",
  locality: "Lalganj, Raebareli",
  state: "Uttar Pradesh",
};
export const VENUE_FULL = `${VENUE.name}, ${VENUE.locality}, ${VENUE.state}`;
const q = encodeURIComponent(VENUE_FULL);
export const MAP_EMBED = `https://maps.google.com/maps?q=${q}&z=14&output=embed`;
export const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
export const MAP_OPEN = `https://www.google.com/maps/search/?api=1&query=${q}`;

export type Ceremony = {
  id: string;
  name: string;
  hindi: string;
  time: string;
  blurb: string;
  icon: "thali" | "rings";
  // UTC instants; IST is UTC+5:30.
  start: string;
  end: string;
};

export const CEREMONIES: Ceremony[] = [
  {
    id: "bariksha-godhbharai",
    name: "Bariksha & Godhbharai Ritual",
    hindi: "बरिक्षा एवं गोद भराई",
    time: "Begins after 12:00 PM",
    blurb: "Sacred blessings as two families come together",
    icon: "thali",
    start: "2026-11-26T06:30:00Z",
    end: "2026-11-26T09:30:00Z",
  },
  {
    id: "ring-ceremony",
    name: "Ring Ceremony",
    hindi: "सगाई",
    time: "Following the Rituals",
    blurb: "An exchange of rings, a promise for a lifetime",
    icon: "rings",
    start: "2026-11-26T06:30:00Z",
    end: "2026-11-26T12:30:00Z",
  },
];

export const CELEBRATION_START = new Date(CEREMONIES[0].start).getTime();

const icsDate = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsEsc = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

export function downloadIcs(c: Ceremony) {
  const couple = `${COUPLE.bride} & ${COUPLE.groom}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bobby & Manish//Ring Ceremony//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${c.id}-20261126@bobby-manish`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(c.start)}`,
    `DTEND:${icsDate(c.end)}`,
    `SUMMARY:${icsEsc(`${c.name} (${c.hindi}) — ${couple}`)}`,
    `LOCATION:${icsEsc(VENUE_FULL)}`,
    `DESCRIPTION:${icsEsc(`${INVOCATION}\n${c.name} — ${c.time}\n${ARRIVAL_NOTE}\n${couple}`)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEsc(c.name)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const url = URL.createObjectURL(
    new Blob([lines.join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `${c.id}-bobby-manish.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

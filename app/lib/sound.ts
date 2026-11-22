// Background song plus temple-bell chimes synthesised with Web Audio.
// The song is read from SONG_SRC; if that file is missing the page stays quiet
// apart from the bells.

export const SONG_SRC = "/music/chanakya.mp3";
const SONG_VOLUME = 0.6;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
let song: HTMLAudioElement | null = null;
// iOS ignores HTMLMediaElement.volume, so the song's level is set through Web Audio.
let songGain: GainNode | null = null;
let songMissing = false;
let pauseTimer: ReturnType<typeof setTimeout> | null = null;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;

    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.34;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.38;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2400;

    master.connect(ctx.destination);
    master.connect(delay);
    delay.connect(tone);
    tone.connect(feedback);
    feedback.connect(delay);
    tone.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, master: master! };
}

export function bell(freq: number, delay = 0, vol = 0.12) {
  if (!enabled) return;
  const { ctx, master } = audio();
  const t = ctx.currentTime + delay;
  for (const [mult, g] of [[1, vol], [2.76, vol * 0.3], [5.4, vol * 0.08]] as const) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.frequency.value = freq * mult;
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(g, t + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 3.6 / mult);
    osc.connect(env).connect(master);
    osc.start(t);
    osc.stop(t + 3.8);
  }
}

export function flourish() {
  [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98].forEach((f, i) => bell(f, i * 0.14, 0.1));
}

function fadeSong(to: number, then?: () => void) {
  if (!song || !songGain || !ctx) return;
  if (pauseTimer) clearTimeout(pauseTimer);
  songGain.gain.cancelScheduledValues(ctx.currentTime);
  songGain.gain.setTargetAtTime(to, ctx.currentTime, 0.35);
  if (then) pauseTimer = setTimeout(then, 1400);
}

function getSong() {
  if (!song && !songMissing) {
    song = new Audio(SONG_SRC);
    song.loop = true;
    song.preload = "auto";
    const { ctx } = audio();
    songGain = ctx.createGain();
    songGain.gain.value = 0;
    ctx.createMediaElementSource(song).connect(songGain).connect(ctx.destination);
    song.addEventListener(
      "error",
      () => {
        songMissing = true;
        song = null;
        songGain = null;
        console.warn(`Background song not found at ${SONG_SRC}`);
      },
      { once: true },
    );
  }
  return song;
}

export function setSound(on: boolean) {
  enabled = on;
  const { ctx, master } = audio();
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(on ? 0.7 : 0, ctx.currentTime, 0.4);
  if (on) {
    getSong()?.play().then(() => fadeSong(SONG_VOLUME), () => {});
  } else {
    fadeSong(0, () => song?.pause());
  }
}

export function pauseForVisibility(hidden: boolean) {
  if (!ctx || !enabled) return;
  if (hidden) {
    void ctx.suspend();
    song?.pause();
  } else {
    void ctx.resume();
    void song?.play().catch(() => {});
  }
}

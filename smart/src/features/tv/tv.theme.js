/*
 * ====================================================================
 *  TV THEME  -  colors for the TV screens (change colors HERE only)
 * ====================================================================
 *
 *  Path: src/features/tv/tv.theme.js
 *
 *  Brand color: INDUSTRIAL BLUE (blue / sky on a deep navy background).
 *  Status colors keep their meaning:
 *     green = running, red = stopped, amber = error, grey = loading.
 *
 *  All class names are written out in full so Tailwind keeps them.
 *  (Make sure your tailwind.config content list includes src/features/**)
 */

/* Page background + shared surface colors */
export const TV_BRAND = {
  // Whole screen
  page: "bg-[#030816] text-white",

  // Soft blue light in the top-right corner
  orb: "bg-blue-500/20",

  // Faint blueprint grid drawn over the background
  gridImage:
    "linear-gradient(rgba(96,165,250,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.05) 1px, transparent 1px)",

  // Cards
  card: "bg-gradient-to-br from-blue-900/40 via-slate-900/60 to-slate-950/80",
  panel: "bg-blue-950/25",

  // Text
  label: "text-blue-200/80",
  muted: "text-slate-400",
  faint: "text-slate-500",

  // Small icon boxes and tags
  iconBox: "bg-blue-500/15 text-blue-300",
  tag: "bg-blue-500/15 text-blue-100 ring-1 ring-blue-400/30",

  // Header divider line
  divider: "bg-gradient-to-r from-transparent via-blue-400/40 to-transparent",

  // Footer progress track + slide indicators
  track: "bg-blue-950",
  chipActive: "bg-blue-500/20 text-white ring-1 ring-blue-300/40",
  chipIdle: "bg-white/[0.04] text-slate-500",
};

/*
 * One theme per machine status.
 *   glow    background light at the top of the screen
 *   accent  text color of the message strip
 *   number  color of the big numbers
 *   border  card outline
 *   edge    gradient line along the top of each number card
 *   pill    status badge
 *   dot     small status dot
 *   bar     progress bar fill
 *   pulse   true = dot blinks
 */
export const THEMES = {
  running: {
    label: "RUNNING",
    glow: "from-blue-600/30",
    accent: "text-emerald-400",
    number: "text-[#00d593]",
    border: "border-blue-400/25",
    edge: "from-blue-500 via-sky-300 to-blue-500",
    pill: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40",
    dot: "bg-emerald-400",
    bar: "bg-gradient-to-r from-blue-500 to-sky-300",
    pulse: false,
  },
  stopped: {
    label: "MACHINE STOPPED",
    glow: "from-rose-600/35",
    accent: "text-rose-400",
    number: "text-rose-300",
    border: "border-rose-400/40",
    edge: "from-rose-600 via-rose-400 to-rose-600",
    pill: "bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/50",
    dot: "bg-rose-400",
    bar: "bg-rose-400",
    pulse: true,
  },
  error: {
    label: "API ERROR",
    glow: "from-amber-500/25",
    accent: "text-amber-300",
    number: "text-amber-200",
    border: "border-amber-400/30",
    edge: "from-amber-500 via-amber-300 to-amber-500",
    pill: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/40",
    dot: "bg-amber-400",
    bar: "bg-amber-400",
    pulse: true,
  },
  "time-error": {
    label: "CHECK TIME",
    glow: "from-amber-500/25",
    accent: "text-amber-300",
    number: "text-amber-200",
    border: "border-amber-400/30",
    edge: "from-amber-500 via-amber-300 to-amber-500",
    pill: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/40",
    dot: "bg-amber-400",
    bar: "bg-amber-400",
    pulse: true,
  },
  loading: {
    label: "LOADING",
    glow: "from-slate-500/20",
    accent: "text-slate-300",
    number: "text-slate-300",
    border: "border-slate-400/20",
    edge: "from-slate-600 via-slate-400 to-slate-600",
    pill: "bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/30",
    dot: "bg-slate-400",
    bar: "bg-slate-400",
    pulse: true,
  },
};
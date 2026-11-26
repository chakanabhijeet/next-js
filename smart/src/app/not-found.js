"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/common/theme-toggle";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  Clock3,
  Cog,
  Cpu,
  Factory,
  LayoutDashboard,
  Package,
  Siren,
  UserCog,
  UserPlus,
  Wrench,
  X,
} from "lucide-react";

const QUICK_LINKS = [
  { label: "Dashboard", hint: "Live assembly lines", href: "/dashboard", icon: LayoutDashboard },
  { label: "Monitoring", hint: "Hourly production", href: "/monitoring", icon: BarChart3 },
  { label: "Moulding", hint: "Injection machines", href: "/monitoring/moulding", icon: Factory },
  { label: "Tenants", hint: "Create and verify", href: "/tenants", icon: Building2 },
  { label: "Roles", hint: "Add or delete roles", href: "/roles", icon: UserCog },
  { label: "Add person", hint: "Register an employee", href: "/employees/create", icon: UserPlus },
];

const GEAR_QUIPS = [
  "Torque check: OK.",
  "Lubricated and ready.",
  "Still no page here.",
  "That is a lot of spinning for a missing page.",
  "Try the dashboard. It is running.",
];

const PART_ICONS = [Cog, Package, Cpu, Wrench];

const HEADLINE_TEXT = "This page is under development.";

/* ============================================================
   ANIMATIONS
   ============================================================ */
const NF_CSS = `
@keyframes nf-spin    { to { transform: rotate(360deg); } }
@keyframes nf-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
@keyframes nf-belt    { to { background-position-x: 28px; } }
@keyframes nf-conveyor{ from{left:-4.5rem} to{left:calc(100% + 1rem)} }
@keyframes nf-catch   { 0%{transform:scale(1);opacity:1} 40%{transform:scale(1.5) rotate(12deg);opacity:1} 100%{transform:scale(0.2) translateY(-30px);opacity:0} }
@keyframes nf-quip    { from{opacity:0;transform:translateY(6px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes nf-flash   { 0%,100%{background-color:#dc2626} 50%{background-color:#fca5a5} }
@keyframes nf-dot     { 0%,100%{opacity:1} 50%{opacity:0.25} }
@keyframes nf-rise    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes nf-particle{ 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
@keyframes nf-scan    { 0%{top:-8px;opacity:0.9} 100%{top:100%;opacity:0} }
@keyframes nf-ripple  { 0%{transform:scale(0);opacity:0.5} 100%{transform:scale(4);opacity:0} }
@keyframes nf-cursor  { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes nf-pfield  { 0%{transform:translateY(0) translateX(0);opacity:var(--po)} 50%{opacity:calc(var(--po)*1.6)} 100%{transform:translateY(var(--py)) translateX(var(--px));opacity:0} }
@keyframes nf-shutdown{ 0%{filter:brightness(1) hue-rotate(0deg)} 50%{filter:brightness(0.7) hue-rotate(180deg)} 100%{filter:brightness(1) hue-rotate(360deg)} }
@keyframes nf-countdown{ from{stroke-dashoffset:0} to{stroke-dashoffset:220} }

.nf-gear      { animation: nf-spin 16s linear infinite; }
.nf-gear:hover{ animation-duration: 4s; }
.nf-gear-fast { animation-duration: 0.9s !important; }
.nf-float     { animation: nf-float 6s ease-in-out infinite; }
.nf-belt      { animation: nf-belt 0.9s linear infinite; }
.nf-part      { animation: nf-conveyor linear forwards; }
.nf-caught    { animation: nf-catch 0.45s ease-out forwards; }
.nf-quip      { animation: nf-quip 0.25s ease-out both; }
.nf-flash     { animation: nf-flash 0.7s ease-in-out infinite; }
.nf-dot       { animation: nf-dot 0.8s ease-in-out infinite; }
.nf-rise      { animation: nf-rise 0.7s ease-out both; }
.nf-rise-2    { animation-delay: 0.12s; }
.nf-rise-3    { animation-delay: 0.24s; }
.nf-rise-4    { animation-delay: 0.36s; }
.nf-scan      { animation: nf-scan 2.4s linear infinite; }
.nf-cursor    { animation: nf-cursor 1s step-end infinite; }
.nf-shutdown  { animation: nf-shutdown 2s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .nf-gear,.nf-float,.nf-belt,.nf-part,.nf-caught,.nf-quip,
  .nf-flash,.nf-dot,.nf-rise,.nf-scan,.nf-cursor,.nf-shutdown {
    animation: none !important;
  }
}
`;

/* ============================================================
   GEAR SVG
   ============================================================ */
function buildGearPath({ teeth = 12, outer = 58, inner = 46, hole = 18 }) {
  const cx = 64, cy = 64;
  const pitch = (Math.PI * 2) / teeth;
  const points = [];
  for (let i = 0; i < teeth; i++) {
    [[-0.34, inner],[-0.2, outer],[0.2, outer],[0.34, inner]].forEach(([f, r]) => {
      const a = i * pitch + f * pitch;
      points.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    });
  }
  const body = "M" + points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L") + " Z";
  const centre = `M ${cx - hole} ${cy} a ${hole} ${hole} 0 1 0 ${hole * 2} 0 a ${hole} ${hole} 0 1 0 ${-hole * 2} 0 Z`;
  return `${body} ${centre}`;
}
const GEAR_PATH = buildGearPath({});

function Gear({ fast, shutdown }) {
  return (
    <svg
      viewBox="0 0 128 128"
      className={`nf-gear h-full w-full drop-shadow-[0_10px_30px_rgba(99,102,241,0.45)] ${fast ? "nf-gear-fast" : ""} ${shutdown ? "nf-shutdown" : ""}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="nf-gear-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shutdown ? "#ef4444" : "#6366f1"} />
          <stop offset="55%" stopColor={shutdown ? "#dc2626" : "#8b5cf6"} />
          <stop offset="100%" stopColor={shutdown ? "#b91c1c" : "#22d3ee"} />
        </linearGradient>
      </defs>
      <path d={GEAR_PATH} fill="url(#nf-gear-grad)" fillRule="evenodd" />
      <circle cx="64" cy="64" r="31" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeDasharray="3 7" />
    </svg>
  );
}

/* ============================================================
   PARTICLE BURST on gear click
   ============================================================ */
function ParticleBurst({ particles }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute h-3 w-3 rounded-full"
          style={{
            left: p.x,
            top: p.y,
            background: p.color,
            "--tx": p.tx,
            "--ty": p.ty,
            animation: `nf-particle ${p.dur}ms ease-out forwards`,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   FLOATING PARTICLE FIELD (background ambiance)
   ============================================================ */
function ParticleField() {
  const [particles, setParticles] = useState([]);

  // Generate random values only on the client after mount,
  // so SSR and client render the same empty array — no hydration mismatch.
  useEffect(() => {
    setParticles(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 3,
        dur: 8000 + Math.random() * 12000,
        delay: -Math.random() * 15000,
        px: `${(Math.random() - 0.5) * 120}px`,
        py: `${-(40 + Math.random() * 80)}px`,
        po: 0.15 + Math.random() * 0.35,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-indigo-400 dark:bg-indigo-300"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            "--px": p.px,
            "--py": p.py,
            "--po": p.po,
            animation: `nf-pfield ${p.dur}ms ease-in-out infinite`,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   TYPEWRITER HEADLINE
   ============================================================ */
function TypewriterHeadline({ text, className }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 38);
    return () => clearInterval(id);
  }, [text]);

  return (
    <h1 className={className}>
      {displayed}
      {!done && (
        <span className="nf-cursor ml-0.5 inline-block h-[1em] w-[3px] align-middle bg-indigo-500" />
      )}
    </h1>
  );
}

/* ============================================================
   COUNTDOWN REDIRECT
   ============================================================ */
function CountdownRedirect({ onCancel }) {
  const [seconds, setSeconds] = useState(10);
  const router = useRouter();
  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (seconds <= 0) {
      router.push("/dashboard");
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds, router]);

  const progress = ((10 - seconds) / 10) * circumference;

  return (
    <div className="nf-rise flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/30 dark:bg-amber-500/10">
      <div className="relative h-12 w-12 shrink-0">
        <svg viewBox="0 0 80 80" className="-rotate-90">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#fde68a" strokeWidth="6" />
          <circle
            cx="40" cy="40" r={radius}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-amber-700 dark:text-amber-300">
          {seconds}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
          Redirecting to dashboard in {seconds}s
        </p>
        <p className="text-xs text-amber-600 dark:text-amber-400">Inspector found nothing here</p>
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-300 bg-white text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300"
        aria-label="Cancel redirect"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ============================================================
   RIPPLE TILE WRAPPER
   ============================================================ */
function RippleTile({ children, href, className }) {
  const [ripples, setRipples] = useState([]);
  const ref = useRef(null);

  const handleClick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
  };

  return (
    <Link href={href} ref={ref} onClick={handleClick} className={`relative overflow-hidden ${className}`}>
      {ripples.map((rp) => (
        <span
          key={rp.id}
          className="pointer-events-none absolute block rounded-full bg-indigo-400/30"
          style={{
            width: 40,
            height: 40,
            left: rp.x - 20,
            top: rp.y - 20,
            animation: "nf-ripple 0.7s ease-out forwards",
          }}
          aria-hidden="true"
        />
      ))}
      {children}
    </Link>
  );
}

/* ============================================================
   STATUS ROW with scan-line
   ============================================================ */
function RouteMonitorCard({ pathname, siren }) {
  return (
    <section
      className={`nf-rise nf-rise-3 overflow-hidden rounded-2xl border bg-white/85 shadow-xl backdrop-blur dark:bg-slate-900/85 ${
        siren ? "border-rose-400 shadow-rose-500/30" : "border-slate-200 shadow-slate-900/5 dark:border-slate-800"
      }`}
    >
      {/* Scan-line sweep */}
      <div className="relative">
        <header className="flex min-h-[54px] flex-wrap items-center justify-between gap-2 bg-indigo-600 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <Factory className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-sm font-bold text-white sm:text-base">Route Monitor</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm shadow-rose-900/30 sm:text-[11px]">
            <span className="nf-dot h-2 w-2 rounded-full bg-white" />
            PAGE NOT FOUND
          </span>
        </header>
        {/* The scan-line */}
        <div
          aria-hidden="true"
          className="nf-scan pointer-events-none absolute inset-x-0 h-2 bg-gradient-to-b from-indigo-400/40 to-transparent"
          style={{ top: -8 }}
        />
      </div>

      <StatusRow label="Requested route">
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
          {pathname || "/"}
        </code>
      </StatusRow>
      <StatusRow label="Status code">404 Not Found</StatusRow>
      <StatusRow label="Lookup result">No page at this address</StatusRow>
      <StatusRow label="Suggested action">Pick a station below</StatusRow>

      <div className="mx-3 my-3 flex min-h-[46px] items-center justify-between gap-2 rounded-lg bg-violet-50 px-3 py-2 dark:bg-violet-500/10">
        <span className="flex items-center gap-2 text-sm text-violet-700 dark:text-violet-400">
          <Clock3 className="h-4 w-4" />
          Missing for
        </span>
        <span className="text-sm font-bold text-violet-800 dark:text-violet-200">
          <MissingFor />
        </span>
      </div>
    </section>
  );
}

function StatusRow({ label, children }) {
  return (
    <div className="flex min-h-[48px] items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="min-w-0 break-all text-right text-sm font-semibold text-slate-800 dark:text-slate-200">
        {children}
      </span>
    </div>
  );
}

function MissingFor() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return <span className="tabular-nums">{`${m}:${s}`}</span>;
}

/* ============================================================
   CONVEYOR GAME
   ============================================================ */
function ConveyorGame() {
  const [parts, setParts] = useState([]);
  const [saved, setSaved] = useState(0);
  const [lost, setLost] = useState(0);
  const idRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      idRef.current++;
      setParts((cur) =>
        cur.length >= 8
          ? cur
          : [...cur, { id: idRef.current, icon: idRef.current % PART_ICONS.length, duration: 5 + Math.random() * 3, caught: false }]
      );
    }, 1100);
    return () => clearInterval(timer);
  }, []);

  const catchPart = (id) => {
    setParts((cur) => cur.map((p) => (p.id === id ? { ...p, caught: true } : p)));
    setSaved((v) => v + 1);
    setTimeout(() => setParts((cur) => cur.filter((p) => p.id !== id)), 450);
  };

  const handleEnd = (e, part) => {
    if (e.animationName !== "nf-conveyor") return;
    setParts((cur) => cur.filter((p) => p.id !== part.id));
    if (!part.caught) setLost((v) => v + 1);
  };

  const rank = saved >= 30 ? "Plant head" : saved >= 15 ? "Supervisor" : saved >= 5 ? "Operator" : "Trainee";

  return (
    <section className="nf-rise nf-rise-4 motion-reduce:hidden">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 sm:text-lg">While you are here: catch the parts</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">Parts are falling off the line. Click or tap them to recover them.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Recovered <span className="tabular-nums">{saved}</span></span>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">Lost <span className="tabular-nums">{lost}</span></span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">Rank: {rank}</span>
        </div>
      </div>

      <div className="relative h-28 select-none overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        {parts.map((part) => {
          const Icon = PART_ICONS[part.icon];
          return (
            <div key={part.id} onAnimationEnd={(e) => handleEnd(e, part)} className="nf-part absolute top-3" style={{ animationDuration: `${part.duration}s` }}>
              <button
                type="button"
                onClick={() => catchPart(part.id)}
                disabled={part.caught}
                aria-label="Catch this part"
                className={`flex h-14 w-14 items-center justify-center rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 transition hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 dark:border-indigo-400/30 ${part.caught ? "nf-caught" : ""}`}
              >
                <Icon className="h-6 w-6" />
              </button>
            </div>
          );
        })}
        <div
          aria-hidden="true"
          className="nf-belt absolute inset-x-0 bottom-0 h-5 border-t border-slate-400/40"
          style={{ backgroundImage: "repeating-linear-gradient(90deg,#475569 0px,#475569 14px,#64748b 14px,#64748b 28px)", backgroundSize: "28px 100%" }}
        />
      </div>
    </section>
  );
}

/* ============================================================
   SIMPLE STATUS PILLS
   ============================================================ */
function DevStatusCard() {
  return (
    <div className="nf-rise nf-rise-3 mt-6 flex flex-wrap gap-3">
      <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-500/20 dark:bg-amber-500/10">
        <span className="h-2 w-2 rounded-full bg-amber-500" style={{ animation: "nf-dot 1.2s ease-in-out infinite" }} />
        <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">In development</span>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 dark:border-indigo-500/20 dark:bg-indigo-500/10">
        <span className="h-2 w-2 rounded-full bg-indigo-500" />
        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Coming soon</span>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 dark:border-emerald-500/20 dark:bg-emerald-500/10">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Team notified</span>
      </div>
    </div>
  );
}

/* ============================================================
   SHUTDOWN MODE overlay
   ============================================================ */
function ShutdownOverlay({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm" role="alertdialog" aria-label="Shutdown mode activated">
      <div className="text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.4em] text-rose-400">System override</p>
        <p className="text-6xl font-black text-white sm:text-8xl">SHUTDOWN</p>
        <p className="mt-3 text-sm text-rose-300">You clicked the gear 10 times. The inspector is not happy.</p>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-slate-100"
        >
          <Cog className="h-4 w-4" /> Restart system
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN 404 PAGE
   ============================================================ */
export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  const rootRef = useRef(null);
  const frameRef = useRef(0);
  const gearBtnRef = useRef(null);

  const [gearFast, setGearFast] = useState(false);
  const [gearClicks, setGearClicks] = useState(0);
  const [quip, setQuip] = useState("");
  const [siren, setSiren] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showCountdown, setShowCountdown] = useState(false);
  const [shutdown, setShutdown] = useState(false);

  useEffect(() => {
    document.title = "Page not found | Smart Monitoring";
    // Auto-show countdown after 8 seconds of inactivity
    const id = setTimeout(() => setShowCountdown(true), 8000);
    return () => clearTimeout(id);
  }, []);

  // Key shortcuts: B = go back, Escape = cancel countdown
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "b" || e.key === "B") router.back();
      else if (e.key === "Escape") setShowCountdown(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const handlePointerMove = (e) => {
    const el = rootRef.current;
    if (!el) return;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
      el.style.setProperty("--px", ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
      el.style.setProperty("--py", ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
    });
  };

  const spawnParticles = useCallback(() => {
    const btn = gearBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ["#6366f1","#8b5cf6","#22d3ee","#f59e0b","#ec4899","#10b981"];
    const burst = Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2;
      const dist = 60 + Math.random() * 60;
      return {
        id: Date.now() + i,
        x: cx - 6,
        y: cy - 6,
        tx: `${Math.cos(angle) * dist}px`,
        ty: `${Math.sin(angle) * dist}px`,
        color: colors[i % colors.length],
        dur: 500 + Math.random() * 300,
        delay: Math.random() * 60,
      };
    });
    setParticles((p) => [...p, ...burst]);
    setTimeout(() => setParticles((p) => p.filter((pt) => !burst.find((b) => b.id === pt.id))), 900);
  }, []);

  const handleGearClick = () => {
    const clicks = gearClicks + 1;
    setGearClicks(clicks);
    setGearFast(true);
    spawnParticles();
    setTimeout(() => setGearFast(false), 1200);

    if (clicks >= 10 && clicks % 10 === 0) {
      setShutdown(true);
      return;
    }

    if (clicks % 5 === 0) {
      setQuip("Inspector alerted. Please stand by.");
      setSiren(true);
      setTimeout(() => setSiren(false), 4500);
    } else {
      setQuip(GEAR_QUIPS[clicks % GEAR_QUIPS.length]);
    }
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 [--spot:rgba(99,102,241,0.16)] dark:bg-slate-950 dark:text-slate-100 dark:[--spot:rgba(129,140,248,0.22)]"
    >
      <style>{NF_CSS}</style>

      {shutdown && <ShutdownOverlay onDismiss={() => { setShutdown(false); setGearClicks(0); }} />}

      {/* Grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(100,116,139,0.14) 1px,transparent 1px),linear-gradient(90deg,rgba(100,116,139,0.14) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at 50% 35%,black 25%,transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 35%,black 25%,transparent 75%)",
        }}
      />

      {/* Floating blobs */}
      <div aria-hidden="true" className="nf-float pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/20" />
      <div aria-hidden="true" className="nf-float pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-cyan-300/25 blur-3xl dark:bg-cyan-500/15" style={{ animationDelay: "-3s" }} />

      {/* Floating particle field */}
      <ParticleField />

      {/* Pointer spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(520px circle at var(--mx,50%) var(--my,30%),var(--spot),transparent 65%)" }}
      />

      {/* Siren bar */}
      {siren && <div aria-hidden="true" className="nf-flash fixed inset-x-0 top-0 z-50 h-1.5" />}

      {/* Particle burst layer (fixed, full screen) */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute h-3 w-3 rounded-full"
            style={{
              left: p.x,
              top: p.y,
              background: p.color,
              "--tx": p.tx,
              "--ty": p.ty,
              animation: `nf-particle ${p.dur}ms ease-out forwards`,
              animationDelay: `${p.delay}ms`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-md dark:border-slate-700 dark:bg-white">
              <img src="/logo.png" alt="ABHIJEET" className="h-full w-full rounded-xl object-contain" />
            </div>
            <div className="leading-tight">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-300">ABHIJEET</p>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">Smart Monitoring</p>
            </div>
          </Link>
          <div className="hidden"><ThemeToggle /></div>
        </header>

        <main className="flex flex-1 flex-col justify-center gap-10 py-8">
          <div>
            {/* 404 hero */}
            <div>
              <span className="nf-rise inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                <span className="nf-dot h-2 w-2 rounded-full bg-amber-500" />
                Under Development
              </span>

              <div
                className="mt-4 flex items-center gap-1 transition-transform duration-200 ease-out sm:gap-3"
                style={{ transform: "translate3d(calc(var(--px,0)*14px),calc(var(--py,0)*10px),0)" }}
              >
                <span className="bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 bg-clip-text text-[7.5rem] font-black leading-[0.85] text-transparent sm:text-[10.5rem] lg:text-[13rem]">4</span>

                <button
                  ref={gearBtnRef}
                  type="button"
                  onClick={handleGearClick}
                  aria-label="Spin the gear"
                  className="h-[7.5rem] w-[7.5rem] shrink-0 cursor-pointer rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 sm:h-[10.5rem] sm:w-[10.5rem] lg:h-[13rem] lg:w-[13rem]"
                >
                  <Gear fast={gearFast} shutdown={shutdown} />
                </button>

                <span className="bg-gradient-to-br from-cyan-400 via-violet-500 to-indigo-500 bg-clip-text text-[7.5rem] font-black leading-[0.85] text-transparent sm:text-[10.5rem] lg:text-[13rem]">4</span>
              </div>

              {/* Quip bubble */}
              <div className="mt-2 h-7">
                {quip && (
                  <p
                    key={`${gearClicks}-${quip}`}
                    className="nf-quip inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-900"
                  >
                    {siren && <Siren className="h-3.5 w-3.5 text-rose-400 dark:text-rose-600" />}
                    {quip}
                  </p>
                )}
              </div>

              {/* Typewriter headline */}
              <TypewriterHeadline
                text={HEADLINE_TEXT}
                className="nf-rise nf-rise-2 mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
              />

              <p className="nf-rise nf-rise-2 mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                Our team is actively building this page. It will be ready soon — head back to the dashboard in the meantime.
              </p>

              {/* Dev status card */}
              <DevStatusCard />

              {/* CTA buttons */}
              <div className="nf-rise nf-rise-3 mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3453e0] to-[#1f84d6] px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:brightness-110"
                >
                  Back to dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go back
                  <kbd className="hidden rounded border border-slate-300 px-1.5 text-[10px] font-bold text-slate-500 dark:border-slate-600 dark:text-slate-400 sm:inline">B</kbd>
                </button>
              </div>

              {/* Countdown redirect */}
              {showCountdown && (
                <div className="mt-4">
                  <CountdownRedirect onCancel={() => setShowCountdown(false)} />
                </div>
              )}
            </div>
          </div>


        </main>

        <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          ABHIJEET Smart Monitoring System
        </footer>
      </div>
    </div>
  );
}
"use client";

import { TV_BRAND, THEMES } from "@/features/tv/tv.theme";

/*
 * Full-screen frame of every TV screen: background, glow, blueprint grid
 * and the animations. Put TvHeader, TvSlide and TvFooter inside it.
 *
 *   glowTheme = a THEMES entry; the light at the top follows its status.
 */
export function TvShell({ glowTheme = THEMES.loading, children }) {
  return (
    <main
      className={`relative flex h-screen w-screen cursor-none select-none flex-col overflow-hidden ${TV_BRAND.page}`}
    >
      <style>{`
        @keyframes tvProgress { from { width: 0%; } to { width: 100%; } }
        @keyframes tvFade {
          from { opacity: 0; transform: translateY(1.2vh); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: TV_BRAND.gridImage,
          backgroundSize: "4vw 4vw",
        }}
      />

      {/* Light that follows the status */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${glowTheme.glow} via-transparent to-transparent`}
      />
      <div
        className={`pointer-events-none absolute -right-[10vw] -top-[20vh] h-[60vh] w-[60vh] rounded-full blur-3xl ${TV_BRAND.orb}`}
      />

      {children}
    </main>
  );
}

/*
 * The middle area of the screen. Give it a different `key` for every slide:
 * it re-mounts and fades in.
 */
export function TvSlide({ children, className = "" }) {
  return (
    <section
      className={`relative z-10 flex min-h-0 flex-1 flex-col px-[3vw] pb-[1.2vh] pt-[1.6vh] ${className}`}
      style={{ animation: "tvFade 600ms ease-out both" }}
    >
      {children}
    </section>
  );
}
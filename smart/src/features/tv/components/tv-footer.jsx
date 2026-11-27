"use client";

import { THEMES, TV_BRAND } from "@/features/tv/tv.theme";

/*
 * Bottom bar: progress bar, slide indicators and "Next: ...".
 *
 *   theme      THEMES entry of the current slide (progress bar color)
 *   index      current slide number
 *   items      [{ key, label, theme }]  one per slide
 *   nextLabel  name of the next slide
 *   durationMs how long one slide stays (progress bar speed)
 *   multiple   false = one slide only: no rotation, just a static bar
 */
export function TvFooter({
  theme = THEMES.loading,
  index,
  items,
  nextLabel,
  durationMs,
  multiple = true,
}) {
  return (
    <footer className="relative z-10 shrink-0 px-[3vw] pb-[1.4vh]">
      {multiple ? (
        <>
          <div
            className={`h-[0.7vh] w-full overflow-hidden rounded-full ${TV_BRAND.track}`}
          >
            <div
              key={`progress-${index}`}
              className={`h-full rounded-full ${theme.bar}`}
              style={{
                animation: `tvProgress ${durationMs}ms linear forwards`,
              }}
            />
          </div>

          <div className="mt-[1.2vh] flex items-center justify-between gap-[1.5vw]">
            <div className="flex min-w-0 flex-wrap items-center gap-[0.6vw]">
              {items.map((item, i) => {
                const itemTheme = item.theme ?? THEMES.loading;
                const active = i === index;

                return (
                  <div
                    key={item.key}
                    className={`flex items-center gap-[0.45vw] whitespace-nowrap rounded-full px-[0.9vw] py-[0.5vh] text-[1vw] font-semibold transition-colors ${
                      active ? TV_BRAND.chipActive : TV_BRAND.chipIdle
                    }`}
                  >
                    <span
                      className={`h-[0.65vw] w-[0.65vw] rounded-full ${itemTheme.dot}`}
                    />
                    {item.label}
                  </div>
                );
              })}
            </div>

            <p
              className={`shrink-0 whitespace-nowrap text-[1.1vw] font-medium ${TV_BRAND.muted}`}
            >
              Next:{" "}
              <span className="font-bold text-blue-100">{nextLabel}</span>
            </p>
          </div>
        </>
      ) : (
        <div className={`h-[0.7vh] w-full rounded-full ${TV_BRAND.track}`}>
          <div className={`h-full w-full rounded-full opacity-60 ${theme.bar}`} />
        </div>
      )}

      <p className={`mt-[0.8vh] text-center text-[0.9vw] ${TV_BRAND.faint}`}>
        ABHIJEET Smart Monitoring System
      </p>
    </footer>
  );
}
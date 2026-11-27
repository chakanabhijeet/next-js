"use client";

import { useEffect, useState } from "react";

/*
 * Slide rotation for TV screens.
 *
 *  - Changes slide every `durationMs` (only when there is more than one).
 *  - Re-arms whenever the slide changes, so manual arrow-key changes
 *    also restart the timer.
 *  - Keyboard: ← → change slide, F toggles full screen.
 *
 * Returns { index, multiple }.
 */
export function useTvRotation({ total, durationMs }) {
  const [index, setIndex] = useState(0);
  const multiple = total > 1;

  useEffect(() => {
    if (!multiple) return undefined;

    const id = setTimeout(
      () => setIndex((current) => (current + 1) % total),
      durationMs
    );

    return () => clearTimeout(id);
  }, [index, total, multiple, durationMs]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "ArrowRight" && multiple) {
        setIndex((current) => (current + 1) % total);
      } else if (event.key === "ArrowLeft" && multiple) {
        setIndex((current) => (current - 1 + total) % total);
      } else if (event.key === "f" || event.key === "F") {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        } else {
          document.documentElement.requestFullscreen?.();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [total, multiple]);

  // Safe even if the number of slides shrinks later.
  return { index: total > 0 ? index % total : 0, multiple };
}
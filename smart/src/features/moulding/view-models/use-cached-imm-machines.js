"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";

import { IMM_MACHINES } from "@/features/moulding/config/imm-machines.config";
import { useImmCacheStore } from "@/features/moulding/store/imm-cache.store";

// Runs before paint on the client, falls back to useEffect on the server
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ============================================================
   PLACEHOLDER (DUMMY) DATA
   Shown only on the very first visit, before any saved or live
   data exists. Deterministic (no Math.random) so server and
   client render the same thing.
   Production counts are always between 60 and 100.
   ============================================================ */

function hashKey(key) {
  let hash = 0;
  for (const ch of String(key)) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function makePlaceholder(key) {
  const h = hashKey(key);

  const data = {
    productionCount: 60 + (h % 41), // 60 - 100
    dayProduction: 60 + ((h >>> 4) % 41), // 60 - 100
    cycleTimeSec: 25 + ((h >>> 8) % 100) / 10, // 25.0 - 34.9
    moldNo: "—",
    shiftName: "",
    productionTime: null,
  };

  // NOTE: dummy shots are still generated here, but they are not visible
  // right now because the "Last 10 Shots" section is commented out in the page.
  const shots = Array.from({ length: 10 }).map((_, i) => ({
    id: `placeholder-${key}-${i}`,
    cycle_time_sec: 25 + ((h + i * 7) % 100) / 10,
    production_time: null,
  }));

  const times = shots.map((s) => s.cycle_time_sec);

  const logStats = {
    shots,
    minCycleTimeSec: Math.min(...times),
    maxCycleTimeSec: Math.max(...times),
    avgCycleTimeSec: times.reduce((a, b) => a + b, 0) / times.length,
  };

  return { data, logStats };
}

/* ============================================================
   HOOK: live data -> saved data -> placeholder data
   Priority for each machine:
   1. live data from the API (TanStack Query)
   2. last saved data (Zustand store, persisted in localStorage)
   3. dummy placeholder (only if there is no error)
   ============================================================ */

export function useCachedImmMachines(liveMachines) {
  const entries = useImmCacheStore((state) => state.entries);

  // Last saved copy of each machine, to skip saving unchanged data.
  const signaturesRef = useRef({});

  // Load saved data before the first paint (no flash on repeat visits)
  useIsoLayoutEffect(() => {
    useImmCacheStore.persist.rehydrate();
  }, []);

  // Save new live data whenever it changes
  useEffect(() => {
    if (!liveMachines) return;

    const { entries: saved, saveEntries } = useImmCacheStore.getState();
    const updates = {};

    for (const [key, machine] of Object.entries(liveMachines)) {
      if (!machine?.data) continue;

      const logStats = machine.logStats ?? saved[key]?.logStats ?? null;
      const signature = JSON.stringify([machine.data, logStats]);

      if (signaturesRef.current[key] !== signature) {
        signaturesRef.current[key] = signature;
        updates[key] = { data: machine.data, logStats, savedAt: Date.now() };
      }
    }

    if (Object.keys(updates).length > 0) {
      saveEntries(updates);
    }
  }, [liveMachines]);

  return useMemo(() => {
    const keys = new Set([
      ...IMM_MACHINES.map((config) => config.key),
      ...Object.keys(liveMachines || {}),
      ...Object.keys(entries),
    ]);

    const merged = {};

    for (const key of keys) {
      const live = liveMachines?.[key];
      const cached = entries[key];
      const hasError = !!live?.error;

      const liveData = live?.data ?? null;
      const cachedData = !liveData ? cached?.data ?? null : null;

      // Dummy values only when nothing real exists and the API has not failed
      const usePlaceholderData = !liveData && !cachedData && !hasError;
      const placeholder = makePlaceholder(key);

      const realLogStats = live?.logStats ?? cached?.logStats ?? null;
      const usePlaceholderLog =
        !realLogStats && !live?.logError && !hasError;

      merged[key] = {
        ...live,
        data:
          liveData ?? cachedData ?? (usePlaceholderData ? placeholder.data : null),
        logStats:
          realLogStats ?? (usePlaceholderLog ? placeholder.logStats : null),
        fromCache: !!cachedData,
        isPlaceholder: usePlaceholderData,
        logIsPlaceholder: usePlaceholderLog,
      };
    }

    return merged;
  }, [liveMachines, entries]);
}
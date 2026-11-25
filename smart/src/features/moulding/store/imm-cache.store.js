/*
 * ====================================================================
 *  IMM CACHE STORE (Zustand)
 * ====================================================================
 *
 *  Path: src/features/moulding/store/imm-cache.store.js
 *
 *  Remembers the last real data of every machine in localStorage, so a
 *  repeat visit shows saved numbers instead of a blank / dummy screen
 *  while the first API call is still running.
 *
 *  Replaces the hand-written readCache() / writeCache() from the page.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const CACHE_NAME = "imm-dashboard-cache-v2";
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // ignore saved data older than 24h

// Keeps only entries that have data and are not older than 24 hours.
function dropExpired(entries) {
  const now = Date.now();
  const fresh = {};

  for (const [key, entry] of Object.entries(entries || {})) {
    if (entry?.data && now - (entry.savedAt ?? 0) <= CACHE_MAX_AGE_MS) {
      fresh[key] = entry;
    }
  }

  return fresh;
}

export const useImmCacheStore = create(
  persist(
    (set) => ({
      // { [machineKey]: { data, logStats, savedAt } }
      entries: {},

      // updates = { [machineKey]: { data, logStats, savedAt } }
      saveEntries: (updates) =>
        set((state) => ({ entries: { ...state.entries, ...updates } })),
    }),
    {
      name: CACHE_NAME,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : undefined
      ),

      // Only the entries are saved, not the functions.
      partialize: (state) => ({ entries: state.entries }),

      // Do NOT read localStorage while the server / first render runs
      // (avoids a Next.js hydration mismatch). The page calls
      // useImmCacheStore.persist.rehydrate() right before first paint.
      skipHydration: true,

      // Drop expired entries when the saved data is loaded.
      merge: (persisted, current) => ({
        ...current,
        entries: dropExpired(persisted?.entries),
      }),
    }
  )
);
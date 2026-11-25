/*
 * ====================================================================
 *  MONITORING STORE (Zustand)
 * ====================================================================
 *
 *  Path: src/features/monitoring/store/monitoring.store.js
 *
 *  Holds the dashboard's UI state: which date is selected.
 *    ""            -> today (live data)
 *    "YYYY-MM-DD"  -> a past date
 *
 *  Any component can read it, e.g.
 *    const selectedDate = useMonitoringStore((state) => state.selectedDate);
 */

import { create } from "zustand";

export const useMonitoringStore = create((set) => ({
  selectedDate: "",

  setSelectedDate: (date) => set({ selectedDate: date }),
}));
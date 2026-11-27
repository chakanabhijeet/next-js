// /*
//  * Path: src/features/alerts/store/alerts.store.js
//  *
//  * Screen state of the Alerts page (Zustand).
//  * The machine data itself comes from the Assembly and Moulding screens'
//  * own TanStack Query data, so nothing is fetched twice.
//  */

// import { create } from "zustand";

// export const useAlertsStore = create((set) => ({
//   areaFilter: "all", // all | Assembly | Moulding
//   sortBy: "longest", // longest | shortest | name

//   setAreaFilter: (areaFilter) => set({ areaFilter }),
//   setSortBy: (sortBy) => set({ sortBy }),
// }));





/*
 * Path: src/features/alerts/store/alerts.store.js
 *
 * Screen state of the Alerts page (Zustand).
 * The machine data itself comes from the Assembly and Moulding screens'
 * own TanStack Query data, so nothing is fetched twice.
 */

import { create } from "zustand";

export const useAlertsStore = create((set) => ({
  activeArea: "Assembly", // Assembly | Moulding  (which tab is open)
  setActiveArea: (activeArea) => set({ activeArea }),

  sortBy: "longest", // longest | shortest | name  (order of the stopped machines)

  setSortBy: (sortBy) => set({ sortBy }),
}));
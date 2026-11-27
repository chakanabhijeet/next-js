// "use client";

// /*
//  * Path: src/features/alerts/view-models/use-alerts-view-model.js
//  *
//  * Joins the Assembly and Moulding machines into ONE list and works out
//  * which of them have been stopped for more than 15 minutes.
//  * It re-checks every second, so the counters and the alert list are live.
//  */

// import { useEffect, useMemo, useRef, useState } from "react";

// import { useProductionViewModel } from "@/features/monitoring/view-models/use-production-view-model";
// import { MACHINES } from "@/features/monitoring/config/machines.config";
// import {
//   IMM_MACHINES,
//   useImmViewModel,
// } from "@/features/moulding/view-models/use-imm-view-model";
// import { useCachedImmMachines } from "@/features/moulding/view-models/use-cached-imm-machines";

// import {
//   AREAS,
//   ALERT_TICK_MS,
//   NEW_ALERT_HIGHLIGHT_MS,
// } from "../config/alerts.config";
// import { useAlertsStore } from "../store/alerts.store";
// import { getAlertState } from "../utils/alert-status";

// /* One flat list of every machine, assembly + moulding */

// function buildMachineList(assemblyMachines, mouldingMachines) {
//   const assembly = MACHINES.map((config) => ({
//     id: `assembly:${config.key}`,
//     area: AREAS.ASSEMBLY,
//     title: config.title,
//     badge: config.badge ?? null,
//     machine: assemblyMachines?.[config.key],
//   }));

//   const moulding = IMM_MACHINES.map((config) => ({
//     id: `moulding:${config.key}`,
//     area: AREAS.MOULDING,
//     title: config.title,
//     badge: null,
//     machine: mouldingMachines?.[config.key],
//   }));

//   return [...assembly, ...moulding];
// }

// export function useAlertsViewModel() {
//   const areaFilter = useAlertsStore((state) => state.areaFilter);
//   const sortBy = useAlertsStore((state) => state.sortBy);
//   const setAreaFilter = useAlertsStore((state) => state.setAreaFilter);
//   const setSortBy = useAlertsStore((state) => state.setSortBy);

//   /* ------------------------ data ------------------------ */

//   const assembly = useProductionViewModel(null); // null = live data
//   const mouldingLive = useImmViewModel();
//   const mouldingMachines = useCachedImmMachines(mouldingLive.machines);

//   /* ------------------------ live clock ------------------------ */

//   const [now, setNow] = useState(() => Date.now());

//   useEffect(() => {
//     const id = setInterval(() => setNow(Date.now()), ALERT_TICK_MS);
//     return () => clearInterval(id);
//   }, []);

//   /* ------------------------ classify every machine ------------------------ */

//   const all = useMemo(
//     () =>
//       buildMachineList(assembly.machines, mouldingMachines).map((item) => ({
//         ...item,
//         ...getAlertState(item.machine, now),
//       })),
//     [assembly.machines, mouldingMachines, now]
//   );

//   const isAlert = (item) =>
//     item.state === "warning" || item.state === "critical";

//   const alertsAll = all.filter(isAlert);
//   const noDataAll = all.filter((item) => item.state === "no-data");

//   /* ------------------------ counts (not affected by the filter) ------------------------ */

//   const counts = {
//     total: all.length,
//     running: all.filter((item) => item.state === "running").length,
//     stopped: alertsAll.length,
//     critical: all.filter((item) => item.state === "critical").length,
//     noData: noDataAll.length,
//     byArea: {
//       all: alertsAll.length,
//       [AREAS.ASSEMBLY]: alertsAll.filter((i) => i.area === AREAS.ASSEMBLY)
//         .length,
//       [AREAS.MOULDING]: alertsAll.filter((i) => i.area === AREAS.MOULDING)
//         .length,
//     },
//     // true while no machine has answered yet
//     isLoading: all.every((item) => item.state === "loading"),
//   };

//   /* ------------------------ filter + sort ------------------------ */

//   const matchesArea = (item) =>
//     areaFilter === "all" || item.area === areaFilter;

//   const sorters = {
//     // unknown duration (null) goes first: it is the most uncertain
//     longest: (a, b) => (b.stoppedForMs ?? Infinity) - (a.stoppedForMs ?? Infinity),
//     shortest: (a, b) => (a.stoppedForMs ?? Infinity) - (b.stoppedForMs ?? Infinity),
//     name: (a, b) => a.title.localeCompare(b.title),
//   };

//   const alerts = alertsAll.filter(matchesArea).sort(sorters[sortBy]);
//   const noData = noDataAll.filter(matchesArea);

//   // Every machine (any state) for the status board, in config order
//   const board = all.filter(matchesArea);

//   /* ------------------------ highlight alerts that just appeared ------------------------ */

//   const [newIds, setNewIds] = useState([]);
//   const knownIdsRef = useRef(null); // null until the first real result

//   const alertKey = alertsAll.map((item) => item.id).join("|");

//   // True once EVERY machine has answered (none still loading). Alerts that
//   // exist at that moment are "already known", so nothing flashes at start.
//   const settled = all.every((item) => item.state !== "loading");

//   useEffect(() => {
//     if (!settled) return;

//     const currentIds = alertKey ? alertKey.split("|") : [];

//     // First result: everything already stopped is "known", not "new"
//     if (knownIdsRef.current === null) {
//       knownIdsRef.current = new Set(currentIds);
//       return;
//     }

//     const fresh = currentIds.filter((id) => !knownIdsRef.current.has(id));

//     knownIdsRef.current = new Set(currentIds);

//     if (fresh.length === 0) return;

//     setNewIds((current) => [...new Set([...current, ...fresh])]);

//     // Not cancelled on re-run: every highlight must switch itself off
//     setTimeout(() => {
//       setNewIds((current) => current.filter((id) => !fresh.includes(id)));
//     }, NEW_ALERT_HIGHLIGHT_MS);
//   }, [alertKey, settled]);

//   /* ------------------------ refresh both areas ------------------------ */

//   const isRefreshing = assembly.isRefreshing || mouldingLive.isRefreshing;

//   const refresh = () => {
//     assembly.refresh?.();
//     mouldingLive.refresh?.();
//   };

//   return {
//     alerts: alerts.map((item) => ({ ...item, isNew: newIds.includes(item.id) })),
//     noData,
//     board,
//     now,
//     counts,
//     isRefreshing,
//     refresh,

//     areaFilter,
//     setAreaFilter,
//     sortBy,
//     setSortBy,
//   };
// }















"use client";

/*
 * Path: src/features/alerts/view-models/use-alerts-view-model.js
 *
 * Joins the Assembly and Moulding machines into ONE list and works out
 * which of them have been stopped for more than 15 minutes.
 * It re-checks every second, so the counters and the alert list are live.
 */

import { useEffect, useMemo, useRef, useState } from "react";

import { useProductionViewModel } from "@/features/monitoring/view-models/use-production-view-model";
import { MACHINES } from "@/features/monitoring/config/machines.config";
import {
  IMM_MACHINES,
  useImmViewModel,
} from "@/features/moulding/view-models/use-imm-view-model";
import { useCachedImmMachines } from "@/features/moulding/view-models/use-cached-imm-machines";

import {
  AREAS,
  ALERT_TICK_MS,
  NEW_ALERT_HIGHLIGHT_MS,
} from "../config/alerts.config";
import { useAlertsStore } from "../store/alerts.store";
import { getAlertState } from "../utils/alert-status";

/* One flat list of every machine, assembly + moulding */

function buildMachineList(assemblyMachines, mouldingMachines) {
  const assembly = MACHINES.map((config) => ({
    id: `assembly:${config.key}`,
    area: AREAS.ASSEMBLY,
    title: config.title,
    badge: config.badge ?? null,
    machine: assemblyMachines?.[config.key],
  }));

  const moulding = IMM_MACHINES.map((config) => ({
    id: `moulding:${config.key}`,
    area: AREAS.MOULDING,
    title: config.title,
    badge: null,
    machine: mouldingMachines?.[config.key],
  }));

  return [...assembly, ...moulding];
}

export function useAlertsViewModel() {
  const activeArea = useAlertsStore((state) => state.activeArea);
  const setActiveArea = useAlertsStore((state) => state.setActiveArea);
  const sortBy = useAlertsStore((state) => state.sortBy);
  const setSortBy = useAlertsStore((state) => state.setSortBy);

  /* ------------------------ data ------------------------ */

  const assembly = useProductionViewModel(null); // null = live data
  const mouldingLive = useImmViewModel();
  const mouldingMachines = useCachedImmMachines(mouldingLive.machines);

  /* ------------------------ live clock ------------------------ */

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ALERT_TICK_MS);
    return () => clearInterval(id);
  }, []);

  /* ------------------------ classify every machine ------------------------ */

  const all = useMemo(
    () =>
      buildMachineList(assembly.machines, mouldingMachines).map((item) => ({
        ...item,
        ...getAlertState(item.machine, now),
      })),
    [assembly.machines, mouldingMachines, now]
  );

  const isAlert = (item) =>
    item.state === "warning" || item.state === "critical";

  const alertsAll = all.filter(isAlert);

  /* ------------------------ counts (not affected by the filter) ------------------------ */

  const counts = {
    total: all.length,
    running: all.filter((item) => item.state === "running").length,
    stopped: alertsAll.length,
    critical: all.filter((item) => item.state === "critical").length,
    noData: all.filter((item) => item.state === "no-data").length,
    byArea: {
      all: alertsAll.length,
      [AREAS.ASSEMBLY]: alertsAll.filter((i) => i.area === AREAS.ASSEMBLY)
        .length,
      [AREAS.MOULDING]: alertsAll.filter((i) => i.area === AREAS.MOULDING)
        .length,
    },
    // true while no machine has answered yet
    isLoading: all.every((item) => item.state === "loading"),
  };

  /* ------------------------ order of the stopped machines ------------------------ */

  const sorters = {
    // unknown duration (null) goes first: it is the most uncertain
    longest: (a, b) => (b.stoppedForMs ?? Infinity) - (a.stoppedForMs ?? Infinity),
    shortest: (a, b) => (a.stoppedForMs ?? Infinity) - (b.stoppedForMs ?? Infinity),
    name: (a, b) => a.title.localeCompare(b.title),
  };

  /* ------------------------ highlight alerts that just appeared ------------------------ */

  const [newIds, setNewIds] = useState([]);
  const knownIdsRef = useRef(null); // null until the first real result

  const alertKey = alertsAll.map((item) => item.id).join("|");

  // True once EVERY machine has answered (none still loading). Alerts that
  // exist at that moment are "already known", so nothing flashes at start.
  const settled = all.every((item) => item.state !== "loading");

  useEffect(() => {
    if (!settled) return;

    const currentIds = alertKey ? alertKey.split("|") : [];

    // First result: everything already stopped is "known", not "new"
    if (knownIdsRef.current === null) {
      knownIdsRef.current = new Set(currentIds);
      return;
    }

    const fresh = currentIds.filter((id) => !knownIdsRef.current.has(id));

    knownIdsRef.current = new Set(currentIds);

    if (fresh.length === 0) return;

    setNewIds((current) => [...new Set([...current, ...fresh])]);

    // Not cancelled on re-run: every highlight must switch itself off
    setTimeout(() => {
      setNewIds((current) => current.filter((id) => !fresh.includes(id)));
    }, NEW_ALERT_HIGHLIGHT_MS);
  }, [alertKey, settled]);

  /* ------------------------ refresh both areas ------------------------ */

  const isRefreshing = assembly.isRefreshing || mouldingLive.isRefreshing;

  const refresh = () => {
    assembly.refresh?.();
    mouldingLive.refresh?.();
  };

  /* ------------------------ one section per area ------------------------ */

  // Each area decides for itself:
  //   some machine stopped  -> hasAlerts: show the stopped machines
  //   none stopped          -> show every machine of that area (running view)
  const sections = [AREAS.ASSEMBLY, AREAS.MOULDING].map((area) => {
    const items = all.filter((item) => item.area === area);

    const sectionAlerts = items
      .filter(isAlert)
      .sort(sorters[sortBy])
      .map((item) => ({ ...item, isNew: newIds.includes(item.id) }));

    return {
      area,
      items, // every machine of this area, in config order
      alerts: sectionAlerts,
      noData: items.filter((item) => item.state === "no-data"),
      hasAlerts: sectionAlerts.length > 0,
      total: items.length,
      running: items.filter((item) => item.state === "running").length,
      stopped: sectionAlerts.length,
      critical: sectionAlerts.filter((item) => item.state === "critical")
        .length,
      isLoading: items.every((item) => item.state === "loading"),
    };
  });

  // The area whose tab is open (header, tiles and cards follow it)
  const section =
    sections.find((item) => item.area === activeArea) ?? sections[0];

  return {
    sections, // both areas (for the tabs)
    section, // the open area
    activeArea: section.area,
    setActiveArea,
    now,
    counts,
    isRefreshing,
    refresh,

    sortBy,
    setSortBy,
  };
}
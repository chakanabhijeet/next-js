

// The API/device sends IST wall-clock time but labels it as UTC ("Z").
// IST = UTC+5:30 = 330 minutes. We subtract it to get the real UTC instant.
// When the backend is fixed to send true UTC, set this to 0.
const DEVICE_CLOCK_OFFSET_MINUTES = 330;

function toTrueUtcIso(value) {
  if (!value || typeof value !== "string") return null;

  const match = value
    .trim()
    .match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}:\d{2})(?:\.(\d+))?/);

  if (!match) return null;

  const [, datePart, timePart, fraction = ""] = match;
  const millis = fraction.padEnd(3, "0").slice(0, 3);

  // Read the wall-clock digits as-is (ignore the misleading "Z")
  const wallClockMs = Date.parse(`${datePart}T${timePart}.${millis}Z`);

  if (Number.isNaN(wallClockMs)) return null;

  return new Date(
    wallClockMs - DEVICE_CLOCK_OFFSET_MINUTES * 60 * 1000
  ).toISOString();
}

export function normalizeProductionResponse(data) {
  const rawStatus =
    data?.device_status ??
    data?.connection_status ??
    data?.machine_status ??
    data?.status ??
    data?.is_online ??
    data?.online ??
    null;

  let connectionStatus = "unknown";

  if (typeof rawStatus === "boolean") {
    connectionStatus = rawStatus ? "online" : "offline";
  } else if (typeof rawStatus === "string") {
    const status = rawStatus.trim().toLowerCase();

    if (["online", "connected", "running", "active"].includes(status)) {
      connectionStatus = "online";
    } else if (
      ["offline", "disconnected", "stopped", "inactive"].includes(status)
    ) {
      connectionStatus = "offline";
    }
  }

  const overallOee = Number(data?.oee?.oee ?? 0);
  const dayOverallOee = Number(data?.day_oee?.oee ?? 0);

  return {
    eventId: data?.event_id ?? null,
    tenantId: data?.tenant_id ?? null,
    shiftName: data?.shift_name ?? null,
    customerId: data?.customer_id ?? "",
    deviceId: data?.device_id ?? null,
    machineId: data?.machine_id ?? null,
    station: data?.station ?? null,
    variant: data?.variant ?? null,

    productionCount: Number(data?.production_count ?? 0),
    dayProduction: Number(data?.day_production ?? 0),

    oee: {
      availability: Number(data?.oee?.availability ?? 0),
      performance: Number(data?.oee?.performance ?? 0),
      quality: Number(data?.oee?.quality ?? 0),
      overall: overallOee,
      oee: overallOee,
    },

    dayOee: {
      availability: Number(data?.day_oee?.availability ?? 0),
      performance: Number(data?.day_oee?.performance ?? 0),
      quality: Number(data?.day_oee?.quality ?? 0),
      overall: dayOverallOee,
      oee: dayOverallOee,
    },

    cycleTimeSec: Number(data?.cycle_time_sec ?? 0),

    // Corrected to true UTC ISO strings (ending in "Z")
    productionTime: toTrueUtcIso(data?.production_time),
    createdAt: toTrueUtcIso(data?.created_at),

    connectionStatus,
  };
}





// // The API/device sends IST wall-clock time but labels it as UTC ("Z").
// // IST = UTC+5:30 = 330 minutes. We subtract it to get the real UTC instant.
// // When the backend is fixed to send true UTC, set this to 0.
// const DEVICE_CLOCK_OFFSET_MINUTES = 330;

// function toTrueUtcIso(value) {
//   if (!value || typeof value !== "string") return null;

//   const match = value
//     .trim()
//     .match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}:\d{2})(?:\.(\d+))?/);

//   if (!match) return null;

//   const [, datePart, timePart, fraction = ""] = match;
//   const millis = fraction.padEnd(3, "0").slice(0, 3);

//   // Read the wall-clock digits as-is (ignore the misleading "Z")
//   const wallClockMs = Date.parse(`${datePart}T${timePart}.${millis}Z`);

//   if (Number.isNaN(wallClockMs)) return null;

//   return new Date(
//     wallClockMs - DEVICE_CLOCK_OFFSET_MINUTES * 60 * 1000
//   ).toISOString();
// }

// function toCount(value) {
//   const number = Number(value ?? 0);
//   return Number.isFinite(number) ? number : 0;
// }

// const EMPTY_OEE = {
//   availability: 0,
//   performance: 0,
//   quality: 0,
//   overall: 0,
//   oee: 0,
// };

// /*
//  * PAST DATE response:
//  * {
//  *   tenant_id, device_id, station, date,
//  *   shifts: [{ shift: "Complete Day", production_count }, { shift: "Shift A", ... }],
//  *   total_production
//  * }
//  * "historical: true" tells the dashboard to hide running / stopped,
//  * cycle time and last update, and to show the shift breakdown instead.
//  */
// function normalizeHistoryResponse(data) {
//   const shifts = Array.isArray(data?.shifts) ? data.shifts : [];

//   const completeDay = shifts.find((item) =>
//     /complete/i.test(String(item?.shift ?? ""))
//   );

//   const dayTotal = completeDay
//     ? toCount(completeDay.production_count)
//     : toCount(data?.total_production);

//   return {
//     historical: true,
//     date: data?.date ?? null,

//     eventId: null,
//     tenantId: data?.tenant_id ?? null,
//     shiftName: "Complete Day",
//     customerId: "",
//     deviceId: data?.device_id ?? null,
//     machineId: null,
//     station: data?.station ?? null,
//     variant: data?.variant ?? null,

//     productionCount: dayTotal,
//     dayProduction: dayTotal,

//     // Individual shifts only (the "Complete Day" row is the total above)
//     shifts: shifts
//       .filter((item) => item !== completeDay)
//       .map((item) => ({
//         name: String(item?.shift ?? "Shift"),
//         count: toCount(item?.production_count),
//       })),

//     oee: EMPTY_OEE,
//     dayOee: EMPTY_OEE,

//     cycleTimeSec: null,
//     productionTime: null,
//     createdAt: null,

//     connectionStatus: "unknown",
//   };
// }

// /*
//  * options.historical = true  -> response came from a request WITH a date
//  * (default)                  -> live / current data (unchanged behaviour)
//  */
// export function normalizeProductionResponse(data, options = {}) {
//   if (options.historical) {
//     return normalizeHistoryResponse(data);
//   }

//   const rawStatus =
//     data?.device_status ??
//     data?.connection_status ??
//     data?.machine_status ??
//     data?.status ??
//     data?.is_online ??
//     data?.online ??
//     null;

//   let connectionStatus = "unknown";

//   if (typeof rawStatus === "boolean") {
//     connectionStatus = rawStatus ? "online" : "offline";
//   } else if (typeof rawStatus === "string") {
//     const status = rawStatus.trim().toLowerCase();

//     if (["online", "connected", "running", "active"].includes(status)) {
//       connectionStatus = "online";
//     } else if (
//       ["offline", "disconnected", "stopped", "inactive"].includes(status)
//     ) {
//       connectionStatus = "offline";
//     }
//   }

//   const overallOee = Number(data?.oee?.oee ?? 0);
//   const dayOverallOee = Number(data?.day_oee?.oee ?? 0);

//   return {
//     historical: false,

//     eventId: data?.event_id ?? null,
//     tenantId: data?.tenant_id ?? null,
//     shiftName: data?.shift_name ?? null,
//     customerId: data?.customer_id ?? "",
//     deviceId: data?.device_id ?? null,
//     machineId: data?.machine_id ?? null,
//     station: data?.station ?? null,
//     variant: data?.variant ?? null,

//     productionCount: Number(data?.production_count ?? 0),
//     dayProduction: Number(data?.day_production ?? 0),

//     oee: {
//       availability: Number(data?.oee?.availability ?? 0),
//       performance: Number(data?.oee?.performance ?? 0),
//       quality: Number(data?.oee?.quality ?? 0),
//       overall: overallOee,
//       oee: overallOee,
//     },

//     dayOee: {
//       availability: Number(data?.day_oee?.availability ?? 0),
//       performance: Number(data?.day_oee?.performance ?? 0),
//       quality: Number(data?.day_oee?.quality ?? 0),
//       overall: dayOverallOee,
//       oee: dayOverallOee,
//     },

//     cycleTimeSec: Number(data?.cycle_time_sec ?? 0),

//     // Corrected to true UTC ISO strings (ending in "Z")
//     productionTime: toTrueUtcIso(data?.production_time),
//     createdAt: toTrueUtcIso(data?.created_at),

//     connectionStatus,
//   };
// }
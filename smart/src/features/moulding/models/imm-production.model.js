/*
 * Injection moulding (IMM) machine response  ->  clean object for the UI.
 *
 * NOTE about this API: in the response, "device_id" holds the MACHINE name
 * ("2700 Milacron") and "machine_id" is empty. So the page takes the machine
 * name from its own config (see use-imm-view-model.js), not from these fields.
 *
 * Timestamps already carry the +05:30 offset, so they are real instants and
 * need NO clock correction (unlike the assembly API).
 */

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function toText(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

// "2026-10-26T14:58:12.627341+05:30" -> real ISO instant (UTC).
// JS is only guaranteed to read 3 fraction digits, so extra digits are cut.
function toIso(value) {
  if (!value || typeof value !== "string") return null;

  const date = new Date(value.trim().replace(/(\.\d{3})\d+/, "$1"));

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toOee(data) {
  return {
    availability: toNumber(data?.availability),
    performance: toNumber(data?.performance),
    quality: toNumber(data?.quality),
    oee: toNumber(data?.oee),
  };
}

export function normalizeImmResponse(data) {
  const oee = toOee(data?.oee);
  const dayOee = toOee(data?.day_oee);

  return {
    eventId: data?.event_id ?? null,
    tenantId: data?.tenant_id ?? null,

    shiftName: toText(data?.shift_name) || null,
    moldNo: toText(data?.mold_no),
    partName: toText(data?.part_name),

    // Shift production / day production / count since the last reset
    productionCount: toNumber(data?.production_count),
    dayProduction: toNumber(data?.day_production_count),
    currentProductionCount: toNumber(data?.current_production_count),

    cycleTimeSec:
      data?.cycle_time_sec === null || data?.cycle_time_sec === undefined
        ? null
        : toNumber(data.cycle_time_sec),

    productionTime: toIso(data?.production_time),
    createdAt: toIso(data?.created_at),

    reset: Boolean(data?.reset),

    oee,
    dayOee,
    // The API sends all zeros when the day OEE is not calculated yet.
    hasDayOee: Object.values(dayOee).some((value) => value > 0),
  };
}
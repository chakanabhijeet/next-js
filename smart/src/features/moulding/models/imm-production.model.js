
function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function toText(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function toIso(value) {
  if (!value || typeof value !== "string") return null;

  // JavaScript reliably preserves millisecond precision.
  const date = new Date(
    value.trim().replace(/(\.\d{3})\d+/, "$1")
  );

  return Number.isNaN(date.getTime())
    ? null
    : date.toISOString();
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

    productionCount: toNumber(data?.production_count),
    dayProduction: toNumber(data?.day_production_count),
    currentProductionCount: toNumber(
      data?.current_production_count
    ),

    cycleTimeSec:
      data?.cycle_time_sec === null ||
      data?.cycle_time_sec === undefined
        ? null
        : toNumber(data.cycle_time_sec),

    productionTime: toIso(data?.production_time),
    createdAt: toIso(data?.created_at),

    reset: Boolean(data?.reset),

    oee,
    dayOee,

    hasDayOee: Object.values(dayOee).some(
      (value) => value > 0
    ),
  };
}

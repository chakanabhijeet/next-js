
// function toFiniteNumber(value) {
//   if (value === null || value === undefined || value === "") {
//     return null;
//   }

//   const number = Number(value);
//   return Number.isFinite(number) ? number : null;
// }

// /**
//  * Normalize the response from POST /proddata/immlog.
//  */
// export function normalizeImmLogResponse(response) {
//   const body = response;
//   const shots = Array.isArray(body?.data) ? body.data : [];

//   return {
//     shots,
//     shotCount: shots.length,
//     minCycleTimeSec: toFiniteNumber(body?.min_cycle_time_sec),
//     maxCycleTimeSec: toFiniteNumber(body?.max_cycle_time_sec),
//     avgCycleTimeSec: toFiniteNumber(body?.avg_cycle_time_sec),
//   };
// }







function toFiniteNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function normalizeImmLogResponse(response) {
  // Supports an Axios response body and a response wrapped in data.
  const body =
    response?.data && !Array.isArray(response.data)
      ? response.data
      : response;

  const shots = Array.isArray(body?.data)
    ? body.data
    : Array.isArray(response?.data)
      ? response.data
      : [];

  return {
    shots: shots.slice(0, 10),
    shotCount: Math.min(shots.length, 10),

    minCycleTimeSec: toFiniteNumber(
      body?.min_cycle_time_sec ?? response?.min_cycle_time_sec
    ),

    maxCycleTimeSec: toFiniteNumber(
      body?.max_cycle_time_sec ?? response?.max_cycle_time_sec
    ),

    avgCycleTimeSec: toFiniteNumber(
      body?.avg_cycle_time_sec ?? response?.avg_cycle_time_sec
    ),
  };
}

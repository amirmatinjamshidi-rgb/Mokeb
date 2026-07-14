/** Normalize CheckCapacity API payloads (boolean or stats object). */
export function isCapacityAvailable(result: unknown): boolean {
  if (typeof result === "boolean") return result;
  if (!result || typeof result !== "object") return false;

  const row = result as Record<string, unknown>;
  if (typeof row.maleAvailability === "boolean") return row.maleAvailability;
  if (typeof row.MaleAvailability === "boolean") return row.MaleAvailability;
  if (typeof row.result === "boolean") return row.result;
  if (typeof row.Result === "boolean") return row.Result;

  const empty = Number(row.emptyCapacity ?? row.EmptyCapacity ?? NaN);
  if (Number.isFinite(empty)) return empty > 0;

  const available = Number(row.availableCapacity ?? row.AvailableCapacity ?? NaN);
  if (Number.isFinite(available)) return available > 0;

  return false;
}

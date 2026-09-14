/**
 * American Central Time (CST/CDT) helpers for the client.
 *
 * The ranking cycle is anchored to the Central calendar day on the backend
 * (see api-server `TimezoneUtil`) and the global countdown ticks to Central
 * midnight. Feeds must therefore window "today" in Central Time too — using the
 * device's local timezone (e.g. `date-fns` `startOfDay`) drops videos that are
 * still in the active Central cycle but already "yesterday" locally for users
 * west of Central. This is a faithful port of the backend's start/end-of-day
 * logic so the client and server agree on the cycle boundaries (DST included).
 */

const CENTRAL_TZ = 'America/Chicago';

/**
 * UTC offset of Central Time on the given instant, in ms (negative: CST = -6h,
 * CDT = -5h). Derived from the IANA database via Intl so DST is automatic.
 */
const getCentralTimeOffset = (date: Date): number => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: CENTRAL_TZ,
    timeZoneName: 'shortOffset',
  });
  const offsetPart =
    formatter.formatToParts(date).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-6';

  const match = offsetPart.match(/GMT([+-])(\d+)/);
  if (match) {
    const sign = match[1] === '-' ? -1 : 1;
    const hours = parseInt(match[2], 10);
    return sign * hours * 60 * 60 * 1000;
  }
  // Fallback to CST (UTC-6) if the runtime omits the offset.
  return -6 * 60 * 60 * 1000;
};

/** Calendar Y/M/D of `date` as it appears in Central Time. */
const getCentralDateComponents = (date: Date): { year: number; month: number; day: number } => {
  const centralStr = date.toLocaleString('en-US', {
    timeZone: CENTRAL_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // "MM/DD/YYYY"
  const [month, day, year] = centralStr.split(',')[0].split('/').map(Number);
  return { year, month, day };
};

/** Midnight (00:00:00.000) of `date`'s Central calendar day, as a UTC Date. */
export const toStartOfDayInCentralTime = (date: Date): Date => {
  const { year, month, day } = getCentralDateComponents(date);
  // Use noon UTC of that calendar day to pick the correct DST offset (avoids
  // midnight DST-transition edge cases).
  const noonUTC = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const offset = getCentralTimeOffset(noonUTC);
  const midnightUTC = Date.UTC(year, month - 1, day, 0, 0, 0, 0);
  return new Date(midnightUTC - offset);
};

/** Last millisecond (23:59:59.999) of `date`'s Central calendar day, as a UTC Date. */
export const toEndOfDayInCentralTime = (date: Date): Date =>
  new Date(toStartOfDayInCentralTime(date).getTime() + 24 * 60 * 60 * 1000 - 1);

/**
 * The current Central calendar day as `{ gte, lte }` UTC ISO strings, ready to
 * drop into a video query's `createdAt` filter so the feed matches the ranking
 * cycle in every timezone.
 */
export const centralDayRangeUtc = (now: Date = new Date()): { gte: string; lte: string } => ({
  gte: toStartOfDayInCentralTime(now).toISOString(),
  lte: toEndOfDayInCentralTime(now).toISOString(),
});

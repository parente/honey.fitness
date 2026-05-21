import type { DailyMiles } from './data';

export const PALETTE = [
  '#ddd7c7',
  '#cac4b4',
  '#b7b0a1',
  '#a49c8e',
  '#90887b',
  '#7d7468',
  '#696055',
  '#564c42',
  '#42382f',
];
export const EMPTY_COLOR = '#eeeeee';

/** Return the palette color for a given miles value, or EMPTY_COLOR for 0/missing. */
export function bucketColor(miles: number, max: number): string {
  if (miles <= 0 || max <= 0) return EMPTY_COLOR;
  const idx = Math.min(Math.floor((miles / max) * PALETTE.length), PALETTE.length - 1);
  return PALETTE[idx];
}

/** Build a Map<day-string, miles> for fast lookup. */
export function buildDayMap(data: DailyMiles[]): Map<string, number> {
  return new Map(data.map((d) => [d.day, d.miles]));
}

/** Return the max miles value in the dataset. */
export function maxMiles(data: DailyMiles[]): number {
  return data.reduce((m, d) => Math.max(m, d.miles), 0);
}

/** Format a YYYY-MM-DD date as a short label like "Jan 1". */
export function fmtShort(day: string): string {
  const d = new Date(day + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/**
 * Generate the list of week columns for a calendar grid between fromDay and toDay (inclusive).
 * Each week is an array of 7 day-strings (Sun–Sat), with '' for days outside the range.
 */
export function buildWeeks(fromDay: string, toDay: string): string[][] {
  const from = new Date(fromDay + 'T12:00:00Z');
  const to = new Date(toDay + 'T12:00:00Z');

  // Rewind to the Sunday on or before `from`
  const start = new Date(from);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  const weeks: string[][] = [];
  const cur = new Date(start);

  while (cur <= to) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      if (cur >= from && cur <= to) {
        week.push(cur.toISOString().slice(0, 10));
      } else {
        week.push('');
      }
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export const WHEEL_CIRCUMFERENCE_MILES = (8.5 * Math.PI) / 63360;
export const DATA_START = '2020-08-23';
export const DATA_END = '2022-01-20';

export interface DailyMiles {
  day: string; // YYYY-MM-DD
  miles: number;
}

/** Parse a minimal CSV (header row + data rows, values may be quoted). */
function parseCsv(text: string): Record<string, string>[] {
  const [headerLine, ...dataLines] = text.trim().split('\n');
  const headers = headerLine.split(',').map((h) => h.replace(/^"|"$/g, '').trim());
  return dataLines
    .filter((l) => l.trim())
    .map((line) => {
      const values = line.split(',').map((v) => v.replace(/^"|"$/g, '').trim());
      return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
    });
}

export async function loadLifetimeMiles(): Promise<DailyMiles[]> {
  const resp = await fetch('https://honey-data-public.s3.amazonaws.com/lifetime.csv');
  if (!resp.ok) throw new Error(`Failed to fetch lifetime.csv: ${resp.status}`);
  const rows = parseCsv(await resp.text());
  return rows
    .map((r) => ({ day: r['day'], miles: Number(r['value']) * WHEEL_CIRCUMFERENCE_MILES }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

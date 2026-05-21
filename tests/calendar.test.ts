import { describe, it, expect } from 'vitest';
import { bucketColor, buildWeeks, maxMiles, PALETTE, EMPTY_COLOR } from '../src/lib/calendar';
import type { DailyMiles } from '../src/lib/data';

describe('bucketColor', () => {
  it('returns EMPTY_COLOR for 0 miles', () => {
    expect(bucketColor(0, 10)).toBe(EMPTY_COLOR);
  });

  it('returns lightest color for small values', () => {
    expect(bucketColor(0.1, 10)).toBe(PALETTE[0]);
  });

  it('returns darkest color for max value', () => {
    expect(bucketColor(10, 10)).toBe(PALETTE[PALETTE.length - 1]);
  });
});

describe('maxMiles', () => {
  it('returns the maximum miles value', () => {
    const data: DailyMiles[] = [
      { day: '2021-01-01', miles: 3 },
      { day: '2021-01-02', miles: 7 },
      { day: '2021-01-03', miles: 1 },
    ];
    expect(maxMiles(data)).toBe(7);
  });
});

describe('buildWeeks', () => {
  it('starts on a Sunday', () => {
    const weeks = buildWeeks('2021-01-04', '2021-01-10'); // Mon–Sun
    // First week should start with '' (days before Mon) then Mon
    expect(weeks[0][0]).toBe(''); // Sunday before Jan 4
    expect(weeks[0][1]).toBe('2021-01-04'); // Monday
  });

  it('includes all days in range', () => {
    const weeks = buildWeeks('2021-01-01', '2021-01-07');
    const days = weeks.flat().filter((d) => d !== '');
    expect(days).toHaveLength(7);
    expect(days[0]).toBe('2021-01-01');
    expect(days[days.length - 1]).toBe('2021-01-07');
  });
});

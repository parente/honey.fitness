import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { loadLifetimeMiles, WHEEL_CIRCUMFERENCE_MILES } from '../src/lib/data';

const fixtureCsv = readFileSync(join(__dirname, 'fixtures/lifetime.csv'), 'utf-8');

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(fixtureCsv) })
  );
});

describe('loadLifetimeMiles', () => {
  it('returns rows sorted by day', async () => {
    const data = await loadLifetimeMiles();
    expect(data.map((d) => d.day)).toEqual(['2020-08-23', '2020-08-24', '2020-08-25']);
  });

  it('converts rotations to miles', async () => {
    const data = await loadLifetimeMiles();
    expect(data[1].miles).toBeCloseTo(10000 * WHEEL_CIRCUMFERENCE_MILES);
  });

  it('handles zero rotations', async () => {
    const data = await loadLifetimeMiles();
    expect(data[2].miles).toBe(0);
  });

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(loadLifetimeMiles()).rejects.toThrow('403');
  });
});

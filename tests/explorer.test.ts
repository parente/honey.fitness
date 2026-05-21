import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import MilesExplorer from '../src/components/MilesExplorer.svelte';
import SevenDayChart from '../src/components/SevenDayChart.svelte';
import type { DailyMiles } from '../src/lib/data';

const data: DailyMiles[] = [
  { day: '2020-08-23', miles: 1.2 },
  { day: '2020-08-24', miles: 2.3 },
  { day: '2020-08-25', miles: 0.5 },
  { day: '2020-08-26', miles: 3.1 },
  { day: '2020-08-27', miles: 1.8 },
  { day: '2020-08-28', miles: 2.0 },
  { day: '2020-08-29', miles: 0.9 },
  { day: '2020-08-30', miles: 1.5 },
];

describe('SevenDayChart', () => {
  it('renders 7 bars', () => {
    const { container } = render(SevenDayChart, { data, selectedDay: '2020-08-23' });
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(7);
  });

  it('shows miles labels for non-zero days', () => {
    const { container } = render(SevenDayChart, { data, selectedDay: '2020-08-23' });
    const texts = [...container.querySelectorAll('text')].map((t) => t.textContent?.trim());
    expect(texts).toContain('1.2');
  });

  it('pads with zero-mile days when window overruns data end', () => {
    const { container } = render(SevenDayChart, { data, selectedDay: '2020-08-28' });
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(7);
  });
});

describe('MilesExplorer', () => {
  it('renders the calendar', () => {
    const { container } = render(MilesExplorer, { data });
    expect(container.querySelectorAll('[data-day]').length).toBeGreaterThan(0);
  });

  it('updates selected cell when a calendar cell is clicked', async () => {
    const { container } = render(MilesExplorer, { data });
    const cell = container.querySelector('[data-day="2020-08-26"]') as SVGElement;
    await fireEvent.click(cell);
    expect(cell.getAttribute('aria-pressed')).toBe('true');
  });
});

<script lang="ts">
  import type { DailyMiles } from '../lib/data';
  import { fmtShort } from '../lib/calendar';

  interface Props {
    data: DailyMiles[];
    selectedDay: string;
  }

  let { data, selectedDay }: Props = $props();

  const BAR_W = 32;
  const BAR_GAP = 8;
  const CHART_H = 100;
  const LABEL_H = 28;
  const VALUE_H = 14;
  const SVG_H = VALUE_H + CHART_H + LABEL_H;
  const SVG_W = 7 * (BAR_W + BAR_GAP) - BAR_GAP;

  /** Add `n` days to a YYYY-MM-DD string without using Date mutation. */
  function addDays(day: string, n: number): string {
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const d = new Date(day + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  interface Bar {
    day: string;
    miles: number;
    x: number;
    barH: number;
    y: number;
  }

  const bars = $derived.by((): Bar[] => {
    const startIdx = data.findIndex((d) => d.day >= selectedDay);
    const slice = startIdx === -1 ? [] : data.slice(startIdx, startIdx + 7);
    const result: DailyMiles[] = [...slice];
    while (result.length < 7) {
      const lastDay = result.length > 0 ? result[result.length - 1].day : selectedDay;
      result.push({ day: addDays(lastDay, 1), miles: 0 });
    }
    const maxVal = Math.max(...result.map((d) => d.miles), 0.1);
    return result.map((d, i) => {
      const barH = Math.max(2, (d.miles / maxVal) * CHART_H);
      return {
        day: d.day,
        miles: d.miles,
        x: i * (BAR_W + BAR_GAP),
        barH,
        y: VALUE_H + CHART_H - barH,
      };
    });
  });
</script>

<div class="chart" aria-label="7-day running chart starting {selectedDay}">
  <svg width={SVG_W} height={SVG_H} role="img">
    {#each bars as bar (bar.day)}
      <rect x={bar.x} y={bar.y} width={BAR_W} height={bar.barH} rx="2" fill="#7d7468" />
      <text x={bar.x + BAR_W / 2} y={bar.y - 3} text-anchor="middle" font-size="9" fill="#211c20">
        {bar.miles > 0 ? bar.miles.toFixed(1) : ''}
      </text>
      <text
        x={bar.x + BAR_W / 2}
        y={VALUE_H + CHART_H + 12}
        text-anchor="middle"
        font-size="8"
        fill="#7d7468"
      >
        {fmtShort(bar.day).replace(' ', '\u00a0')}
      </text>
    {/each}
  </svg>
</div>

<style>
  .chart {
    margin: 1rem 0;
    overflow-x: auto;
  }

  svg {
    display: block;
  }
</style>

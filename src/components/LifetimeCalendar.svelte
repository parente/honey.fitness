<script lang="ts">
  import type { DailyMiles } from '../lib/data';
  import {
    bucketColor,
    buildDayMap,
    maxMiles,
    buildWeeks,
    fmtShort,
    EMPTY_COLOR,
  } from '../lib/calendar';

  interface Props {
    data: DailyMiles[];
    selectedDay: string;
    from?: string;
    to?: string;
    onselect: (day: string) => void;
  }

  let { data, selectedDay, from = '2020-08-20', to = '2022-01-18', onselect }: Props = $props();

  const dayMap = $derived(buildDayMap(data));
  const max = $derived(maxMiles(data));
  const years = $derived([...new Set(data.map((d) => d.day.slice(0, 4)))].sort());

  const CELL = 11;
  const GAP = 2;
  const STEP = CELL + GAP;
  const LABEL_W = 24;
  const MONTH_H = 14;
  const DOW_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  interface Cell {
    day: string;
    wi: number;
    di: number;
    miles: number;
    color: string;
    tipLabel: string;
  }

  interface YearData {
    year: string;
    svgW: number;
    svgH: number;
    monthLabels: { x: number; label: string }[];
    cells: Cell[];
  }

  function buildYearData(year: string): YearData {
    const yFrom = year === years[0] ? from : `${year}-01-01`;
    const yTo = year === years[years.length - 1] ? to : `${year}-12-31`;
    const weeks = buildWeeks(yFrom, yTo);
    const svgW = LABEL_W + weeks.length * STEP;
    const svgH = MONTH_H + 7 * STEP;

    const monthLabels: { x: number; label: string }[] = [];
    let lastMonth = '';
    weeks.forEach((week, wi) => {
      const firstDay = week.find((d) => d !== '');
      if (firstDay) {
        const m = firstDay.slice(5, 7);
        if (m !== lastMonth) {
          monthLabels.push({
            x: LABEL_W + wi * STEP,
            label: new Date(firstDay + 'T12:00:00Z').toLocaleDateString('en-US', {
              month: 'short',
              timeZone: 'UTC',
            }),
          });
          lastMonth = m;
        }
      }
    });

    const cells: Cell[] = [];
    weeks.forEach((week, wi) => {
      week.forEach((day, di) => {
        if (!day) return;
        const miles = dayMap.get(day) ?? 0;
        const color = bucketColor(miles, max);
        const tipLabel =
          color === EMPTY_COLOR
            ? `${fmtShort(day)}: no data`
            : `${fmtShort(day)}: ${miles.toFixed(1)} mi`;
        cells.push({ day, wi, di, miles, color, tipLabel });
      });
    });

    return { year, svgW, svgH, monthLabels, cells };
  }

  const yearData = $derived(years.map(buildYearData));

  // All valid days in order for keyboard navigation
  const allDays = $derived(
    data
      .map((d) => d.day)
      .filter((d) => d >= from && d <= to)
      .sort()
  );

  function handleKey(e: KeyboardEvent, day: string) {
    const idx = allDays.indexOf(day);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onselect(day);
    } else if (e.key === 'ArrowRight' && idx < allDays.length - 1) {
      e.preventDefault();
      onselect(allDays[idx + 1]);
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      onselect(allDays[idx - 1]);
    } else if (e.key === 'ArrowDown' && idx + 7 < allDays.length) {
      e.preventDefault();
      onselect(allDays[idx + 7]);
    } else if (e.key === 'ArrowUp' && idx - 7 >= 0) {
      e.preventDefault();
      onselect(allDays[idx - 7]);
    }
  }
</script>

<div class="calendar" aria-label="Lifetime running calendar — click a day to explore">
  {#each yearData as yd (yd.year)}
    <div class="year-block">
      <svg width={yd.svgW} height={yd.svgH} role="img" aria-label="{yd.year} running activity">
        {#each yd.monthLabels as ml (ml.x)}
          <text x={ml.x} y={10} font-size="9" fill="#7d7468">{ml.label}</text>
        {/each}

        {#each DOW_LABELS as label, di (di)}
          <text
            x={LABEL_W - 3}
            y={MONTH_H + di * STEP + CELL - 2}
            font-size="8"
            fill="#7d7468"
            text-anchor="end">{label}</text
          >
        {/each}

        {#each yd.cells as cell (cell.day)}
          <rect
            x={LABEL_W + cell.wi * STEP}
            y={MONTH_H + cell.di * STEP}
            width={CELL}
            height={CELL}
            rx="2"
            fill={cell.color}
            stroke={cell.day === selectedDay ? '#211c20' : 'none'}
            stroke-width={cell.day === selectedDay ? 1.5 : 0}
            data-day={cell.day}
            role="button"
            tabindex="0"
            aria-pressed={cell.day === selectedDay}
            aria-label={cell.tipLabel}
            onclick={() => onselect(cell.day)}
            onkeydown={(e) => handleKey(e, cell.day)}
            style="cursor: pointer;"
          >
            <title>{cell.tipLabel}</title>
          </rect>
        {/each}
      </svg>
    </div>
  {/each}
</div>

<style>
  .calendar {
    margin: 2rem 0;
    overflow-x: auto;
  }

  .year-block {
    margin-bottom: 1rem;
  }

  .year-block svg {
    display: block;
  }
</style>

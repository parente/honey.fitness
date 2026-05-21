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

  const CELL = 10;
  const GAP = 1;
  const STEP = CELL + GAP;
  const LABEL_W = 24;
  const YEAR_H = 12; // height for year label row
  const MONTH_H = 12; // height for month label row
  const TOP_H = YEAR_H + MONTH_H; // total top margin

  const DOW_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  // Responsive: measure container width to derive weeks per row
  let containerEl: HTMLDivElement | undefined = $state();
  let containerW = $state(600);
  let measured = $state(false);

  $effect(() => {
    if (!containerEl || typeof ResizeObserver === 'undefined') return;
    const obs = new ResizeObserver((entries) => {
      containerW = entries[0].contentRect.width;
      measured = true;
    });
    obs.observe(containerEl);
    return () => obs.disconnect();
  });

  const weeksPerRow = $derived(Math.max(4, Math.floor((containerW - LABEL_W) / STEP)));

  interface Cell {
    day: string;
    wi: number;
    di: number;
    miles: number;
    color: string;
    tipLabel: string;
  }

  interface Row {
    rowIdx: number;
    cells: Cell[];
    monthLabels: { x: number; label: string }[];
    yearLabels: { x: number; year: string }[];
    svgW: number;
    svgH: number;
  }

  const rows = $derived.by((): Row[] => {
    const allWeeks = buildWeeks(from, to);
    const result: Row[] = [];

    for (let start = 0; start < allWeeks.length; start += weeksPerRow) {
      const rowWeeks = allWeeks.slice(start, start + weeksPerRow);
      const cells: Cell[] = [];
      const monthLabels: { x: number; label: string }[] = [];
      const yearLabels: { x: number; year: string }[] = [];
      let lastMonth = '';
      let lastYear = '';

      rowWeeks.forEach((week, wi) => {
        const firstDay = week.find((d) => d !== '');
        if (firstDay) {
          const m = firstDay.slice(5, 7);
          const y = firstDay.slice(0, 4);
          if (y !== lastYear) {
            yearLabels.push({ x: LABEL_W + wi * STEP, year: y });
            lastYear = y;
            lastMonth = ''; // force month label after year label
          }
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

      const svgW = LABEL_W + rowWeeks.length * STEP;
      const svgH = TOP_H + 7 * STEP;
      result.push({ rowIdx: start, cells, monthLabels, yearLabels, svgW, svgH });
    }

    return result;
  });

  // Tooltip
  let tooltip: { label: string; x: number; y: number } | null = $state(null);

  function showTooltip(e: MouseEvent | FocusEvent, label: string) {
    const rect = (e.currentTarget as Element).getBoundingClientRect();
    const containerRect = containerEl!.getBoundingClientRect();
    tooltip = {
      label,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 6,
    };
  }

  function hideTooltip() {
    tooltip = null;
  }

  // Keyboard nav
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

<div
  class="calendar"
  aria-label="Lifetime running calendar"
  bind:this={containerEl}
  style="opacity: {measured ? 1 : 0}; transition: opacity 0.15s ease;"
>
  {#each rows as row (row.rowIdx)}
    <svg
      width={row.svgW}
      height={row.svgH}
      role="img"
      aria-label="Running activity"
      style="max-width:100%;display:block;margin-bottom:2px;"
    >
      {#each row.yearLabels as yl (yl.year)}
        <text x={yl.x} y={YEAR_H - 2} font-size="9" font-weight="bold" fill="#42382f"
          >{yl.year}</text
        >
      {/each}

      {#each row.monthLabels as ml (ml.x)}
        <text x={ml.x} y={TOP_H - 2} font-size="9" fill="#7d7468">{ml.label}</text>
      {/each}

      {#each DOW_LABELS as label, di (di)}
        <text
          x={LABEL_W - 3}
          y={TOP_H + di * STEP + CELL - 2}
          font-size="8"
          fill="#7d7468"
          text-anchor="end">{label}</text
        >
      {/each}

      {#each row.cells as cell (cell.day)}
        <rect
          x={LABEL_W + cell.wi * STEP}
          y={TOP_H + cell.di * STEP}
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
          onmouseenter={(e) => showTooltip(e, cell.tipLabel)}
          onmouseleave={hideTooltip}
          onfocus={(e) => showTooltip(e, cell.tipLabel)}
          onblur={hideTooltip}
          style="cursor:pointer;"
        >
        </rect>
      {/each}
    </svg>
  {/each}

  {#if tooltip}
    <div class="tooltip" style="left:{tooltip.x}px;top:{tooltip.y}px;">
      {tooltip.label}
    </div>
  {/if}
</div>

<style>
  .calendar {
    margin: 2rem 0;
    position: relative;
  }

  .tooltip {
    position: absolute;
    transform: translate(-50%, -100%);
    background: #211c20;
    color: #f8f6f2;
    font-size: 0.75rem;
    padding: 3px 7px;
    border-radius: 3px;
    pointer-events: none;
    white-space: nowrap;
    z-index: 10;
  }
</style>

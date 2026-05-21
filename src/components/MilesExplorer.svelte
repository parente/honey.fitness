<script lang="ts">
  import { onMount } from 'svelte';
  import type { DailyMiles } from '../lib/data';
  import { DATA_START } from '../lib/data';
  import LifetimeCalendar from './LifetimeCalendar.svelte';
  import SevenDayChart from './SevenDayChart.svelte';

  interface Props {
    data: DailyMiles[];
  }

  let { data }: Props = $props();

  let selectedDay = $state(DATA_START);

  onMount(() => {
    const hash = window.location.hash.slice(1);
    if (/^\d{4}-\d{2}-\d{2}$/.test(hash)) {
      selectedDay = hash;
    }
  });

  function handleSelect(day: string) {
    selectedDay = day;
    history.replaceState(null, '', `#${day}`);
  }
</script>

<div class="explorer">
  <LifetimeCalendar {data} {selectedDay} onselect={handleSelect} />
  <div class="chart-section">
    <h2>7 days starting {selectedDay}</h2>
    <SevenDayChart {data} {selectedDay} />
  </div>
</div>

<style>
  .explorer {
    margin: 2rem 0;
  }

  .chart-section {
    margin-top: 1.5rem;
  }

  .chart-section h2 {
    font-size: 0.85rem;
    color: #7d7468;
    margin: 0 0 0.5rem;
  }
</style>

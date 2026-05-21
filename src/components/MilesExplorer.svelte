<script lang="ts">
  import { onMount } from 'svelte';
  import type { DailyMiles } from '../lib/data';
  import { DATA_START } from '../lib/data';
  import LifetimeCalendar from './LifetimeCalendar.svelte';

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

<LifetimeCalendar {data} {selectedDay} onselect={handleSelect} />

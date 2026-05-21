import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://honey.parente.dev',
  output: 'static',
  integrations: [svelte()],
});

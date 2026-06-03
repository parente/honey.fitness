# honey.fitness

A memorial for Honey the Syrian long-haired hamster, who ran over 1,886 miles in her exercise
wheel between August 2020 and January 2022.

Live at **[honey.parente.dev](https://honey.parente.dev)**. Includes the original page
explaining how the tracking worked.

## Stack

- [Astro](https://astro.build) — static site generator (`output: 'static'`)
- [Svelte 5](https://svelte.dev) — interactive island (calendar + tooltips)
- [Cloudflare Pages](https://pages.cloudflare.com) — hosting via Git integration
- Data: build-time fetch from `https://honey-data-public.s3.amazonaws.com/lifetime.csv`

## Local development

```bash
npm install
npm run dev        # dev server at http://localhost:4321
npm run build      # production build → dist/
npm run preview    # preview the production build
npm run check      # Astro + TypeScript type check
npm run lint       # Prettier + ESLint
npm run test       # Vitest
```

## Data sources

All data is frozen as of January 2022 (when Honey passed away):

| File           | Description                                   |
| -------------- | --------------------------------------------- |
| `lifetime.csv` | Daily wheel rotations for Honey's entire life |

Hosted at `https://honey-data-public.s3.amazonaws.com/`. Source: [honey.data](https://github.com/parente/honey.data).

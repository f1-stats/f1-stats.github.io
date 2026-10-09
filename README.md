# F1 Stats

F1 Stats is a bilingual Formula 1 statistics and tools website featuring season standings, race schedules and results, driver and team comparisons, and interactive calculators.

## Features

- Driver and constructor standings with individual detail pages
- Race calendar, weekend schedules, qualifying, Sprint, and Grand Prix results
- Qualifying lap-time, race-points, and driver season-points charts
- Driver and team comparisons with race-by-race championship simulators
- Grand Prix points, lap-time delta, and pit-stop strategy calculators
- Responsive desktop and mobile layouts with English and Chinese interface text
- Generated sitemap and GitHub Pages deployment

## Tech Stack

- Next.js 15, React 19, and TypeScript
- Tailwind CSS 4 and Lucide React
- Static export for GitHub Pages
- Jolpica F1 API data stored as JSON snapshots in `data/`

## Getting Started

Requires Node.js 20 or a compatible version.

```sh
npm install
npm run dev
```

The development server runs at <http://localhost:3000> by default.

To refresh missing results for completed races from Jolpica F1, run:

```sh
npm run data:update
```

## Build and Deployment

```sh
npm run build
```

Next.js writes the static export to `out/`. The GitHub Actions workflow at `.github/workflows/pages.yml` refreshes race data, builds, and deploys the site to GitHub Pages when changes are pushed to `main`, on its daily schedule, or when run manually.

## Routes

| Route                             | Description                                                   |
| --------------------------------- | ------------------------------------------------------------- |
| `/`                               | Home page with standings highlights and recent/upcoming races |
| `/<year>`                         | Season home, standings highlights, and race status             |
| `/<year>/drivers`, `/<year>/drivers/[driverId]` | Driver standings and season details       |
| `/<year>/teams`, `/<year>/teams/[teamId]`       | Constructor standings and team details    |
| `/<year>/races`, `/<year>/races/[round]`        | Race calendar and weekend details         |
| `/<year>/compare`                 | Driver/team comparisons and championship scenarios            |
| `/tools`                          | Calculator directory                                          |
| `/tools/points-calculator`        | Grand Prix and Sprint points calculator                       |
| `/tools/lap-time-calculator`      | Lap-time delta calculator                                     |
| `/tools/pit-stop-calculator`      | Pit-stop strategy calculator                                  |
| `/policy`                         | Privacy policy                                                |
| `/contact`                        | Contact and feedback                                          |

## Data

Pages read static JSON snapshots and do not fetch live data from an external API on each visit. Each season's snapshots and metadata live in `data/<year>/`; the year selector and static season routes are generated from those directories. Add a season directory with the standings, schedule, and per-round JSON files to make that season available.

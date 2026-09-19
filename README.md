# Paygate

Multi-tenant payment orchestration console for onboarding merchants, managing payment channels and reconciling collections.

## Tech stack

- [TanStack Start](https://tanstack.com/start) and TanStack Router (file-based routing)
- React 19 and TypeScript
- Tailwind CSS v4 with [shadcn/ui](https://ui.shadcn.com) components
- Vite, built for Cloudflare Workers via Nitro
- [Bun](https://bun.sh) for package management

## Getting started

Requires [Bun](https://bun.sh/docs/installation).

```sh
bun install
bun dev
```

The dev server runs at http://localhost:8080.

## Scripts

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `bun dev`        | Start the dev server               |
| `bun run build`  | Production build (`.output/`)      |
| `bun run preview`| Preview the production build       |
| `bun run lint`   | Lint with ESLint                   |
| `bun run format` | Format with Prettier               |

## Project structure

- `src/routes/` — TanStack Router file-based routes
- `src/components/` — UI components (shadcn/ui primitives in `src/components/ui`)
- `src/lib/` — shared utilities, session handling and types
- `src/lib/mock-data.ts` — mock data used until the Go backend is connected

## Backend

The UI currently runs against mock data in `src/lib/mock-data.ts`. It will be connected to the Go backend when that is ready.

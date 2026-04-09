# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a Ukrainian clicker game "Українець: Шлях До Успіху".

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Main App: Українець: Шлях До Успіху

A mobile-first clicker game built with React + TypeScript + Vite + Tailwind CSS + Framer Motion.

### Game Features
- **5 Tabs**: Life (main clicker), Work (jobs), Business (passive income), Skills (upgrades), Market (shop)
- **Resources**: Money, Health, Reputation, Corruption
- **Stage Progression**: Village → Town → City → Kyiv → Elite (based on total earnings)
- **Random Events**: 12+ events with moral choices (honest vs corrupt paths)
- **Skills**: 8 skills (Farming, Oratory, Bribery, Haggling, Networking, Driving, Accounting, Marketing)
- **Businesses**: 6 businesses with passive income and upgrade system
- **Market**: 8 items including consumables and permanent bonuses
- **Save/Load**: Auto-save to localStorage every 30 seconds

### Key Files
- `artifacts/ukrainian-clicker/src/App.tsx` — Main game shell
- `artifacts/ukrainian-clicker/src/hooks/useGameState.ts` — All state management + localStorage
- `artifacts/ukrainian-clicker/src/hooks/usePassiveIncome.ts` — Passive income ticker
- `artifacts/ukrainian-clicker/src/data/` — Game data (events, jobs, businesses, skills, market)
- `artifacts/ukrainian-clicker/src/components/` — UI components
- `artifacts/ukrainian-clicker/src/pages/` — Tab pages

### Visual Style
- Ukrainian village aesthetic with earthy tones
- Colors: Background #e8dcc4, Primary #8b4513, Accent #ffd700
- Fonts: Russo One (headings), Rubik (body) from Google Fonts
- Sharp borders (2px radius), thick dark borders (#2a1f0f)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

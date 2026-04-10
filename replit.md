# Українець: Шлях До Успіху

A mobile-first Ukrainian idle clicker game built with React + Vite + TypeScript. The player progresses from a village farmer to an oligarch through work, businesses, skills, and moral choices.

## Architecture

**Monorepo** using `pnpm` workspaces. Game lives at `artifacts/ukrainian-clicker`.

### Key Files

- `src/hooks/useGameState.ts` — entire game state, all actions, save/load, achievements, events
- `src/hooks/usePassiveIncome.ts` — 1-second passive income tick
- `src/hooks/useSound.ts` — Web Audio API synthesized sound effects
- `src/App.tsx` — root component, wires all tabs and modals
- `src/data/` — all static game data (events, jobs, businesses, skills, market, achievements, dailyTasks, dailyRewards)
- `src/pages/` — 6 tabs: Life, Work, Business, Skills, Market, Settings
- `src/components/` — shared UI components

### Save System

- Key: `ukrainian_clicker_save_v3`
- Auto-saves every 30 seconds via `setInterval` (uses a ref so it always saves latest state)
- Also saves on tab switch and `beforeunload`
- Schema versioning — incompatible old saves rejected gracefully
- NaN sanitization on load

### Game Systems

**Progression:** 5 stages (Village → Town → City → Kyiv → Elite) driven by `totalEarned` thresholds: ₴1k / ₴10k / ₴100k / ₴1M

**Jobs:** 6 jobs from farm labor (₴20/click) to accountant (₴150/click), each requiring level + optional skill

**Businesses:** 8 businesses with passive income per second. Upgrade cost formula: `bizCost × 1.8^currentLevel` — single source of truth in `getBusinessUpgradeCost()` exported from useGameState

**Skills:** 8 skills (farming, oratory, bribery, haggling, networking, driving, accounting, marketing), each 5 levels, cost = `baseCost × 1.5^currentLevel`

**Events:** 18 random events (25% chance per work click) with honest/corrupt choices affecting money/health/reputation/corruption/XP

**Achievements:** 26 achievements with instant popup notifications and monetary/XP rewards

**Daily Tasks:** 3 rotating tasks per day (seeded shuffle using mulberry32 PRNG), tracked per session metric

**Daily Login Rewards:** 7-day streak system with escalating rewards. Day 7 = Golden Boots permanent bonus

**Offline Progress:** Up to 8 hours of passive income calculated on return, displayed in modal

### Economy Balance

| Stage | When reached | Primary income |
|-------|-------------|----------------|
| 1 Village | Start | Work clicks (₴20-60/click) |
| 2 Town | ₴1,000 earned | First business + work |
| 3 City | ₴10,000 earned | Passive businesses |
| 4 Kyiv | ₴100,000 earned | Upgraded businesses |
| 5 Elite | ₴1,000,000 earned | All systems active |

First business (Street Food ₴500) reachable in ~5-10 minutes of play.

### Key formulas

```ts
// XP to level up
getLevelXpNeeded(level) = Math.floor(100 × level^1.5)

// Business upgrade cost (single source of truth)
getBusinessUpgradeCost(cost, level) = Math.floor(cost × 1.8^level)

// Business passive income with marketing bonus
income = biz.passiveIncome × 2^(ownedLevel-1) × (1 + marketing × 0.1)

// Work earnings with all bonuses
earn = Math.floor((job.earnPerShift + farming×5) × (1 + workBootsBonus))
```

### Critical Bug Fixes Applied

1. BusinessTab upgrade cost was wrong (`cost × 3 × level`) — fixed to use shared `getBusinessUpgradeCost()`
2. Autosave interval was re-created on every state change (never fired) — fixed with `stateRef`
3. Daily reward double-triggered after offline earnings collection — fixed with `dailyLoginChecked` ref
4. `getDailyTasksForDate` shuffle was broken (same comparator value) — fixed with mulberry32 seeded PRNG
5. AdModal typed as `string | null` instead of union — fixed to `AdModalType`

## Development

```bash
pnpm --filter @workspace/ukrainian-clicker run dev
```

Server runs on `PORT` env var (default 19477 in dev).

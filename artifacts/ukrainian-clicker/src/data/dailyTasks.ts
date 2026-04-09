export interface DailyTask {
  id: string;
  label: string;
  emoji: string;
  goal: number;
  metric: "workClicks" | "skillUpgrades" | "marketPurchases" | "moneyEarned";
  reward: {
    money?: number;
    experience?: number;
    health?: number;
  };
}

export const allDailyTasks: DailyTask[] = [
  {
    id: "work_shifts",
    label: "Відпрацювати 20 змін",
    emoji: "💼",
    goal: 20,
    metric: "workClicks",
    reward: { money: 300 },
  },
  {
    id: "upgrade_skill",
    label: "Покращити навичку",
    emoji: "📚",
    goal: 1,
    metric: "skillUpgrades",
    reward: { experience: 15 },
  },
  {
    id: "buy_food",
    label: "Купити їжу",
    emoji: "🍲",
    goal: 1,
    metric: "marketPurchases",
    reward: { health: 5 },
  },
  {
    id: "earn_1000",
    label: "Заробити ₴1,000",
    emoji: "💰",
    goal: 1000,
    metric: "moneyEarned",
    reward: { money: 200 },
  },
  {
    id: "work_50",
    label: "Відпрацювати 50 змін",
    emoji: "⚒️",
    goal: 50,
    metric: "workClicks",
    reward: { money: 600, experience: 10 },
  },
  {
    id: "earn_5000",
    label: "Заробити ₴5,000",
    emoji: "💳",
    goal: 5000,
    metric: "moneyEarned",
    reward: { money: 500 },
  },
  {
    id: "upgrade_2_skills",
    label: "Покращити 2 навички",
    emoji: "🎓",
    goal: 2,
    metric: "skillUpgrades",
    reward: { experience: 25, money: 200 },
  },
  {
    id: "buy_2_items",
    label: "Купити 2 товари",
    emoji: "🛒",
    goal: 2,
    metric: "marketPurchases",
    reward: { money: 150, health: 10 },
  },
];

/** Seeded pseudo-random number generator (mulberry32) for deterministic daily task selection */
function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getDailyTasksForDate(dateStr: string): DailyTask[] {
  const seed = dateStr.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
  const rand = mulberry32(Math.abs(seed));
  const shuffled = [...allDailyTasks]
    .map((t) => ({ t, r: rand() }))
    .sort((a, b) => a.r - b.r)
    .map(({ t }) => t);
  return shuffled.slice(0, 3);
}

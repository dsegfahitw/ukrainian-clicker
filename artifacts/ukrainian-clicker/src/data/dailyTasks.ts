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

export function getDailyTasksForDate(dateStr: string): DailyTask[] {
  const seed = dateStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const shuffled = [...allDailyTasks].sort(() => {
    const r = Math.sin(seed) * 10000;
    return r - Math.floor(r) - 0.5;
  });
  return shuffled.slice(0, 3);
}

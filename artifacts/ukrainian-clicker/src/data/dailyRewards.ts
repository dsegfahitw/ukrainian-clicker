export interface DailyReward {
  day: number;
  emoji: string;
  label: string;
  effect: {
    money?: number;
    health?: number;
    reputation?: number;
    permanent?: string;
  };
}

export const dailyRewards: DailyReward[] = [
  {
    day: 1,
    emoji: "💰",
    label: "₴200",
    effect: { money: 200 },
  },
  {
    day: 2,
    emoji: "💰",
    label: "₴500",
    effect: { money: 500 },
  },
  {
    day: 3,
    emoji: "❤️",
    label: "+10 Здоров'я",
    effect: { health: 10 },
  },
  {
    day: 4,
    emoji: "💰",
    label: "₴1,000",
    effect: { money: 1000 },
  },
  {
    day: 5,
    emoji: "⭐",
    label: "+5 Репутація",
    effect: { reputation: 5 },
  },
  {
    day: 6,
    emoji: "💰",
    label: "₴2,500",
    effect: { money: 2500 },
  },
  {
    day: 7,
    emoji: "🥾",
    label: "Золоті черевики (+20% доходу)",
    effect: { permanent: "work_earnings_20", money: 500 },
  },
];

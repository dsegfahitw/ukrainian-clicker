export interface MarketItem {
  id: string;
  name: string;
  emoji: string;
  basePrice: number;
  effect: {
    health?: number;
    reputation?: number;
    permanent?: string;
  };
  description: string;
  consumable: boolean;
}

export const marketItems: MarketItem[] = [
  {
    id: "bread",
    name: "Хліб",
    emoji: "🍞",
    basePrice: 10,
    effect: { health: 10 },
    description: "+10 здоров'я",
    consumable: true,
  },
  {
    id: "borscht",
    name: "Борщ",
    emoji: "🍲",
    basePrice: 25,
    effect: { health: 25 },
    description: "+25 здоров'я",
    consumable: true,
  },
  {
    id: "medkit",
    name: "Аптечка",
    emoji: "💊",
    basePrice: 50,
    effect: { health: 40 },
    description: "+40 здоров'я",
    consumable: true,
  },
  {
    id: "hospital",
    name: "Лікарня",
    emoji: "🏥",
    basePrice: 200,
    effect: { health: 100 },
    description: "Повне відновлення здоров'я",
    consumable: true,
  },
  {
    id: "vodka",
    name: "Горілка",
    emoji: "🍶",
    basePrice: 30,
    effect: { health: 15, reputation: -5 },
    description: "+15 здоров'я, -5 репутація",
    consumable: true,
  },
  {
    id: "work_boots",
    name: "Робочі черевики",
    emoji: "🥾",
    basePrice: 80,
    effect: { permanent: "work_earnings_10" },
    description: "+10% заробітку (назавжди)",
    consumable: false,
  },
  {
    id: "premium_boots",
    name: "Преміум черевики",
    emoji: "👟",
    basePrice: 500,
    effect: { permanent: "work_earnings_20" },
    description: "+20% заробітку (назавжди)",
    consumable: false,
  },
  {
    id: "business_suit",
    name: "Діловий костюм",
    emoji: "👔",
    basePrice: 500,
    effect: { permanent: "reputation_gain_15" },
    description: "+15% приросту репутації (назавжди)",
    consumable: false,
  },
  {
    id: "energy_drink",
    name: "Енергетик",
    emoji: "⚡",
    basePrice: 40,
    effect: { health: 20, reputation: -2 },
    description: "+20 здоров'я, -2 репутація",
    consumable: true,
  },
  {
    id: "lawyer",
    name: "Адвокат",
    emoji: "⚖️",
    basePrice: 1000,
    effect: { permanent: "court_protection" },
    description: "Захист від судових подій",
    consumable: false,
  },
];

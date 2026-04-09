export interface Skill {
  id: string;
  name: string;
  emoji: string;
  baseCost: number;
  maxLevel: number;
  description: string;
  effectDescription: string;
}

export const skills: Skill[] = [
  {
    id: "farming",
    name: "Фермерство",
    emoji: "🌾",
    baseCost: 50,
    maxLevel: 5,
    description: "Вміння працювати на землі",
    effectDescription: "+5₴ за клік за рівень",
  },
  {
    id: "oratory",
    name: "Ораторство",
    emoji: "🎤",
    baseCost: 80,
    maxLevel: 5,
    description: "Мистецтво переконувати людей",
    effectDescription: "Кращі результати подій",
  },
  {
    id: "bribery",
    name: "Хабарництво",
    emoji: "💸",
    baseCost: 100,
    maxLevel: 5,
    description: "Вміння домовлятися неофіційно",
    effectDescription: "Дешевші хабарі у подіях",
  },
  {
    id: "haggling",
    name: "Торгівля",
    emoji: "🤝",
    baseCost: 60,
    maxLevel: 5,
    description: "Вміння збивати ціну",
    effectDescription: "-10% ціни на ринку за рівень",
  },
  {
    id: "networking",
    name: "Зв'язки",
    emoji: "📞",
    baseCost: 70,
    maxLevel: 5,
    description: "Корисні знайомства",
    effectDescription: "+5% репутації за рівень",
  },
  {
    id: "driving",
    name: "Водіння",
    emoji: "🚗",
    baseCost: 120,
    maxLevel: 5,
    description: "Водійські права та навички",
    effectDescription: "Відкриває роботу водія",
  },
  {
    id: "accounting",
    name: "Бухгалтерія",
    emoji: "📊",
    baseCost: 150,
    maxLevel: 5,
    description: "Фінансова грамотність",
    effectDescription: "Відкриває бухгалтера та логістику",
  },
  {
    id: "marketing",
    name: "Маркетинг",
    emoji: "📣",
    baseCost: 100,
    maxLevel: 5,
    description: "Вміння просувати бізнес",
    effectDescription: "+10% пасивного доходу за рівень",
  },
];

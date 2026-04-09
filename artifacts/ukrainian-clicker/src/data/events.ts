export interface GameEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  minStage?: number;
  maxStage?: number;
  choices: {
    label: string;
    emoji: string;
    type: "honest" | "corrupt";
    effects: {
      money?: number;
      health?: number;
      reputation?: number;
      corruption?: number;
      experience?: number;
      skipPassiveSeconds?: number;
      skipDays?: number;
      marketPriceMultiplier?: number;
    };
    riskChance?: number;
    riskEffects?: {
      money?: number;
      health?: number;
      reputation?: number;
      corruption?: number;
    };
  }[];
  forced?: boolean;
}

export const events: GameEvent[] = [
  {
    id: "neighbor_favor",
    title: "Сусід просить допомоги",
    description: "Сусід Василь потребує допомоги з дозволом на будівництво. Можеш допомогти через офіційні канали або дати хабар чиновнику.",
    emoji: "🏘️",
    choices: [
      {
        label: "Допомогти чесно",
        emoji: "😇",
        type: "honest",
        effects: { reputation: 50, experience: 15 },
      },
      {
        label: "Дати хабар",
        emoji: "😈",
        type: "corrupt",
        effects: { money: 200, corruption: 15, reputation: -5, experience: 10 },
      },
    ],
  },
  {
    id: "tax_inspector",
    title: "Податковий інспектор",
    description: "До вас прийшов податковий інспектор з перевіркою. Можете сплатити всі податки або спробувати домовитися.",
    emoji: "📋",
    choices: [
      {
        label: "Сплатити податки",
        emoji: "😇",
        type: "honest",
        effects: { money: -100, reputation: 10, experience: 10 },
      },
      {
        label: "Дати хабар",
        emoji: "😈",
        type: "corrupt",
        effects: { money: -50, corruption: 20, experience: 5 },
        riskChance: 0.2,
        riskEffects: { money: -500, reputation: -10 },
      },
    ],
  },
  {
    id: "found_money",
    title: "Знайшов гроші на вулиці",
    description: "Ви знайшли гаманець з грошима на землі. Ніхто не бачить... Що зробите?",
    emoji: "💰",
    choices: [
      {
        label: "Здати в поліцію",
        emoji: "😇",
        type: "honest",
        effects: { reputation: 15, money: 50, experience: 10 },
      },
      {
        label: "Забрати собі",
        emoji: "😈",
        type: "corrupt",
        effects: { money: 200, corruption: 5, experience: 5 },
      },
    ],
  },
  {
    id: "sick_coworker",
    title: "Хворий колега",
    description: "Ваш колега захворів і не може вийти на зміну. Начальник просить вас підмінити або повідомити керівництву.",
    emoji: "🤒",
    choices: [
      {
        label: "Підмінити колегу",
        emoji: "😇",
        type: "honest",
        effects: { reputation: 20, health: -10, experience: 15, skipPassiveSeconds: 10 },
      },
      {
        label: "Донести начальству",
        emoji: "😈",
        type: "corrupt",
        effects: { money: 100, reputation: -10, experience: 5 },
      },
    ],
  },
  {
    id: "shady_deal",
    title: "Сумнівна пропозиція",
    description: "Бізнес-партнер пропонує заробити великі гроші, але схема виглядає підозріло...",
    emoji: "🤝",
    choices: [
      {
        label: "Відмовитися",
        emoji: "😇",
        type: "honest",
        effects: { reputation: 10, experience: 10 },
      },
      {
        label: "Погодитися",
        emoji: "😈",
        type: "corrupt",
        effects: { money: 500, corruption: 25, reputation: -15, experience: 15 },
      },
    ],
  },
  {
    id: "gang_protection",
    title: "Рекет!",
    description: "Місцева банда вимагає «дах» — гроші за захист. Якщо відмовити, можуть побити.",
    emoji: "👊",
    choices: [
      {
        label: "Заплатити",
        emoji: "💸",
        type: "corrupt",
        effects: { money: -150, reputation: -5, experience: 5 },
      },
      {
        label: "Відмовити",
        emoji: "💪",
        type: "honest",
        effects: { health: -20, reputation: 15, experience: 20 },
      },
    ],
  },
  {
    id: "inflation_crisis",
    title: "Інфляційна криза!",
    description: "Ціни на все зросли на 30%! Потрібно якось пережити цей період...",
    emoji: "📈",
    forced: true,
    choices: [
      {
        label: "Терпіти далі",
        emoji: "😤",
        type: "honest",
        effects: { experience: 10, marketPriceMultiplier: 1.3 },
      },
    ],
  },
  {
    id: "judge_offer",
    title: "Суддя пропонує угоду",
    description: "Ви потрапили під суд. Суддя натякає, що справу можна закрити за певну суму...",
    emoji: "⚖️",
    minStage: 3,
    choices: [
      {
        label: "Дати хабар",
        emoji: "😈",
        type: "corrupt",
        effects: { money: -1000, corruption: 30, experience: 20 },
      },
      {
        label: "Боротися чесно",
        emoji: "😇",
        type: "honest",
        effects: { reputation: 20, experience: 25 },
        riskChance: 0.5,
        riskEffects: { money: -2000, reputation: -10 },
      },
    ],
  },
  {
    id: "politician_support",
    title: "Депутат шукає підтримку",
    description: "Місцевий депутат пропонує фінансову підтримку в обмін на вашу лояльність та голоси.",
    emoji: "🏛️",
    minStage: 4,
    choices: [
      {
        label: "Підтримати",
        emoji: "🤝",
        type: "corrupt",
        effects: { money: 2000, corruption: 15, experience: 30 },
      },
      {
        label: "Відмовити",
        emoji: "😇",
        type: "honest",
        effects: { reputation: 5, experience: 10 },
      },
    ],
  },
  {
    id: "viral_post",
    title: "Вірусний пост про вас!",
    description: "Хтось написав про вас у соцмережах. Це може бути як позитивна, так і негативна увага...",
    emoji: "📱",
    choices: [
      {
        label: "Позитивна історія",
        emoji: "🌟",
        type: "honest",
        effects: { reputation: 25, experience: 15 },
      },
      {
        label: "Продати інтерв'ю таблоїду",
        emoji: "💰",
        type: "corrupt",
        effects: { reputation: -20, money: 300, experience: 10 },
      },
    ],
  },
  {
    id: "bolt_delivery",
    title: "Bolt Food пропозиція",
    description: "Є можливість підзаробити на доставці їжі. Робота важка, але платять непогано.",
    emoji: "🛵",
    choices: [
      {
        label: "Взяти зміну",
        emoji: "💪",
        type: "honest",
        effects: { money: 300, health: -15, experience: 15 },
      },
      {
        label: "Відпочити",
        emoji: "😴",
        type: "honest",
        effects: { health: 10, experience: 5 },
      },
    ],
  },
  {
    id: "army_notice",
    title: "Повістка з ТЦК!",
    description: "Прийшла повістка з Територіального Центру Комплектування. Що будете робити?",
    emoji: "🪖",
    maxStage: 2,
    choices: [
      {
        label: "Відкосити",
        emoji: "🏃",
        type: "corrupt",
        effects: { corruption: 10, experience: 5 },
      },
      {
        label: "Служити",
        emoji: "🇺🇦",
        type: "honest",
        effects: { reputation: 50, experience: 30, skipDays: 365 },
      },
    ],
  },
];

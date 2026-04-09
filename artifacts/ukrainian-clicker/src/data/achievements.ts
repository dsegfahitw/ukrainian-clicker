export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  condition: (state: AchievementCheckState) => boolean;
  reward: {
    money?: number;
    experience?: number;
    health?: number;
    reputation?: number;
  };
}

export interface AchievementCheckState {
  money: number;
  totalEarned: number;
  health: number;
  reputation: number;
  corruption: number;
  level: number;
  workClicks: number;
  stage: number;
  ownedBusinesses: { id: string; level: number }[];
  skills: Record<string, number>;
  passiveIncome: number;
  day: number;
  permanentBonuses: string[];
}

export const achievements: Achievement[] = [
  {
    id: "first_money",
    name: "Перший заробіток",
    emoji: "💰",
    description: "Заробіть ₴100",
    condition: (s) => s.totalEarned >= 100,
    reward: { money: 100 },
  },
  {
    id: "hard_worker",
    name: "Трудяга",
    emoji: "💪",
    description: "200 робочих кліків",
    condition: (s) => s.workClicks >= 200,
    reward: { experience: 10 },
  },
  {
    id: "village_hero",
    name: "Герой села",
    emoji: "🌾",
    description: "Репутація 80+",
    condition: (s) => s.reputation >= 80,
    reward: { money: 500 },
  },
  {
    id: "corrupt_official",
    name: "Корупціонер",
    emoji: "☠️",
    description: "Корупція 80+",
    condition: (s) => s.corruption >= 80,
    reward: { money: 700 },
  },
  {
    id: "businessman",
    name: "Бізнесмен",
    emoji: "🏢",
    description: "Мати 3 бізнеси",
    condition: (s) => s.ownedBusinesses.length >= 3,
    reward: { money: 1500 },
  },
  {
    id: "oligarch",
    name: "Олігарх",
    emoji: "👑",
    description: "Заробіть ₴1,000,000",
    condition: (s) => s.totalEarned >= 1000000,
    reward: { money: 5000 },
  },
  {
    id: "first_business",
    name: "Підприємець",
    emoji: "🏪",
    description: "Відкрийте перший бізнес",
    condition: (s) => s.ownedBusinesses.length >= 1,
    reward: { money: 200, experience: 20 },
  },
  {
    id: "reach_town",
    name: "Містянин",
    emoji: "🏘️",
    description: "Досягніть Райцентру",
    condition: (s) => s.stage >= 2,
    reward: { money: 300 },
  },
  {
    id: "reach_city",
    name: "Городянин",
    emoji: "🏙️",
    description: "Досягніть Обласного центру",
    condition: (s) => s.stage >= 3,
    reward: { money: 1000 },
  },
  {
    id: "reach_kyiv",
    name: "Киянин",
    emoji: "🌆",
    description: "Досягніть Києва",
    condition: (s) => s.stage >= 4,
    reward: { money: 5000 },
  },
  {
    id: "max_level",
    name: "Профі",
    emoji: "🎯",
    description: "Досягніть 50 рівня",
    condition: (s) => s.level >= 50,
    reward: { money: 10000 },
  },
  {
    id: "passive_master",
    name: "Рантьє",
    emoji: "💸",
    description: "Пасивний дохід 50₴/сек",
    condition: (s) => s.passiveIncome >= 50,
    reward: { money: 3000, experience: 50 },
  },
  {
    id: "skill_master",
    name: "Майстер",
    emoji: "📚",
    description: "Прокачайте 3 навички до максимуму",
    condition: (s) => Object.values(s.skills).filter((v) => v >= 5).length >= 3,
    reward: { money: 2000 },
  },
  {
    id: "thousand_clicks",
    name: "Стаханівець",
    emoji: "⚒️",
    description: "1000 робочих кліків",
    condition: (s) => s.workClicks >= 1000,
    reward: { money: 2000, experience: 50 },
  },
  {
    id: "healthy",
    name: "Здоровань",
    emoji: "❤️",
    description: "Здоров'я 100 при 50+ рівні",
    condition: (s) => s.health >= 100 && s.level >= 50,
    reward: { money: 1000 },
  },
  {
    id: "earn_10k",
    name: "Зароблені 10 тисяч",
    emoji: "💳",
    description: "Заробіть ₴10,000",
    condition: (s) => s.totalEarned >= 10000,
    reward: { money: 500 },
  },
  {
    id: "earn_100k",
    name: "Зароблені 100 тисяч",
    emoji: "🏦",
    description: "Заробіть ₴100,000",
    condition: (s) => s.totalEarned >= 100000,
    reward: { money: 2000 },
  },
  {
    id: "survive_long",
    name: "Довгожитель",
    emoji: "🗓️",
    description: "Прожити 365 днів",
    condition: (s) => s.day >= 365,
    reward: { money: 1000, reputation: 10 },
  },
  {
    id: "full_skills",
    name: "Ренесансна людина",
    emoji: "🌟",
    description: "Мати принаймні 1 рівень у всіх навичках",
    condition: (s) => Object.values(s.skills).every((v) => v >= 1),
    reward: { money: 3000 },
  },
  {
    id: "five_businesses",
    name: "Магнат",
    emoji: "🏛️",
    description: "Мати 5 бізнесів",
    condition: (s) => s.ownedBusinesses.length >= 5,
    reward: { money: 10000, experience: 100 },
  },
];

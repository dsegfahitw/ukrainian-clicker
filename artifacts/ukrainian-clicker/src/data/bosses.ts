export interface BossRequirement {
  reputation?: number;
  corruption?: number;
  money?: number;
  stage?: number;
  skill?: { id: string; level: number };
  level?: number;
}

export interface BossReward {
  money?: number;
  experience?: number;
  passiveBonus?: number;
  permanent?: string;
  description: string;
}

export interface Boss {
  id: string;
  name: string;
  title: string;
  emoji: string;
  description: string;
  storyText: string;
  requirements: BossRequirement;
  requirementsText: string[];
  reward: BossReward;
  color: string;
}

export const bosses: Boss[] = [
  {
    id: "local_king",
    name: "Василь Грошовенко",
    title: "Король Місцевого Ринку",
    emoji: "🐗",
    description: "Тримає всі ринки в районі. Носить золоту ланцюгу і говорить у третій особі.",
    storyText: "«Василь дає тобі шанс... один раз. Доведи, що ти заслуговуєш місця на ринку.»",
    requirements: { reputation: 30, level: 5 },
    requirementsText: ["Репутація ≥ 30", "Рівень ≥ 5"],
    reward: {
      money: 1000,
      experience: 200,
      permanent: "market_discount_10",
      description: "+₴1000, +200 XP, знижка 10% на ринку назавжди",
    },
    color: "#8B6914",
  },
  {
    id: "city_oligarch",
    name: "Олексій Мільйонченко",
    title: "Олігарх Міста",
    emoji: "🏛️",
    description: "Контролює будівельний бізнес міста. Їздить на Гелікові й знає всіх депутатів.",
    storyText: "«Ти хочеш грати у великий бізнес? Спочатку покажи мені своє портфоліо...»",
    requirements: { money: 25000, stage: 2 },
    requirementsText: ["Гроші ≥ ₴25,000", "Стадія ≥ 2 (Райцентр)"],
    reward: {
      money: 5000,
      experience: 500,
      passiveBonus: 0.25,
      permanent: "passive_boost_25",
      description: "+₴5000, +500 XP, +25% до пасивного доходу назавжди",
    },
    color: "#4169E1",
  },
  {
    id: "media_tycoon",
    name: "Інна Піарченко",
    title: "Медіа-Магнат",
    emoji: "📺",
    description: "Власниця 3 телеканалів і 12 YouTube-каналів. Знає все про всіх.",
    storyText: "«PR — це влада. Хочеш, щоб про тебе говорили? Доведи, що ти вмієш говорити.»",
    requirements: { skill: { id: "marketing", level: 3 }, reputation: 60 },
    requirementsText: ["Маркетинг ≥ рівень 3", "Репутація ≥ 60"],
    reward: {
      money: 8000,
      experience: 800,
      permanent: "reputation_multiplier_20",
      description: "+₴8000, +800 XP, +20% до репутації від подій назавжди",
    },
    color: "#9B59B6",
  },
  {
    id: "political_sponsor",
    name: "Борис Корупційович",
    title: "Політичний Спонсор",
    emoji: "🤝",
    description: "Фінансує 4 партії одночасно. Принцип: «хто платить — той і замовляє музику».",
    storyText: "«У політиці виживають ті, хто вміє домовлятися... і мати правильних друзів.»",
    requirements: { corruption: 50, money: 80000 },
    requirementsText: ["Корупція ≥ 50", "Гроші ≥ ₴80,000"],
    reward: {
      money: 20000,
      experience: 1500,
      permanent: "political_influence",
      description: "+₴20000, +1500 XP, Політичний вплив — нові події розблоковано",
    },
    color: "#E74C3C",
  },
  {
    id: "national_oligarch",
    name: "Дмитро Всевладний",
    title: "Національний Олігарх",
    emoji: "👑",
    description: "Контролює 40% ВВП країни. Сніданок — у Відні, обід — у Лондоні. Зустрічається лише з президентами.",
    storyText: "«Я дивився, як ти ріс. Тепер ти готовий зіграти у справжню гру.»",
    requirements: { stage: 4, level: 50 },
    requirementsText: ["Стадія 4 (Київ)", "Рівень ≥ 50"],
    reward: {
      money: 100000,
      experience: 5000,
      passiveBonus: 0.5,
      permanent: "oligarch_network",
      description: "+₴100,000, +5000 XP, +50% до пасивного доходу, Мережа олігархів",
    },
    color: "#DAA520",
  },
];

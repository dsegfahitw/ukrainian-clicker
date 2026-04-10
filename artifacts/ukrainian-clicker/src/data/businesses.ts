export interface Business {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  passiveIncome: number;
  levelReq: number;
  description: string;
  requiredSkill?: string;
}

export const businesses: Business[] = [
  {
    id: "street_food",
    name: "Вулична їжа",
    emoji: "🌭",
    cost: 500,
    passiveIncome: 0.5,
    levelReq: 5,
    description: "Шаурма, хот-доги, кава з собою. Класика!",
  },
  {
    id: "cafe",
    name: "Кав'ярня",
    emoji: "☕",
    cost: 2000,
    passiveIncome: 2,
    levelReq: 10,
    description: "Своя кав'ярня — мрія кожного. Латте, капучіно, мафіни.",
  },
  {
    id: "car_wash",
    name: "Автомийка",
    emoji: "🚗",
    cost: 4500,
    passiveIncome: 4,
    levelReq: 15,
    description: "Помиємо авто і заберемо гроші. Простий бізнес.",
  },
  {
    id: "minimarket",
    name: "Міні-маркет",
    emoji: "🏪",
    cost: 7000,
    passiveIncome: 7,
    levelReq: 20,
    description: "Продуктовий магазин біля будинку — завжди у прибутку.",
  },
  {
    id: "logistics",
    name: "Логістична компанія",
    emoji: "🚛",
    cost: 18000,
    passiveIncome: 18,
    levelReq: 30,
    description: "Перевезення вантажів по всій Україні.",
    requiredSkill: "accounting",
  },
  {
    id: "construction_firm",
    name: "Будівельна фірма",
    emoji: "🏗️",
    cost: 45000,
    passiveIncome: 45,
    levelReq: 45,
    description: "Будувати будинки та заробляти великі гроші.",
  },
  {
    id: "political_campaign",
    name: "Політична кампанія",
    emoji: "🏛️",
    cost: 120000,
    passiveIncome: 120,
    levelReq: 60,
    description: "Політика — це бізнес. Великий бізнес.",
  },
  {
    id: "oligarch_empire",
    name: "Імперія олігарха",
    emoji: "👑",
    cost: 500000,
    passiveIncome: 500,
    levelReq: 80,
    description: "Контролювати все — від заводів до ЗМІ.",
  },
];

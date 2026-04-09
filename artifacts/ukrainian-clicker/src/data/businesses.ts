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
    id: "logistics",
    name: "Логістична компанія",
    emoji: "🚛",
    cost: 8000,
    passiveIncome: 8,
    levelReq: 25,
    description: "Перевезення вантажів по всій Україні.",
    requiredSkill: "accounting",
  },
  {
    id: "construction_firm",
    name: "Будівельна фірма",
    emoji: "🏗️",
    cost: 20000,
    passiveIncome: 20,
    levelReq: 40,
    description: "Будувати будинки та заробляти великі гроші.",
  },
  {
    id: "political_campaign",
    name: "Політична кампанія",
    emoji: "🏛️",
    cost: 50000,
    passiveIncome: 50,
    levelReq: 60,
    description: "Політика — це бізнес. Великий бізнес.",
  },
  {
    id: "oligarch_empire",
    name: "Імперія олігарха",
    emoji: "👑",
    cost: 200000,
    passiveIncome: 200,
    levelReq: 80,
    description: "Контролювати все — від заводів до ЗМІ.",
  },
];

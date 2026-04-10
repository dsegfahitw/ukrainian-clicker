export interface Job {
  id: string;
  name: string;
  emoji: string;
  levelReq: number;
  earnPerShift: number;
  healthCost: number;
  requiredSkill?: string;
  description: string;
}

export const jobs: Job[] = [
  {
    id: "farm_labor",
    name: "Поле (сезонник)",
    emoji: "🌾",
    levelReq: 1,
    earnPerShift: 20,
    healthCost: 5,
    description: "Збирати картоплю під дощем. Мало платять, але завжди є робота.",
  },
  {
    id: "car_wash_worker",
    name: "Мийник авто",
    emoji: "🪣",
    levelReq: 2,
    earnPerShift: 28,
    healthCost: 4,
    description: "Мити машини під трасою. Клієнти примхливі, вода холодна.",
  },
  {
    id: "construction",
    name: "Будівельник",
    emoji: "🏗️",
    levelReq: 3,
    earnPerShift: 38,
    healthCost: 8,
    description: "Цегла, цемент і болючий хребет. Але платять непогано.",
  },
  {
    id: "security_guard",
    name: "Охоронець",
    emoji: "🛡️",
    levelReq: 5,
    earnPerShift: 42,
    healthCost: 2,
    description: "Сидіти вночі біля банку з термосом чаю. Спокійна робота.",
  },
  {
    id: "market_vendor",
    name: "Торговець на ринку",
    emoji: "🏪",
    levelReq: 6,
    earnPerShift: 50,
    healthCost: 3,
    description: "«Беріть, красуне, все свіже!» Торгувати — мистецтво.",
  },
  {
    id: "bolt_courier",
    name: "Кур'єр Bolt Food",
    emoji: "🛵",
    levelReq: 8,
    earnPerShift: 62,
    healthCost: 4,
    description: "Везти піцу через все місто за 30 хвилин. Складно, але вигідно.",
    requiredSkill: "driving",
  },
  {
    id: "delivery_driver",
    name: "Таксист (Bolt/Uklon)",
    emoji: "🚕",
    levelReq: 10,
    earnPerShift: 75,
    healthCost: 3,
    description: "«Куди їдемо?» Розмови з пасажирами про політику в подарунок.",
    requiredSkill: "driving",
  },
  {
    id: "office_worker",
    name: "Офісний планктон",
    emoji: "💻",
    levelReq: 13,
    earnPerShift: 95,
    healthCost: 2,
    description: "Стендапи, звіти, Excel. Зате кава безкоштовна.",
  },
  {
    id: "small_shop_owner",
    name: "Підприємець (ФОП)",
    emoji: "🧾",
    levelReq: 16,
    earnPerShift: 120,
    healthCost: 2,
    description: "ФОП 3-ї групи. Один в полі воїн — сам і директор, і касир.",
  },
  {
    id: "accountant",
    name: "Бухгалтер",
    emoji: "📊",
    levelReq: 22,
    earnPerShift: 160,
    healthCost: 1,
    description: "Рахувати чужі гроші і грати в сапера з ДПС.",
    requiredSkill: "accounting",
  },
];

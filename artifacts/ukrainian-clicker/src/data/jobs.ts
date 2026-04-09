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
    name: "Робота на полі",
    emoji: "🌾",
    levelReq: 1,
    earnPerShift: 20,
    healthCost: 5,
    description: "Важка фізична праця на фермі. Мало платять, але завжди є робота.",
  },
  {
    id: "construction",
    name: "Будівництво",
    emoji: "🏗️",
    levelReq: 3,
    earnPerShift: 35,
    healthCost: 8,
    description: "Будувати будинки — справа не легка, але гроші непогані.",
  },
  {
    id: "market_vendor",
    name: "Продавець на ринку",
    emoji: "🏪",
    levelReq: 5,
    earnPerShift: 45,
    healthCost: 3,
    description: "Торгувати на базарі — треба мати язик підвішений.",
  },
  {
    id: "delivery_driver",
    name: "Водій доставки",
    emoji: "🚗",
    levelReq: 8,
    earnPerShift: 60,
    healthCost: 4,
    requiredSkill: "driving",
    description: "Розвозити товари по місту. Потрібні водійські права.",
  },
  {
    id: "office_worker",
    name: "Офісний працівник",
    emoji: "💻",
    levelReq: 12,
    earnPerShift: 90,
    healthCost: 2,
    description: "Сидіти в офісі, пити каву, робити звіти. Цивілізовано!",
  },
  {
    id: "accountant",
    name: "Бухгалтер",
    emoji: "📊",
    levelReq: 20,
    earnPerShift: 150,
    healthCost: 1,
    requiredSkill: "accounting",
    description: "Рахувати гроші — чужі і свої. Потрібна освіта.",
  },
];

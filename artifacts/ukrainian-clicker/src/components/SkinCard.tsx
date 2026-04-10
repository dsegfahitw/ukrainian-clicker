import { motion } from "framer-motion";

export interface Skin {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockCondition?: string;
  price?: number;
  free?: boolean;
}

export const skins: Skin[] = [
  { id: "farmer", name: "Колгоспник", emoji: "🧑‍🌾", description: "Класичний початок. Безкоштовно.", free: true },
  { id: "worker", name: "Будівельник", emoji: "👷", description: "Каска і поважний вигляд.", price: 5000 },
  { id: "businessman", name: "Бізнесмен", emoji: "🤵", description: "Костюм з краваткою. Солідно.", price: 25000 },
  { id: "politician", name: "Депутат", emoji: "🏛️", description: "Пиджак, значок, широка посмішка.", price: 100000 },
  { id: "oligarch", name: "Олігарх", emoji: "👑", description: "Ексклюзив. Лише для еліти.", price: 500000 },
];

interface SkinCardProps {
  skin: Skin;
  isSelected: boolean;
  isUnlocked: boolean;
  money: number;
  onBuy: (skinId: string) => void;
  onSelect: (skinId: string) => void;
}

export function SkinCard({ skin, isSelected, isUnlocked, money, onBuy, onSelect }: SkinCardProps) {
  const canAfford = money >= (skin.price || 0);

  return (
    <motion.div
      layout
      className={`border-2 p-3 text-center transition-all ${
        isSelected ? "border-yellow-500 bg-yellow-500/10" : isUnlocked ? "border-foreground/40 bg-card" : "border-foreground/20 bg-foreground/5"
      }`}
      style={{ borderRadius: "2px" }}
    >
      <div className={`text-4xl mb-1.5 ${!isUnlocked ? "opacity-40 grayscale" : ""}`}>{skin.emoji}</div>
      <div className="font-heading text-xs uppercase tracking-wider mb-0.5">{skin.name}</div>
      <p className="text-[10px] text-foreground/50 mb-2">{skin.description}</p>

      {isSelected ? (
        <div className="text-[10px] text-yellow-600 font-heading uppercase">✓ Обрано</div>
      ) : isUnlocked ? (
        <button
          onClick={() => onSelect(skin.id)}
          className="w-full py-1.5 bg-primary text-primary-foreground font-heading text-[10px] uppercase border border-foreground"
          style={{ borderRadius: "2px", minHeight: "32px" }}
        >
          Обрати
        </button>
      ) : skin.free ? (
        <button
          onClick={() => onBuy(skin.id)}
          className="w-full py-1.5 bg-green-700 text-white font-heading text-[10px] uppercase"
          style={{ borderRadius: "2px", minHeight: "32px" }}
        >
          Безкоштовно
        </button>
      ) : (
        <button
          onClick={() => onBuy(skin.id)}
          disabled={!canAfford}
          className={`w-full py-1.5 font-heading text-[10px] uppercase border ${
            canAfford ? "bg-card border-foreground/60 text-foreground" : "opacity-40 border-foreground/20 text-foreground/40"
          }`}
          style={{ borderRadius: "2px", minHeight: "32px" }}
        >
          {canAfford ? `₴${(skin.price || 0).toLocaleString()}` : `🔒 ₴${(skin.price || 0).toLocaleString()}`}
        </button>
      )}
    </motion.div>
  );
}

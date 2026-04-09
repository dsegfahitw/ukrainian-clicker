import { motion } from "framer-motion";
import { marketItems } from "@/data/market";
import type { GameState } from "@/hooks/useGameState";

interface MarketTabProps {
  state: GameState;
  onBuy: (itemId: string, price: number, effect: { health?: number; reputation?: number; permanent?: string }) => void;
}

export function MarketTab({ state, onBuy }: MarketTabProps) {
  const hagglingDiscount = 1 - state.skills.haggling * 0.1;

  return (
    <div className="p-4 pb-24 scrollbar-hide overflow-y-auto max-h-[calc(100vh-120px)]">
      <h2 className="font-heading text-lg uppercase tracking-wider text-foreground mb-4 text-center" style={{ transform: "rotate(-1deg)" }}>
        🛒 Ринок
      </h2>

      {state.marketPriceMultiplier > 1 && (
        <div className="bg-red-100 border-2 border-red-800 p-2 mb-4 text-center" style={{ borderRadius: "2px" }}>
          <span className="text-red-800 text-xs font-heading uppercase">
            📈 Інфляція! Ціни +{Math.round((state.marketPriceMultiplier - 1) * 100)}%
          </span>
        </div>
      )}

      <div className="space-y-2">
        {marketItems.map((item) => {
          const price = Math.floor(item.basePrice * state.marketPriceMultiplier * hagglingDiscount);
          const canAfford = state.money >= price;
          const alreadyOwned = item.effect.permanent && state.permanentBonuses.includes(item.effect.permanent);
          const isHealthFull = item.consumable && item.effect.health && state.health >= 100;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border-game p-3 flex items-center gap-3 ${alreadyOwned ? "bg-green-50 opacity-60" : "bg-card"}`}
              style={{ borderRadius: "2px" }}
            >
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-xs uppercase">{item.name}</h3>
                <p className="text-[10px] text-foreground/50">{item.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-foreground mb-1">₴{price}</div>
                {alreadyOwned ? (
                  <span className="text-[10px] text-green-700 font-heading">Є</span>
                ) : (
                  <button
                    onClick={() => onBuy(item.id, item.basePrice, item.effect)}
                    disabled={!canAfford || !!isHealthFull}
                    className={`px-3 py-1 font-heading text-[10px] uppercase border transition-all active:scale-95 ${
                      canAfford && !isHealthFull
                        ? "bg-primary text-primary-foreground border-foreground"
                        : "bg-foreground/10 text-foreground/30 border-foreground/20"
                    }`}
                    style={{ borderRadius: "2px" }}
                  >
                    Купити
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {state.skills.haggling > 0 && (
        <div className="mt-4 text-center text-xs text-foreground/40">
          Знижка торгівлі: -{state.skills.haggling * 10}%
        </div>
      )}
    </div>
  );
}

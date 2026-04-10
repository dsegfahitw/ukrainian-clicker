import { memo, useState } from "react";
import { motion } from "framer-motion";
import { marketItems } from "@/data/market";
import { skins, SkinCard } from "@/components/SkinCard";
import type { GameState } from "@/hooks/useGameState";

interface ShopTabProps {
  state: GameState;
  onBuyMarket: (itemId: string, price: number, effect: { health?: number; reputation?: number; permanent?: string }) => void;
  onBuySkin: (skinId: string, price: number) => void;
  onSelectSkin: (skinId: string) => void;
}

type Section = "market" | "skins";

function ShopTabInner({ state, onBuyMarket, onBuySkin, onSelectSkin }: ShopTabProps) {
  const [section, setSection] = useState<Section>("market");
  const hagglingDiscount = 1 - (state.skills.haggling || 0) * 0.1;

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* Section Tabs */}
      <div className="flex border-b-2 border-foreground bg-card">
        {(["market", "skins"] as Section[]).map((s) => {
          const labels: Record<Section, string> = { market: "🛒 Ринок", skins: "👔 Образи" };
          return (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`tap-target flex-1 py-2.5 font-heading text-[11px] uppercase tracking-wider transition-colors ${
                section === s ? "bg-primary text-primary-foreground" : "text-foreground/50"
              }`}
            >
              {labels[s]}
            </button>
          );
        })}
      </div>

      <div className="flex-1 p-4 pb-24 overflow-y-auto scrollbar-hide">
        {/* MARKET */}
        {section === "market" && (
          <div>
            {state.marketPriceMultiplier > 1 && (
              <div className="bg-red-100 border-2 border-red-800 p-2 mb-3 text-center" style={{ borderRadius: "2px" }}>
                <span className="text-red-800 text-xs font-heading uppercase">
                  📈 Інфляція! Ціни +{Math.round((state.marketPriceMultiplier - 1) * 100)}%
                </span>
              </div>
            )}
            {state.skills.haggling > 0 && (
              <div className="mb-3 text-center text-xs text-green-700 font-heading bg-green-50 border border-green-300 py-1.5" style={{ borderRadius: "2px" }}>
                🤝 Знижка торгівлі: -{(state.skills.haggling || 0) * 10}%
              </div>
            )}
            <div className="space-y-2">
              {marketItems.map((item) => {
                const price = Math.floor(item.basePrice * state.marketPriceMultiplier * hagglingDiscount);
                const canAfford = state.money >= price;
                const alreadyOwned = !!(item.effect.permanent && state.permanentBonuses.includes(item.effect.permanent));
                const isHealthFull = !!(item.consumable && item.effect.health && state.health >= 100);

                return (
                  <motion.div
                    key={item.id}
                    layout
                    className={`border-game p-3 flex items-center gap-3 ${alreadyOwned ? "bg-green-50 opacity-60" : "bg-card"}`}
                    style={{ borderRadius: "2px" }}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-xs uppercase">{item.name}</h3>
                      <p className="text-[10px] text-foreground/50">{item.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-foreground mb-1">₴{price}</div>
                      {alreadyOwned ? (
                        <span className="text-[10px] text-green-700 font-heading">✓ Є</span>
                      ) : (
                        <button
                          onClick={() => onBuyMarket(item.id, item.basePrice, item.effect)}
                          disabled={!canAfford || isHealthFull}
                          className={`tap-target px-3 py-1.5 font-heading text-[10px] uppercase border transition-all active:scale-95 ${
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
          </div>
        )}

        {/* SKINS */}
        {section === "skins" && (
          <div>
            <p className="text-xs text-foreground/50 text-center mb-4 font-heading">
              Змінюй зовнішній вигляд свого персонажа
            </p>
            <div className="grid grid-cols-2 gap-3">
              {skins.map((skin) => (
                <SkinCard
                  key={skin.id}
                  skin={skin}
                  isSelected={state.selectedSkin === skin.id}
                  isUnlocked={state.unlockedSkins.includes(skin.id)}
                  money={state.money}
                  onBuy={(id) => onBuySkin(id, skin.price || 0)}
                  onSelect={onSelectSkin}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const ShopTab = memo(ShopTabInner);

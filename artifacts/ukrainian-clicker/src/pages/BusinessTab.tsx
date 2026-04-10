import { memo } from "react";
import { motion } from "framer-motion";
import { businesses } from "@/data/businesses";
import { getBusinessUpgradeCost } from "@/hooks/useGameState";
import type { GameState } from "@/hooks/useGameState";

interface BusinessTabProps {
  state: GameState;
  onBuy: (id: string) => void;
  onUpgrade: (id: string) => void;
}

function BusinessTabInner({ state, onBuy, onUpgrade }: BusinessTabProps) {
  return (
    <div className="p-4 pb-24 scrollbar-hide overflow-y-auto max-h-[calc(100vh-120px)]">
      <h2 className="font-heading text-lg uppercase tracking-wider text-foreground mb-2 text-center" style={{ transform: "rotate(-1deg)" }}>
        🏢 Бізнес
      </h2>

      {state.passiveIncome > 0 && (
        <div className="text-center mb-4 bg-green-700/10 border border-green-700/30 p-2" style={{ borderRadius: "2px" }}>
          <span className="text-green-700 font-heading text-sm">
            ▶ +₴{state.passiveIncome < 1 ? state.passiveIncome.toFixed(1) : Math.floor(state.passiveIncome)}/сек пасивно
          </span>
        </div>
      )}

      <div className="space-y-3">
        {businesses.map((biz) => {
          const owned = state.ownedBusinesses.find((b) => b.id === biz.id);
          const isLocked = state.level < biz.levelReq;
          const missingSkill = biz.requiredSkill && (state.skills[biz.requiredSkill] || 0) < 1;
          const canBuy = !isLocked && !missingSkill && !owned && state.money >= biz.cost;
          const upgradeCost = owned ? getBusinessUpgradeCost(biz.cost, owned.level) : 0;
          const canUpgrade = owned && state.money >= upgradeCost;
          const currentIncome = owned
            ? biz.passiveIncome * Math.pow(2, owned.level - 1) * (1 + (state.skills.marketing || 0) * 0.1)
            : 0;
          const nextIncome = owned
            ? biz.passiveIncome * Math.pow(2, owned.level) * (1 + (state.skills.marketing || 0) * 0.1)
            : 0;

          return (
            <motion.div
              key={biz.id}
              layout
              className={`border-game p-4 transition-all ${
                owned ? "bg-green-50 border-green-800" : isLocked || missingSkill ? "bg-foreground/5 opacity-50" : "bg-card"
              }`}
              style={{ borderRadius: "2px" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{biz.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-heading text-sm uppercase">{biz.name}</h3>
                    {owned && (
                      <span className="text-[10px] bg-green-700 text-white px-2 py-0.5 font-heading" style={{ borderRadius: "2px" }}>
                        Рівень {owned.level}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/60 mb-2">{biz.description}</p>
                  <div className="flex items-center gap-3 text-xs flex-wrap">
                    {owned ? (
                      <span className="text-green-700 font-bold">
                        +₴{currentIncome < 1 ? currentIncome.toFixed(1) : Math.floor(currentIncome)}/сек
                      </span>
                    ) : (
                      <span className="text-green-700 font-bold">+₴{biz.passiveIncome}/сек</span>
                    )}
                    {!owned && <span className="text-foreground/70 font-bold">₴{biz.cost.toLocaleString()}</span>}
                    <span className="text-foreground/50">Рівень {biz.levelReq}+</span>
                  </div>
                  {biz.requiredSkill && !owned && (
                    <div className="text-[10px] text-foreground/40 mt-1">
                      Потрібна: {biz.requiredSkill === "accounting" ? "Бухгалтерія" : biz.requiredSkill}
                    </div>
                  )}
                </div>
              </div>

              {!owned && canBuy && (
                <button
                  onClick={() => onBuy(biz.id)}
                  className="w-full mt-3 py-2.5 bg-green-700 hover:bg-green-600 text-white font-heading text-xs uppercase tracking-wider border-2 border-green-900 active:scale-95 transition-all"
                  style={{ borderRadius: "2px" }}
                >
                  Інвестувати ₴{biz.cost.toLocaleString()}
                </button>
              )}

              {!owned && !canBuy && !isLocked && !missingSkill && (
                <div className="mt-2 text-center text-xs text-foreground/40 font-heading uppercase">
                  Потрібно ₴{biz.cost.toLocaleString()}
                </div>
              )}

              {owned && (
                <button
                  onClick={() => onUpgrade(biz.id)}
                  disabled={!canUpgrade}
                  className={`w-full mt-3 py-2.5 font-heading text-xs uppercase tracking-wider border-2 active:scale-95 transition-all ${
                    canUpgrade
                      ? "bg-accent text-foreground border-foreground hover:bg-accent/80"
                      : "bg-foreground/10 text-foreground/30 border-foreground/20"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  Покращити ₴{upgradeCost.toLocaleString()}
                  {canUpgrade && <span className="ml-1 opacity-60">(→ ₴{nextIncome < 1 ? nextIncome.toFixed(1) : Math.floor(nextIncome)}/сек)</span>}
                </button>
              )}

              {(isLocked || missingSkill) && !owned && (
                <div className="mt-2 text-center text-xs text-foreground/40 font-heading uppercase">
                  🔒 {isLocked ? `Потрібен рівень ${biz.levelReq}` : "Потрібна навичка"}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export const BusinessTab = memo(BusinessTabInner);

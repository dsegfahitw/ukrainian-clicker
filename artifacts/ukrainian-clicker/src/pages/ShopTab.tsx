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

type Section = "market" | "skins" | "premium";

function ShopTabInner({ state, onBuyMarket, onBuySkin, onSelectSkin }: ShopTabProps) {
  const [section, setSection] = useState<Section>("market");
  const hagglingDiscount = 1 - (state.skills.haggling || 0) * 0.1;

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* Section Tabs */}
      <div className="flex border-b-2 border-foreground bg-card">
        {(["market", "skins", "premium"] as Section[]).map((s) => {
          const labels: Record<Section, string> = { market: "🛒 Ринок", skins: "👔 Образи", premium: "⭐ VIP" };
          return (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`flex-1 py-2.5 font-heading text-[10px] uppercase tracking-wider transition-colors ${
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
                          className={`px-3 py-1.5 font-heading text-[10px] uppercase border transition-all active:scale-95 ${
                            canAfford && !isHealthFull
                              ? "bg-primary text-primary-foreground border-foreground"
                              : "bg-foreground/10 text-foreground/30 border-foreground/20"
                          }`}
                          style={{ borderRadius: "2px", minHeight: "32px" }}
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

        {/* PREMIUM / VIP */}
        {section === "premium" && (
          <div className="space-y-4">
            <div className="text-center text-xs text-foreground/50 font-heading mb-2">
              Підтримати розробника та отримати переваги
            </div>

            {/* VIP Membership */}
            <div
              className="border-2 p-4"
              style={{ borderColor: "#DAA520", borderRadius: "2px", background: "linear-gradient(135deg, #DAA52022, #111)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="font-heading text-sm uppercase" style={{ color: "#DAA520" }}>VIP Членство</div>
                  <div className="text-[10px] text-foreground/50">$4.99 / місяць</div>
                </div>
              </div>
              <ul className="space-y-1 mb-3">
                {[
                  "+20% до пасивного доходу",
                  "+20% до заробітку на роботі",
                  "Щоденний бонус ₴1,000",
                  "Ексклюзивна золота тема",
                  "Без реклами назавжди",
                ].map((b) => (
                  <li key={b} className="text-xs text-foreground/70 flex items-center gap-1.5">
                    <span className="text-yellow-600">✓</span> {b}
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3 font-heading text-sm uppercase tracking-wider border-2"
                style={{
                  borderRadius: "2px", minHeight: "52px",
                  borderColor: "#DAA520", color: "#DAA520",
                  background: "rgba(218,165,32,0.15)",
                }}
              >
                ⭐ Стати VIP (незабаром)
              </button>
            </div>

            {/* Remove Ads */}
            <div className="border-game p-4 bg-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🚫</span>
                <div>
                  <div className="font-heading text-sm uppercase">Без реклами</div>
                  <div className="text-[10px] text-foreground/50">$2.99 — назавжди</div>
                </div>
              </div>
              <p className="text-xs text-foreground/50 mb-3">
                Вимкніть всю рекламу в грі. Назавжди. Жодного відволікання.
              </p>
              <button
                className="w-full py-3 font-heading text-xs uppercase tracking-wider border-2 border-foreground/40 text-foreground/60"
                style={{ borderRadius: "2px", minHeight: "48px" }}
              >
                Видалити рекламу (незабаром)
              </button>
            </div>

            {/* Starter Pack */}
            <div
              className="border-2 p-4"
              style={{ borderColor: "#ff6b35", borderRadius: "2px", background: "rgba(255,107,53,0.08)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎁</span>
                <div>
                  <div className="font-heading text-sm uppercase" style={{ color: "#ff6b35" }}>Стартовий пакет</div>
                  <div className="text-[10px] text-foreground/50">$0.99 — одноразово</div>
                </div>
              </div>
              <ul className="space-y-1 mb-3">
                <li className="text-xs text-foreground/70">✓ +₴5,000 стартовий капітал</li>
                <li className="text-xs text-foreground/70">✓ +50 HP</li>
                <li className="text-xs text-foreground/70">✓ Скін «Бізнесмен» безкоштовно</li>
              </ul>
              <button
                className="w-full py-3 font-heading text-xs uppercase tracking-wider border-2"
                style={{ borderRadius: "2px", minHeight: "48px", borderColor: "#ff6b35", color: "#ff6b35" }}
              >
                Купити пакет (незабаром)
              </button>
            </div>

            <p className="text-[9px] text-center text-foreground/30">
              * Монетизація ще не активована. Внутрішньоігрові покупки з'являться у фінальній версії.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export const ShopTab = memo(ShopTabInner);

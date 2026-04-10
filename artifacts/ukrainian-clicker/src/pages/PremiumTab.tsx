import { memo } from "react";
import type { GameState } from "@/hooks/useGameState";

interface PremiumTabProps {
  state: GameState;
  onActivateVip: () => void;
  onRemoveAds: () => void;
}

function PremiumTabInner({ state, onActivateVip, onRemoveAds }: PremiumTabProps) {
  return (
    <div className="p-4 pb-24 space-y-4 scrollbar-hide overflow-y-auto max-h-[calc(100vh-120px)]">
      <h2 className="font-heading text-lg uppercase tracking-wider text-center">⭐ Premium</h2>

      <div className="border-2 p-4 bg-card" style={{ borderColor: "#DAA520", borderRadius: "8px" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-heading text-sm uppercase">VIP Membership</div>
            <div className="text-xs text-foreground/60">$4.99 / місяць (demo)</div>
          </div>
          <span className="text-2xl">👑</span>
        </div>
        <ul className="text-xs mt-3 space-y-1 text-foreground/80">
          <li>+20% пасивного доходу</li>
          <li>+20% доходу з роботи</li>
          <li>Щоденний бонус ₴1,000</li>
          <li>Золота VIP тема інтерфейсу</li>
        </ul>
        <button
          onClick={onActivateVip}
          disabled={state.vipActive}
          className="tap-target w-full mt-3 border-2 font-heading text-xs uppercase"
          style={{
            borderRadius: "6px",
            borderColor: "#DAA520",
            background: state.vipActive ? "rgba(34,197,94,0.2)" : "rgba(218,165,32,0.2)",
            color: state.vipActive ? "#166534" : "#8B6914",
          }}
        >
          {state.vipActive ? "VIP активовано" : "Активувати VIP ($4.99)"}
        </button>
      </div>

      <div className="border-game p-4 bg-card" style={{ borderRadius: "8px" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-heading text-sm uppercase">Remove Ads</div>
            <div className="text-xs text-foreground/60">$2.99 разово (demo)</div>
          </div>
          <span className="text-2xl">🚫</span>
        </div>
        <p className="text-xs text-foreground/70 mt-2">Вимикає міжсторінкову рекламу та залишає тільки добровільні бонуси.</p>
        <button
          onClick={onRemoveAds}
          disabled={state.adsRemoved}
          className="tap-target w-full mt-3 border-2 font-heading text-xs uppercase border-foreground"
          style={{ borderRadius: "6px", background: state.adsRemoved ? "rgba(34,197,94,0.2)" : "rgba(0,0,0,0.05)" }}
        >
          {state.adsRemoved ? "Рекламу вимкнено" : "Видалити рекламу ($2.99)"}
        </button>
      </div>

      <p className="text-[10px] text-center text-foreground/45">
        Це UI-заглушки монетизації. Реальні платежі ще не підключені.
      </p>
    </div>
  );
}

export const PremiumTab = memo(PremiumTabInner);

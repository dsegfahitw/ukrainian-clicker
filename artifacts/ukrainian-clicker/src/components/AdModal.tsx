import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import type { AdModalType } from "@/hooks/useGameState";

interface AdModalProps {
  type: AdModalType;
  onWatchAd: (type: AdModalType) => void;
  onDismiss: () => void;
}

export function AdModal({ type, onWatchAd, onDismiss }: AdModalProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!type) return;
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [type]);

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-[380px] bg-foreground p-6 text-center"
            style={{ borderRadius: "2px" }}
          >
            {type === "interstitial" ? (
              <>
                <div className="text-6xl mb-4">📺</div>
                <h2 className="text-white font-heading text-lg uppercase mb-2">Рекламна пауза</h2>
                <p className="text-white/50 text-xs mb-3">Ваша гра підтримується рекламою</p>
                <div className="bg-white/10 h-28 flex items-center justify-center mb-4" style={{ borderRadius: "2px" }}>
                  <span className="text-white/40 text-sm font-heading uppercase">[ Реклама ]</span>
                </div>
                <button
                  onClick={onDismiss}
                  disabled={countdown > 0}
                  className={`w-full py-3 font-heading text-sm uppercase border-2 transition-all ${
                    countdown > 0
                      ? "bg-white/10 text-white/30 border-white/10 cursor-not-allowed"
                      : "bg-accent text-foreground border-accent active:scale-95 cursor-pointer"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  {countdown > 0 ? `Зачекайте ${countdown}с...` : "✓ Закрити"}
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🎁</div>
                <h2 className="text-white font-heading text-lg uppercase mb-2">Бонус за рекламу</h2>
                <p className="text-white/50 text-xs mb-4">Перегляньте рекламу та отримайте нагороду</p>
                <div className="space-y-2 mb-4">
                  <button
                    onClick={() => onWatchAd("rewarded")}
                    className="w-full py-3 bg-accent text-foreground font-heading text-sm uppercase border-2 border-foreground active:scale-95 transition-all"
                    style={{ borderRadius: "2px" }}
                  >
                    📺 Дивитись → +₴1,000
                  </button>
                  <button
                    onClick={() => onWatchAd("rewarded")}
                    className="w-full py-3 bg-red-700 text-white font-heading text-sm uppercase border-2 border-red-900 active:scale-95 transition-all"
                    style={{ borderRadius: "2px" }}
                  >
                    📺 Дивитись → Повне HP
                  </button>
                </div>
                <button onClick={onDismiss} className="text-white/40 text-xs font-heading uppercase hover:text-white/60 transition-colors py-1">
                  Пропустити
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

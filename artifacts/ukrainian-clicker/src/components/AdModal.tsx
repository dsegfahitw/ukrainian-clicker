import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface AdModalProps {
  type: string | null;
  onWatchAd: (type: "offline_double" | "money_bonus" | "health_restore") => void;
  onDismiss: () => void;
}

export function AdModal({ type, onWatchAd, onDismiss }: AdModalProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!type) return;
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
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
                <h2 className="text-white font-heading text-lg uppercase mb-2">
                  Рекламна пауза
                </h2>
                <div className="bg-white/10 h-32 flex items-center justify-center mb-4" style={{ borderRadius: "2px" }}>
                  <span className="text-white/40 text-sm">[ РЕКЛАМА ТУТ ]</span>
                </div>
                <button
                  onClick={onDismiss}
                  disabled={countdown > 0}
                  className={`w-full py-2 font-heading text-sm uppercase border transition-all ${
                    countdown > 0 ? "bg-white/20 text-white/40 border-white/20" : "bg-accent text-foreground border-accent active:scale-95"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  {countdown > 0 ? `Закрити (${countdown})` : "Закрити"}
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">📺</div>
                <h2 className="text-white font-heading text-lg uppercase mb-2">
                  Переглянути рекламу
                </h2>
                <div className="space-y-2 mb-4">
                  <button
                    onClick={() => onWatchAd("money_bonus")}
                    className="w-full py-2.5 bg-accent text-foreground font-heading text-sm uppercase border-2 border-accent active:scale-95 transition-all"
                    style={{ borderRadius: "2px" }}
                  >
                    📺 +₴1,000 бонус
                  </button>
                  <button
                    onClick={() => onWatchAd("health_restore")}
                    className="w-full py-2.5 bg-red-700 text-white font-heading text-sm uppercase border-2 border-red-900 active:scale-95 transition-all"
                    style={{ borderRadius: "2px" }}
                  >
                    📺 Відновити здоров'я
                  </button>
                </div>
                <button
                  onClick={onDismiss}
                  className="text-white/40 text-xs font-heading uppercase"
                >
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

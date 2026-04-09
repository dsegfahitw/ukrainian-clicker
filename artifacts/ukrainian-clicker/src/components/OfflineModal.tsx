import { motion, AnimatePresence } from "framer-motion";
import type { OfflineData } from "@/hooks/useGameState";

interface OfflineModalProps {
  isOpen: boolean;
  data: OfflineData | null;
  onCollect: () => void;
  onWatchAd: () => void;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}г ${m}хв`;
  if (m > 0) return `${m}хв ${s}с`;
  return `${s}с`;
}

export function OfflineModal({ isOpen, data, onCollect, onWatchAd }: OfflineModalProps) {
  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-[380px] bg-card border-game p-6 text-center"
            style={{ borderRadius: "2px" }}
          >
            <span className="text-5xl block mb-3">⏰</span>
            <h2 className="font-heading text-xl uppercase text-foreground mb-1">
              Поки вас не було...
            </h2>
            <p className="text-sm text-foreground/60 mb-4">
              Ви були відсутні {formatTime(data.seconds)}
            </p>

            <div className="bg-background/60 border border-foreground/20 p-4 mb-5" style={{ borderRadius: "2px" }}>
              <div className="text-2xl font-heading text-green-700 mb-1">
                +₴{Math.floor(data.earnings).toLocaleString()}
              </div>
              <div className="text-xs text-foreground/50">Бізнеси працювали без вас!</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCollect}
                className="flex-1 py-3 bg-primary text-primary-foreground font-heading text-sm uppercase border-2 border-foreground active:scale-95 transition-all"
                style={{ borderRadius: "2px" }}
              >
                Зібрати
              </button>
              <button
                onClick={onWatchAd}
                className="flex-1 py-3 bg-accent text-foreground font-heading text-sm uppercase border-2 border-foreground active:scale-95 transition-all"
                style={{ borderRadius: "2px" }}
              >
                📺 x2
              </button>
            </div>
            <p className="text-[10px] text-foreground/30 mt-2">* Перегляд реклами подвоює нагороду</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { dailyRewards, type DailyReward } from "@/data/dailyRewards";

interface DailyRewardModalProps {
  isOpen: boolean;
  reward: DailyReward | null;
  streak: number;
  onClaim: (reward: DailyReward) => void;
}

export function DailyRewardModal({ isOpen, reward, streak, onClaim }: DailyRewardModalProps) {
  if (!reward) return null;

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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-[380px] bg-card border-game p-6 text-center"
            style={{ borderRadius: "2px" }}
          >
            <span className="text-4xl block mb-2">🎁</span>
            <h2 className="font-heading text-xl uppercase text-foreground mb-1">
              Щоденна нагорода
            </h2>
            <p className="text-sm text-foreground/60 mb-4">
              День {streak} підряд — ось ваша нагорода!
            </p>

            <div className="grid grid-cols-7 gap-1 mb-5">
              {dailyRewards.map((r) => (
                <div
                  key={r.day}
                  className={`flex flex-col items-center p-1.5 border text-center ${
                    r.day === streak
                      ? "bg-accent border-foreground"
                      : r.day < streak
                      ? "bg-foreground/10 border-foreground/20 opacity-40"
                      : "bg-card border-foreground/20"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  <span className="text-xs">{r.emoji}</span>
                  <span className="text-[8px] font-heading">{r.day}</span>
                </div>
              ))}
            </div>

            <div className="bg-background/60 border border-foreground/20 p-4 mb-5" style={{ borderRadius: "2px" }}>
              <span className="text-3xl block mb-1">{reward.emoji}</span>
              <span className="font-heading text-lg text-foreground">{reward.label}</span>
            </div>

            <button
              onClick={() => onClaim(reward)}
              className="w-full py-3 bg-green-700 hover:bg-green-600 text-white font-heading uppercase tracking-wider border-2 border-green-900 active:scale-95 transition-all animate-glow"
              style={{ borderRadius: "2px" }}
            >
              Отримати!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

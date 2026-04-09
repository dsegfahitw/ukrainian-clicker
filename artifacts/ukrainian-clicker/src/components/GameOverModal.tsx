import { motion, AnimatePresence } from "framer-motion";

interface GameOverModalProps {
  isOpen: boolean;
  reason: string;
  stats: {
    totalEarned: number;
    level: number;
    day: number;
    workClicks: number;
    stage: number;
  };
  onRestart: () => void;
}

const stageNames = ["Село", "Райцентр", "Обласний центр", "Київ", "Еліта"];

export function GameOverModal({ isOpen, reason, stats, onRestart }: GameOverModalProps) {
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
            <span className="text-6xl block mb-3">💀</span>
            <h2 className="font-heading text-2xl uppercase text-destructive mb-3">
              Гра закінчена
            </h2>
            <p className="text-sm text-foreground/80 mb-5">{reason}</p>

            <div className="bg-background/50 border border-foreground/20 p-3 mb-5 text-left text-sm space-y-1" style={{ borderRadius: "2px" }}>
              <div className="flex justify-between">
                <span>Зароблено:</span>
                <span className="font-bold">₴{stats.totalEarned.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Рівень:</span>
                <span className="font-bold">{stats.level}</span>
              </div>
              <div className="flex justify-between">
                <span>Етап:</span>
                <span className="font-bold">{stageNames[stats.stage - 1]}</span>
              </div>
              <div className="flex justify-between">
                <span>Днів прожито:</span>
                <span className="font-bold">{stats.day}</span>
              </div>
              <div className="flex justify-between">
                <span>Змін відпрацьовано:</span>
                <span className="font-bold">{stats.workClicks}</span>
              </div>
            </div>

            <button
              onClick={onRestart}
              className="w-full py-3 bg-primary text-primary-foreground font-heading uppercase tracking-wider border-2 border-foreground active:scale-95 transition-transform"
              style={{ borderRadius: "2px" }}
            >
              Почати знову
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

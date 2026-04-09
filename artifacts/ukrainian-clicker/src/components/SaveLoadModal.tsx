import { motion, AnimatePresence } from "framer-motion";

interface SaveLoadModalProps {
  isOpen: boolean;
  onResume: () => void;
  onNewGame: () => void;
}

export function SaveLoadModal({ isOpen, onResume, onNewGame }: SaveLoadModalProps) {
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
            <span className="text-5xl block mb-3">💾</span>
            <h2 className="font-heading text-xl uppercase text-foreground mb-2">
              Збережена гра
            </h2>
            <p className="text-sm text-foreground/70 mb-5">
              Знайдено збережену гру. Хочете продовжити?
            </p>

            <div className="flex gap-3">
              <button
                onClick={onResume}
                className="flex-1 py-3 bg-green-700 hover:bg-green-600 text-white font-heading text-sm uppercase tracking-wider border-2 border-green-900 active:scale-95 transition-all"
                style={{ borderRadius: "2px" }}
              >
                Продовжити
              </button>
              <button
                onClick={onNewGame}
                className="flex-1 py-3 bg-red-800 hover:bg-red-700 text-white font-heading text-sm uppercase tracking-wider border-2 border-red-950 active:scale-95 transition-all"
                style={{ borderRadius: "2px" }}
              >
                Нова гра
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { motion, AnimatePresence } from "framer-motion";

const stageNames = ["🌾 Село", "🏘️ Райцентр", "🏙️ Обласний центр", "🌆 Київ", "👑 Еліта"];

interface StageUpModalProps {
  isOpen: boolean;
  stage: number;
}

export function StageUpModal({ isOpen, stage }: StageUpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="text-center p-8"
          >
            <motion.div
              animate={{ rotate: [0, -3, 3, -3, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-7xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="font-heading text-3xl uppercase text-accent text-shadow mb-2">
              Новий етап!
            </h2>
            <p className="font-heading text-xl text-white text-shadow">
              {stageNames[stage - 1]}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

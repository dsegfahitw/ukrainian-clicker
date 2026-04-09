import { motion, AnimatePresence } from "framer-motion";
import type { AchievementUnlock } from "@/hooks/useGameState";

interface AchievementPopupProps {
  achievement: AchievementUnlock | null;
  onDismiss: () => void;
}

export function AchievementPopup({ achievement, onDismiss }: AchievementPopupProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.id}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          onClick={onDismiss}
          className="fixed top-20 right-3 z-50 max-w-[220px] cursor-pointer"
        >
          <div
            className="bg-card border-game p-3 shadow-lg"
            style={{ borderRadius: "2px" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{achievement.emoji}</span>
              <div>
                <div className="text-[9px] text-accent font-heading uppercase tracking-wider">
                  Досягнення!
                </div>
                <div className="text-xs font-heading uppercase">{achievement.name}</div>
              </div>
            </div>
            {achievement.rewardText && (
              <div className="text-[10px] text-green-700 font-bold">{achievement.rewardText}</div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

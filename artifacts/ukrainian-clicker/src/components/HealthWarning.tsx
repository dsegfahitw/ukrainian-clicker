import { motion, AnimatePresence } from "framer-motion";

interface HealthWarningProps {
  health: number;
}

export function HealthWarning({ health }: HealthWarningProps) {
  const isLow = health > 0 && health <= 20;
  const isCritical = health > 0 && health <= 10;

  return (
    <AnimatePresence>
      {isLow && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`mx-4 mt-2 py-2 px-3 border-2 text-center font-heading text-xs uppercase tracking-wider ${
            isCritical
              ? "bg-red-900 border-red-600 text-red-100 animate-pulse"
              : "bg-red-100 border-red-600 text-red-900"
          }`}
          style={{ borderRadius: "2px" }}
        >
          {isCritical ? "⚠️ КРИТИЧНЕ ЗДОРОВ'Я! Купіть їжу!" : "⚠️ Здоров'я низьке — зайдіть на ринок"}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

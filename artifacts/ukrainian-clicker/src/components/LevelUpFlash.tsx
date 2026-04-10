import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface LevelUpFlashProps {
  level: number;
}

export function LevelUpFlash({ level }: LevelUpFlashProps) {
  const [show, setShow] = useState(false);
  const [prevLevel, setPrevLevel] = useState(level);

  useEffect(() => {
    if (level > prevLevel) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 2000);
      setPrevLevel(level);
      return () => clearTimeout(t);
    }
    setPrevLevel(level);
    return undefined;
  }, [level, prevLevel]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.3 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-accent border-4 border-foreground px-8 py-5 text-center shadow-2xl" style={{ borderRadius: "2px" }}>
            <div className="text-4xl mb-1">⭐</div>
            <div className="font-heading text-2xl uppercase tracking-wider text-foreground">Рівень {level}!</div>
            <div className="text-sm text-foreground/70 font-heading uppercase mt-1">Ви стали кращим</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

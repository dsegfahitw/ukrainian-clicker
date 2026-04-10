import { AnimatePresence, motion } from "framer-motion";

interface NewDayBannerProps {
  show: boolean;
  day: number;
}

export function NewDayBanner({ show, day }: NewDayBannerProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -80 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed top-20 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          <div
            className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 text-foreground font-heading px-6 py-3 border-2 border-foreground shadow-xl flex items-center gap-3"
            style={{ borderRadius: "2px", maxWidth: "320px" }}
          >
            <motion.span
              animate={{ rotate: [0, 20, -10, 20, 0], scale: [1, 1.3, 1.1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: 1 }}
              className="text-2xl"
            >
              🌅
            </motion.span>
            <div>
              <div className="text-sm uppercase tracking-wider">Новий день!</div>
              <div className="text-lg font-bold">День {day}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

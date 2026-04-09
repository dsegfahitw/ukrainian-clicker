import { motion, AnimatePresence } from "framer-motion";
import type { GameEvent } from "@/data/events";

interface EventPopupProps {
  isOpen: boolean;
  event: GameEvent | null;
  onChoice: (index: number) => void;
}

export function EventPopup({ isOpen, event, onChoice }: EventPopupProps) {
  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4"
          style={{ paddingBottom: "80px" }}
        >
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-[400px] bg-card border-game p-5"
            style={{ borderRadius: "2px" }}
          >
            <div className="text-center mb-4">
              <span className="text-5xl block mb-3">{event.emoji}</span>
              <h3 className="font-heading text-lg uppercase text-foreground tracking-wide">
                {event.title}
              </h3>
            </div>

            <p className="text-sm text-foreground/80 text-center mb-5 leading-relaxed">
              {event.description}
            </p>

            <div className="flex gap-3">
              {event.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => onChoice(i)}
                  className={`flex-1 py-3 px-3 font-heading text-xs uppercase tracking-wider border-2 transition-all active:scale-95 ${
                    choice.type === "honest"
                      ? "bg-green-700 hover:bg-green-600 text-white border-green-900"
                      : "bg-red-800 hover:bg-red-700 text-white border-red-950"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  <span className="text-lg block mb-1">{choice.emoji}</span>
                  {choice.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

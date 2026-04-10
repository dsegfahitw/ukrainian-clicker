import { AnimatePresence, motion } from "framer-motion";

interface PassiveIncomeTicketProps {
  floats: { id: number; amount: number }[];
}

export function PassiveIncomeTicket({ floats }: PassiveIncomeTicketProps) {
  return (
    <div className="fixed top-16 right-3 z-30 pointer-events-none flex flex-col items-end gap-1">
      <AnimatePresence>
        {floats.slice(-5).map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 1, y: 0, x: 0, scale: 0.9 }}
            animate={{ opacity: 0, y: -50, x: 5, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="text-xs font-bold text-green-700 font-heading bg-green-50/80 px-1.5 py-0.5 border border-green-700/30"
            style={{ borderRadius: "2px", backdropFilter: "blur(2px)" }}
          >
            +₴{f.amount < 1 ? f.amount.toFixed(1) : Math.floor(f.amount)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

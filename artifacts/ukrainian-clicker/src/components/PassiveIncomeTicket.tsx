import { AnimatePresence, motion } from "framer-motion";

interface PassiveIncomeTicketProps {
  floats: { id: number; amount: number }[];
}

export function PassiveIncomeTicket({ floats }: PassiveIncomeTicketProps) {
  return (
    <div className="fixed top-14 right-4 z-30 pointer-events-none">
      <AnimatePresence>
        {floats.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -60, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-sm font-bold text-green-700 font-heading"
          >
            +₴{f.amount < 1 ? f.amount.toFixed(1) : Math.floor(f.amount)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

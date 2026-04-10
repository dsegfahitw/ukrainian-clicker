import { AnimatePresence, motion } from "framer-motion";
import type { BossEncounter } from "@/hooks/useGameState";

interface BossEncounterModalProps {
  encounter: BossEncounter | null;
  onResolve: (accepted: boolean) => void;
}

export function BossEncounterModal({ encounter, onResolve }: BossEncounterModalProps) {
  if (!encounter) return null;

  const { boss, rewardPreview } = encounter;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/70 flex items-end justify-center p-4"
        style={{ paddingBottom: "80px" }}
      >
        <motion.div
          initial={{ y: 260, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 260, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="w-full max-w-[420px] border-2 p-5 text-foreground"
          style={{
            borderColor: boss.color,
            borderRadius: "8px",
            background: `linear-gradient(135deg, ${boss.color}22 0%, #171717 80%)`,
          }}
        >
          <div className="text-center mb-3">
            <div className="text-5xl mb-2">{boss.emoji}</div>
            <div className="text-[11px] uppercase tracking-widest font-heading" style={{ color: boss.color }}>
              Спецподія
            </div>
            <h3 className="font-heading text-lg uppercase mt-1">{boss.title}</h3>
            <p className="text-xs text-foreground/70 mt-2">{boss.storyText}</p>
          </div>

          <div className="border border-white/20 p-3 mb-4 bg-white/5" style={{ borderRadius: "6px" }}>
            <div className="text-[10px] uppercase font-heading text-foreground/60 mb-1">Нагорода за домовленість</div>
            <div className="text-xs">
              +₴{rewardPreview.money.toLocaleString()}, +{rewardPreview.experience} XP
              {rewardPreview.passiveBonus > 0 && `, +${Math.round(rewardPreview.passiveBonus * 100)}% пасивного доходу`}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onResolve(false)}
              className="tap-target border-2 border-white/35 text-white/80 font-heading text-xs uppercase"
              style={{ borderRadius: "6px" }}
            >
              Відкласти
            </button>
            <button
              onClick={() => onResolve(true)}
              className="tap-target border-2 font-heading text-xs uppercase text-black"
              style={{ borderRadius: "6px", borderColor: boss.color, background: boss.color }}
            >
              Підписати угоду
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

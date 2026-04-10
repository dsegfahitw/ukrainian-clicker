import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { StageProgress } from "@/components/StageProgress";
import { computeWorkEarnings, getLevelXpNeeded } from "@/hooks/useGameState";
import type { GameState } from "@/hooks/useGameState";
import { jobs } from "@/data/jobs";

const stageEmojis = ["🧑‍🌾", "👷", "👨‍💼", "🤵", "👑"];
const stageBackgrounds = [
  "linear-gradient(180deg, #87CEEB 0%, #90EE90 40%, #8B7355 70%, #6B4226 100%)",
  "linear-gradient(180deg, #87CEEB 0%, #B0C4DE 30%, #A0522D 70%, #8B4513 100%)",
  "linear-gradient(180deg, #708090 0%, #B0C4DE 30%, #696969 60%, #808080 100%)",
  "linear-gradient(180deg, #4169E1 0%, #87CEEB 30%, #C0C0C0 60%, #808080 100%)",
  "linear-gradient(180deg, #FFD700 0%, #DAA520 30%, #B8860B 60%, #8B6914 100%)",
];
const stageLocationNames = ["Село", "Райцентр", "Обласний центр", "Київ", "Елітний район"];

interface LifeTabProps {
  state: GameState;
  onWork: () => void;
  onRest: () => void;
  onInvest: () => void;
}

function LifeTabInner({ state, onWork, onRest, onInvest }: LifeTabProps) {
  const activeJob = jobs.find((j) => j.id === state.activeJobId) || jobs[0];
  const earn = useMemo(() => computeWorkEarnings(state), [state]);
  const xpNeeded = useMemo(() => getLevelXpNeeded(state.level), [state.level]);
  const xpProgress = Math.min(100, (state.experience / xpNeeded) * 100);

  return (
    <div className="min-h-full flex flex-col">
      <div
        className="relative flex-1 flex flex-col items-center justify-center py-8"
        style={{ background: stageBackgrounds[state.stage - 1], minHeight: "300px" }}
      >
        <div className="absolute top-3 left-3 bg-black/30 px-3 py-1 text-white text-xs font-heading uppercase" style={{ borderRadius: "2px" }}>
          📍 {stageLocationNames[state.stage - 1]}
        </div>
        <div className="absolute top-3 right-3 bg-black/30 px-3 py-1 text-white text-xs font-heading" style={{ borderRadius: "2px" }}>
          День {state.day}
        </div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl mb-4"
        >
          {stageEmojis[state.stage - 1]}
        </motion.div>

        <div className="text-center mb-4">
          <div className="text-white text-shadow font-heading text-sm uppercase mb-1">
            Рівень {state.level}
          </div>
          <div className="w-40 h-2 bg-white/30 mx-auto overflow-hidden" style={{ borderRadius: "2px" }}>
            <motion.div
              className="h-full bg-accent"
              style={{ borderRadius: "1px" }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-white/70 text-[10px] mt-0.5">
            {Math.floor(state.experience)}/{xpNeeded} XP
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onWork}
          disabled={state.gameOver}
          className="tap-target relative bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xl uppercase tracking-wider px-10 py-5 border-4 border-foreground shadow-lg transition-colors disabled:opacity-50"
          style={{ borderRadius: "8px" }}
        >
          <span className="mr-2">💪</span>
          Працювати
          <div className="absolute -top-2 -right-2 bg-accent text-foreground text-[10px] font-bold px-1.5 py-0.5" style={{ borderRadius: "4px" }}>
            +₴{earn}
          </div>
        </motion.button>

        <div className="mt-3 grid grid-cols-2 gap-2 w-full px-4">
          <button
            onClick={onRest}
            className="tap-target border-2 border-foreground/40 bg-card/80 font-heading text-xs uppercase tracking-wider"
            style={{ borderRadius: "8px" }}
          >
            😌 Відпочити
          </button>
          <button
            onClick={onInvest}
            className="tap-target border-2 border-green-900 bg-green-700 text-white font-heading text-xs uppercase tracking-wider"
            style={{ borderRadius: "8px" }}
          >
            📈 Інвестувати
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3 flex-wrap justify-center">
          <span className="text-white/80 text-xs bg-black/30 px-2 py-1" style={{ borderRadius: "2px" }}>
            {activeJob.emoji} {activeJob.name}
          </span>
          <span className="text-white/80 text-xs bg-black/30 px-2 py-1" style={{ borderRadius: "2px" }}>
            -{activeJob.healthCost} HP/зміну
          </span>
          <span className="text-white/80 text-xs bg-black/30 px-2 py-1" style={{ borderRadius: "2px" }}>
            Змін: {state.workClicks}
          </span>
        </div>

        {state.passiveIncome > 0 && (
          <div className="mt-2 text-green-300 text-xs font-heading bg-black/30 px-3 py-1" style={{ borderRadius: "2px" }}>
            ▶ +₴{state.passiveIncome < 1 ? state.passiveIncome.toFixed(1) : Math.floor(state.passiveIncome)}/сек
          </div>
        )}
      </div>

      <StageProgress stage={state.stage} totalEarned={state.totalEarned} />
    </div>
  );
}

export const LifeTab = memo(LifeTabInner);

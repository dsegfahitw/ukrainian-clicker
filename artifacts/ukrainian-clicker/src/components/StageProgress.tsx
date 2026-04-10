import { motion } from "framer-motion";

const stageThresholds = [0, 1000, 10000, 100000, 1000000];
const stageNames = ["🌾 Село", "🏘️ Райцентр", "🏙️ Обл. центр", "🌆 Київ", "👑 Еліта"];
const stageColors = ["#8B7355", "#A0522D", "#708090", "#4169E1", "#DAA520"];

interface StageProgressProps {
  stage: number;
  totalEarned: number;
}

export function StageProgress({ stage, totalEarned }: StageProgressProps) {
  const currentThreshold = stageThresholds[stage - 1] ?? 0;
  const nextThreshold = stageThresholds[stage] ?? stageThresholds[stageThresholds.length - 1];
  const rawProgress = stage >= 5
    ? 100
    : ((totalEarned - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  const progress = Math.min(100, Math.max(0, rawProgress));
  const earned = Math.floor(totalEarned - currentThreshold);
  const needed = nextThreshold - currentThreshold;

  return (
    <div className="w-full px-4 py-3 border-t border-foreground/10 bg-card">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-heading uppercase text-foreground tracking-wider">
          {stageNames[stage - 1]}
        </span>
        {stage < 5 ? (
          <span className="text-[10px] text-foreground/50 font-heading">
            → {stageNames[stage]}
          </span>
        ) : (
          <span className="text-[10px] text-yellow-600 font-heading uppercase">✓ Максимум!</span>
        )}
      </div>
      <div className="h-3 bg-foreground/10 border border-foreground/20 overflow-hidden" style={{ borderRadius: "2px" }}>
        <motion.div
          className="h-full"
          style={{ backgroundColor: stageColors[stage - 1], borderRadius: "1px" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {stage < 5 && (
        <div className="flex justify-between text-[9px] text-foreground/40 mt-0.5">
          <span>+₴{earned.toLocaleString()}</span>
          <span>₴{needed.toLocaleString()} до наступного</span>
        </div>
      )}
    </div>
  );
}

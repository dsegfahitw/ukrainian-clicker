const stageThresholds = [0, 1000, 10000, 100000, 1000000];
const stageNames = ["🌾 Село", "🏘️ Райцентр", "🏙️ Обласний центр", "🌆 Київ", "👑 Еліта"];

interface StageProgressProps {
  stage: number;
  totalEarned: number;
}

export function StageProgress({ stage, totalEarned }: StageProgressProps) {
  const currentThreshold = stageThresholds[stage - 1] || 0;
  const nextThreshold = stageThresholds[stage] || stageThresholds[stageThresholds.length - 1];
  const progress = stage >= 5 ? 100 : ((totalEarned - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

  return (
    <div className="w-full px-4 py-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-heading uppercase text-foreground/70">
          {stageNames[stage - 1]}
        </span>
        {stage < 5 && (
          <span className="text-[10px] text-foreground/50">
            → {stageNames[stage]}
          </span>
        )}
      </div>
      <div className="h-3 bg-foreground/10 border border-foreground/30 overflow-hidden" style={{ borderRadius: "2px" }}>
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%`, borderRadius: "1px" }}
        />
      </div>
      {stage < 5 && (
        <div className="text-[9px] text-foreground/40 text-right mt-0.5">
          ₴{Math.floor(totalEarned).toLocaleString()} / ₴{nextThreshold.toLocaleString()}
        </div>
      )}
    </div>
  );
}

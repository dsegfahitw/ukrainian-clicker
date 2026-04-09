import { memo } from "react";
import { motion } from "framer-motion";
import { jobs } from "@/data/jobs";
import { computeWorkEarnings } from "@/hooks/useGameState";
import type { GameState } from "@/hooks/useGameState";

interface WorkTabProps {
  state: GameState;
  onSelectJob: (jobId: string) => void;
}

const skillLabels: Record<string, string> = {
  driving: "Водіння",
  accounting: "Бухгалтерія",
};

function WorkTabInner({ state, onSelectJob }: WorkTabProps) {
  return (
    <div className="p-4 pb-24 scrollbar-hide overflow-y-auto max-h-[calc(100vh-120px)]">
      <h2 className="font-heading text-lg uppercase tracking-wider text-foreground mb-4 text-center" style={{ transform: "rotate(-1deg)" }}>
        💼 Робота
      </h2>

      <div className="space-y-3">
        {jobs.map((job) => {
          const isActive = state.activeJobId === job.id;
          const isLocked = state.level < job.levelReq;
          const missingSkill = job.requiredSkill && (state.skills[job.requiredSkill] || 0) < 1;
          const canSelect = !isLocked && !missingSkill;
          // Show earnings with all bonuses applied for the active or preview job
          const previewState = { ...state, activeJobId: job.id };
          const totalEarn = computeWorkEarnings(previewState);

          return (
            <motion.div
              key={job.id}
              layout
              className={`border-game p-4 transition-all ${
                isActive ? "bg-primary/10 border-primary" : isLocked || missingSkill ? "bg-foreground/5 opacity-50" : "bg-card"
              }`}
              style={{ borderRadius: "2px" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{job.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-heading text-sm uppercase">{job.name}</h3>
                    {isActive && (
                      <span className="text-[10px] bg-green-700 text-white px-2 py-0.5 font-heading uppercase" style={{ borderRadius: "2px" }}>
                        Активна
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/60 mb-2">{job.description}</p>
                  <div className="flex items-center gap-3 text-xs flex-wrap">
                    <span className="text-green-700 font-bold">₴{totalEarn}/зміна</span>
                    <span className="text-red-600">-{job.healthCost} HP</span>
                    <span className="text-foreground/50">Рівень {job.levelReq}+</span>
                  </div>
                  {job.requiredSkill && (
                    <div className="text-[10px] text-foreground/40 mt-1">
                      Потрібна навичка: {skillLabels[job.requiredSkill] || job.requiredSkill}
                    </div>
                  )}
                </div>
              </div>

              {canSelect && !isActive && (
                <button
                  onClick={() => onSelectJob(job.id)}
                  className="w-full mt-3 py-2.5 bg-primary text-primary-foreground font-heading text-xs uppercase tracking-wider border-2 border-foreground active:scale-95 transition-transform"
                  style={{ borderRadius: "2px", minHeight: "44px" }}
                >
                  Обрати роботу
                </button>
              )}

              {(isLocked || missingSkill) && (
                <div className="mt-2 text-center text-xs text-foreground/40 font-heading uppercase">
                  🔒 {isLocked ? `Потрібен рівень ${job.levelReq}` : `Потрібна: ${skillLabels[job.requiredSkill!] || job.requiredSkill}`}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export const WorkTab = memo(WorkTabInner);

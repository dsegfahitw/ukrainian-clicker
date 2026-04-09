import { memo } from "react";
import { motion } from "framer-motion";
import { skills } from "@/data/skills";
import type { GameState } from "@/hooks/useGameState";

interface SkillsTabProps {
  state: GameState;
  onUpgrade: (skillId: string) => void;
}

function SkillsTabInner({ state, onUpgrade }: SkillsTabProps) {
  return (
    <div className="p-4 pb-24 scrollbar-hide overflow-y-auto max-h-[calc(100vh-120px)]">
      <h2 className="font-heading text-lg uppercase tracking-wider text-foreground mb-4 text-center" style={{ transform: "rotate(-1deg)" }}>
        📚 Навички
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {skills.map((skill) => {
          const currentLevel = state.skills[skill.id] || 0;
          const isMaxed = currentLevel >= skill.maxLevel;
          const cost = Math.floor(skill.baseCost * Math.pow(1.5, currentLevel));
          const canAfford = state.money >= cost && !isMaxed;

          return (
            <motion.div
              key={skill.id}
              layout
              className="border-game p-3 text-center bg-card"
              style={{ borderRadius: "2px" }}
            >
              <span className="text-3xl block mb-1">{skill.emoji}</span>
              <h3 className="font-heading text-[11px] uppercase mb-1">{skill.name}</h3>

              <div className="flex justify-center gap-0.5 mb-1">
                {Array.from({ length: skill.maxLevel }).map((_, i) => (
                  <span key={i} className={`text-sm ${i < currentLevel ? "text-yellow-500" : "text-foreground/20"}`}>
                    ★
                  </span>
                ))}
              </div>

              <p className="text-[9px] text-foreground/50 mb-2 leading-tight">{skill.effectDescription}</p>

              {!isMaxed ? (
                <button
                  onClick={() => onUpgrade(skill.id)}
                  disabled={!canAfford}
                  className={`w-full py-2 font-heading text-[10px] uppercase tracking-wider border transition-all active:scale-95 ${
                    canAfford
                      ? "bg-accent text-foreground border-foreground hover:bg-accent/80"
                      : "bg-foreground/10 text-foreground/30 border-foreground/20"
                  }`}
                  style={{ borderRadius: "2px", minHeight: "36px" }}
                >
                  ₴{cost.toLocaleString()}
                </button>
              ) : (
                <div className="text-[10px] text-green-700 font-heading uppercase py-2">✓ Максимум</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export const SkillsTab = memo(SkillsTabInner);

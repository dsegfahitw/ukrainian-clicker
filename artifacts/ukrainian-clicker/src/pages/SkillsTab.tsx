import { memo } from "react";
import { skills } from "@/data/skills";
import type { GameState } from "@/hooks/useGameState";
import { SkillCard } from "@/components/SkillCard";

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
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            currentLevel={state.skills[skill.id] || 0}
            money={state.money}
            onUpgrade={onUpgrade}
          />
        ))}
      </div>
    </div>
  );
}

export const SkillsTab = memo(SkillsTabInner);

import { motion } from "framer-motion";
import type { Boss } from "@/data/bosses";
import type { GameState } from "@/hooks/useGameState";

interface BossCardProps {
  boss: Boss;
  state: GameState;
  onChallenge: (bossId: string) => void;
  defeated: boolean;
}

function checkReqs(boss: Boss, state: GameState): { met: boolean; missing: string[] } {
  const missing: string[] = [];
  const r = boss.requirements;
  if (r.reputation !== undefined && state.reputation < r.reputation) missing.push(`Репутація: ${state.reputation}/${r.reputation}`);
  if (r.corruption !== undefined && state.corruption < r.corruption) missing.push(`Корупція: ${state.corruption}/${r.corruption}`);
  if (r.money !== undefined && state.money < r.money) missing.push(`Гроші: ₴${Math.floor(state.money).toLocaleString()}/₴${r.money.toLocaleString()}`);
  if (r.stage !== undefined && state.stage < r.stage) missing.push(`Стадія ${r.stage}`);
  if (r.level !== undefined && state.level < r.level) missing.push(`Рівень ${r.level}`);
  if (r.skill) {
    const current = state.skills[r.skill.id] || 0;
    const skillLabel = r.skill.id === "marketing" ? "Маркетинг" : r.skill.id;
    if (current < r.skill.level) missing.push(`${skillLabel}: ${current}/${r.skill.level}`);
  }
  return { met: missing.length === 0, missing };
}

export function BossCard({ boss, state, onChallenge, defeated }: BossCardProps) {
  const { met, missing } = checkReqs(boss, state);

  return (
    <motion.div
      layout
      className={`relative border-2 p-4 mb-3 overflow-hidden ${defeated ? "opacity-60" : ""}`}
      style={{
        borderColor: defeated ? "#888" : boss.color,
        borderRadius: "2px",
        background: defeated
          ? "linear-gradient(135deg, #333 0%, #222 100%)"
          : `linear-gradient(135deg, ${boss.color}22 0%, #111 100%)`,
      }}
    >
      {/* Boss header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="text-4xl w-14 h-14 flex items-center justify-center border-2 flex-shrink-0"
          style={{ borderColor: boss.color, borderRadius: "2px" }}
        >
          {boss.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: boss.color }}>
            {boss.title}
          </div>
          <div className="font-heading text-sm uppercase text-foreground leading-tight">{boss.name}</div>
          <p className="text-xs text-foreground/60 mt-1 leading-snug">{boss.description}</p>
        </div>
      </div>

      {/* Story text */}
      <div
        className="text-xs italic text-foreground/70 px-3 py-2 mb-3 border-l-2"
        style={{ borderColor: boss.color, background: "rgba(255,255,255,0.03)" }}
      >
        {boss.storyText}
      </div>

      {/* Requirements */}
      {!defeated && (
        <div className="mb-3">
          <div className="text-[10px] font-heading uppercase text-foreground/50 mb-1">Вимоги:</div>
          <div className="flex flex-wrap gap-1.5">
            {boss.requirementsText.map((req) => {
              const isMet = !missing.some((m) => m.startsWith(req.split(":")[0].trim().split(" ")[0]));
              return (
                <span
                  key={req}
                  className={`text-[10px] px-2 py-0.5 border font-heading`}
                  style={{
                    borderRadius: "2px",
                    borderColor: isMet ? "#22c55e" : "#888",
                    color: isMet ? "#22c55e" : "#888",
                    background: isMet ? "rgba(34,197,94,0.1)" : "transparent",
                  }}
                >
                  {isMet ? "✓" : "✗"} {req}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Reward */}
      <div className="text-[10px] text-foreground/50 mb-3">
        <span className="font-heading uppercase">Нагорода: </span>
        {boss.reward.description}
      </div>

      {/* Action button */}
      {defeated ? (
        <div className="text-center text-green-600 font-heading text-sm uppercase py-2 border border-green-700/40 bg-green-900/20" style={{ borderRadius: "2px" }}>
          ✓ Переможено
        </div>
      ) : met ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onChallenge(boss.id)}
          className="tap-target w-full py-3 font-heading text-sm uppercase tracking-wider border-2 transition-all active:brightness-90"
          style={{
            borderRadius: "2px",
            borderColor: boss.color,
            color: boss.color,
            background: `${boss.color}22`,
          }}
        >
          ⚔️ Кинути виклик
        </motion.button>
      ) : (
        <div className="space-y-1">
          {missing.map((m) => (
            <div key={m} className="text-[10px] text-red-400 text-center font-heading">⚠ {m}</div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

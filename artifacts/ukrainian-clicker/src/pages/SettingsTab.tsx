import { motion } from "framer-motion";
import { achievements } from "@/data/achievements";
import { DailyTasks } from "@/components/DailyTasks";
import type { GameState } from "@/hooks/useGameState";
import { getDailyTasksForDate } from "@/data/dailyTasks";

interface SettingsTabProps {
  state: GameState;
  onNewGame: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onClaimTask: (taskId: string) => void;
  onShowAds: () => void;
}

export function SettingsTab({ state, onNewGame, onToggleSound, onToggleMusic, onClaimTask, onShowAds }: SettingsTabProps) {
  const tasks = getDailyTasksForDate(state.dailyTasksDate || `day-${state.day}`);

  const handleClaimTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) onClaimTask(taskId);
  };

  return (
    <div className="pb-24 scrollbar-hide overflow-y-auto max-h-[calc(100vh-120px)]">
      <h2 className="font-heading text-lg uppercase tracking-wider text-foreground p-4 pb-0 text-center" style={{ transform: "rotate(-1deg)" }}>
        ⚙️ Налаштування
      </h2>

      <DailyTasks taskCycleKey={state.dailyTasksDate || `day-${state.day}`} taskProgress={state.dailyTaskProgress} onClaim={handleClaimTask} />

      <div className="px-4 pb-4 space-y-3">
        <div className="border-game bg-card p-4" style={{ borderRadius: "2px" }}>
          <h3 className="font-heading text-sm uppercase mb-3">Звук і музика</h3>
          <div className="space-y-2">
            <button
              onClick={onToggleSound}
              className={`tap-target w-full flex items-center justify-between py-2.5 px-3 border-2 font-heading text-sm uppercase transition-all ${
                state.soundEnabled ? "bg-green-700 text-white border-green-900" : "bg-foreground/10 text-foreground/50 border-foreground/20"
              }`}
              style={{ borderRadius: "2px" }}
            >
              <span>🔊 Звук</span>
              <span>{state.soundEnabled ? "УВІМК" : "ВИМК"}</span>
            </button>
            <button
              onClick={onToggleMusic}
              className={`tap-target w-full flex items-center justify-between py-2.5 px-3 border-2 font-heading text-sm uppercase transition-all ${
                state.musicEnabled ? "bg-green-700 text-white border-green-900" : "bg-foreground/10 text-foreground/50 border-foreground/20"
              }`}
              style={{ borderRadius: "2px" }}
            >
              <span>🎵 Музика</span>
              <span>{state.musicEnabled ? "УВІМК" : "ВИМК"}</span>
            </button>
          </div>
        </div>

        <div className="border-game bg-card p-4" style={{ borderRadius: "2px" }}>
          <h3 className="font-heading text-sm uppercase mb-3">Статистика</h3>
          <div className="space-y-1 text-sm">
            {[
              { label: "Зароблено всього", value: `₴${Math.floor(state.totalEarned).toLocaleString()}` },
              { label: "Кліки роботи", value: state.workClicks.toString() },
              { label: "Бізнесів", value: state.ownedBusinesses.length.toString() },
              { label: "Рівень", value: state.level.toString() },
              { label: "Днів зіграно", value: state.totalDaysPlayed.toString() },
              { label: "Макс. репутація", value: Math.floor(state.highestReputation).toString() },
              { label: "Макс. корупція", value: Math.floor(state.highestCorruption).toString() },
              { label: "Ланцюжок входу", value: `${state.dailyLoginStreak} дн.` },
              { label: "Досягнень", value: `${state.unlockedAchievements.length}/${achievements.length}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm py-0.5 border-b border-foreground/10">
                <span className="text-foreground/60">{label}</span>
                <span className="font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-game bg-card p-4" style={{ borderRadius: "2px" }}>
          <h3 className="font-heading text-sm uppercase mb-3">
            Досягнення ({state.unlockedAchievements.length}/{achievements.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {achievements.map((ach) => {
              const unlocked = state.unlockedAchievements.includes(ach.id);
              return (
                <motion.div
                  key={ach.id}
                  className={`p-2 border text-center transition-all ${
                    unlocked ? "bg-accent/20 border-accent" : "bg-foreground/5 border-foreground/20 opacity-40"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  <span className="text-xl block">{unlocked ? ach.emoji : "🔒"}</span>
                  <div className="text-[9px] font-heading uppercase mt-0.5 leading-tight">{ach.name}</div>
                  {unlocked && (
                    <div className="text-[8px] text-foreground/50 mt-0.5">{ach.description}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="border-game bg-card p-4" style={{ borderRadius: "2px" }}>
          <h3 className="font-heading text-sm uppercase mb-3">Монетизація (Демо)</h3>
          <div className="space-y-2">
            <div className="text-xs text-foreground/50 mb-2">Преміум скіни (заблоковано):</div>
            {["Бізнесмен 💼", "Депутат 🏛️", "Олігарх 👑"].map((skin) => (
              <div
                key={skin}
                className="flex items-center justify-between py-2 px-3 bg-foreground/5 border border-foreground/20 opacity-60"
                style={{ borderRadius: "2px" }}
              >
                <span className="text-sm font-heading uppercase">{skin}</span>
                <span className="text-[10px] text-foreground/40 font-heading">🔒 PREMIUM</span>
              </div>
            ))}
            <button
              onClick={onShowAds}
              className="tap-target w-full py-2.5 bg-primary text-primary-foreground font-heading text-xs uppercase border-2 border-foreground active:scale-95 transition-all mt-2"
              style={{ borderRadius: "2px" }}
            >
              📺 Бонуси за рекламу
            </button>
          </div>
        </div>

        <button
          onClick={onNewGame}
          className="tap-target w-full py-3 bg-red-800 hover:bg-red-700 text-white font-heading uppercase tracking-wider border-2 border-red-950 active:scale-95 transition-all"
          style={{ borderRadius: "2px" }}
        >
          Нова гра
        </button>
      </div>
    </div>
  );
}


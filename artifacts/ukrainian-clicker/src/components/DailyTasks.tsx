import { motion } from "framer-motion";
import { getDailyTasksForDate } from "@/data/dailyTasks";
import type { DailyTaskProgress } from "@/hooks/useGameState";

interface DailyTasksProps {
  taskProgress: DailyTaskProgress[];
  onClaim: (taskId: string) => void;
}

export function DailyTasks({ taskProgress, onClaim }: DailyTasksProps) {
  const today = new Date().toISOString().split("T")[0];
  const tasks = getDailyTasksForDate(today);

  return (
    <div className="p-4">
      <h3 className="font-heading text-sm uppercase tracking-wider text-foreground mb-3">
        📋 Щоденні завдання
      </h3>
      <div className="space-y-2">
        {tasks.map((task) => {
          const progress = taskProgress.find((p) => p.id === task.id) || {
            id: task.id,
            progress: 0,
            completed: false,
            claimedReward: false,
          };
          const pct = Math.min(100, (progress.progress / task.goal) * 100);

          return (
            <motion.div
              key={task.id}
              className={`border-game p-3 ${
                progress.claimedReward ? "bg-foreground/5 opacity-50" : progress.completed ? "bg-green-50 border-green-700" : "bg-card"
              }`}
              style={{ borderRadius: "2px" }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{task.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-heading uppercase">{task.label}</div>
                  <div className="text-[9px] text-foreground/50">
                    {task.reward.money && `+₴${task.reward.money}`}
                    {task.reward.experience && ` +${task.reward.experience} XP`}
                    {task.reward.health && ` +${task.reward.health} HP`}
                  </div>
                </div>
                {progress.completed && !progress.claimedReward && (
                  <button
                    onClick={() => onClaim(task.id)}
                    className="bg-accent text-foreground font-heading text-[10px] uppercase px-2 py-1 border border-foreground active:scale-95"
                    style={{ borderRadius: "2px" }}
                  >
                    Забрати
                  </button>
                )}
                {progress.claimedReward && (
                  <span className="text-[10px] text-green-700 font-heading">✓</span>
                )}
              </div>
              <div className="h-2 bg-foreground/10 border border-foreground/20" style={{ borderRadius: "2px" }}>
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${pct}%`, borderRadius: "1px" }}
                />
              </div>
              <div className="text-[9px] text-foreground/40 text-right mt-0.5">
                {Math.min(progress.progress, task.goal)}/{task.goal}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

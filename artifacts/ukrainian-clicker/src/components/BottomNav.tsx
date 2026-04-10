import { memo } from "react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unclaimedTasks?: number;
  bossesAvailable?: number;
}

const tabs = [
  { id: "life", label: "Життя", emoji: "🏠" },
  { id: "work", label: "Робота", emoji: "💼" },
  { id: "business", label: "Бізнес", emoji: "🏢" },
  { id: "skills", label: "Навички", emoji: "📚" },
  { id: "shop", label: "Магазин", emoji: "🛒" },
  { id: "premium", label: "Premium", emoji: "⭐" },
  { id: "settings", label: "Меню", emoji: "⚙️" },
];

function BottomNavInner({ activeTab, onTabChange, unclaimedTasks = 0, bossesAvailable = 0 }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t-2 border-foreground">
      <div className="max-w-[430px] mx-auto flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tap-target flex-1 flex flex-col items-center py-2 relative transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-foreground/60 hover:bg-foreground/5"
            }`}
          >
            <span className="text-base">{tab.emoji}</span>
            <span className="text-[8px] font-heading uppercase tracking-wider mt-0.5">
              {tab.label}
            </span>
            {tab.id === "settings" && unclaimedTasks > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {unclaimedTasks}
              </span>
            )}
            {tab.id === "business" && bossesAvailable > 0 && (
              <span className="absolute top-1 right-1 bg-orange-600 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                ⚔
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

export const BottomNav = memo(BottomNavInner);

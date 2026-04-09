interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "life", label: "Життя", emoji: "🏠" },
  { id: "work", label: "Робота", emoji: "💼" },
  { id: "business", label: "Бізнес", emoji: "🏢" },
  { id: "skills", label: "Навички", emoji: "📚" },
  { id: "market", label: "Ринок", emoji: "🛒" },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t-3 border-foreground">
      <div className="max-w-[430px] mx-auto flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-foreground/60 hover:bg-foreground/5"
            }`}
          >
            <span className="text-lg">{tab.emoji}</span>
            <span className="text-[9px] font-heading uppercase tracking-wider mt-0.5">
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

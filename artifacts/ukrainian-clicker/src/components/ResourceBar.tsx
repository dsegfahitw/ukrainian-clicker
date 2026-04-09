interface ResourceBarProps {
  icon: string;
  value: number;
  maxValue: number;
  color: string;
  label: string;
  showExact?: boolean;
}

export function ResourceBar({ icon, value, maxValue, color, label, showExact }: ResourceBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  return (
    <div className="flex items-center gap-1.5 w-full">
      <span className="text-sm">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-[10px] font-heading uppercase tracking-wider text-foreground/70">{label}</span>
          <span className="text-[10px] font-bold text-foreground">
            {showExact ? `₴${Math.floor(value).toLocaleString()}` : `${Math.floor(value)}/${maxValue}`}
          </span>
        </div>
        <div className="h-2.5 bg-foreground/10 border border-foreground/30 overflow-hidden" style={{ borderRadius: "2px" }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${showExact ? 100 : percentage}%`,
              backgroundColor: color,
              borderRadius: "1px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

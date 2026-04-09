interface CorruptionScaleProps {
  value: number;
}

export function CorruptionScale({ value }: CorruptionScaleProps) {
  const percentage = Math.min(100, Math.max(0, value));
  const skullSize = 12 + (percentage / 100) * 8;

  return (
    <div className="flex items-center gap-1.5 w-full">
      <span className="text-sm" style={{ fontSize: `${skullSize}px` }}>☠️</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-[10px] font-heading uppercase tracking-wider text-foreground/70">Корупція</span>
          <span className="text-[10px] font-bold text-foreground">{Math.floor(value)}/100</span>
        </div>
        <div className="h-2.5 bg-foreground/10 border border-foreground/30 overflow-hidden" style={{ borderRadius: "2px" }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, #4caf50 0%, #ffeb3b 40%, #ff9800 70%, #f44336 90%, #4a0e0e 100%)`,
              borderRadius: "1px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

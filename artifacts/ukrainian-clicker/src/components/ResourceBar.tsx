import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

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
  const [pulse, setPulse] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value > prevRef.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 400);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
    prevRef.current = value;
  }, [value]);

  const isLow = !showExact && percentage <= 20;

  return (
    <div className="flex items-center gap-1.5 w-full">
      <span className="text-sm">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-[10px] font-heading uppercase tracking-wider text-foreground/70">{label}</span>
          <motion.span
            animate={pulse ? { scale: [1, 1.25, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`text-[10px] font-bold ${pulse ? "text-yellow-600" : "text-foreground"}`}
          >
            {showExact ? `₴${Math.floor(value).toLocaleString()}` : `${Math.floor(value)}/${maxValue}`}
          </motion.span>
        </div>
        <div
          className={`h-2.5 bg-foreground/10 border overflow-hidden ${isLow ? "border-red-500" : "border-foreground/30"}`}
          style={{ borderRadius: "2px" }}
        >
          <motion.div
            className="h-full"
            style={{ backgroundColor: isLow ? "#ef4444" : color, borderRadius: "1px" }}
            animate={{ width: `${showExact ? 100 : percentage}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>
      </div>
    </div>
  );
}

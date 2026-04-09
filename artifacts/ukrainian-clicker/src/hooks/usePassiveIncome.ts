import { useEffect } from "react";

export function usePassiveIncome(passiveIncome: number, onTick: () => void, gameOver: boolean) {
  useEffect(() => {
    if (passiveIncome <= 0 || gameOver) return;
    const interval = setInterval(onTick, 1000);
    return () => clearInterval(interval);
  }, [passiveIncome, onTick, gameOver]);
}

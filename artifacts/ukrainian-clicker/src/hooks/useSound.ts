import { useCallback, useRef } from "react";

type SoundType = "work_click" | "coin_gain" | "level_up" | "event_popup" | "purchase" | "achievement_unlock";

function createAudioContext(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playTone(ctx: AudioContext, frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.3) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

function playSoundEffect(ctx: AudioContext, sound: SoundType) {
  try {
    switch (sound) {
      case "work_click":
        playTone(ctx, 220, 0.1, "square", 0.15);
        break;
      case "coin_gain":
        playTone(ctx, 523, 0.08, "sine", 0.2);
        setTimeout(() => playTone(ctx, 659, 0.1, "sine", 0.2), 80);
        break;
      case "level_up":
        playTone(ctx, 523, 0.1, "sine", 0.3);
        setTimeout(() => playTone(ctx, 659, 0.1, "sine", 0.3), 100);
        setTimeout(() => playTone(ctx, 784, 0.2, "sine", 0.3), 200);
        break;
      case "event_popup":
        playTone(ctx, 440, 0.15, "triangle", 0.2);
        break;
      case "purchase":
        playTone(ctx, 392, 0.08, "sine", 0.25);
        setTimeout(() => playTone(ctx, 523, 0.15, "sine", 0.25), 80);
        break;
      case "achievement_unlock":
        playTone(ctx, 523, 0.1, "sine", 0.3);
        setTimeout(() => playTone(ctx, 659, 0.1, "sine", 0.3), 100);
        setTimeout(() => playTone(ctx, 784, 0.1, "sine", 0.3), 200);
        setTimeout(() => playTone(ctx, 1047, 0.3, "sine", 0.3), 300);
        break;
    }
  } catch {}
}

export function useSound(soundEnabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = createAudioContext();
    }
    if (ctxRef.current?.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (sound: SoundType) => {
      if (!soundEnabled) return;
      const ctx = ensureCtx();
      if (ctx) playSoundEffect(ctx, sound);
    },
    [soundEnabled, ensureCtx]
  );

  return { play };
}

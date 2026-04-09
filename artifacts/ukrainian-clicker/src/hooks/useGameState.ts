import { useState, useEffect, useCallback, useRef } from "react";
import { jobs } from "@/data/jobs";
import { businesses } from "@/data/businesses";
import { events, type GameEvent } from "@/data/events";
import { skills as skillDefs } from "@/data/skills";
import { achievements, type AchievementCheckState } from "@/data/achievements";
import { dailyRewards, type DailyReward } from "@/data/dailyRewards";
import { getDailyTasksForDate, type DailyTask } from "@/data/dailyTasks";

export type AdModalType = "interstitial" | "rewarded" | null;

export interface DailyTaskProgress {
  id: string;
  progress: number;
  completed: boolean;
  claimedReward: boolean;
}

export interface GameState {
  money: number;
  health: number;
  reputation: number;
  corruption: number;
  experience: number;
  level: number;
  stage: 1 | 2 | 3 | 4 | 5;
  workClicks: number;
  totalEarned: number;
  skills: Record<string, number>;
  ownedBusinesses: { id: string; level: number }[];
  passiveIncome: number;
  unlockedCurrencies: string[];
  inventory: { name: string; quantity: number }[];
  day: number;
  lastSaved: number;
  activeJobId: string;
  permanentBonuses: string[];
  marketPriceMultiplier: number;
  eventCount: number;
  gameOver: boolean;
  gameOverReason: string;
  wonGame: boolean;
  unlockedAchievements: string[];
  dailyLoginStreak: number;
  lastLoginDate: string;
  dailyTasksDate: string;
  dailyTaskProgress: DailyTaskProgress[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  sessionWorkClicks: number;
  sessionSkillUpgrades: number;
  sessionMarketPurchases: number;
  sessionMoneyEarned: number;
  totalDaysPlayed: number;
  highestReputation: number;
  highestCorruption: number;
  saveVersion: number;
}

const SAVE_VERSION = 3;
const SAVE_KEY = "ukrainian_clicker_save_v3";
const MAX_OFFLINE_SECONDS = 8 * 60 * 60;

const initialState: GameState = {
  money: 150,
  health: 75,
  reputation: 50,
  corruption: 30,
  experience: 0,
  level: 1,
  stage: 1,
  workClicks: 0,
  totalEarned: 0,
  skills: {
    farming: 0, oratory: 0, bribery: 0, haggling: 0,
    networking: 0, driving: 0, accounting: 0, marketing: 0,
  },
  ownedBusinesses: [],
  passiveIncome: 0,
  unlockedCurrencies: ["uah"],
  inventory: [],
  day: 1,
  lastSaved: Date.now(),
  activeJobId: "farm_labor",
  permanentBonuses: [],
  marketPriceMultiplier: 1,
  eventCount: 0,
  gameOver: false,
  gameOverReason: "",
  wonGame: false,
  unlockedAchievements: [],
  dailyLoginStreak: 0,
  lastLoginDate: "",
  dailyTasksDate: "",
  dailyTaskProgress: [],
  soundEnabled: true,
  musicEnabled: false,
  sessionWorkClicks: 0,
  sessionSkillUpgrades: 0,
  sessionMarketPurchases: 0,
  sessionMoneyEarned: 0,
  totalDaysPlayed: 0,
  highestReputation: 50,
  highestCorruption: 30,
  saveVersion: SAVE_VERSION,
};

export interface OfflineData {
  seconds: number;
  earnings: number;
}

export interface AchievementUnlock {
  id: string;
  name: string;
  emoji: string;
  rewardText: string;
}

/** Sanitize numeric fields to prevent NaN corruption */
function sanitize(s: GameState): GameState {
  const nums: (keyof GameState)[] = ["money", "health", "reputation", "corruption", "experience", "level", "day", "totalEarned", "workClicks", "passiveIncome"];
  const out = { ...s };
  for (const k of nums) {
    const v = out[k] as number;
    if (typeof v !== "number" || isNaN(v) || !isFinite(v)) {
      (out as Record<string, unknown>)[k] = (initialState as Record<string, unknown>)[k];
    }
  }
  // Clamp values
  out.health = Math.max(0, Math.min(100, out.health));
  out.reputation = Math.max(0, Math.min(100, out.reputation));
  out.corruption = Math.max(0, Math.min(100, out.corruption));
  out.money = Math.max(0, out.money);
  return out;
}

function loadState(): (GameState & { _loadTime: number }) | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    // Version check — reject saves from incompatible versions
    if (!parsed || typeof parsed !== "object") return null;
    if ((parsed.saveVersion || 0) < SAVE_VERSION - 1) return null; // allow v2 → v3 migration
    const merged: GameState = { ...initialState, ...parsed, saveVersion: SAVE_VERSION };
    return { ...sanitize(merged), _loadTime: parsed.lastSaved || Date.now() };
  } catch {
    return null;
  }
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(sanitize({ ...state, lastSaved: Date.now(), saveVersion: SAVE_VERSION })));
  } catch { /* quota exceeded or private mode */ }
}

function getStage(totalEarned: number): 1 | 2 | 3 | 4 | 5 {
  if (totalEarned >= 1000000) return 5;
  if (totalEarned >= 100000) return 4;
  if (totalEarned >= 10000) return 3;
  if (totalEarned >= 1000) return 2;
  return 1;
}

export function getLevelXpNeeded(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/** Compute upgrade cost for a business — single source of truth */
export function getBusinessUpgradeCost(bizCost: number, currentLevel: number): number {
  return Math.floor(bizCost * Math.pow(1.8, currentLevel));
}

/** Compute the per-second passive income from all owned businesses */
export function calculatePassiveIncome(ownedBiz: { id: string; level: number }[], marketingLevel: number): number {
  let total = 0;
  for (const ob of ownedBiz) {
    const biz = businesses.find((b) => b.id === ob.id);
    if (biz) total += biz.passiveIncome * Math.pow(2, ob.level - 1);
  }
  return total * (1 + marketingLevel * 0.1);
}

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function checkNewAchievements(state: GameState): { state: GameState; newUnlocks: AchievementUnlock[] } {
  const checkState: AchievementCheckState = {
    money: state.money, totalEarned: state.totalEarned, health: state.health,
    reputation: state.reputation, corruption: state.corruption, level: state.level,
    workClicks: state.workClicks, stage: state.stage, ownedBusinesses: state.ownedBusinesses,
    skills: state.skills, passiveIncome: state.passiveIncome, day: state.day,
    permanentBonuses: state.permanentBonuses,
  };

  const newUnlocks: AchievementUnlock[] = [];
  let newUnlockedAchievements = [...state.unlockedAchievements];
  let money = state.money;
  let experience = state.experience;

  for (const ach of achievements) {
    if (newUnlockedAchievements.includes(ach.id)) continue;
    if (ach.condition(checkState)) {
      newUnlockedAchievements.push(ach.id);
      if (ach.reward.money) money += ach.reward.money;
      if (ach.reward.experience) experience += ach.reward.experience;
      const rewardParts: string[] = [];
      if (ach.reward.money) rewardParts.push(`+₴${ach.reward.money}`);
      if (ach.reward.experience) rewardParts.push(`+${ach.reward.experience} XP`);
      newUnlocks.push({ id: ach.id, name: ach.name, emoji: ach.emoji, rewardText: rewardParts.join(", ") });
    }
  }

  return { state: { ...state, unlockedAchievements: newUnlockedAchievements, money, experience }, newUnlocks };
}

function initDailyTasksIfNeeded(state: GameState): GameState {
  const today = getTodayStr();
  if (state.dailyTasksDate === today && state.dailyTaskProgress.length > 0) return state;
  const tasks = getDailyTasksForDate(today);
  return {
    ...state,
    dailyTasksDate: today,
    dailyTaskProgress: tasks.map((t) => ({ id: t.id, progress: 0, completed: false, claimedReward: false })),
    sessionWorkClicks: 0, sessionSkillUpgrades: 0, sessionMarketPurchases: 0, sessionMoneyEarned: 0,
  };
}

function updateDailyTaskProgress(
  state: GameState,
  metric: "workClicks" | "skillUpgrades" | "marketPurchases" | "moneyEarned",
  amount: number
): GameState {
  const today = getTodayStr();
  if (state.dailyTasksDate !== today) return state;
  const tasks = getDailyTasksForDate(today);
  const newProgress = state.dailyTaskProgress.map((p) => {
    const task = tasks.find((t) => t.id === p.id);
    if (!task || task.metric !== metric || p.completed) return p;
    const newProg = p.progress + amount;
    return { ...p, progress: newProg, completed: newProg >= task.goal };
  });
  return { ...state, dailyTaskProgress: newProgress };
}

/** Compute the work earnings for a given state + job */
export function computeWorkEarnings(state: GameState): number {
  const job = jobs.find((j) => j.id === state.activeJobId) || jobs[0];
  const farmingBonus = state.skills.farming * 5;
  const workBootsBonus =
    (state.permanentBonuses.includes("work_earnings_10") ? 0.1 : 0) +
    (state.permanentBonuses.includes("work_earnings_20") ? 0.2 : 0);
  const baseEarn = job.earnPerShift + farmingBonus;
  return Math.floor(baseEarn * (1 + workBootsBonus));
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadState();
    let s = saved ? ({ ...saved } as GameState) : { ...initialState };
    s = initDailyTasksIfNeeded(s);
    return s;
  });

  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showStageUp, setShowStageUp] = useState(false);
  const [moneyFloats, setMoneyFloats] = useState<{ id: number; amount: number }[]>([]);
  const [achievementQueue, setAchievementQueue] = useState<AchievementUnlock[]>([]);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const [showDailyReward, setShowDailyReward] = useState<DailyReward | null>(null);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState<AdModalType>(null);
  const [lastInterstitialTime, setLastInterstitialTime] = useState(Date.now());
  const floatIdRef = useRef(0);
  // Keep a ref to latest state for the autosave interval (avoids stale closure)
  const stateRef = useRef(state);
  stateRef.current = state;
  // Track whether daily login has already been processed this session
  const dailyLoginChecked = useRef(false);

  // One-time startup: offline earnings + daily login
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      const offlineSeconds = Math.min(
        Math.floor((Date.now() - saved._loadTime) / 1000),
        MAX_OFFLINE_SECONDS
      );
      if (offlineSeconds > 60 && saved.passiveIncome > 0) {
        const earnings = Math.floor(saved.passiveIncome * offlineSeconds);
        setOfflineData({ seconds: offlineSeconds, earnings });
        setShowOfflineModal(true);
      } else {
        checkDailyLogin(saved);
        setShowResumeModal(true);
      }
    } else {
      // Brand new game — check daily login anyway
      checkDailyLogin({ ...initialState, lastLoginDate: "", dailyLoginStreak: 0, totalDaysPlayed: 0 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function checkDailyLogin(saved: Partial<GameState>) {
    if (dailyLoginChecked.current) return;
    dailyLoginChecked.current = true;
    const today = getTodayStr();
    const lastLogin = saved.lastLoginDate || "";
    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      const streak = lastLogin === yesterdayStr ? Math.min((saved.dailyLoginStreak || 0) + 1, 7) : 1;
      const rewardDay = ((streak - 1) % 7) + 1;
      const reward = dailyRewards.find((r) => r.day === rewardDay);
      if (reward) setShowDailyReward(reward);
      setState((prev) => {
        let newState = { ...prev, dailyLoginStreak: streak, lastLoginDate: today, totalDaysPlayed: prev.totalDaysPlayed + 1 };
        newState = initDailyTasksIfNeeded(newState);
        return newState;
      });
    }
  }

  // Autosave every 30 seconds — uses ref so it always saves latest state
  useEffect(() => {
    const interval = setInterval(() => {
      saveState(stateRef.current);
    }, 30_000);
    // Also save on page unload
    const handleUnload = () => saveState(stateRef.current);
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  // Interstitial ad timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInterstitialTime > 4 * 60 * 1000) {
        setShowAdModal("interstitial");
        setLastInterstitialTime(Date.now());
      }
    }, 15_000);
    return () => clearInterval(interval);
  }, [lastInterstitialTime]);

  const addMoneyFloat = useCallback((amount: number) => {
    const id = floatIdRef.current++;
    setMoneyFloats((prev) => [...prev, { id, amount }]);
    setTimeout(() => setMoneyFloats((prev) => prev.filter((f) => f.id !== id)), 1200);
  }, []);

  const applyAchievements = useCallback((s: GameState, onUnlock?: (unlocks: AchievementUnlock[]) => void): GameState => {
    const { state: newS, newUnlocks } = checkNewAchievements(s);
    if (newUnlocks.length > 0) {
      setAchievementQueue((prev) => [...prev, ...newUnlocks]);
      onUnlock?.(newUnlocks);
    }
    return newS;
  }, []);

  const checkGameOver = useCallback((s: GameState): GameState => {
    if (s.health <= 0) return { ...s, health: 0, gameOver: true, gameOverReason: "Ви впали від виснаження! Здоров'я на нулі." };
    if (s.reputation <= 0) return { ...s, reputation: 0, gameOver: true, gameOverReason: "Всі втратили довіру до вас! Репутація на нулі." };
    return s;
  }, []);

  const checkLevelUp = useCallback((s: GameState, onLevelUp?: () => void): GameState => {
    let newState = { ...s };
    while (newState.experience >= getLevelXpNeeded(newState.level) && newState.level < 100) {
      newState.experience -= getLevelXpNeeded(newState.level);
      newState.level += 1;
      onLevelUp?.();
    }
    return newState;
  }, []);

  const checkStageUp = useCallback((s: GameState): GameState => {
    const newStage = getStage(s.totalEarned);
    if (newStage > s.stage) {
      setShowStageUp(true);
      setTimeout(() => setShowStageUp(false), 3500);
      let currencies = [...s.unlockedCurrencies];
      if (newStage >= 3 && !currencies.includes("usd")) currencies.push("usd");
      if (newStage >= 4 && !currencies.includes("eur")) currencies.push("eur");
      if (newStage >= 5 && !currencies.includes("crypto")) currencies.push("crypto");
      const wonGame = newStage === 5 && !s.wonGame;
      return { ...s, stage: newStage as GameState["stage"], unlockedCurrencies: currencies, wonGame: wonGame || s.wonGame };
    }
    return s;
  }, []);

  const doWork = useCallback((onSound?: (s: "work_click" | "coin_gain" | "level_up") => void) => {
    setState((prev) => {
      if (prev.gameOver) return prev;
      const job = jobs.find((j) => j.id === prev.activeJobId) || jobs[0];
      const earn = computeWorkEarnings(prev);
      onSound?.("work_click");

      let s: GameState = {
        ...prev,
        money: prev.money + earn,
        health: Math.max(0, prev.health - job.healthCost),
        workClicks: prev.workClicks + 1,
        totalEarned: prev.totalEarned + earn,
        experience: prev.experience + 5,
        sessionWorkClicks: prev.sessionWorkClicks + 1,
        sessionMoneyEarned: prev.sessionMoneyEarned + earn,
        highestReputation: Math.max(prev.highestReputation, prev.reputation),
        highestCorruption: Math.max(prev.highestCorruption, prev.corruption),
      };

      const prevLevel = s.level;
      s = checkLevelUp(s, () => onSound?.("level_up"));
      if (s.level > prevLevel) {
        // level-up sound already called
      }
      s = checkStageUp(s);
      s = checkGameOver(s);
      s = updateDailyTaskProgress(s, "workClicks", 1);
      s = updateDailyTaskProgress(s, "moneyEarned", earn);
      s = applyAchievements(s);

      addMoneyFloat(earn);
      setTimeout(() => onSound?.("coin_gain"), 50);

      // 25% chance of random event
      if (Math.random() < 0.25 && !s.gameOver) {
        const availableEvents = events.filter((e) => {
          if (e.minStage && s.stage < e.minStage) return false;
          if (e.maxStage && s.stage > e.maxStage) return false;
          return true;
        });
        if (availableEvents.length > 0) {
          const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
          setTimeout(() => setCurrentEvent(randomEvent), 300);
        }
      }

      return s;
    });
  }, [addMoneyFloat, checkGameOver, checkLevelUp, checkStageUp, applyAchievements]);

  const handleEventChoice = useCallback((choiceIndex: number) => {
    if (!currentEvent) return;
    const choice = currentEvent.choices[choiceIndex];
    setState((prev) => {
      let s = { ...prev };
      if (choice.effects.money) s.money = Math.max(0, s.money + choice.effects.money);
      if (choice.effects.health) s.health = Math.min(100, Math.max(0, s.health + choice.effects.health));
      if (choice.effects.reputation) {
        const networkingBonus = 1 + s.skills.networking * 0.05;
        const suitBonus = s.permanentBonuses.includes("reputation_gain_15") ? 1.15 : 1;
        const repChange = choice.effects.reputation > 0
          ? Math.floor(choice.effects.reputation * networkingBonus * suitBonus)
          : choice.effects.reputation;
        s.reputation = Math.min(100, Math.max(0, s.reputation + repChange));
      }
      if (choice.effects.corruption) s.corruption = Math.min(100, Math.max(0, s.corruption + choice.effects.corruption));
      if (choice.effects.experience) s.experience = s.experience + choice.effects.experience;
      if (choice.effects.skipDays) s.day += choice.effects.skipDays;
      if (choice.effects.marketPriceMultiplier) s.marketPriceMultiplier = choice.effects.marketPriceMultiplier;

      if (choice.riskChance && Math.random() < choice.riskChance && choice.riskEffects) {
        if (choice.riskEffects.money) s.money = Math.max(0, s.money + choice.riskEffects.money);
        if (choice.riskEffects.health) s.health = Math.min(100, Math.max(0, s.health + choice.riskEffects.health));
        if (choice.riskEffects.reputation) s.reputation = Math.min(100, Math.max(0, s.reputation + choice.riskEffects.reputation));
        if (choice.riskEffects.corruption) s.corruption = Math.min(100, Math.max(0, s.corruption + choice.riskEffects.corruption));
      }

      if (choice.effects.money && choice.effects.money > 0) {
        s.totalEarned += choice.effects.money;
        s = updateDailyTaskProgress(s, "moneyEarned", choice.effects.money);
      }
      s.highestReputation = Math.max(s.highestReputation, s.reputation);
      s.highestCorruption = Math.max(s.highestCorruption, s.corruption);
      s = checkLevelUp(s);
      s = checkStageUp(s);
      s = checkGameOver(s);
      s = applyAchievements(s);
      return s;
    });
    setCurrentEvent(null);
  }, [currentEvent, checkGameOver, checkLevelUp, checkStageUp, applyAchievements]);

  const setActiveJob = useCallback((jobId: string) => {
    setState((prev) => ({ ...prev, activeJobId: jobId }));
  }, []);

  const buyBusiness = useCallback((businessId: string, onSound?: () => void) => {
    setState((prev) => {
      const biz = businesses.find((b) => b.id === businessId);
      if (!biz || prev.money < biz.cost || prev.level < biz.levelReq) return prev;
      if (prev.ownedBusinesses.some((b) => b.id === businessId)) return prev;
      if (biz.requiredSkill && (prev.skills[biz.requiredSkill] || 0) < 1) return prev;
      const newOwned = [...prev.ownedBusinesses, { id: businessId, level: 1 }];
      const newPassive = calculatePassiveIncome(newOwned, prev.skills.marketing);
      onSound?.();
      let s: GameState = { ...prev, money: prev.money - biz.cost, ownedBusinesses: newOwned, passiveIncome: newPassive, experience: prev.experience + 50 };
      s = applyAchievements(s);
      return s;
    });
  }, [applyAchievements]);

  const upgradeBusiness = useCallback((businessId: string, onSound?: () => void) => {
    setState((prev) => {
      const biz = businesses.find((b) => b.id === businessId);
      const owned = prev.ownedBusinesses.find((b) => b.id === businessId);
      if (!biz || !owned) return prev;
      const cost = getBusinessUpgradeCost(biz.cost, owned.level);
      if (prev.money < cost) return prev;
      const newOwned = prev.ownedBusinesses.map((b) => b.id === businessId ? { ...b, level: b.level + 1 } : b);
      const newPassive = calculatePassiveIncome(newOwned, prev.skills.marketing);
      onSound?.();
      let s: GameState = { ...prev, money: prev.money - cost, ownedBusinesses: newOwned, passiveIncome: newPassive, experience: prev.experience + 20 };
      s = applyAchievements(s);
      return s;
    });
  }, [applyAchievements]);

  const upgradeSkill = useCallback((skillId: string, onSound?: () => void) => {
    setState((prev) => {
      const skillDef = skillDefs.find((s) => s.id === skillId);
      if (!skillDef) return prev;
      const currentLevel = prev.skills[skillId] || 0;
      if (currentLevel >= skillDef.maxLevel) return prev;
      const cost = Math.floor(skillDef.baseCost * Math.pow(1.5, currentLevel));
      if (prev.money < cost) return prev;
      const newSkills = { ...prev.skills, [skillId]: currentLevel + 1 };
      const newPassive = calculatePassiveIncome(prev.ownedBusinesses, newSkills.marketing);
      onSound?.();
      let s: GameState = {
        ...prev, money: prev.money - cost, skills: newSkills, passiveIncome: newPassive,
        experience: prev.experience + 20, sessionSkillUpgrades: prev.sessionSkillUpgrades + 1,
      };
      s = updateDailyTaskProgress(s, "skillUpgrades", 1);
      s = applyAchievements(s);
      return s;
    });
  }, [applyAchievements]);

  const buyMarketItem = useCallback((itemId: string, basePrice: number, effect: { health?: number; reputation?: number; permanent?: string }, onSound?: () => void) => {
    setState((prev) => {
      const hagglingDiscount = 1 - prev.skills.haggling * 0.1;
      const price = Math.floor(basePrice * prev.marketPriceMultiplier * hagglingDiscount);
      if (prev.money < price) return prev;
      let s = { ...prev, money: prev.money - price };
      if (effect.health) s.health = Math.min(100, s.health + effect.health);
      if (effect.reputation) s.reputation = Math.min(100, Math.max(0, s.reputation + effect.reputation));
      if (effect.permanent && !prev.permanentBonuses.includes(effect.permanent)) {
        s.permanentBonuses = [...prev.permanentBonuses, effect.permanent];
      }
      s.sessionMarketPurchases += 1;
      s = updateDailyTaskProgress(s, "marketPurchases", 1);
      s = applyAchievements(s);
      onSound?.();
      return s;
    });
  }, [applyAchievements]);

  const addPassiveIncome = useCallback(() => {
    setState((prev) => {
      if (prev.passiveIncome <= 0 || prev.gameOver) return prev;
      const income = prev.passiveIncome;
      addMoneyFloat(income);
      let s = { ...prev, money: prev.money + income, totalEarned: prev.totalEarned + income };
      s = checkStageUp(s);
      s = updateDailyTaskProgress(s, "moneyEarned", income);
      return s;
    });
  }, [addMoneyFloat, checkStageUp]);

  const collectOfflineEarnings = useCallback((doubleIt = false) => {
    if (!offlineData) return;
    const earnings = doubleIt ? offlineData.earnings * 2 : offlineData.earnings;
    setState((prev) => {
      let s = { ...prev, money: prev.money + earnings, totalEarned: prev.totalEarned + earnings };
      s = checkStageUp(s);
      s = applyAchievements(s);
      return s;
    });
    addMoneyFloat(earnings);
    setOfflineData(null);
    setShowOfflineModal(false);
    // Check daily login after collecting offline earnings
    const saved = stateRef.current;
    checkDailyLogin(saved);
    setShowResumeModal(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offlineData, addMoneyFloat, checkStageUp, applyAchievements]);

  const claimDailyReward = useCallback((reward: DailyReward) => {
    setState((prev) => {
      let s = { ...prev };
      if (reward.effect.money) { s.money += reward.effect.money; s.totalEarned += reward.effect.money; }
      if (reward.effect.health) s.health = Math.min(100, s.health + reward.effect.health);
      if (reward.effect.reputation) s.reputation = Math.min(100, s.reputation + reward.effect.reputation);
      if (reward.effect.permanent && !prev.permanentBonuses.includes(reward.effect.permanent)) {
        s.permanentBonuses = [...s.permanentBonuses, reward.effect.permanent];
      }
      return s;
    });
    setShowDailyReward(null);
  }, []);

  const claimDailyTask = useCallback((taskId: string, task: DailyTask) => {
    setState((prev) => {
      const prog = prev.dailyTaskProgress.find((p) => p.id === taskId);
      if (!prog || !prog.completed || prog.claimedReward) return prev;
      let s = { ...prev };
      if (task.reward.money) { s.money += task.reward.money; s.totalEarned += task.reward.money; }
      if (task.reward.experience) s.experience += task.reward.experience;
      if (task.reward.health) s.health = Math.min(100, s.health + task.reward.health);
      s.dailyTaskProgress = s.dailyTaskProgress.map((p) => p.id === taskId ? { ...p, claimedReward: true } : p);
      return s;
    });
  }, []);

  const watchAdForBonus = useCallback((type: AdModalType) => {
    if (!type) return;
    if (type === "interstitial") {
      setState((prev) => ({ ...prev, money: prev.money + 1000, totalEarned: prev.totalEarned + 1000 }));
      addMoneyFloat(1000);
    } else if (type === "rewarded") {
      setState((prev) => ({ ...prev, health: 100 }));
    }
    setShowAdModal(null);
  }, [addMoneyFloat]);

  const dismissAchievement = useCallback(() => {
    setAchievementQueue((prev) => prev.slice(1));
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState({ ...initialState });
    setCurrentEvent(null);
    setShowStageUp(false);
    setOfflineData(null);
    setShowOfflineModal(false);
    setShowResumeModal(false);
    setAchievementQueue([]);
    dailyLoginChecked.current = false;
  }, []);

  const resumeGame = useCallback(() => setShowResumeModal(false), []);

  const startNewGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState({ ...initialState });
    setCurrentEvent(null);
    setShowStageUp(false);
    setOfflineData(null);
    setShowOfflineModal(false);
    setShowResumeModal(false);
    setAchievementQueue([]);
    dailyLoginChecked.current = false;
  }, []);

  const saveNow = useCallback(() => saveState(stateRef.current), []);

  const toggleSound = useCallback(() => setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled })), []);
  const toggleMusic = useCallback(() => setState((prev) => ({ ...prev, musicEnabled: !prev.musicEnabled })), []);
  const dismissAd = useCallback(() => setShowAdModal(null), []);
  const showRewardedAd = useCallback(() => setShowAdModal("rewarded"), []);

  const processAchievements = useCallback((s: GameState) => checkNewAchievements(s), []);

  return {
    state,
    currentEvent, setCurrentEvent,
    showStageUp,
    moneyFloats,
    achievementQueue,
    offlineData,
    showDailyReward,
    showOfflineModal,
    showResumeModal,
    showAdModal,
    doWork,
    handleEventChoice,
    setActiveJob,
    buyBusiness,
    upgradeBusiness,
    upgradeSkill,
    buyMarketItem,
    addPassiveIncome,
    collectOfflineEarnings,
    claimDailyReward,
    claimDailyTask,
    watchAdForBonus,
    dismissAchievement,
    resetGame,
    resumeGame,
    startNewGame,
    saveNow,
    toggleSound,
    toggleMusic,
    dismissAd,
    showRewardedAd,
    getLevelXpNeeded,
    processAchievements,
  };
}

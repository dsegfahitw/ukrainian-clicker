import { useState, useEffect, useCallback, useRef } from "react";
import { jobs } from "@/data/jobs";
import { businesses } from "@/data/businesses";
import { events, type GameEvent } from "@/data/events";
import { skills as skillDefs } from "@/data/skills";
import { achievements, type AchievementCheckState } from "@/data/achievements";
import { dailyRewards, type DailyReward } from "@/data/dailyRewards";
import { getDailyTasksForDate, type DailyTask } from "@/data/dailyTasks";

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
}

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
    farming: 0,
    oratory: 0,
    bribery: 0,
    haggling: 0,
    networking: 0,
    driving: 0,
    accounting: 0,
    marketing: 0,
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
};

const SAVE_KEY = "ukrainian_clicker_save_v2";
const MAX_OFFLINE_SECONDS = 8 * 60 * 60;

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

function loadState(): GameState | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSaved: Date.now() }));
  } catch {}
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

function calculatePassiveIncome(ownedBiz: { id: string; level: number }[], marketingLevel: number): number {
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
    money: state.money,
    totalEarned: state.totalEarned,
    health: state.health,
    reputation: state.reputation,
    corruption: state.corruption,
    level: state.level,
    workClicks: state.workClicks,
    stage: state.stage,
    ownedBusinesses: state.ownedBusinesses,
    skills: state.skills,
    passiveIncome: state.passiveIncome,
    day: state.day,
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
      newUnlocks.push({
        id: ach.id,
        name: ach.name,
        emoji: ach.emoji,
        rewardText: rewardParts.join(", "),
      });
    }
  }

  return {
    state: { ...state, unlockedAchievements: newUnlockedAchievements, money, experience },
    newUnlocks,
  };
}

function initDailyTasksIfNeeded(state: GameState): GameState {
  const today = getTodayStr();
  if (state.dailyTasksDate === today && state.dailyTaskProgress.length > 0) return state;
  const tasks = getDailyTasksForDate(today);
  return {
    ...state,
    dailyTasksDate: today,
    dailyTaskProgress: tasks.map((t) => ({ id: t.id, progress: 0, completed: false, claimedReward: false })),
    sessionWorkClicks: 0,
    sessionSkillUpgrades: 0,
    sessionMarketPurchases: 0,
    sessionMoneyEarned: 0,
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

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadState();
    let s = saved || { ...initialState };
    s = initDailyTasksIfNeeded(s);
    return s;
  });

  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showStageUp, setShowStageUp] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [moneyFloats, setMoneyFloats] = useState<{ id: number; amount: number }[]>([]);
  const [achievementQueue, setAchievementQueue] = useState<AchievementUnlock[]>([]);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const [showDailyReward, setShowDailyReward] = useState<DailyReward | null>(null);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState<string | null>(null);
  const [lastInterstitialTime, setLastInterstitialTime] = useState(Date.now());
  const floatIdRef = useRef(0);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      const offlineSeconds = Math.min(
        Math.floor((Date.now() - saved.lastSaved) / 1000),
        MAX_OFFLINE_SECONDS
      );
      if (offlineSeconds > 60 && saved.passiveIncome > 0) {
        const earnings = saved.passiveIncome * offlineSeconds;
        setOfflineData({ seconds: offlineSeconds, earnings });
        setShowOfflineModal(true);
      } else {
        setShowResumeModal(true);
      }
    }
  }, []);

  useEffect(() => {
    if (showOfflineModal || showResumeModal) return;
    const today = getTodayStr();
    const saved = loadState();
    const lastLogin = saved?.lastLoginDate || state.lastLoginDate;
    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      const streak = lastLogin === yesterdayStr ? Math.min((saved?.dailyLoginStreak || state.dailyLoginStreak) + 1, 7) : 1;
      const rewardDay = ((streak - 1) % 7) + 1;
      const reward = dailyRewards.find((r) => r.day === rewardDay);
      if (reward) setShowDailyReward(reward);
      setState((prev) => {
        let newState = { ...prev, dailyLoginStreak: streak, lastLoginDate: today, totalDaysPlayed: prev.totalDaysPlayed + 1 };
        newState = initDailyTasksIfNeeded(newState);
        return newState;
      });
    }
  }, [showOfflineModal, showResumeModal, state.lastLoginDate, state.dailyLoginStreak]);

  useEffect(() => {
    const interval = setInterval(() => {
      saveState(state);
    }, 30000);
    return () => clearInterval(interval);
  }, [state]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInterstitialTime > 4 * 60 * 1000) {
        setShowAdModal("interstitial");
        setLastInterstitialTime(Date.now());
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [lastInterstitialTime]);

  const addMoneyFloat = useCallback((amount: number) => {
    const id = floatIdRef.current++;
    setMoneyFloats((prev) => [...prev, { id, amount }]);
    setTimeout(() => setMoneyFloats((prev) => prev.filter((f) => f.id !== id)), 1200);
  }, []);

  const processAchievements = useCallback((s: GameState): { state: GameState; newUnlocks: AchievementUnlock[] } => {
    return checkNewAchievements(s);
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
      setShowLevelUp(true);
      onLevelUp?.();
      setTimeout(() => setShowLevelUp(false), 2000);
    }
    return newState;
  }, []);

  const checkStageUp = useCallback((s: GameState): GameState => {
    const newStage = getStage(s.totalEarned);
    if (newStage > s.stage) {
      setShowStageUp(true);
      setTimeout(() => setShowStageUp(false), 3000);
      let currencies = [...s.unlockedCurrencies];
      if (newStage >= 3 && !currencies.includes("usd")) currencies.push("usd");
      if (newStage >= 4 && !currencies.includes("eur")) currencies.push("eur");
      if (newStage >= 5 && !currencies.includes("crypto")) currencies.push("crypto");
      const wonGame = newStage === 5 && !s.wonGame;
      return { ...s, stage: newStage as GameState["stage"], unlockedCurrencies: currencies, wonGame: wonGame || s.wonGame };
    }
    return s;
  }, []);

  const applyAchievements = useCallback((s: GameState, onUnlock?: (unlocks: AchievementUnlock[]) => void) => {
    const { state: newS, newUnlocks } = checkNewAchievements(s);
    if (newUnlocks.length > 0) {
      setAchievementQueue((prev) => [...prev, ...newUnlocks]);
      onUnlock?.(newUnlocks);
    }
    return newS;
  }, []);

  const doWork = useCallback((onSound?: (s: "work_click" | "coin_gain" | "level_up") => void) => {
    setState((prev) => {
      if (prev.gameOver) return prev;
      const job = jobs.find((j) => j.id === prev.activeJobId) || jobs[0];
      const farmingBonus = prev.skills.farming * 5;
      const workBootsBonus =
        (prev.permanentBonuses.includes("work_earnings_10") ? 0.1 : 0) +
        (prev.permanentBonuses.includes("work_earnings_20") ? 0.2 : 0);
      const baseEarn = job.earnPerShift + farmingBonus;
      const earn = Math.floor(baseEarn * (1 + workBootsBonus));

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
      s = checkStageUp(s);
      s = checkGameOver(s);
      s = updateDailyTaskProgress(s, "workClicks", 1);
      s = updateDailyTaskProgress(s, "moneyEarned", earn);
      s = applyAchievements(s);

      addMoneyFloat(earn);
      setTimeout(() => onSound?.("coin_gain"), 50);

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
      if (choice.effects.money) s.money += choice.effects.money;
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
      if (choice.effects.experience) s.experience += choice.effects.experience;
      if (choice.effects.skipDays) s.day += choice.effects.skipDays;
      if (choice.effects.marketPriceMultiplier) s.marketPriceMultiplier = choice.effects.marketPriceMultiplier;

      if (choice.riskChance && Math.random() < choice.riskChance && choice.riskEffects) {
        if (choice.riskEffects.money) s.money += choice.riskEffects.money;
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
      if (biz.requiredSkill && prev.skills[biz.requiredSkill] < 1) return prev;
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
      const cost = Math.floor(biz.cost * Math.pow(1.8, owned.level));
      if (prev.money < cost) return prev;
      const newOwned = prev.ownedBusinesses.map((b) => b.id === businessId ? { ...b, level: b.level + 1 } : b);
      const newPassive = calculatePassiveIncome(newOwned, prev.skills.marketing);
      onSound?.();
      return { ...prev, money: prev.money - cost, ownedBusinesses: newOwned, passiveIncome: newPassive, experience: prev.experience + 20 };
    });
  }, []);

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
        ...prev,
        money: prev.money - cost,
        skills: newSkills,
        passiveIncome: newPassive,
        experience: prev.experience + 20,
        sessionSkillUpgrades: prev.sessionSkillUpgrades + 1,
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
      onSound?.();
      return s;
    });
  }, []);

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
    setShowResumeModal(true);
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

  const dismissAchievement = useCallback(() => {
    setAchievementQueue((prev) => prev.slice(1));
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState({ ...initialState });
    setCurrentEvent(null);
    setShowStageUp(false);
    setShowLevelUp(false);
    setOfflineData(null);
    setShowOfflineModal(false);
    setShowResumeModal(false);
  }, []);

  const resumeGame = useCallback(() => {
    setShowResumeModal(false);
  }, []);

  const startNewGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState({ ...initialState });
    setShowResumeModal(false);
    setShowOfflineModal(false);
  }, []);

  const saveNow = useCallback(() => { saveState(state); }, [state]);

  const toggleSound = useCallback(() => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const toggleMusic = useCallback(() => {
    setState((prev) => ({ ...prev, musicEnabled: !prev.musicEnabled }));
  }, []);

  const watchAdForBonus = useCallback((type: "offline_double" | "money_bonus" | "health_restore") => {
    if (type === "offline_double" && offlineData) {
      collectOfflineEarnings(true);
      return;
    }
    if (type === "money_bonus") {
      setState((prev) => {
        let s = { ...prev, money: prev.money + 1000, totalEarned: prev.totalEarned + 1000 };
        s = checkStageUp(s);
        return s;
      });
      addMoneyFloat(1000);
    }
    if (type === "health_restore") {
      setState((prev) => ({ ...prev, health: 100 }));
    }
    setShowAdModal(null);
  }, [offlineData, collectOfflineEarnings, checkStageUp, addMoneyFloat]);

  const dismissAd = useCallback(() => { setShowAdModal(null); }, []);
  const showRewardedAd = useCallback(() => { setShowAdModal("rewarded"); }, []);

  return {
    state,
    currentEvent,
    showStageUp,
    showLevelUp,
    moneyFloats,
    achievementQueue,
    offlineData,
    showOfflineModal,
    showDailyReward,
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
    dismissAchievement,
    resetGame,
    resumeGame,
    startNewGame,
    saveNow,
    toggleSound,
    toggleMusic,
    watchAdForBonus,
    dismissAd,
    showRewardedAd,
    setCurrentEvent,
    getLevelXpNeeded,
    processAchievements,
  };
}

export { getStage, getLevelXpNeeded as getXpNeeded };

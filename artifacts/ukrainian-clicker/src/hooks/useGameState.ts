import { useState, useEffect, useCallback, useRef } from "react";
import { jobs } from "@/data/jobs";
import { businesses, type Business } from "@/data/businesses";
import { events, type GameEvent } from "@/data/events";
import { skills as skillDefs } from "@/data/skills";

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
};

const SAVE_KEY = "ukrainian_clicker_save";

function loadState(): GameState | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
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

function getLevelXpNeeded(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

function calculatePassiveIncome(ownedBusinesses: { id: string; level: number }[], marketingLevel: number): number {
  let total = 0;
  for (const ob of ownedBusinesses) {
    const biz = businesses.find((b) => b.id === ob.id);
    if (biz) {
      total += biz.passiveIncome * Math.pow(2, ob.level - 1);
    }
  }
  const marketingBonus = 1 + marketingLevel * 0.1;
  return total * marketingBonus;
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadState();
    return saved || { ...initialState };
  });

  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showStageUp, setShowStageUp] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [moneyFloats, setMoneyFloats] = useState<{ id: number; amount: number }[]>([]);
  const floatIdRef = useRef(0);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setHasSavedGame(true);
      setShowResumeModal(true);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      saveState(state);
    }, 30000);
    return () => clearInterval(interval);
  }, [state]);

  const addMoneyFloat = useCallback((amount: number) => {
    const id = floatIdRef.current++;
    setMoneyFloats((prev) => [...prev, { id, amount }]);
    setTimeout(() => {
      setMoneyFloats((prev) => prev.filter((f) => f.id !== id));
    }, 1200);
  }, []);

  const checkGameOver = useCallback((s: GameState): GameState => {
    if (s.health <= 0) {
      return { ...s, health: 0, gameOver: true, gameOverReason: "Ви впали від виснаження! Здоров'я на нулі." };
    }
    if (s.reputation <= 0) {
      return { ...s, reputation: 0, gameOver: true, gameOverReason: "Всі втратили довіру до вас! Репутація на нулі." };
    }
    return s;
  }, []);

  const checkLevelUp = useCallback((s: GameState): GameState => {
    let newState = { ...s };
    while (newState.experience >= getLevelXpNeeded(newState.level) && newState.level < 100) {
      newState.experience -= getLevelXpNeeded(newState.level);
      newState.level += 1;
      setShowLevelUp(true);
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

  const doWork = useCallback(() => {
    setState((prev) => {
      if (prev.gameOver) return prev;
      const job = jobs.find((j) => j.id === prev.activeJobId) || jobs[0];
      const farmingBonus = prev.skills.farming * 5;
      const workBootsBonus = prev.permanentBonuses.includes("work_earnings_10") ? 0.1 : 0;
      const baseEarn = job.earnPerShift + farmingBonus;
      const earn = Math.floor(baseEarn * (1 + workBootsBonus));

      let newState: GameState = {
        ...prev,
        money: prev.money + earn,
        health: Math.max(0, prev.health - job.healthCost),
        workClicks: prev.workClicks + 1,
        totalEarned: prev.totalEarned + earn,
        experience: prev.experience + 5,
        eventCount: prev.eventCount + 1,
      };

      newState = checkLevelUp(newState);
      newState = checkStageUp(newState);
      newState = checkGameOver(newState);

      addMoneyFloat(earn);

      if (Math.random() < 0.25 && !newState.gameOver) {
        const availableEvents = events.filter((e) => {
          if (e.minStage && newState.stage < e.minStage) return false;
          if (e.maxStage && newState.stage > e.maxStage) return false;
          return true;
        });
        if (availableEvents.length > 0) {
          const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
          setTimeout(() => setCurrentEvent(randomEvent), 300);
        }
      }

      return newState;
    });
  }, [addMoneyFloat, checkGameOver, checkLevelUp, checkStageUp]);

  const handleEventChoice = useCallback(
    (choiceIndex: number) => {
      if (!currentEvent) return;
      const choice = currentEvent.choices[choiceIndex];

      setState((prev) => {
        let newState = { ...prev };

        if (choice.effects.money) newState.money += choice.effects.money;
        if (choice.effects.health) newState.health = Math.min(100, Math.max(0, newState.health + choice.effects.health));
        if (choice.effects.reputation) {
          const networkingBonus = 1 + newState.skills.networking * 0.05;
          const suitBonus = newState.permanentBonuses.includes("reputation_gain_15") ? 1.15 : 1;
          const repChange = choice.effects.reputation > 0
            ? Math.floor(choice.effects.reputation * networkingBonus * suitBonus)
            : choice.effects.reputation;
          newState.reputation = Math.min(100, Math.max(0, newState.reputation + repChange));
        }
        if (choice.effects.corruption) newState.corruption = Math.min(100, Math.max(0, newState.corruption + choice.effects.corruption));
        if (choice.effects.experience) newState.experience += choice.effects.experience;
        if (choice.effects.skipDays) newState.day += choice.effects.skipDays;
        if (choice.effects.marketPriceMultiplier) newState.marketPriceMultiplier = choice.effects.marketPriceMultiplier;

        if (choice.riskChance && Math.random() < choice.riskChance && choice.riskEffects) {
          if (choice.riskEffects.money) newState.money += choice.riskEffects.money;
          if (choice.riskEffects.health) newState.health = Math.min(100, Math.max(0, newState.health + choice.riskEffects.health));
          if (choice.riskEffects.reputation) newState.reputation = Math.min(100, Math.max(0, newState.reputation + choice.riskEffects.reputation));
          if (choice.riskEffects.corruption) newState.corruption = Math.min(100, Math.max(0, newState.corruption + choice.riskEffects.corruption));
        }

        if (choice.effects.money && choice.effects.money > 0) {
          newState.totalEarned += choice.effects.money;
        }

        newState = checkLevelUp(newState);
        newState = checkStageUp(newState);
        newState = checkGameOver(newState);

        return newState;
      });

      setCurrentEvent(null);
    },
    [currentEvent, checkGameOver, checkLevelUp, checkStageUp]
  );

  const setActiveJob = useCallback((jobId: string) => {
    setState((prev) => ({ ...prev, activeJobId: jobId }));
  }, []);

  const buyBusiness = useCallback((businessId: string) => {
    setState((prev) => {
      const biz = businesses.find((b) => b.id === businessId);
      if (!biz || prev.money < biz.cost || prev.level < biz.levelReq) return prev;
      if (prev.ownedBusinesses.some((b) => b.id === businessId)) return prev;
      if (biz.requiredSkill && prev.skills[biz.requiredSkill] < 1) return prev;

      const newOwned = [...prev.ownedBusinesses, { id: businessId, level: 1 }];
      const newPassive = calculatePassiveIncome(newOwned, prev.skills.marketing);

      return {
        ...prev,
        money: prev.money - biz.cost,
        ownedBusinesses: newOwned,
        passiveIncome: newPassive,
        experience: prev.experience + 50,
      };
    });
  }, []);

  const upgradeBusiness = useCallback((businessId: string) => {
    setState((prev) => {
      const biz = businesses.find((b) => b.id === businessId);
      const owned = prev.ownedBusinesses.find((b) => b.id === businessId);
      if (!biz || !owned) return prev;
      const upgradeCost = biz.cost * 3 * owned.level;
      if (prev.money < upgradeCost) return prev;

      const newOwned = prev.ownedBusinesses.map((b) =>
        b.id === businessId ? { ...b, level: b.level + 1 } : b
      );
      const newPassive = calculatePassiveIncome(newOwned, prev.skills.marketing);

      return {
        ...prev,
        money: prev.money - upgradeCost,
        ownedBusinesses: newOwned,
        passiveIncome: newPassive,
        experience: prev.experience + 20,
      };
    });
  }, []);

  const upgradeSkill = useCallback((skillId: string) => {
    setState((prev) => {
      const skillDef = skillDefs.find((s) => s.id === skillId);
      if (!skillDef) return prev;
      const currentLevel = prev.skills[skillId] || 0;
      if (currentLevel >= skillDef.maxLevel) return prev;
      const cost = Math.floor(skillDef.baseCost * Math.pow(1.5, currentLevel));
      if (prev.money < cost) return prev;

      const newSkills = { ...prev.skills, [skillId]: currentLevel + 1 };
      const newPassive = calculatePassiveIncome(prev.ownedBusinesses, newSkills.marketing);

      return {
        ...prev,
        money: prev.money - cost,
        skills: newSkills,
        passiveIncome: newPassive,
        experience: prev.experience + 20,
      };
    });
  }, []);

  const buyMarketItem = useCallback((itemId: string, basePrice: number, effect: { health?: number; reputation?: number; permanent?: string }) => {
    setState((prev) => {
      const hagglingDiscount = 1 - prev.skills.haggling * 0.1;
      const price = Math.floor(basePrice * prev.marketPriceMultiplier * hagglingDiscount);
      if (prev.money < price) return prev;

      let newState = { ...prev, money: prev.money - price };

      if (effect.health) {
        newState.health = Math.min(100, newState.health + effect.health);
      }
      if (effect.reputation) {
        newState.reputation = Math.min(100, Math.max(0, newState.reputation + effect.reputation));
      }
      if (effect.permanent && !prev.permanentBonuses.includes(effect.permanent)) {
        newState.permanentBonuses = [...prev.permanentBonuses, effect.permanent];
      }

      return newState;
    });
  }, []);

  const addPassiveIncome = useCallback(() => {
    setState((prev) => {
      if (prev.passiveIncome <= 0 || prev.gameOver) return prev;
      const income = prev.passiveIncome;
      addMoneyFloat(income);
      let newState = {
        ...prev,
        money: prev.money + income,
        totalEarned: prev.totalEarned + income,
        day: prev.day + 1,
      };
      newState = checkStageUp(newState);
      return newState;
    });
  }, [addMoneyFloat, checkStageUp]);

  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState({ ...initialState });
    setCurrentEvent(null);
    setShowStageUp(false);
    setShowLevelUp(false);
  }, []);

  const resumeGame = useCallback(() => {
    setShowResumeModal(false);
  }, []);

  const startNewGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState({ ...initialState });
    setShowResumeModal(false);
  }, []);

  const saveNow = useCallback(() => {
    saveState(state);
  }, [state]);

  return {
    state,
    currentEvent,
    showStageUp,
    showLevelUp,
    moneyFloats,
    hasSavedGame,
    showResumeModal,
    doWork,
    handleEventChoice,
    setActiveJob,
    buyBusiness,
    upgradeBusiness,
    upgradeSkill,
    buyMarketItem,
    addPassiveIncome,
    resetGame,
    resumeGame,
    startNewGame,
    saveNow,
    setCurrentEvent,
    getLevelXpNeeded,
  };
}

export { getStage, getLevelXpNeeded };

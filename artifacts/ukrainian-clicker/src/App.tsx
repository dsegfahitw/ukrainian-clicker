import { useState, useCallback, useRef } from "react";
import { useGameState } from "@/hooks/useGameState";
import { usePassiveIncome } from "@/hooks/usePassiveIncome";
import { useSound } from "@/hooks/useSound";
import { ResourceBar } from "@/components/ResourceBar";
import { CorruptionScale } from "@/components/CorruptionScale";
import { BottomNav } from "@/components/BottomNav";
import { EventPopup } from "@/components/EventPopup";
import { GameOverModal } from "@/components/GameOverModal";
import { SaveLoadModal } from "@/components/SaveLoadModal";
import { StageUpModal } from "@/components/StageUpModal";
import { PassiveIncomeTicket } from "@/components/PassiveIncomeTicket";
import { OfflineModal } from "@/components/OfflineModal";
import { DailyRewardModal } from "@/components/DailyRewardModal";
import { AchievementPopup } from "@/components/AchievementPopup";
import { AdModal } from "@/components/AdModal";
import { LifeTab } from "@/pages/LifeTab";
import { WorkTab } from "@/pages/WorkTab";
import { BusinessTab } from "@/pages/BusinessTab";
import { SkillsTab } from "@/pages/SkillsTab";
import { MarketTab } from "@/pages/MarketTab";
import { SettingsTab } from "@/pages/SettingsTab";
import { getDailyTasksForDate } from "@/data/dailyTasks";

function App() {
  const [activeTab, setActiveTab] = useState("life");
  const game = useGameState();
  const { play } = useSound(game.state.soundEnabled);

  usePassiveIncome(game.state.passiveIncome, game.addPassiveIncome, game.state.gameOver);

  const handleTabChange = useCallback(
    (tab: string) => {
      game.saveNow();
      setActiveTab(tab);
    },
    [game.saveNow]
  );

  const handleWork = useCallback(() => {
    game.doWork((sound) => play(sound));
  }, [game.doWork, play]);

  const handleBuyBusiness = useCallback((id: string) => {
    game.buyBusiness(id, () => play("purchase"));
  }, [game.buyBusiness, play]);

  const handleUpgradeBusiness = useCallback((id: string) => {
    game.upgradeBusiness(id, () => play("purchase"));
  }, [game.upgradeBusiness, play]);

  const handleUpgradeSkill = useCallback((skillId: string) => {
    game.upgradeSkill(skillId, () => play("purchase"));
  }, [game.upgradeSkill, play]);

  const handleBuyMarketItem = useCallback((itemId: string, price: number, effect: { health?: number; reputation?: number; permanent?: string }) => {
    game.buyMarketItem(itemId, price, effect, () => play("purchase"));
  }, [game.buyMarketItem, play]);

  const handleEventPopup = useCallback((idx: number) => {
    game.handleEventChoice(idx);
  }, [game.handleEventChoice]);

  const handleClaimTask = useCallback((taskId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const tasks = getDailyTasksForDate(today);
    const task = tasks.find((t) => t.id === taskId);
    if (task) game.claimDailyTask(taskId, task);
  }, [game.claimDailyTask]);

  const unclaimedTasks = game.state.dailyTaskProgress.filter((p) => p.completed && !p.claimedReward).length;

  return (
    <div className="min-h-screen bg-background max-w-[430px] mx-auto relative overflow-hidden">
      <div className="bg-card border-b-2 border-foreground p-2 grid grid-cols-2 gap-x-3 gap-y-1 sticky top-0 z-30">
        <ResourceBar
          icon="💰"
          value={game.state.money}
          maxValue={1000000}
          color="#ffd700"
          label="Гроші"
          showExact
        />
        <ResourceBar
          icon="❤️"
          value={game.state.health}
          maxValue={100}
          color="#ff4444"
          label="Здоров'я"
        />
        <ResourceBar
          icon="⭐"
          value={game.state.reputation}
          maxValue={100}
          color="#ffaa00"
          label="Репутація"
        />
        <CorruptionScale value={game.state.corruption} />
      </div>

      <div className="pb-16">
        {activeTab === "life" && (
          <LifeTab
            state={game.state}
            onWork={handleWork}
            getLevelXpNeeded={game.getLevelXpNeeded}
          />
        )}
        {activeTab === "work" && (
          <WorkTab state={game.state} onSelectJob={game.setActiveJob} />
        )}
        {activeTab === "business" && (
          <BusinessTab
            state={game.state}
            onBuy={handleBuyBusiness}
            onUpgrade={handleUpgradeBusiness}
          />
        )}
        {activeTab === "skills" && (
          <SkillsTab state={game.state} onUpgrade={handleUpgradeSkill} />
        )}
        {activeTab === "market" && (
          <MarketTab state={game.state} onBuy={handleBuyMarketItem} />
        )}
        {activeTab === "settings" && (
          <SettingsTab
            state={game.state}
            onNewGame={game.startNewGame}
            onToggleSound={game.toggleSound}
            onToggleMusic={game.toggleMusic}
            onClaimTask={handleClaimTask}
            onShowAds={() => game.showRewardedAd()}
          />
        )}
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unclaimedTasks={unclaimedTasks}
      />

      <PassiveIncomeTicket floats={game.moneyFloats} />

      <EventPopup
        isOpen={!!game.currentEvent}
        event={game.currentEvent}
        onChoice={handleEventPopup}
      />

      <AchievementPopup
        achievement={game.achievementQueue[0] ?? null}
        onDismiss={game.dismissAchievement}
      />

      <OfflineModal
        isOpen={game.showOfflineModal}
        data={game.offlineData}
        onCollect={() => game.collectOfflineEarnings(false)}
        onWatchAd={() => game.collectOfflineEarnings(true)}
      />

      <DailyRewardModal
        isOpen={!!game.showDailyReward}
        reward={game.showDailyReward}
        streak={game.state.dailyLoginStreak}
        onClaim={game.claimDailyReward}
      />

      <AdModal
        type={game.showAdModal}
        onWatchAd={game.watchAdForBonus}
        onDismiss={game.dismissAd}
      />

      <GameOverModal
        isOpen={game.state.gameOver}
        reason={game.state.gameOverReason}
        stats={{
          totalEarned: game.state.totalEarned,
          level: game.state.level,
          day: game.state.day,
          workClicks: game.state.workClicks,
          stage: game.state.stage,
        }}
        onRestart={game.resetGame}
      />

      <SaveLoadModal
        isOpen={game.showResumeModal}
        onResume={game.resumeGame}
        onNewGame={game.startNewGame}
      />

      <StageUpModal isOpen={game.showStageUp} stage={game.state.stage} />
    </div>
  );
}

export default App;

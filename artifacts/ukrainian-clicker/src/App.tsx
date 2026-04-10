import { useState, useCallback, useMemo } from "react";
import { useGameState } from "@/hooks/useGameState";
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
import { LevelUpFlash } from "@/components/LevelUpFlash";
import { HealthWarning } from "@/components/HealthWarning";
import { NewDayBanner } from "@/components/NewDayBanner";
import { BossEncounterModal } from "@/components/BossEncounterModal";
import { LifeTab } from "@/pages/LifeTab";
import { WorkTab } from "@/pages/WorkTab";
import { BusinessTab } from "@/pages/BusinessTab";
import { SkillsTab } from "@/pages/SkillsTab";
import { ShopTab } from "@/pages/ShopTab";
import { PremiumTab } from "@/pages/PremiumTab";
import { SettingsTab } from "@/pages/SettingsTab";
import { getDailyTasksForDate } from "@/data/dailyTasks";
import { bosses } from "@/data/bosses";

function App() {
  const [activeTab, setActiveTab] = useState("life");
  const game = useGameState();
  const { play } = useSound(game.state.soundEnabled);

  const handleTabChange = useCallback((tab: string) => {
    game.saveNow();
    setActiveTab(tab);
  }, [game.saveNow]);

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
  const handleChoice = useCallback((choiceIndex: number) => {
    game.handleEventChoice(choiceIndex);
  }, [game.handleEventChoice]);

  const handleBuyMarketItem = useCallback((itemId: string, price: number, effect: { health?: number; reputation?: number; permanent?: string }) => {
    game.buyMarketItem(itemId, price, effect, () => play("purchase"));
  }, [game.buyMarketItem, play]);

  const handleBuySkin = useCallback((skinId: string, price: number) => {
    game.buySkin(skinId, price);
    play("purchase");
  }, [game.buySkin, play]);

  const handleClaimTask = useCallback((taskId: string) => {
    const tasks = getDailyTasksForDate(game.state.dailyTasksDate || `day-${game.state.day}`);
    const task = tasks.find((t) => t.id === taskId);
    if (task) game.claimDailyTask(taskId, task);
  }, [game.claimDailyTask, game.state.dailyTasksDate, game.state.day]);

  const unclaimedTasks = game.state.dailyTaskProgress.filter(
    (p) => p.completed && !p.claimedReward
  ).length;

  const bossesAvailable = useMemo(() => {
    return bosses.filter((b) => !game.state.defeatedBosses.includes(b.id)).length;
  }, [game.state.defeatedBosses]);

  const headerClass = game.state.vipActive
    ? "bg-gradient-to-r from-amber-100 to-yellow-50 border-amber-700"
    : "bg-card border-foreground";

  return (
    <div className={`min-h-screen bg-background max-w-[430px] mx-auto relative overflow-hidden ${game.state.vipActive ? "vip-theme" : ""}`}>
      {/* Sticky Resource Header */}
      <div className={`${headerClass} border-b-2 p-2 grid grid-cols-2 gap-x-3 gap-y-1 sticky top-0 z-30`}>
        <ResourceBar icon="💰" value={game.state.money} maxValue={1_000_000} color="#ffd700" label="Гроші" showExact />
        <ResourceBar icon="❤️" value={game.state.health} maxValue={100} color="#ff4444" label="Здоров'я" />
        <ResourceBar icon="⭐" value={game.state.reputation} maxValue={100} color="#ffaa00" label="Репутація" />
        <CorruptionScale value={game.state.corruption} />
        <div className="col-span-2 flex items-center justify-center gap-2 text-xs font-heading uppercase tracking-widest pt-1">
          <span className={game.showNewDay ? "animate-float" : ""}>🌅</span>
          День {game.state.day}
          <span className="text-foreground/60">•</span>
          <span>{game.state.vipActive ? "VIP" : "Standard"}</span>
        </div>
      </div>

      {/* Health warning banner */}
      <HealthWarning health={game.state.health} />

      {/* Tab Content */}
      <div className="pb-16">
        {activeTab === "life" && (
          <LifeTab state={game.state} onWork={handleWork} onRest={game.takeRest} onInvest={() => handleTabChange("business")} />
        )}
        {activeTab === "work" && (
          <WorkTab state={game.state} onSelectJob={game.setActiveJob} />
        )}
        {activeTab === "business" && (
          <BusinessTab
            state={game.state}
            onBuy={handleBuyBusiness}
            onUpgrade={handleUpgradeBusiness}
            onChallengeBoss={game.challengeBoss}
          />
        )}
        {activeTab === "skills" && (
          <SkillsTab state={game.state} onUpgrade={handleUpgradeSkill} />
        )}
        {activeTab === "shop" && (
          <ShopTab
            state={game.state}
            onBuyMarket={handleBuyMarketItem}
            onBuySkin={handleBuySkin}
            onSelectSkin={game.selectSkin}
          />
        )}
        {activeTab === "premium" && (
          <PremiumTab state={game.state} onActivateVip={game.activateVipMembership} onRemoveAds={game.purchaseRemoveAds} />
        )}
        {activeTab === "settings" && (
          <SettingsTab
            state={game.state}
            onNewGame={game.startNewGame}
            onToggleSound={game.toggleSound}
            onToggleMusic={game.toggleMusic}
            onClaimTask={handleClaimTask}
            onShowAds={game.showRewardedAd}
          />
        )}
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unclaimedTasks={unclaimedTasks}
        bossesAvailable={bossesAvailable}
      />

      {/* Floating coin animations */}
      <PassiveIncomeTicket floats={game.moneyFloats} />

      {/* Level up celebration */}
      <LevelUpFlash level={game.state.level} />

      {/* New day sunrise banner */}
      <NewDayBanner show={game.showNewDay} day={game.state.day} />

      {/* Modals — ordered by priority */}
      <EventPopup isOpen={!!game.currentEvent} event={game.currentEvent} onChoice={handleChoice} />

      <AchievementPopup achievement={game.achievementQueue[0] ?? null} onDismiss={game.dismissAchievement} />

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

      <AdModal type={game.showAdModal} onWatchAd={game.watchAdForBonus} onDismiss={game.dismissAd} />
      <BossEncounterModal encounter={game.activeBossEncounter} onResolve={game.resolveBossEncounter} />

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

      <SaveLoadModal isOpen={game.showResumeModal} onResume={game.resumeGame} onNewGame={game.startNewGame} />

      <StageUpModal isOpen={game.showStageUp} stage={game.state.stage} />
    </div>
  );
}

export default App;

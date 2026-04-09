import { useState, useCallback } from "react";
import { useGameState } from "@/hooks/useGameState";
import { usePassiveIncome } from "@/hooks/usePassiveIncome";
import { ResourceBar } from "@/components/ResourceBar";
import { CorruptionScale } from "@/components/CorruptionScale";
import { BottomNav } from "@/components/BottomNav";
import { EventPopup } from "@/components/EventPopup";
import { GameOverModal } from "@/components/GameOverModal";
import { SaveLoadModal } from "@/components/SaveLoadModal";
import { StageUpModal } from "@/components/StageUpModal";
import { PassiveIncomeTicket } from "@/components/PassiveIncomeTicket";
import { LifeTab } from "@/pages/LifeTab";
import { WorkTab } from "@/pages/WorkTab";
import { BusinessTab } from "@/pages/BusinessTab";
import { SkillsTab } from "@/pages/SkillsTab";
import { MarketTab } from "@/pages/MarketTab";

function App() {
  const [activeTab, setActiveTab] = useState("life");
  const game = useGameState();

  usePassiveIncome(game.state.passiveIncome, game.addPassiveIncome, game.state.gameOver);

  const handleTabChange = useCallback(
    (tab: string) => {
      game.saveNow();
      setActiveTab(tab);
    },
    [game.saveNow]
  );

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
            onWork={game.doWork}
            getLevelXpNeeded={game.getLevelXpNeeded}
          />
        )}
        {activeTab === "work" && (
          <WorkTab state={game.state} onSelectJob={game.setActiveJob} />
        )}
        {activeTab === "business" && (
          <BusinessTab
            state={game.state}
            onBuy={game.buyBusiness}
            onUpgrade={game.upgradeBusiness}
          />
        )}
        {activeTab === "skills" && (
          <SkillsTab state={game.state} onUpgrade={game.upgradeSkill} />
        )}
        {activeTab === "market" && (
          <MarketTab state={game.state} onBuy={game.buyMarketItem} />
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      <PassiveIncomeTicket floats={game.moneyFloats} />

      <EventPopup
        isOpen={!!game.currentEvent}
        event={game.currentEvent}
        onChoice={game.handleEventChoice}
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

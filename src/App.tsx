import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TopBar } from './components/TopBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ReactionResultModal } from './components/ReactionResultModal';
import { MainMenuScreen } from './components/screens/MainMenuScreen';
import { LabScreen } from './components/screens/LabScreen';
import { CatalogScreen } from './components/screens/CatalogScreen';
import { MissionsScreen } from './components/screens/MissionsScreen';
import { PeriodicScreen } from './components/screens/PeriodicScreen';
import { ProgressScreen } from './components/screens/ProgressScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { RecipeBookScreen } from './components/screens/RecipeBookScreen';

const GameShell: React.FC = () => {
  const { currentScreen, isMobileFrame, setIsMobileFrame } = useGame();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <MainMenuScreen />;
      case 'lab':
        return <LabScreen />;
      case 'recipes':
        return <RecipeBookScreen />;
      case 'catalog':
        return <CatalogScreen />;
      case 'missions':
        return <MissionsScreen />;
      case 'periodic':
        return <PeriodicScreen />;
      case 'progress':
        return <ProgressScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <MainMenuScreen />;
    }
  };

  const content = (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Top Bar with 3-Zone contract */}
      <TopBar />

      {/* Main Playfield Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-20 md:pb-8">
        {renderActiveScreen()}
      </main>

      {/* Mobile Thumb Navigation (Phones only) */}
      <MobileBottomNav />

      {/* Modal for Reaction Discoveries and Chemistry Feedback */}
      <ReactionResultModal />

      {/* Footer note */}
      <footer className="border-t border-slate-800/60 py-4 px-6 text-center text-xs text-slate-500">
        <span>Alquimia Imposible</span> · <span>Laboratorio Químico Experimental de 10.º Grado</span> · <span>React & Web Audio Engine</span>
      </footer>
    </div>
  );

  // If Mobile Simulation Frame is active (useful for testing phone experience)
  if (isMobileFrame) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-[40px] border-4 border-slate-700 bg-[#070a12] shadow-2xl overflow-hidden flex flex-col relative aspect-[9/19.5]">
          {/* Simulated phone notch / speaker */}
          <div className="h-6 bg-black flex items-center justify-center shrink-0">
            <div className="w-20 h-3 bg-slate-800 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto">
            {content}
          </div>

          {/* Close simulator frame floating bar */}
          <button
            onClick={() => setIsMobileFrame(false)}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800/90 text-[10px] text-slate-300 rounded-full border border-slate-700 shadow-md hover:bg-slate-700 transition"
          >
            Salir de marco móvil
          </button>
        </div>
      </div>
    );
  }

  return content;
};

export default function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}

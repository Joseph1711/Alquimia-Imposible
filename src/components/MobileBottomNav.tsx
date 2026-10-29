import React from 'react';
import {
  FlaskConical,
  BookOpen,
  BookMarked,
  Target,
  Atom,
  Award,
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const MobileBottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useGame();

  const navItems = [
    { id: 'lab', label: 'Lab', icon: FlaskConical },
    { id: 'recipes', label: 'Recetario', icon: BookMarked },
    { id: 'catalog', label: 'Catálogo', icon: BookOpen },
    { id: 'periodic', label: 'Tabla 118', icon: Atom },
    { id: 'missions', label: 'Misiones', icon: Target },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060911]/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around safe-area-inset-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            className={`flex-1 py-1 px-2 flex flex-col items-center justify-center min-h-[44px] rounded-xl transition-all ${
              isActive
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
            <span className="text-[10px] mt-0.5 tracking-tight truncate">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

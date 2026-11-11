import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { SUBSTANCES, Substance } from '../data/chemistryData';
import { ELEMENTS_118, ChemicalElement } from '../data/elements118';
import {
  ADVANCED_REACTIONS,
  AdvancedReaction,
  ExperimentalConditions,
  TemperatureLevel,
  PressureLevel,
  CatalystType,
  ElectricalState,
  ConcentrationLevel,
  evaluateAdvancedReaction,
} from '../data/reactionsEngine';
import {
  MISSIONS,
  Achievement,
  INITIAL_ACHIEVEMENTS,
} from '../data/missionsData';
import { sound } from '../utils/audio';

export type VesselType =
  | 'erlenmeyer'
  | 'beaker'
  | 'testtube'
  | 'crucible'
  | 'distillation'
  | 'mortar'
  | 'watchglass';

export type AnalyticalToolType = 'none' | 'ph' | 'thermometer' | 'balance' | 'stirrer';

interface ReactionModalData {
  success: boolean;
  reaction?: AdvancedReaction;
  reason?: string;
  chemicalTip?: string;
  isNewDiscovery?: boolean;
}

interface GameContextType {
  // Navigation & View
  currentScreen: 'menu' | 'lab' | 'catalog' | 'missions' | 'progress' | 'settings' | 'periodic' | 'recipes' | 'bondlab';
  setCurrentScreen: (screen: 'menu' | 'lab' | 'catalog' | 'missions' | 'progress' | 'settings' | 'periodic' | 'recipes' | 'bondlab') => void;
  isMobileDevice: boolean;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;

  // Player Progress
  xp: number;
  level: number;
  alchemistRank: string;
  xpToNextLevel: number;
  xpCurrentLevelProgress: number;
  unlockedSubstanceIds: string[];
  analyzedElementSymbols: string[];
  analyzeElement: (symbol: string) => void;
  addXp: (amount: number) => void;
  completedMissionIds: string[];
  achievements: Achievement[];
  activeMissionId: string | null;
  setActiveMissionId: (id: string | null) => void;

  // Lab Workbench State
  selectedReactants: string[];
  conditions: ExperimentalConditions;
  setTemperature: (t: TemperatureLevel) => void;
  setPressure: (p: PressureLevel) => void;
  setCatalyst: (c: CatalystType) => void;
  setElectricity: (e: ElectricalState) => void;
  setConcentration: (c: ConcentrationLevel) => void;
  selectedVessel: VesselType;
  setSelectedVessel: (v: VesselType) => void;
  activeAnalyticalTool: AnalyticalToolType;
  setActiveAnalyticalTool: (tool: AnalyticalToolType) => void;
  isMagneticStirrerActive: boolean;
  setIsMagneticStirrerActive: (active: boolean) => void;
  stirrerRpm: number;
  setStirrerRpm: (rpm: number) => void;
  isFumeHoodActive: boolean;
  setIsFumeHoodActive: (active: boolean) => void;
  isVesselSealed: boolean;
  setIsVesselSealed: (sealed: boolean) => void;
  addReactant: (id: string) => void;
  removeReactant: (id: string) => void;
  clearVessel: () => void;
  loadRecipe: (
    reactantIds: string[],
    conditions?: Partial<ExperimentalConditions>,
    vessel?: VesselType
  ) => void;

  // Experiment Execution
  isExperimentRunning: boolean;
  isExploding: boolean;
  executeExperiment: () => void;
  reactionModalData: ReactionModalData | null;
  closeReactionModal: () => void;

  // Stats
  experimentCount: number;
  successfulReactionsCount: number;

  // Audio & Settings
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
  resetProgress: () => void;

  // Fast Navigation
  jumpToLabWithMission: (missionId: string) => void;

  // Interactive Tutorial
  isTutorialOpen: boolean;
  setIsTutorialOpen: (val: boolean) => void;
  openTutorial: () => void;
  closeTutorial: () => void;

  // Nuclear Experiment Simulation & Workspace Devastation
  isLabDevastated: boolean;
  isNuclearWarningOpen: boolean;
  setIsNuclearWarningOpen: (val: boolean) => void;
  isNuclearCinematicRunning: boolean;
  nuclearCinematicPhase: 'idle' | 'charging' | 'flash' | 'fireball' | 'shockwave' | 'devastated';
  isReconstructing: boolean;
  triggerNuclearExperiment: () => void;
  loadAndDetonateNuclearReaction: () => void;
  skipNuclearCinematic: () => void;
  repairLaboratory: () => void;
}

const STORAGE_KEY = 'alquimia_imposible_save_v3';

const ALCHEMIST_RANKS = [
  'Iniciado en el Crisol',
  'Aprendiz de Enlaces',
  'Investigador Molecular',
  'Maestro de Reacciones',
  'Gran Alquimista Cuántico',
];

const LEVEL_THRESHOLDS = [0, 250, 650, 1250, 2100];

const INITIAL_STARTER_ELEMENTS = ['H', 'O', 'Na', 'Cl', 'Fe', 'C', 'S', 'N', 'Cu', 'Ca'];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'lab' | 'catalog' | 'missions' | 'progress' | 'settings' | 'periodic' | 'recipes' | 'bondlab'>('menu');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Initial unlocked substances
  const defaultUnlocked = Object.values(SUBSTANCES)
    .filter((s) => s.isUnlockedByDefault)
    .map((s) => s.id);

  const [unlockedSubstanceIds, setUnlockedSubstanceIds] = useState<string[]>(defaultUnlocked);
  const [analyzedElementSymbols, setAnalyzedElementSymbols] = useState<string[]>(INITIAL_STARTER_ELEMENTS);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [xp, setXp] = useState<number>(0);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);

  // Workbench State
  const [selectedReactants, setSelectedReactants] = useState<string[]>([]);
  const [conditions, setConditions] = useState<ExperimentalConditions>({
    temperature: 'ambient',
    pressure: 'standard',
    catalyst: 'none',
    electricity: 'none',
    concentration: 'normal',
  });
  const [selectedVessel, setSelectedVessel] = useState<VesselType>('erlenmeyer');
  const [activeAnalyticalTool, setActiveAnalyticalTool] = useState<AnalyticalToolType>('none');
  const [isMagneticStirrerActive, setIsMagneticStirrerActive] = useState<boolean>(false);
  const [stirrerRpm, setStirrerRpm] = useState<number>(400);
  const [isFumeHoodActive, setIsFumeHoodActive] = useState<boolean>(false);
  const [isVesselSealed, setIsVesselSealed] = useState<boolean>(false);
  const [isExperimentRunning, setIsExperimentRunning] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [reactionModalData, setReactionModalData] = useState<ReactionModalData | null>(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Nuclear Experiment Simulation & Devastation State
  const [isLabDevastated, setIsLabDevastated] = useState(false);
  const [isNuclearWarningOpen, setIsNuclearWarningOpen] = useState(false);
  const [isNuclearCinematicRunning, setIsNuclearCinematicRunning] = useState(false);
  const [nuclearCinematicPhase, setNuclearCinematicPhase] = useState<'idle' | 'charging' | 'flash' | 'fireball' | 'shockwave' | 'devastated'>('idle');
  const [isReconstructing, setIsReconstructing] = useState(false);

  // Stats
  const [experimentCount, setExperimentCount] = useState(0);
  const [successfulReactionsCount, setSuccessfulReactionsCount] = useState(0);
  const [explosionsCount, setExplosionsCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Detect mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
    }
  }, []);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.unlockedSubstanceIds) setUnlockedSubstanceIds(parsed.unlockedSubstanceIds);
        if (parsed.analyzedElementSymbols) setAnalyzedElementSymbols(parsed.analyzedElementSymbols);
        if (parsed.completedMissionIds) setCompletedMissionIds(parsed.completedMissionIds);
        if (parsed.achievements) setAchievements(parsed.achievements);
        if (typeof parsed.xp === 'number') setXp(parsed.xp);
        if (typeof parsed.experimentCount === 'number') setExperimentCount(parsed.experimentCount);
        if (typeof parsed.successfulReactionsCount === 'number') setSuccessfulReactionsCount(parsed.successfulReactionsCount);
        if (typeof parsed.isLabDevastated === 'boolean') setIsLabDevastated(parsed.isLabDevastated);
        if (typeof parsed.audioEnabled === 'boolean') {
          setAudioEnabled(parsed.audioEnabled);
          sound.setEnabled(parsed.audioEnabled);
        }
      }
    } catch {
      // Storage parsing ignore
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    try {
      const toSave = {
        unlockedSubstanceIds,
        analyzedElementSymbols,
        completedMissionIds,
        achievements,
        xp,
        experimentCount,
        successfulReactionsCount,
        audioEnabled,
        isLabDevastated,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Storage unavailable
    }
  }, [
    unlockedSubstanceIds,
    analyzedElementSymbols,
    completedMissionIds,
    achievements,
    xp,
    experimentCount,
    successfulReactionsCount,
    audioEnabled,
    isLabDevastated,
  ]);

  // Audio helper
  const toggleAudio = (val: boolean) => {
    setAudioEnabled(val);
    sound.setEnabled(val);
    if (val) sound.playClick();
  };

  // Calculate Level & Rank
  const getLevelInfo = (currentXp: number) => {
    let lvl = 1;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (currentXp >= LEVEL_THRESHOLDS[i]) {
        lvl = i + 1;
        break;
      }
    }
    const currentThreshold = LEVEL_THRESHOLDS[lvl - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[lvl] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 1000;
    const xpCurrentLevelProgress = currentXp - currentThreshold;
    const xpToNextLevel = nextThreshold - currentThreshold;
    const rankTitle = ALCHEMIST_RANKS[Math.min(lvl - 1, ALCHEMIST_RANKS.length - 1)];

    return { lvl, rankTitle, xpToNextLevel, xpCurrentLevelProgress };
  };

  const { lvl: level, rankTitle: alchemistRank, xpToNextLevel, xpCurrentLevelProgress } = getLevelInfo(xp);

  // Trigger achievements
  const triggerAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === id && !ach.unlocked) {
          sound.playDiscovery();
          return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return ach;
      })
    );
  };

  // Explicit spectroscopy / analysis of an element
  const analyzeElement = (symbol: string) => {
    if (!analyzedElementSymbols.includes(symbol)) {
      sound.playSpark();
      setAnalyzedElementSymbols((prev) => [...prev, symbol]);
      setXp((prev) => prev + 25);
    }
  };

  const addXp = (amount: number) => {
    if (amount <= 0) return;
    setXp((prev) => prev + amount);
  };

  const addReactant = (substanceOrElementId: string) => {
    if (selectedReactants.length >= 4) return;
    sound.playGlassClink();
    setSelectedReactants((prev) => [...prev, substanceOrElementId]);
  };

  const removeReactant = (substanceOrElementId: string) => {
    sound.playClick();
    setSelectedReactants((prev) => {
      const idx = prev.lastIndexOf(substanceOrElementId);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  };

  const clearVessel = () => {
    sound.playClick();
    setSelectedReactants([]);
  };

  // Condition setters
  const setTemperature = (t: TemperatureLevel) => {
    if (t !== 'ambient') sound.playFlame();
    else sound.playClick();
    setConditions((c) => ({ ...c, temperature: t }));
  };

  const setPressure = (p: PressureLevel) => {
    sound.playClick();
    setConditions((c) => ({ ...c, pressure: p }));
  };

  const setCatalyst = (cat: CatalystType) => {
    sound.playClick();
    setConditions((c) => ({ ...c, catalyst: cat }));
  };

  const setElectricity = (e: ElectricalState) => {
    if (e !== 'none') sound.playSpark();
    else sound.playClick();
    setConditions((c) => ({ ...c, electricity: e }));
  };

  const setConcentration = (conc: ConcentrationLevel) => {
    sound.playClick();
    setConditions((c) => ({ ...c, concentration: conc }));
  };

  const executeExperiment = () => {
    if (isExperimentRunning || selectedReactants.length === 0) return;

    setIsExperimentRunning(true);
    setExperimentCount((c) => {
      const nextCount = c + 1;
      if (nextCount >= 25) triggerAchievement('ach_experiments_25');
      if (nextCount >= 100) triggerAchievement('ach_experiments_100');
      return nextCount;
    });

    if (conditions.temperature !== 'ambient') sound.playFlame();
    else if (conditions.electricity !== 'none') sound.playSpark();
    else sound.playBubbles();

    // Mark any used elements as analyzed/discovered through experimentation
    const newlyAnalyzedElements: string[] = [];
    selectedReactants.forEach((id) => {
      const isEl = ELEMENTS_118.some((e) => e.symbol === id);
      if (isEl && !analyzedElementSymbols.includes(id) && !newlyAnalyzedElements.includes(id)) {
        newlyAnalyzedElements.push(id);
      }
    });

    if (newlyAnalyzedElements.length > 0) {
      setAnalyzedElementSymbols((prev) => [...prev, ...newlyAnalyzedElements]);
      setXp((prev) => prev + newlyAnalyzedElements.length * 20);
    }

    // Evaluate chemistry
    const result = evaluateAdvancedReaction(selectedReactants, conditions);

    // Initial reaction phase: camera zooms in for 700ms while molecules excite
    setTimeout(() => {
      setIsExperimentRunning(false);

      if (result.success && result.reaction) {
        setSuccessfulReactionsCount((c) => c + 1);

        let isNewDiscovery = false;
        const newlyUnlocked: string[] = [];

        result.reaction.products.forEach((prodId) => {
          if (!unlockedSubstanceIds.includes(prodId)) {
            isNewDiscovery = true;
            newlyUnlocked.push(prodId);
          }
        });

        if (newlyUnlocked.length > 0) {
          setUnlockedSubstanceIds((prev) => [...prev, ...newlyUnlocked]);
        }

        const earnedXp = result.reaction.discoveryXp + (isNewDiscovery ? 60 : 15);
        setXp((prev) => prev + earnedXp);

        const isExplosion =
          result.reaction.visualEffect === 'explosion' ||
          result.reaction.reactionType === 'Reacción Explosiva';

        const isNuclear =
          result.reaction.id === 'rx_nuclear_critical_excursion' ||
          result.reaction.id.startsWith('rx_nuclear_') ||
          (result.reaction.reactants.includes('U') && result.reaction.reactants.includes('Be'));

        if (isNuclear) {
          // MASSIVE NUCLEAR EXPLOSION & WORKSPACE DEVASTATION (Sin confeti)
          triggerNuclearExperiment();
          setExplosionsCount((prev) => prev + 1);
          triggerAchievement('ach_pyro_master');

          // Allow the massive explosion animation on the lab table before modal opens
          setTimeout(() => {
            setReactionModalData({
              success: true,
              reaction: result.reaction,
              isNewDiscovery,
            });
          }, 2200);
        } else if (isExplosion) {
          // VIOLENT CAMERA RECOIL & EXPLOSION PHASE
          sound.playExplosion();
          setIsExploding(true);
          setExplosionsCount((prev) => {
            const nextExp = prev + 1;
            if (nextExp >= 5) triggerAchievement('ach_pyro_expert');
            return nextExp;
          });
          triggerAchievement('ach_pyro_master');

          confetti({
            particleCount: 95,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#ef4444', '#f97316', '#fbbf24', '#ffffff', '#dc2626'],
          });

          // Allow the user to enjoy the full explosion animation before modal opens
          setTimeout(() => {
            setIsExploding(false);
            setReactionModalData({
              success: true,
              reaction: result.reaction,
              isNewDiscovery,
            });
          }, 1500);
        } else {
          sound.playReactionSuccess();

          confetti({
            particleCount: 55,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#10b981', '#38bdf8', '#fbbf24', '#a855f7'],
          });

          // Smooth focused discovery delay
          setTimeout(() => {
            setReactionModalData({
              success: true,
              reaction: result.reaction,
              isNewDiscovery,
            });
          }, 450);
        }

        // Check mission completions across 100 missions
        const newlyFinishedMissionIds: string[] = [];
        MISSIONS.forEach((m) => {
          if (!completedMissionIds.includes(m.id) && !newlyFinishedMissionIds.includes(m.id)) {
            const hasAllTargets = m.targetProductIds.every(
              (pId) => result.reaction?.products.includes(pId) || newlyUnlocked.includes(pId)
            );
            const matchesType = !m.requiredReactionType || m.requiredReactionType === result.reaction?.reactionType;
            if (hasAllTargets && matchesType) {
              newlyFinishedMissionIds.push(m.id);
              setXp((prev) => prev + m.rewardXp);
            }
          }
        });

        if (newlyFinishedMissionIds.length > 0) {
          setCompletedMissionIds((prev) => {
            const totalCompleted = [...prev, ...newlyFinishedMissionIds];
            // Module completion checks
            const m1Count = totalCompleted.filter((id) => id.startsWith('mission_') && parseInt(id.replace('mission_', '')) <= 20).length;
            const m2Count = totalCompleted.filter((id) => id.startsWith('mission_') && parseInt(id.replace('mission_', '')) > 20 && parseInt(id.replace('mission_', '')) <= 40).length;
            const m3Count = totalCompleted.filter((id) => id.startsWith('mission_') && parseInt(id.replace('mission_', '')) > 40 && parseInt(id.replace('mission_', '')) <= 60).length;
            const m4Count = totalCompleted.filter((id) => id.startsWith('mission_') && parseInt(id.replace('mission_', '')) > 60 && parseInt(id.replace('mission_', '')) <= 80).length;
            const m5Count = totalCompleted.filter((id) => id.startsWith('mission_') && parseInt(id.replace('mission_', '')) > 80 && parseInt(id.replace('mission_', '')) <= 100).length;

            if (m1Count >= 20) triggerAchievement('ach_module_1');
            if (m2Count >= 20) triggerAchievement('ach_module_2');
            if (m3Count >= 20) triggerAchievement('ach_module_3');
            if (m4Count >= 20) triggerAchievement('ach_module_4');
            if (m5Count >= 20) triggerAchievement('ach_module_5');

            if (totalCompleted.length >= 10) triggerAchievement('ach_centurion_10');
            if (totalCompleted.length >= 25) triggerAchievement('ach_centurion_25');
            if (totalCompleted.length >= 50) triggerAchievement('ach_centurion_50');
            if (totalCompleted.length >= 100) triggerAchievement('ach_centurion_100');

            return totalCompleted;
          });
        }

        // Check comprehensive achievements
        triggerAchievement('ach_first_bond');
        if (conditions.temperature === 'moderate') triggerAchievement('ach_fire_lord');
        if (conditions.temperature === 'extreme') triggerAchievement('ach_calcination_master');
        if (conditions.electricity === 'spark') triggerAchievement('ach_spark_master');
        if (conditions.electricity === 'electrolysis') triggerAchievement('ach_electrolysis');
        if (conditions.catalyst !== 'none') triggerAchievement('ach_catalyst_guru');
        if (conditions.pressure === 'high') triggerAchievement('ach_pressure_god');
        if (result.reaction.reactionType === 'Doble Desplazamiento (Neutralización)') {
          triggerAchievement('ach_neutralizer');
        }
        if (result.reaction.products.includes('HAuCl4')) triggerAchievement('ach_aqua_regia');
        if (result.reaction.products.includes('XeF4')) triggerAchievement('ach_xenon_master');
        if (result.reaction.products.includes('PbI2')) triggerAchievement('ach_golden_rain');

        const totalUnlocked = unlockedSubstanceIds.length + newlyUnlocked.length;
        if (totalUnlocked >= 5) triggerAchievement('ach_discoverer_5');
        if (totalUnlocked >= 15) triggerAchievement('ach_discoverer_15');
        if (totalUnlocked >= 30) triggerAchievement('ach_discoverer_30');
        if (totalUnlocked >= 50) triggerAchievement('ach_discoverer_50');
        if (level >= 3) triggerAchievement('ach_level_3');
        if (level >= 5) triggerAchievement('ach_grand_alchemist');

      } else {
        sound.playFailedReaction();
        if (selectedReactants.some((id) => ['He', 'Ne', 'Ar', 'Kr'].includes(id))) {
          triggerAchievement('ach_noble_lesson');
        }

        setReactionModalData({
          success: false,
          reason: result.reason,
          chemicalTip: result.chemicalTip,
        });
      }
    }, 700);
  };

  const closeReactionModal = () => {
    sound.playClick();
    setReactionModalData(null);
  };

  const openTutorial = () => {
    sound.playClick();
    setIsTutorialOpen(true);
  };

  const closeTutorial = () => {
    sound.playClick();
    setIsTutorialOpen(false);
  };

  const loadRecipe = (
    reactantIds: string[],
    targetConditions?: Partial<ExperimentalConditions>,
    targetVessel?: VesselType
  ) => {
    sound.playGlassClink();
    setSelectedReactants([...reactantIds]);
    if (targetConditions) {
      setConditions((prev) => ({
        ...prev,
        ...targetConditions,
      }));
    }
    if (targetVessel) {
      setSelectedVessel(targetVessel);
    }
    triggerAchievement('ach_recipe_master');
    setCurrentScreen('lab');
  };

  const jumpToLabWithMission = (missionId: string) => {
    setActiveMissionId(missionId);
    setCurrentScreen('lab');
    sound.playClick();
  };

  const triggerNuclearExperiment = () => {
    setIsNuclearWarningOpen(false);
    setCurrentScreen('lab');
    setIsNuclearCinematicRunning(false); // Sin cinematica
    setNuclearCinematicPhase('idle');

    // Detonación nuclear masiva inmediata en el laboratorio (sin sirenas ni confeti)
    sound.playNuclearDetonation();
    setIsExploding(true);
    setIsLabDevastated(true);

    setTimeout(() => {
      setIsExploding(false);
    }, 2200);
  };

  const skipNuclearCinematic = () => {
    setIsNuclearCinematicRunning(false);
    setNuclearCinematicPhase('idle');
    setIsLabDevastated(true);
  };

  const loadAndDetonateNuclearReaction = () => {
    sound.playGlassClink();
    setSelectedReactants(['U', 'Be']);
    setConditions((prev) => ({
      ...prev,
      temperature: 'ambient',
      pressure: 'high',
      catalyst: 'none',
      electricity: 'spark',
      concentration: 'concentrated',
    }));
    triggerAchievement('ach_recipe_master');
    setCurrentScreen('lab');

    // Launch the massive, grand nuclear explosion in the laboratory!
    setTimeout(() => {
      triggerNuclearExperiment();
    }, 450);
  };

  const repairLaboratory = () => {
    setIsReconstructing(true);
    sound.playLaboratoryReconstruct();

    setTimeout(() => {
      setIsLabDevastated(false);
      setIsReconstructing(false);
      try {
        confetti({
          particleCount: 75,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#6366f1', '#e2e8f0'],
        });
      } catch {
        // ignore
      }
    }, 1800);
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUnlockedSubstanceIds(defaultUnlocked);
    setAnalyzedElementSymbols(INITIAL_STARTER_ELEMENTS);
    setCompletedMissionIds([]);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setXp(0);
    setExperimentCount(0);
    setSuccessfulReactionsCount(0);
    setSelectedReactants([]);
    setIsLabDevastated(false);
    setConditions({
      temperature: 'ambient',
      pressure: 'standard',
      catalyst: 'none',
      electricity: 'none',
      concentration: 'normal',
    });
    sound.playClick();
  };

  return (
    <GameContext.Provider
      value={{
        currentScreen,
        setCurrentScreen: (s) => {
          sound.playClick();
          setCurrentScreen(s);
        },
        isMobileDevice,
        isMobileFrame,
        setIsMobileFrame,
        xp,
        level,
        alchemistRank,
        xpToNextLevel,
        xpCurrentLevelProgress,
        unlockedSubstanceIds,
        analyzedElementSymbols,
        analyzeElement,
        addXp,
        completedMissionIds,
        achievements,
        activeMissionId,
        setActiveMissionId,
        selectedReactants,
        conditions,
        setTemperature,
        setPressure,
        setCatalyst,
        setElectricity,
        setConcentration,
        selectedVessel,
        setSelectedVessel,
        activeAnalyticalTool,
        setActiveAnalyticalTool,
        isMagneticStirrerActive,
        setIsMagneticStirrerActive,
        stirrerRpm,
        setStirrerRpm,
        isFumeHoodActive,
        setIsFumeHoodActive,
        isVesselSealed,
        setIsVesselSealed,
        addReactant,
        removeReactant,
        clearVessel,
        loadRecipe,
        isExperimentRunning,
        isExploding,
        executeExperiment,
        reactionModalData,
        closeReactionModal,
        experimentCount,
        successfulReactionsCount,
        audioEnabled,
        setAudioEnabled: toggleAudio,
        resetProgress,
        jumpToLabWithMission,
        isTutorialOpen,
        setIsTutorialOpen,
        openTutorial,
        closeTutorial,
        isLabDevastated,
        isNuclearWarningOpen,
        setIsNuclearWarningOpen,
        isNuclearCinematicRunning,
        nuclearCinematicPhase,
        isReconstructing,
        triggerNuclearExperiment,
        loadAndDetonateNuclearReaction,
        skipNuclearCinematic,
        repairLaboratory,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

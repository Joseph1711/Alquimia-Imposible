import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertCircle, ArrowRight, BookOpen, Check, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { SUBSTANCES } from '../data/chemistryData';
import { ELEMENTS_118 } from '../data/elements118';

export const ReactionResultModal: React.FC = () => {
  const { reactionModalData, closeReactionModal, setCurrentScreen } = useGame();

  if (!reactionModalData) return null;

  const { success, reaction, reason, chemicalTip, isNewDiscovery } = reactionModalData;

  const getProductDetails = (prodId: string) => {
    // Check in substances
    const sub = SUBSTANCES[prodId];
    if (sub) {
      return {
        formula: sub.formula,
        name: sub.name,
        category: sub.category,
        color: sub.color,
      };
    }
    // Check in elements 118
    const el = ELEMENTS_118.find((e) => e.symbol === prodId);
    if (el) {
      return {
        formula: el.symbol,
        name: el.name,
        category: el.categoryName,
        color: el.color,
      };
    }
    return {
      formula: prodId,
      name: prodId,
      category: 'Compuesto Químico',
      color: '#38bdf8',
    };
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-[#0d1424] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]"
        >
          {/* Header */}
          <div
            className={`px-6 py-4 flex items-center justify-between border-b ${
              success
                ? 'bg-gradient-to-r from-emerald-950/60 to-slate-900 border-emerald-500/30'
                : 'bg-gradient-to-r from-amber-950/50 to-slate-900 border-amber-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {success ? <Sparkles className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-base text-white">
                  {success ? '¡Reacción Química Exitosa!' : 'Sin Reacción Observable'}
                </h3>
                <p className="text-xs text-slate-400">
                  {success
                    ? isNewDiscovery
                      ? '★ Nuevo Compuesto Sintetizado'
                      : 'Reacción Registrada en el Laboratorio'
                    : 'Condiciones Experimentales Insuficientes'}
                </p>
              </div>
            </div>
            <button
              onClick={closeReactionModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-4 text-sm">
            {success && reaction ? (
              <>
                {/* Balanced Equation */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-center shadow-inner">
                  <div className="text-xs text-emerald-400 font-medium mb-1">
                    Ecuación Química Balanceada
                  </div>
                  <div className="font-mono text-base md:text-lg text-white font-bold tracking-wide">
                    {reaction.balancedEquation}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Clasificación: <span className="text-slate-200">{reaction.reactionType}</span>
                  </div>
                </div>

                {/* Products Obtained */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Sustancias Producidas:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {reaction.products.map((prodId) => {
                      const details = getProductDetails(prodId);
                      return (
                        <div
                          key={prodId}
                          className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex items-center gap-3 shadow-sm"
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-white shrink-0 border"
                            style={{
                              backgroundColor: details.color + '30',
                              borderColor: details.color,
                            }}
                          >
                            {details.formula}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-white truncate">{details.name}</div>
                            <div className="text-xs text-slate-400 truncate">{details.category}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Educational Explanation */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                  <div className="text-xs font-semibold text-slate-300">
                    Fundamento Químico y Mecanismo:
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {reaction.explanation}
                  </p>
                </div>

                {/* Condition Met & XP */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
                  <span>Condición: {reaction.conditionDescription}</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    +{reaction.discoveryXp} XP
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Failure explanation */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-slate-300 space-y-2">
                  <div className="text-xs font-semibold text-amber-400">
                    ¿Por qué no ocurrió la reacción?
                  </div>
                  <p className="text-xs leading-relaxed">{reason}</p>
                </div>

                {chemicalTip && (
                  <div className="bg-amber-950/20 border border-amber-600/30 rounded-xl p-3.5 space-y-1">
                    <div className="text-xs font-semibold text-amber-300">
                      Consejo del Alquimista:
                    </div>
                    <p className="text-xs text-slate-300">{chemicalTip}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-3.5 bg-slate-900/80 border-t border-slate-800 flex items-center justify-end gap-3">
            {success ? (
              <>
                <button
                  onClick={() => {
                    closeReactionModal();
                    setCurrentScreen('catalog');
                  }}
                  className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Ver en Catálogo
                </button>
                <button
                  onClick={closeReactionModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Continuar Experimentos
                </button>
              </>
            ) : (
              <button
                onClick={closeReactionModal}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Ajustar Variables Experimentales
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

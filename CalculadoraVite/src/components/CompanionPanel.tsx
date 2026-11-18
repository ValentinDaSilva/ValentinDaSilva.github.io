import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Trash2, Search } from 'lucide-react';
import { SCIENTIFIC_CONSTANTS, UNIT_CONVERSIONS } from '../engine/constants';
import { formatCasioNumber } from '../engine/exactMath';
import { AstList, CalcMode, HistoryEntry, MemoryBank, SetupConfig } from '../engine/types';

export interface QuickPreset {
  id: string;
  mode: CalcMode;
  title: string;
  subtitle: string;
}

interface CompanionPanelProps {
  mode: CalcMode;
  setup: SetupConfig;
  memory: MemoryBank;
  history: HistoryEntry[];
  onRecallHistory: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
  onInsertConstant: (code: string) => void;
  onInsertConversion: (code: string) => void;
  onLoadExample: (presetId: string) => void;
  onSelectMode: (mode: CalcMode) => void;
}

const EXAMPLES: QuickPreset[] = [
  {
    id: 'EX_FRAC_SURD',
    mode: 'COMP',
    title: 'Fracción y raíz exacta (MathIO)',
    subtitle: '(√2 + √8) / 2  →  3√2/2 (pulse S⇔D para decimal)',
  },
  {
    id: 'EX_INTEGRAL',
    mode: 'COMP',
    title: 'Integral definida ∫(x²)dx',
    subtitle: '∫ de 0 a 3 de X² dx  →  9',
  },
  {
    id: 'EX_DERIV',
    mode: 'COMP',
    title: 'Derivada numérica d/dx',
    subtitle: 'd/dx(X³ + 2X)|X=2  →  14',
  },
  {
    id: 'EX_SOLVE',
    mode: 'COMP',
    title: 'Ecuación con SOLVE (X² − 5X + 6 = 0)',
    subtitle: 'Carga ecuación lista para resolver con SHIFT + CALC',
  },
  {
    id: 'EX_CMPLX',
    mode: 'CMPLX',
    title: 'Operación en Complejos (CMPLX)',
    subtitle: '(3 + 4i) × (1 − 2i)  →  11 − 2i',
  },
  {
    id: 'EX_EQN_QUAD',
    mode: 'EQN',
    title: 'Ecuación cuadrática (EQN)',
    subtitle: '2X² − 4X − 6 = 0  →  X₁=3, X₂=-1',
  },
  {
    id: 'EX_STAT',
    mode: 'STAT',
    title: 'Regresión lineal (STAT A+BX)',
    subtitle: 'Carga 5 puntos (X, Y) para calcular r, A, B, x̄',
  },
  {
    id: 'EX_TABLE',
    mode: 'TABLE',
    title: 'Tabla de valores f(X) = X² − 4',
    subtitle: 'De X = -2 hasta 4 con paso 1',
  },
];

const KEYBOARD_MAP = [
  { key: '0–9, .', action: 'Dígitos y punto decimal' },
  { key: '+ − * / ^', action: 'Operadores básicos y potencia' },
  { key: '( ) ,', action: 'Paréntesis y coma' },
  { key: 'Enter / =', action: 'Ejecutar cálculo (=)' },
  { key: 'Backspace', action: 'Borrar carácter (DEL)' },
  { key: 'Escape', action: 'Limpiar todo (AC)' },
  { key: 'Flechas ←↑↓→', action: 'Navegar cursor / historial' },
  { key: 's / c / t', action: 'sin / cos / tan' },
  { key: 'l / n / r', action: 'log / ln / √□' },
  { key: 'p / e / x', action: 'π / e / variable X' },
  { key: 'F9 / F10', action: 'SHIFT / ALPHA' },
  { key: 'd', action: 'Alternar S⇔D (Fracción/Decimal)' },
];

export const CompanionPanel: React.FC<CompanionPanelProps> = ({
  mode,
  setup,
  memory,
  history,
  onRecallHistory,
  onClearHistory,
  onInsertConstant,
  onInsertConversion,
  onLoadExample,
  onSelectMode,
}) => {
  const [tab, setTab] = useState<'TAPE' | 'MEM' | 'CONST' | 'GUIDE'>('TAPE');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1400);
  };

  const scalarVars: Array<{ name: string; val: number }> = [
    { name: 'Ans', val: memory.Ans },
    { name: 'PreAns', val: memory.PreAns },
    { name: 'M', val: memory.M },
    { name: 'A', val: memory.A },
    { name: 'B', val: memory.B },
    { name: 'C', val: memory.C },
    { name: 'D', val: memory.D },
    { name: 'E', val: memory.E },
    { name: 'F', val: memory.F },
    { name: 'X', val: memory.X },
    { name: 'Y', val: memory.Y },
  ];

  const q = search.trim().toLowerCase();
  const filteredConst = SCIENTIFIC_CONSTANTS.filter(
    (c) =>
      !q ||
      c.code.includes(q) ||
      c.symbol.toLowerCase().includes(q) ||
      c.nameEs.toLowerCase().includes(q)
  );
  const filteredConv = UNIT_CONVERSIONS.filter(
    (c) =>
      !q ||
      c.code.includes(q) ||
      c.label.toLowerCase().includes(q) ||
      c.nameEs.toLowerCase().includes(q)
  );

  const modesList: Array<{ id: CalcMode; num: string; desc: string }> = [
    { id: 'COMP', num: '1', desc: 'Cálculo general' },
    { id: 'CMPLX', num: '2', desc: 'Números complejos' },
    { id: 'STAT', num: '3', desc: 'Estadística y regresión' },
    { id: 'BASE', num: '4', desc: 'Sistemas DEC/HEX/BIN/OCT' },
    { id: 'EQN', num: '5', desc: 'Sistemas y polinomios' },
    { id: 'MATRIX', num: '6', desc: 'Matrices hasta 3×3' },
    { id: 'TABLE', num: '7', desc: 'Tabla de funciones' },
    { id: 'VECTOR', num: '8', desc: 'Vectores 2D y 3D' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col h-[640px] overflow-hidden">
      {/* Segmented Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-3 py-2 bg-slate-50/70 dark:bg-slate-950/40">
        <div className="flex items-center gap-1">
          {[
            { id: 'TAPE' as const, label: 'Historial' },
            { id: 'MEM' as const, label: 'Memoria' },
            { id: 'CONST' as const, label: 'Const / Conv' },
            { id: 'GUIDE' as const, label: 'Guía y Ejemplos' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                tab === item.id
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
          {mode} · {setup.angleUnit} · {setup.ioMode === 'MATH' ? 'MthIO' : 'LineIO'}
        </span>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto thin-scroll p-4">
        {tab === 'TAPE' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Cinta de operaciones
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Haz clic en cualquier cálculo para cargarlo de nuevo en la pantalla.
                </p>
              </div>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 rounded-md cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Limpiar
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Sin cálculos registrados todavía
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                  Escribe una expresión en la calculadora o prueba un ejemplo desde la pestaña «Guía y Ejemplos».
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <button
                      type="button"
                      onClick={() => onRecallHistory(item)}
                      className="flex-1 text-left min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        <span>{item.mode}</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                      <div className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate mt-0.5">
                        {item.inputDisplay}
                      </div>
                      <div className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                        = {item.resultDisplay}
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onRecallHistory(item)}
                        title="Cargar expresión en pantalla"
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.resultDisplay)}
                        title="Copiar resultado"
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded cursor-pointer"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'MEM' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Variables y registros en memoria
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Usa SHIFT + RCL (STO) seguido de A–F, X, Y o M para almacenar un resultado.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {scalarVars.map((v) => (
                <div
                  key={v.name}
                  className="border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 bg-slate-50/60 dark:bg-slate-950/30"
                >
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{v.name}</div>
                  <div className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums truncate">
                    {formatCasioNumber(v.val, setup)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Matrices y Vectores guardados
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="border border-slate-200 dark:border-slate-800 rounded-md p-2.5">
                  <div className="text-slate-500">MatA ({memory.MatA.length}×{memory.MatA[0]?.length})</div>
                  <div className="text-slate-800 dark:text-slate-200 mt-1 truncate">
                    {JSON.stringify(memory.MatA)}
                  </div>
                </div>
                <div className="border border-slate-200 dark:border-slate-800 rounded-md p-2.5">
                  <div className="text-slate-500">MatB ({memory.MatB.length}×{memory.MatB[0]?.length})</div>
                  <div className="text-slate-800 dark:text-slate-200 mt-1 truncate">
                    {JSON.stringify(memory.MatB)}
                  </div>
                </div>
                <div className="border border-slate-200 dark:border-slate-800 rounded-md p-2.5">
                  <div className="text-slate-500">VctA ({memory.VctA.length}D)</div>
                  <div className="text-slate-800 dark:text-slate-200 mt-1 truncate">
                    [{memory.VctA.join(', ')}]
                  </div>
                </div>
                <div className="border border-slate-200 dark:border-slate-800 rounded-md p-2.5">
                  <div className="text-slate-500">VctB ({memory.VctB.length}D)</div>
                  <div className="text-slate-800 dark:text-slate-200 mt-1 truncate">
                    [{memory.VctB.join(', ')}]
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'CONST' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar constante (01–40) o conversión (km, atm, °C...)"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-600"
              />
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Constantes científicas (SHIFT + 7 CONST)
              </h3>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 max-h-[210px] overflow-y-auto thin-scroll">
                {filteredConst.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => onInsertConstant(c.code)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-400 mr-2">
                        {c.code}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 mr-2">
                        {c.symbol}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {c.nameEs}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 tabular-nums shrink-0">
                      {c.value.toExponential(4)} {c.unit}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Conversiones métricas (SHIFT + 8 CONV)
              </h3>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 max-h-[210px] overflow-y-auto thin-scroll">
                {filteredConv.map((u) => (
                  <button
                    key={u.code}
                    type="button"
                    onClick={() => onInsertConversion(u.code)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400 mr-2">
                        {u.code}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 mr-2">
                        {u.label}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {u.nameEs}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">Insertar</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'GUIDE' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Cambio rápido de modo (MODE 1–8)
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {modesList.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelectMode(m.id)}
                    className={`px-2.5 py-2 rounded-md border text-left transition-colors cursor-pointer ${
                      mode === m.id
                        ? 'border-cyan-600 bg-cyan-50/70 dark:bg-cyan-950/40 text-slate-900 dark:text-slate-100'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold">
                      {m.num}:{m.id}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Ejemplos interactivos (clic para cargar en la calculadora)
              </h3>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => onLoadExample(ex.id)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {ex.title}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                        {ex.subtitle}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-700 dark:text-cyan-400 shrink-0">
                      {ex.mode}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Atajos de teclado físico
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                {KEYBOARD_MAP.map((km) => (
                  <div key={km.key} className="flex items-center justify-between gap-2 py-0.5">
                    <kbd className="font-mono text-[11px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 shrink-0">
                      {km.key}
                    </kbd>
                    <span className="text-slate-600 dark:text-slate-400 text-right truncate">{km.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Sun, Moon, Keyboard } from 'lucide-react';
import { CasioHardware, KeyId } from './components/CasioHardware';
import { CompanionPanel } from './components/CompanionPanel';
import {
  EqnScreenState,
  LcdDisplayResult,
  MatVecEditorState,
  PromptState,
  StatScreenState,
  TableScreenState,
} from './components/LcdScreen';
import { SCIENTIFIC_CONSTANTS, UNIT_CONVERSIONS } from './engine/constants';
import { CalcError, evaluateAst, EvalValue, solveForX } from './engine/evaluator';
import {
  formatCasioNumber,
  formatComplex,
  formatDMS,
  primeFactorize,
  toExactResult,
} from './engine/exactMath';
import {
  computeStatSummary,
  formatBaseN,
  solveCubic,
  solveLinear2x2,
  solveLinear3x3,
  solveQuadratic,
} from './engine/modes';
import {
  ActivePopupMenu,
  AstCursor,
  AstList,
  AstNode,
  BaseSystem,
  CalcMode,
  ComplexNum,
  EqnType,
  HistoryEntry,
  MatrixData,
  MemoryBank,
  SetupConfig,
  StatRow,
  StatType,
} from './engine/types';
import {
  astToReadableString,
  cloneAstList,
  createTextNode,
  deleteBeforeCursor,
  genId,
  insertNodesAtCursor,
  moveCursorLeft,
  moveCursorRight,
  moveCursorUpDown,
  popPrecedingBaseTokens,
} from './engine/vpamAst';

const DEFAULT_SETUP: SetupConfig = {
  ioMode: 'MATH',
  angleUnit: 'DEG',
  displayFormat: 'NORM1',
  fixDigits: 2,
  sciDigits: 3,
  fractionMode: 'ab/c',
  complexFormat: 'a+bi',
  statFreq: 'OFF',
  contrast: 6,
};

const DEFAULT_MEMORY: MemoryBank = {
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  E: 0,
  F: 0,
  X: 0,
  Y: 0,
  M: 0,
  Ans: 0,
  PreAns: 0,
  AnsComplex: { re: 0, im: 0 },
  MatA: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  MatB: [
    [1, 2, 0],
    [3, 4, 0],
    [0, 0, 1],
  ],
  MatC: [
    [0, 0],
    [0, 0],
  ],
  MatAns: [[0]],
  VctA: [1, 0, 0],
  VctB: [0, 1, 0],
  VctC: [0, 0, 1],
  VctAns: [0, 0, 0],
};

function createEmptyMatrix(rows: number, cols: number): MatrixData {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
}

function collectAstVariables(list: AstList, found = new Set<string>()): string[] {
  for (const node of list) {
    if (node.type === 'text') {
      for (const ch of node.value) {
        if (/^[A-FXY]$/.test(ch)) found.add(ch);
      }
    } else if (node.type === 'frac') {
      collectAstVariables(node.num, found);
      collectAstVariables(node.den, found);
    } else if (node.type === 'mixedFrac') {
      collectAstVariables(node.whole, found);
      collectAstVariables(node.num, found);
      collectAstVariables(node.den, found);
    } else if (node.type === 'sqrt' || node.type === 'cbrt' || node.type === 'abs') {
      collectAstVariables(node.inner, found);
    } else if (node.type === 'nthRoot') {
      collectAstVariables(node.index, found);
      collectAstVariables(node.inner, found);
    } else if (node.type === 'pow') {
      collectAstVariables(node.base, found);
      collectAstVariables(node.exp, found);
    } else if (node.type === 'logBase') {
      collectAstVariables(node.base, found);
      collectAstVariables(node.inner, found);
    } else if (node.type === 'integral') {
      collectAstVariables(node.lower, found);
      collectAstVariables(node.upper, found);
    } else if (node.type === 'deriv') {
      collectAstVariables(node.at, found);
    } else if (node.type === 'sum') {
      collectAstVariables(node.lower, found);
      collectAstVariables(node.upper, found);
    }
  }
  return Array.from(found);
}

function splitEquationOnEquals(list: AstList): { lhs: AstList; rhs: AstList } {
  const eqIdx = list.findIndex((n) => n.type === 'text' && n.value === '=');
  if (eqIdx === -1) return { lhs: list, rhs: [] };
  return { lhs: list.slice(0, eqIdx), rhs: list.slice(eqIdx + 1) };
}

export default function App() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pressedKey, setPressedKey] = useState<KeyId | null>(null);

  // Core Calculator Session State
  const [isOn, setIsOn] = useState(true);
  const [shift, setShift] = useState(false);
  const [alpha, setAlpha] = useState(false);
  const [insertMode, setInsertMode] = useState(true);
  const [mode, setMode] = useState<CalcMode>('COMP');
  const [baseSystem, setBaseSystem] = useState<BaseSystem>('DEC');
  const [setup, setSetup] = useState<SetupConfig>(DEFAULT_SETUP);
  const [memory, setMemory] = useState<MemoryBank>(DEFAULT_MEMORY);

  // AST Input & Result
  const [ast, setAst] = useState<AstList>([]);
  const [cursor, setCursor] = useState<AstCursor>({ path: [], index: 0 });
  const [result, setResult] = useState<LcdDisplayResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [popup, setPopup] = useState<ActivePopupMenu>({ type: 'NONE' });
  const [prompt, setPrompt] = useState<PromptState>({ kind: 'NONE', inputBuf: '' });

  // History
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyNavIdx, setHistoryNavIdx] = useState<number>(-1);

  // EQN State
  const [eqnState, setEqnState] = useState<EqnScreenState>({
    stage: 'EDIT',
    eqnType: 'QUAD',
    coeffs: [1, 0, -1],
    cursorIdx: 0,
    inputBuf: '',
    solutions: [],
    solIdx: 0,
  });

  // STAT State
  const [statType, setStatType] = useState<StatType>('1-VAR');
  const [statRows, setStatRows] = useState<StatRow[]>([
    { x: 10, y: 20, freq: 1 },
    { x: 15, y: 28, freq: 1 },
    { x: 20, y: 41, freq: 1 },
  ]);
  const [statScreen, setStatScreen] = useState<StatScreenState>({
    stage: 'DATA',
    cursorRow: 0,
    cursorCol: 0,
    inputBuf: '',
  });

  // MATRIX / VECTOR Editor State
  const [matVecEditor, setMatVecEditor] = useState<MatVecEditorState>({
    active: false,
    kind: 'MATRIX',
    target: 'A',
    row: 0,
    col: 0,
    inputBuf: '',
  });

  // TABLE State
  const [tableFx, setTableFx] = useState<AstList>([]);
  const [tableGx, setTableGx] = useState<AstList>([]);
  const [tableState, setTableState] = useState<TableScreenState>({
    stage: 'FX',
    start: 1,
    end: 5,
    step: 1,
    inputBuf: '',
    rows: [],
    scrollRow: 0,
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkTheme);
  }, [darkTheme]);

  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtor();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.022);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.024);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.025);
    } catch {
      // Ignore audio errors
    }
  }, [soundEnabled]);

  const flashKey = (k: KeyId) => {
    setPressedKey(k);
    setTimeout(() => setPressedKey((prev) => (prev === k ? null : prev)), 110);
  };

  const resetForNewExpr = (initialNodes: AstNode[] = []) => {
    setAst(initialNodes);
    setCursor({ path: [], index: initialNodes.length });
    setResult(null);
    setErrorMsg(null);
    setHistoryNavIdx(-1);
  };

  const insertText = (val: string) => {
    if (result) {
      // If pressing binary op right after a result, continue with Ans
      const isContinuationOp = ['+', '-', '×', '÷', '^', 'nPr', 'nCr', '∠', '·', '!', '²', '³', '⁻¹', '%'].includes(val);
      if (isContinuationOp) {
        const ansStr = mode === 'MATRIX' ? 'MatAns' : mode === 'VECTOR' ? 'VctAns' : 'Ans';
        const nodes = [createTextNode(ansStr), createTextNode(val)];
        setAst(nodes);
        setCursor({ path: [], index: nodes.length });
        setResult(null);
        setHistoryNavIdx(-1);
        return;
      }
      resetForNewExpr([createTextNode(val)]);
      return;
    }

    const res = insertNodesAtCursor(ast, cursor, [createTextNode(val)]);
    setAst(res.ast);
    setCursor(res.cursor);
  };

  const insertTokenList = (tokens: string[]) => {
    const nodes = tokens.map((t) => createTextNode(t));
    if (result) {
      resetForNewExpr(nodes);
      return;
    }
    const res = insertNodesAtCursor(ast, cursor, nodes);
    setAst(res.ast);
    setCursor(res.cursor);
  };

  const insertTemplateNode = (
    node: AstNode,
    enterSlot: string,
    wrapBase = false
  ) => {
    let baseAst = ast;
    let baseCursor = cursor;

    if (result) {
      if (wrapBase) {
        const ansNode = createTextNode(mode === 'MATRIX' ? 'MatAns' : mode === 'VECTOR' ? 'VctAns' : 'Ans');
        baseAst = [ansNode];
        baseCursor = { path: [], index: 1 };
      } else {
        baseAst = [];
        baseCursor = { path: [], index: 0 };
      }
      setResult(null);
    }

    if (wrapBase && node.type === 'pow') {
      const popped = popPrecedingBaseTokens(baseAst, baseCursor);
      const newPow: AstNode = {
        ...node,
        base: popped.baseNodes.length > 0 ? popped.baseNodes : [],
      };
      const slotToEnter = popped.baseNodes.length > 0 && node.exp.length === 0 ? 'exp' : popped.baseNodes.length === 0 ? 'base' : '';
      const res = insertNodesAtCursor(
        popped.ast,
        popped.cursor,
        [newPow],
        slotToEnter ? { nodeIndex: 0, slot: slotToEnter } : undefined
      );
      setAst(res.ast);
      setCursor(res.cursor);
      return;
    }

    if (wrapBase && node.type === 'frac') {
      const popped = popPrecedingBaseTokens(baseAst, baseCursor);
      if (popped.baseNodes.length > 0) {
        const newFrac: AstNode = { ...node, num: popped.baseNodes };
        const res = insertNodesAtCursor(popped.ast, popped.cursor, [newFrac], {
          nodeIndex: 0,
          slot: 'den',
        });
        setAst(res.ast);
        setCursor(res.cursor);
        return;
      }
    }

    const res = insertNodesAtCursor(baseAst, baseCursor, [node], {
      nodeIndex: 0,
      slot: enterSlot,
    });
    setAst(res.ast);
    setCursor(res.cursor);
  };

  const finalizeEvalResult = (
    evalVal: EvalValue,
    sourceAst: AstList,
    forceDecimal = false,
    forcePolar: 'NONE' | 'POLAR' | 'RECT' = 'NONE'
  ) => {
    const inputDisplay = astToReadableString(sourceAst);
    let dispRes: LcdDisplayResult;
    let tapeText = '';

    if (evalVal.kind === 'matrix') {
      setMemory((m) => ({ ...m, MatAns: evalVal.value }));
      dispRes = {
        kind: 'matrix',
        matrixVal: evalVal.value,
        showDecimal: true,
        engShift: 0,
        dmsMode: false,
        factActive: false,
      };
      tapeText = JSON.stringify(evalVal.value.map((r) => r.map((v) => Number(v.toPrecision(6)))));
    } else if (evalVal.kind === 'vector') {
      setMemory((m) => ({ ...m, VctAns: evalVal.value }));
      dispRes = {
        kind: 'vector',
        vectorVal: evalVal.value,
        showDecimal: true,
        engShift: 0,
        dmsMode: false,
        factActive: false,
      };
      tapeText = `[${evalVal.value.map((v) => formatCasioNumber(v, setup)).join(', ')}]`;
    } else if (evalVal.kind === 'complex') {
      setMemory((m) => ({
        ...m,
        PreAns: m.Ans,
        Ans: Math.hypot(evalVal.value.re, evalVal.value.im),
        AnsComplex: evalVal.value,
      }));
      const effectiveSetup: SetupConfig =
        forcePolar === 'POLAR'
          ? { ...setup, complexFormat: 'r<theta' }
          : forcePolar === 'RECT'
          ? { ...setup, complexFormat: 'a+bi' }
          : setup;
      dispRes = {
        kind: 'complex',
        complexVal: evalVal.value,
        showDecimal: true,
        engShift: 0,
        dmsMode: false,
        factActive: false,
      };
      tapeText = formatComplex(evalVal.value, effectiveSetup);
    } else {
      const val = evalVal.value;
      setMemory((m) => ({
        ...m,
        PreAns: m.Ans,
        Ans: val,
        AnsComplex: { re: val, im: 0 },
      }));
      const exact = toExactResult(val);
      const factStr = primeFactorize(val) ?? undefined;
      dispRes = {
        kind: 'real',
        realVal: val,
        exact,
        showDecimal: forceDecimal || setup.ioMode === 'LINE',
        engShift: 0,
        dmsMode: false,
        dmsText: formatDMS(val),
        factText: factStr,
        factActive: false,
      };
      tapeText =
        mode === 'BASE'
          ? `${formatBaseN(val, baseSystem)} (${baseSystem})`
          : formatCasioNumber(val, setup);
    }

    setResult(dispRes);
    setErrorMsg(null);
    setHistory((prev) => [
      {
        id: genId(),
        mode,
        inputAst: cloneAstList(sourceAst),
        inputDisplay,
        resultDisplay: tapeText,
        decimalValue: evalVal.kind === 'real' ? evalVal.value : undefined,
        complexValue: evalVal.kind === 'complex' ? evalVal.value : undefined,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 49),
    ]);
  };

  const runCurrentExpression = (forceDecimal = false, customMem?: MemoryBank) => {
    const activeMem = customMem ?? memory;
    if (ast.length === 0) return;

    // Check trailing ▸r∠θ or ▸a+bi
    let forcePolar: 'NONE' | 'POLAR' | 'RECT' = 'NONE';
    let exprAst = ast;
    const last = ast[ast.length - 1];
    if (last?.type === 'text' && last.value === '▸r∠θ') {
      forcePolar = 'POLAR';
      exprAst = ast.slice(0, -1);
    } else if (last?.type === 'text' && last.value === '▸a+bi') {
      forcePolar = 'RECT';
      exprAst = ast.slice(0, -1);
    }

    try {
      let sideXY: { x: number; y: number } | null = null;
      const val = evaluateAst(exprAst, {
        mode,
        setup,
        memory: activeMem,
        baseSystem,
        sideEffectXY: (x, y) => {
          sideXY = { x, y };
        },
      });
      if (sideXY) {
        setMemory((m) => ({ ...m, X: sideXY!.x, Y: sideXY!.y }));
      }
      finalizeEvalResult(val, ast, forceDecimal, forcePolar);
    } catch (err) {
      if (err instanceof CalcError) {
        setErrorMsg(err.code);
      } else {
        setErrorMsg('Math ERROR');
      }
    }
  };

  const switchMode = (newMode: CalcMode) => {
    setMode(newMode);
    setPopup({ type: 'NONE' });
    setPrompt({ kind: 'NONE', inputBuf: '' });
    setErrorMsg(null);
    setResult(null);
    setAst([]);
    setCursor({ path: [], index: 0 });

    if (newMode === 'STAT') {
      setPopup({ type: 'STAT_TYPE' });
    } else if (newMode === 'EQN') {
      setPopup({ type: 'EQN_SELECT' });
    } else if (newMode === 'MATRIX') {
      setMatVecEditor({ active: false, kind: 'MATRIX', target: 'A', row: 0, col: 0, inputBuf: '' });
      setPopup({ type: 'MATRIX_DIM_SELECT' });
    } else if (newMode === 'VECTOR') {
      setMatVecEditor({ active: false, kind: 'VECTOR', target: 'A', row: 0, col: 0, inputBuf: '' });
      setPopup({ type: 'VECTOR_DIM_SELECT' });
    } else if (newMode === 'TABLE') {
      setTableState({
        stage: 'FX',
        start: 1,
        end: 5,
        step: 1,
        inputBuf: '',
        rows: [],
        scrollRow: 0,
      });
    } else if (newMode === 'BASE') {
      setBaseSystem('DEC');
    }
  };

  const digitFromKey = (k: KeyId): number | null => {
    if (/^[0-9]$/.test(k)) return parseInt(k, 10);
    return null;
  };

  const alphaVarFromKey = (k: KeyId): keyof MemoryBank | null => {
    if (k === 'NEG') return 'A';
    if (k === 'DMS') return 'B';
    if (k === 'HYP') return 'C';
    if (k === 'SIN') return 'D';
    if (k === 'COS') return 'E';
    if (k === 'TAN') return 'F';
    if (k === 'RPAREN') return 'X';
    if (k === 'SD') return 'Y';
    if (k === 'MPLUS') return 'M';
    return null;
  };

  const handlePopupKey = (k: KeyId): boolean => {
    const d = digitFromKey(k);

    if (k === 'AC') {
      setPopup({ type: 'NONE' });
      return true;
    }

    if (popup.type === 'MODE') {
      const map: Record<number, CalcMode> = {
        1: 'COMP',
        2: 'CMPLX',
        3: 'STAT',
        4: 'BASE',
        5: 'EQN',
        6: 'MATRIX',
        7: 'TABLE',
        8: 'VECTOR',
      };
      if (d !== null && map[d]) switchMode(map[d]);
      return true;
    }

    if (popup.type === 'SETUP') {
      if (k === 'DOWN' && popup.page === 1) {
        setPopup({ type: 'SETUP', page: 2 });
        return true;
      }
      if (k === 'UP' && popup.page === 2) {
        setPopup({ type: 'SETUP', page: 1 });
        return true;
      }
      if (popup.page === 1 && d !== null) {
        if (d === 1) setSetup((s) => ({ ...s, ioMode: 'MATH' }));
        if (d === 2) setSetup((s) => ({ ...s, ioMode: 'LINE' }));
        if (d === 3) setSetup((s) => ({ ...s, angleUnit: 'DEG' }));
        if (d === 4) setSetup((s) => ({ ...s, angleUnit: 'RAD' }));
        if (d === 5) setSetup((s) => ({ ...s, angleUnit: 'GRA' }));
        if (d === 6) {
          setPopup({ type: 'NONE' });
          setPrompt({ kind: 'FIX_DIGITS', inputBuf: '' });
          return true;
        }
        if (d === 7) {
          setPopup({ type: 'NONE' });
          setPrompt({ kind: 'SCI_DIGITS', inputBuf: '' });
          return true;
        }
        if (d === 8) {
          setPopup({ type: 'NONE' });
          setPrompt({ kind: 'NORM_SELECT', inputBuf: '' });
          return true;
        }
        setPopup({ type: 'NONE' });
      }
      if (popup.page === 2 && d !== null) {
        if (d === 1) setSetup((s) => ({ ...s, fractionMode: 'ab/c' }));
        if (d === 2) setSetup((s) => ({ ...s, fractionMode: 'd/c' }));
        if (d === 3)
          setSetup((s) => ({
            ...s,
            complexFormat: s.complexFormat === 'a+bi' ? 'r<theta' : 'a+bi',
          }));
        if (d === 4)
          setSetup((s) => ({
            ...s,
            statFreq: s.statFreq === 'ON' ? 'OFF' : 'ON',
          }));
        if (d === 5) {
          setPopup({ type: 'NONE' });
          setPrompt({ kind: 'CONTRAST', inputBuf: '' });
          return true;
        }
        setPopup({ type: 'NONE' });
      }
      return true;
    }

    if (popup.type === 'CLR') {
      if (d === 1) setPopup({ type: 'CLR_CONFIRM', target: 'SETUP' });
      if (d === 2) setPopup({ type: 'CLR_CONFIRM', target: 'MEMORY' });
      if (d === 3) setPopup({ type: 'CLR_CONFIRM', target: 'ALL' });
      return true;
    }

    if (popup.type === 'CLR_CONFIRM') {
      if (k === 'EQ') {
        if (popup.target === 'SETUP' || popup.target === 'ALL') setSetup(DEFAULT_SETUP);
        if (popup.target === 'MEMORY' || popup.target === 'ALL') setMemory(DEFAULT_MEMORY);
        if (popup.target === 'ALL') {
          setMode('COMP');
          setAst([]);
          setCursor({ path: [], index: 0 });
          setResult(null);
          setHistory([]);
        }
        setPopup({ type: 'NONE' });
      }
      return true;
    }

    if (popup.type === 'CONST' || popup.type === 'CONV') {
      if (k === 'DEL') {
        setPopup({ ...popup, digits: popup.digits.slice(0, -1) });
        return true;
      }
      if (d !== null) {
        const nextDigits = popup.digits + String(d);
        if (nextDigits.length < 2) {
          setPopup({ ...popup, digits: nextDigits });
        } else {
          const valid =
            popup.type === 'CONST'
              ? SCIENTIFIC_CONSTANTS.find((c) => c.code === nextDigits)
              : UNIT_CONVERSIONS.find((u) => u.code === nextDigits);
          if (valid) {
            const tag = popup.type === 'CONST' ? `[C${nextDigits}]` : `[U${nextDigits}]`;
            setPopup({ type: 'NONE' });
            insertText(tag);
          } else {
            setPopup({ type: 'NONE' });
            setErrorMsg('Syntax ERROR');
          }
        }
      }
      return true;
    }

    if (popup.type === 'DRG') {
      if (d === 1) {
        setPopup({ type: 'NONE' });
        insertText('°');
      } else if (d === 2) {
        setPopup({ type: 'NONE' });
        insertText('×π÷180');
      } else if (d === 3) {
        setPopup({ type: 'NONE' });
        insertText('×9÷10');
      }
      return true;
    }

    if (popup.type === 'CMPLX_OPT') {
      if (d === 1) {
        setPopup({ type: 'NONE' });
        insertText('Arg(');
      } else if (d === 2) {
        setPopup({ type: 'NONE' });
        insertText('Conjg(');
      } else if (d === 3) {
        setPopup({ type: 'NONE' });
        insertText('▸r∠θ');
      } else if (d === 4) {
        setPopup({ type: 'NONE' });
        insertText('▸a+bi');
      }
      return true;
    }

    if (popup.type === 'BASE_OPT') {
      if (d === 1) insertText(' and ');
      if (d === 2) insertText(' or ');
      if (d === 3) insertText(' xor ');
      if (d === 4) insertText(' xnor ');
      if (d === 5) insertText('Not(');
      if (d === 6) insertText('Neg(');
      if (d !== null && d >= 1 && d <= 6) setPopup({ type: 'NONE' });
      return true;
    }

    if (popup.type === 'STAT_TYPE') {
      const map: Record<number, StatType> = {
        1: '1-VAR',
        2: 'A+BX',
        3: '_+CX2',
        4: 'lnX',
        5: 'e^X',
        6: 'A*B^X',
        7: 'A*X^B',
        8: '1/X',
      };
      if (d !== null && map[d]) {
        setStatType(map[d]);
        setPopup({ type: 'NONE' });
        setStatScreen({ stage: 'DATA', cursorRow: 0, cursorCol: 0, inputBuf: '' });
      }
      return true;
    }

    if (popup.type === 'STAT_OPT') {
      if (d === 1) setPopup({ type: 'STAT_TYPE' });
      if (d === 2) {
        setPopup({ type: 'NONE' });
        setStatScreen((s) => ({ ...s, stage: 'DATA' }));
      }
      if (d === 3) setPopup({ type: 'STAT_SUM' });
      if (d === 4) setPopup({ type: 'STAT_VAR' });
      if (d === 5) setPopup({ type: 'STAT_MINMAX' });
      if (d === 6 && statType !== '1-VAR') setPopup({ type: 'STAT_REG' });
      return true;
    }

    if (popup.type === 'STAT_SUM' || popup.type === 'STAT_VAR' || popup.type === 'STAT_MINMAX' || popup.type === 'STAT_REG') {
      if (d === null) return true;
      const summary = computeStatSummary(statRows, statType);
      let val: number | null = null;
      let label = '';
      if (popup.type === 'STAT_SUM') {
        if (d === 1) { val = summary.sumX2; label = '∑x²'; }
        if (d === 2) { val = summary.sumX; label = '∑x'; }
        if (d === 3) { val = summary.sumY2; label = '∑y²'; }
        if (d === 4) { val = summary.sumY; label = '∑y'; }
        if (d === 5) { val = summary.sumXY; label = '∑xy'; }
      } else if (popup.type === 'STAT_VAR') {
        if (d === 1) { val = summary.n; label = 'n'; }
        if (d === 2) { val = summary.meanX; label = 'x̄'; }
        if (d === 3) { val = summary.sigmaX; label = 'σx'; }
        if (d === 4) { val = summary.sX; label = 'sx'; }
        if (d === 5) { val = summary.meanY; label = 'ȳ'; }
        if (d === 6) { val = summary.sigmaY; label = 'σy'; }
      } else if (popup.type === 'STAT_MINMAX') {
        if (d === 1) { val = summary.minX; label = 'minX'; }
        if (d === 2) { val = summary.maxX; label = 'maxX'; }
        if (d === 3) { val = summary.q1; label = 'Q1'; }
        if (d === 4) { val = summary.med; label = 'Med'; }
        if (d === 5) { val = summary.q3; label = 'Q3'; }
      } else if (popup.type === 'STAT_REG') {
        if (d === 1) { val = summary.regA; label = 'A'; }
        if (d === 2) { val = summary.regB; label = 'B'; }
        if (d === 3) { val = summary.regR; label = 'r'; }
        if (d === 4) {
          val = summary.regB !== 0 ? (memory.Ans - summary.regA) / summary.regB : 0;
          label = 'x̂';
        }
        if (d === 5) {
          val = summary.regA + summary.regB * memory.Ans;
          label = 'ŷ';
        }
        if (d === 6) { val = summary.regC; label = 'C'; }
      }
      if (val !== null) {
        setPopup({ type: 'NONE' });
        setStatScreen((s) => ({ ...s, stage: 'CALC' }));
        finalizeEvalResult({ kind: 'real', value: val }, [createTextNode(label)], true);
      }
      return true;
    }

    if (popup.type === 'EQN_SELECT') {
      const map: Record<number, { t: EqnType; count: number }> = {
        1: { t: '2x2', count: 6 },
        2: { t: '3x3', count: 12 },
        3: { t: 'QUAD', count: 3 },
        4: { t: 'CUBIC', count: 4 },
      };
      if (d !== null && map[d]) {
        setPopup({ type: 'NONE' });
        setEqnState({
          stage: 'EDIT',
          eqnType: map[d].t,
          coeffs: Array(map[d].count).fill(0),
          cursorIdx: 0,
          inputBuf: '',
          solutions: [],
          solIdx: 0,
        });
      }
      return true;
    }

    if (popup.type === 'MATRIX_OPT') {
      if (d === 1) setPopup({ type: 'MATRIX_DIM_SELECT' });
      if (d === 2) {
        setPopup({ type: 'NONE' });
        setMatVecEditor({ active: true, kind: 'MATRIX', target: 'A', row: 0, col: 0, inputBuf: '' });
      }
      if (d === 3) { setPopup({ type: 'NONE' }); insertText('MatA'); }
      if (d === 4) { setPopup({ type: 'NONE' }); insertText('MatB'); }
      if (d === 5) { setPopup({ type: 'NONE' }); insertText('MatC'); }
      if (d === 6) { setPopup({ type: 'NONE' }); insertText('MatAns'); }
      if (d === 7) { setPopup({ type: 'NONE' }); insertText('det('); }
      if (d === 8) { setPopup({ type: 'NONE' }); insertText('Trn('); }
      return true;
    }

    if (popup.type === 'MATRIX_DIM_SELECT') {
      const targets: Record<number, 'A' | 'B' | 'C'> = { 1: 'A', 2: 'B', 3: 'C' };
      if (d !== null && targets[d]) {
        setPopup({ type: 'MATRIX_DIM_SIZE', mat: targets[d] });
      }
      return true;
    }

    if (popup.type === 'MATRIX_DIM_SIZE') {
      const dims: Record<number, [number, number]> = {
        1: [3, 3], 2: [3, 2], 3: [3, 1],
        4: [2, 3], 5: [2, 2], 6: [2, 1],
        7: [1, 3], 8: [1, 2], 9: [1, 1],
      };
      if (d !== null && dims[d]) {
        const [r, c] = dims[d];
        const key = `Mat${popup.mat}` as 'MatA' | 'MatB' | 'MatC';
        setMemory((m) => ({ ...m, [key]: createEmptyMatrix(r, c) }));
        setPopup({ type: 'NONE' });
        setMatVecEditor({ active: true, kind: 'MATRIX', target: popup.mat, row: 0, col: 0, inputBuf: '' });
      }
      return true;
    }

    if (popup.type === 'VECTOR_OPT') {
      if (d === 1) setPopup({ type: 'VECTOR_DIM_SELECT' });
      if (d === 2) {
        setPopup({ type: 'NONE' });
        setMatVecEditor({ active: true, kind: 'VECTOR', target: 'A', row: 0, col: 0, inputBuf: '' });
      }
      if (d === 3) { setPopup({ type: 'NONE' }); insertText('VctA'); }
      if (d === 4) { setPopup({ type: 'NONE' }); insertText('VctB'); }
      if (d === 5) { setPopup({ type: 'NONE' }); insertText('VctC'); }
      if (d === 6) { setPopup({ type: 'NONE' }); insertText('VctAns'); }
      if (d === 7) { setPopup({ type: 'NONE' }); insertText('·'); }
      return true;
    }

    if (popup.type === 'VECTOR_DIM_SELECT') {
      const targets: Record<number, 'A' | 'B' | 'C'> = { 1: 'A', 2: 'B', 3: 'C' };
      if (d !== null && targets[d]) {
        setPopup({ type: 'VECTOR_DIM_SIZE', vct: targets[d] });
      }
      return true;
    }

    if (popup.type === 'VECTOR_DIM_SIZE') {
      if (d === 1 || d === 2) {
        const len = d === 1 ? 3 : 2;
        const key = `Vct${popup.vct}` as 'VctA' | 'VctB' | 'VctC';
        setMemory((m) => ({ ...m, [key]: Array(len).fill(0) }));
        setPopup({ type: 'NONE' });
        setMatVecEditor({ active: true, kind: 'VECTOR', target: popup.vct, row: 0, col: 0, inputBuf: '' });
      }
      return true;
    }

    if (popup.type === 'STO_WAIT') {
      const varKey = alphaVarFromKey(k);
      if (varKey) {
        let valToStore = memory.Ans;
        if (ast.length > 0 && !result) {
          try {
            const evalRes = evaluateAst(ast, { mode, setup, memory, baseSystem });
            if (evalRes.kind === 'real') valToStore = evalRes.value;
          } catch {
            // fallback to Ans
          }
        } else if (result?.realVal !== undefined) {
          valToStore = result.realVal;
        }
        setMemory((m) => ({ ...m, [varKey]: valToStore, Ans: valToStore }));
        setPopup({ type: 'NONE' });
        setResult({
          kind: 'real',
          realVal: valToStore,
          exact: toExactResult(valToStore),
          showDecimal: false,
          engShift: 0,
          dmsMode: false,
          factActive: false,
        });
      }
      return true;
    }

    if (popup.type === 'RCL_WAIT') {
      const varKey = alphaVarFromKey(k);
      if (varKey) {
        const val = memory[varKey] as number;
        setPopup({ type: 'NONE' });
        resetForNewExpr([createTextNode(varKey)]);
        setResult({
          kind: 'real',
          realVal: val,
          exact: toExactResult(val),
          showDecimal: false,
          engShift: 0,
          dmsMode: false,
          factActive: false,
        });
      }
      return true;
    }

    if (popup.type === 'HYP_WAIT') {
      setPopup({ type: 'NONE' });
      const wasShift = shift;
      setShift(false);
      if (k === 'SIN') insertText(wasShift ? 'sinh⁻¹(' : 'sinh(');
      else if (k === 'COS') insertText(wasShift ? 'cosh⁻¹(' : 'cosh(');
      else if (k === 'TAN') insertText(wasShift ? 'tanh⁻¹(' : 'tanh(');
      return true;
    }

    return false;
  };

  const handlePromptKey = (k: KeyId): boolean => {
    const d = digitFromKey(k);
    if (k === 'AC') {
      setPrompt({ kind: 'NONE', inputBuf: '' });
      return true;
    }
    if (prompt.kind === 'FIX_DIGITS' && d !== null) {
      setSetup((s) => ({ ...s, displayFormat: 'FIX', fixDigits: d }));
      setPrompt({ kind: 'NONE', inputBuf: '' });
      return true;
    }
    if (prompt.kind === 'SCI_DIGITS' && d !== null) {
      setSetup((s) => ({ ...s, displayFormat: 'SCI', sciDigits: d === 0 ? 10 : d }));
      setPrompt({ kind: 'NONE', inputBuf: '' });
      return true;
    }
    if (prompt.kind === 'NORM_SELECT' && (d === 1 || d === 2)) {
      setSetup((s) => ({ ...s, displayFormat: d === 1 ? 'NORM1' : 'NORM2' }));
      setPrompt({ kind: 'NONE', inputBuf: '' });
      return true;
    }
    if (prompt.kind === 'CONTRAST') {
      if (k === 'LEFT') setSetup((s) => ({ ...s, contrast: Math.max(0, s.contrast - 1) }));
      if (k === 'RIGHT') setSetup((s) => ({ ...s, contrast: Math.min(10, s.contrast + 1) }));
      if (k === 'EQ') setPrompt({ kind: 'NONE', inputBuf: '' });
      return true;
    }
    if (prompt.kind === 'SOLVE_RESULT') {
      if (k === 'EQ' || k === 'LEFT') setPrompt({ kind: 'NONE', inputBuf: '' });
      return true;
    }
    if (prompt.kind === 'CALC_VAR' || prompt.kind === 'SOLVE_X') {
      if (d !== null) {
        setPrompt((p) => ({ ...p, inputBuf: p.inputBuf + String(d) }));
        return true;
      }
      if (k === 'DOT') {
        setPrompt((p) => ({ ...p, inputBuf: p.inputBuf.includes('.') ? p.inputBuf : p.inputBuf + '.' }));
        return true;
      }
      if (k === 'NEG' || k === 'SUB') {
        setPrompt((p) => ({
          ...p,
          inputBuf: p.inputBuf.startsWith('-') ? p.inputBuf.slice(1) : '-' + p.inputBuf,
        }));
        return true;
      }
      if (k === 'DEL') {
        setPrompt((p) => ({ ...p, inputBuf: p.inputBuf.slice(0, -1) }));
        return true;
      }
      if (k === 'EQ') {
        const parsed = prompt.inputBuf === '' ? 0 : parseFloat(prompt.inputBuf);
        if (Number.isNaN(parsed)) {
          setErrorMsg('Syntax ERROR');
          setPrompt({ kind: 'NONE', inputBuf: '' });
          return true;
        }
        if (prompt.kind === 'SOLVE_X') {
          const { lhs, rhs } = splitEquationOnEquals(ast);
          try {
            const solved = solveForX(lhs, rhs, parsed, { mode, setup, memory });
            setMemory((m) => ({ ...m, X: solved.root, Ans: solved.root }));
            setPrompt({
              kind: 'SOLVE_RESULT',
              inputBuf: '',
              solveRoot: solved.root,
              solveResidual: solved.residual,
            });
          } catch (err) {
            setPrompt({ kind: 'NONE', inputBuf: '' });
            setErrorMsg(err instanceof CalcError ? err.code : "Can't Solve");
          }
          return true;
        }

        // CALC_VAR
        const varName = prompt.varName!;
        const updatedMem = { ...memory, [varName]: parsed };
        setMemory(updatedMem);
        const list = prompt.varList ?? [];
        const nextIdx = (prompt.varIndex ?? 0) + 1;
        if (nextIdx < list.length) {
          const nextVar = list[nextIdx];
          const curVal = updatedMem[nextVar as keyof MemoryBank] as number;
          setPrompt({
            kind: 'CALC_VAR',
            varName: nextVar,
            varList: list,
            varIndex: nextIdx,
            inputBuf: String(curVal ?? 0),
          });
        } else {
          setPrompt({ kind: 'NONE', inputBuf: '' });
          runCurrentExpression(false, updatedMem);
        }
        return true;
      }
      return true;
    }
    return false;
  };

  const handleEqnModeKey = (k: KeyId): boolean => {
    const d = digitFromKey(k);
    if (eqnState.stage === 'RESULT') {
      if (k === 'UP') {
        setEqnState((e) => ({
          ...e,
          solIdx: (e.solIdx - 1 + e.solutions.length) % Math.max(1, e.solutions.length),
        }));
      } else if (k === 'DOWN' || k === 'EQ') {
        if (k === 'EQ' && eqnState.solIdx === eqnState.solutions.length - 1) {
          setEqnState((e) => ({ ...e, stage: 'EDIT', cursorIdx: 0, inputBuf: '', specialMsg: undefined }));
        } else {
          setEqnState((e) => ({
            ...e,
            solIdx: (e.solIdx + 1) % Math.max(1, e.solutions.length),
          }));
        }
      } else if (k === 'AC') {
        setEqnState((e) => ({ ...e, stage: 'EDIT', cursorIdx: 0, inputBuf: '', specialMsg: undefined }));
      }
      return true;
    }

    // Coefficient Editor
    if (d !== null) {
      setEqnState((e) => ({ ...e, inputBuf: e.inputBuf + String(d) }));
      return true;
    }
    if (k === 'DOT') {
      setEqnState((e) => ({ ...e, inputBuf: e.inputBuf.includes('.') ? e.inputBuf : e.inputBuf + '.' }));
      return true;
    }
    if (k === 'NEG' || k === 'SUB') {
      setEqnState((e) => ({
        ...e,
        inputBuf: e.inputBuf.startsWith('-') ? e.inputBuf.slice(1) : '-' + e.inputBuf,
      }));
      return true;
    }
    if (k === 'DEL') {
      setEqnState((e) => ({ ...e, inputBuf: e.inputBuf.slice(0, -1) }));
      return true;
    }
    if (k === 'LEFT') {
      setEqnState((e) => ({
        ...e,
        cursorIdx: (e.cursorIdx - 1 + e.coeffs.length) % e.coeffs.length,
        inputBuf: '',
      }));
      return true;
    }
    if (k === 'RIGHT') {
      setEqnState((e) => ({
        ...e,
        cursorIdx: (e.cursorIdx + 1) % e.coeffs.length,
        inputBuf: '',
      }));
      return true;
    }
    if (k === 'AC') {
      setEqnState((e) => ({ ...e, inputBuf: '' }));
      return true;
    }
    if (k === 'EQ') {
      const nextCoeffs = [...eqnState.coeffs];
      if (eqnState.inputBuf !== '') {
        const val = parseFloat(eqnState.inputBuf);
        if (!Number.isNaN(val)) nextCoeffs[eqnState.cursorIdx] = val;
      }
      if (eqnState.cursorIdx + 1 < nextCoeffs.length) {
        setEqnState((e) => ({
          ...e,
          coeffs: nextCoeffs,
          cursorIdx: e.cursorIdx + 1,
          inputBuf: '',
        }));
      } else {
        // Solve!
        if (eqnState.eqnType === '2x2') {
          const sol = solveLinear2x2(nextCoeffs);
          if (sol === 'NO_SOL' || sol === 'INF_SOL') {
            setEqnState((e) => ({
              ...e,
              coeffs: nextCoeffs,
              stage: 'RESULT',
              specialMsg: sol === 'NO_SOL' ? 'Sin solución' : 'Infinitas soluciones',
              solutions: [],
              solIdx: 0,
            }));
          } else {
            setEqnState((e) => ({ ...e, coeffs: nextCoeffs, stage: 'RESULT', solutions: sol, solIdx: 0, specialMsg: undefined }));
          }
        } else if (eqnState.eqnType === '3x3') {
          const sol = solveLinear3x3(nextCoeffs);
          if (sol === 'NO_SOL' || sol === 'INF_SOL') {
            setEqnState((e) => ({
              ...e,
              coeffs: nextCoeffs,
              stage: 'RESULT',
              specialMsg: 'Sin solución única',
              solutions: [],
              solIdx: 0,
            }));
          } else {
            setEqnState((e) => ({ ...e, coeffs: nextCoeffs, stage: 'RESULT', solutions: sol, solIdx: 0, specialMsg: undefined }));
          }
        } else if (eqnState.eqnType === 'QUAD') {
          const sol = solveQuadratic(nextCoeffs[0], nextCoeffs[1], nextCoeffs[2]);
          setEqnState((e) => ({ ...e, coeffs: nextCoeffs, stage: 'RESULT', solutions: sol, solIdx: 0, specialMsg: undefined }));
        } else {
          const sol = solveCubic(nextCoeffs[0], nextCoeffs[1], nextCoeffs[2], nextCoeffs[3]);
          setEqnState((e) => ({ ...e, coeffs: nextCoeffs, stage: 'RESULT', solutions: sol, solIdx: 0, specialMsg: undefined }));
        }
      }
      return true;
    }
    return false;
  };

  const handleStatDataKey = (k: KeyId): boolean => {
    const d = digitFromKey(k);
    const hasY = statType !== '1-VAR';
    const hasFreq = setup.statFreq === 'ON';

    if (k === 'AC') {
      setStatScreen((s) => ({ ...s, stage: 'CALC', inputBuf: '' }));
      return true;
    }
    if (d !== null) {
      setStatScreen((s) => ({ ...s, inputBuf: s.inputBuf + String(d) }));
      return true;
    }
    if (k === 'DOT') {
      setStatScreen((s) => ({ ...s, inputBuf: s.inputBuf.includes('.') ? s.inputBuf : s.inputBuf + '.' }));
      return true;
    }
    if (k === 'NEG' || k === 'SUB') {
      setStatScreen((s) => ({
        ...s,
        inputBuf: s.inputBuf.startsWith('-') ? s.inputBuf.slice(1) : '-' + s.inputBuf,
      }));
      return true;
    }
    if (k === 'DEL') {
      if (statScreen.inputBuf !== '') {
        setStatScreen((s) => ({ ...s, inputBuf: s.inputBuf.slice(0, -1) }));
      } else if (statRows.length > 1 && statScreen.cursorRow < statRows.length) {
        setStatRows((rows) => rows.filter((_, i) => i !== statScreen.cursorRow));
      }
      return true;
    }
    if (k === 'UP') {
      setStatScreen((s) => ({ ...s, cursorRow: Math.max(0, s.cursorRow - 1), inputBuf: '' }));
      return true;
    }
    if (k === 'DOWN') {
      setStatScreen((s) => ({ ...s, cursorRow: Math.min(statRows.length, s.cursorRow + 1), inputBuf: '' }));
      return true;
    }
    if (k === 'RIGHT' || k === 'LEFT') {
      const cols: Array<0 | 1 | 2> = [0];
      if (hasY) cols.push(1);
      if (hasFreq) cols.push(2);
      const pos = cols.indexOf(statScreen.cursorCol);
      const nextPos = k === 'RIGHT' ? (pos + 1) % cols.length : (pos - 1 + cols.length) % cols.length;
      setStatScreen((s) => ({ ...s, cursorCol: cols[nextPos], inputBuf: '' }));
      return true;
    }
    if (k === 'EQ') {
      const val = statScreen.inputBuf === '' ? 0 : parseFloat(statScreen.inputBuf);
      if (Number.isNaN(val)) return true;
      setStatRows((prev) => {
        const next = [...prev];
        while (next.length <= statScreen.cursorRow) {
          next.push({ x: 0, y: 0, freq: 1 });
        }
        const row = { ...next[statScreen.cursorRow] };
        if (statScreen.cursorCol === 0) row.x = val;
        else if (statScreen.cursorCol === 1) row.y = val;
        else row.freq = Math.max(0, val);
        next[statScreen.cursorRow] = row;
        return next;
      });
      setStatScreen((s) => ({ ...s, cursorRow: s.cursorRow + 1, inputBuf: '' }));
      return true;
    }
    return false;
  };

  const handleMatVecEditorKey = (k: KeyId): boolean => {
    const d = digitFromKey(k);
    if (k === 'AC') {
      setMatVecEditor((e) => ({ ...e, active: false, inputBuf: '' }));
      return true;
    }
    if (d !== null) {
      setMatVecEditor((e) => ({ ...e, inputBuf: e.inputBuf + String(d) }));
      return true;
    }
    if (k === 'DOT') {
      setMatVecEditor((e) => ({ ...e, inputBuf: e.inputBuf.includes('.') ? e.inputBuf : e.inputBuf + '.' }));
      return true;
    }
    if (k === 'NEG' || k === 'SUB') {
      setMatVecEditor((e) => ({
        ...e,
        inputBuf: e.inputBuf.startsWith('-') ? e.inputBuf.slice(1) : '-' + e.inputBuf,
      }));
      return true;
    }
    if (k === 'DEL') {
      setMatVecEditor((e) => ({ ...e, inputBuf: e.inputBuf.slice(0, -1) }));
      return true;
    }

    if (matVecEditor.kind === 'MATRIX') {
      const matKey = `Mat${matVecEditor.target}` as 'MatA' | 'MatB' | 'MatC';
      const mat = memory[matKey];
      const rows = mat.length;
      const cols = mat[0]?.length ?? 1;

      if (k === 'LEFT') {
        setMatVecEditor((e) => ({ ...e, col: (e.col - 1 + cols) % cols, inputBuf: '' }));
        return true;
      }
      if (k === 'RIGHT') {
        setMatVecEditor((e) => ({ ...e, col: (e.col + 1) % cols, inputBuf: '' }));
        return true;
      }
      if (k === 'UP') {
        setMatVecEditor((e) => ({ ...e, row: (e.row - 1 + rows) % rows, inputBuf: '' }));
        return true;
      }
      if (k === 'DOWN') {
        setMatVecEditor((e) => ({ ...e, row: (e.row + 1) % rows, inputBuf: '' }));
        return true;
      }
      if (k === 'EQ') {
        const val = matVecEditor.inputBuf === '' ? mat[matVecEditor.row][matVecEditor.col] : parseFloat(matVecEditor.inputBuf);
        if (!Number.isNaN(val)) {
          const copy = mat.map((r) => [...r]);
          copy[matVecEditor.row][matVecEditor.col] = val;
          setMemory((m) => ({ ...m, [matKey]: copy }));
        }
        const nextCol = (matVecEditor.col + 1) % cols;
        const nextRow = nextCol === 0 ? (matVecEditor.row + 1) % rows : matVecEditor.row;
        setMatVecEditor((e) => ({ ...e, row: nextRow, col: nextCol, inputBuf: '' }));
        return true;
      }
    } else {
      const vctKey = `Vct${matVecEditor.target}` as 'VctA' | 'VctB' | 'VctC';
      const vct = memory[vctKey];
      const len = vct.length;
      if (k === 'LEFT') {
        setMatVecEditor((e) => ({ ...e, col: (e.col - 1 + len) % len, inputBuf: '' }));
        return true;
      }
      if (k === 'RIGHT') {
        setMatVecEditor((e) => ({ ...e, col: (e.col + 1) % len, inputBuf: '' }));
        return true;
      }
      if (k === 'EQ') {
        const val = matVecEditor.inputBuf === '' ? vct[matVecEditor.col] : parseFloat(matVecEditor.inputBuf);
        if (!Number.isNaN(val)) {
          const copy = [...vct];
          copy[matVecEditor.col] = val;
          setMemory((m) => ({ ...m, [vctKey]: copy }));
        }
        setMatVecEditor((e) => ({ ...e, col: (e.col + 1) % len, inputBuf: '' }));
        return true;
      }
    }
    return false;
  };

  const handleTableKey = (k: KeyId): boolean => {
    const d = digitFromKey(k);
    if (tableState.stage === 'VIEW') {
      if (k === 'UP') {
        setTableState((t) => ({ ...t, scrollRow: Math.max(0, t.scrollRow - 1) }));
        return true;
      }
      if (k === 'DOWN') {
        setTableState((t) => ({
          ...t,
          scrollRow: Math.min(Math.max(0, t.rows.length - 3), t.scrollRow + 1),
        }));
        return true;
      }
      if (k === 'AC') {
        setTableState((t) => ({ ...t, stage: 'FX' }));
        setAst(cloneAstList(tableFx));
        setCursor({ path: [], index: tableFx.length });
        return true;
      }
      return true;
    }

    if (tableState.stage === 'FX' || tableState.stage === 'GX') {
      if (k === 'EQ') {
        if (tableState.stage === 'FX') {
          if (ast.length === 0) return true;
          setTableFx(cloneAstList(ast));
          setAst(cloneAstList(tableGx));
          setCursor({ path: [], index: tableGx.length });
          setTableState((t) => ({ ...t, stage: 'GX' }));
          return true;
        } else {
          setTableGx(cloneAstList(ast));
          setTableState((t) => ({ ...t, stage: 'START', inputBuf: String(t.start) }));
          return true;
        }
      }
      return false; // Let normal expression keys edit f(X)/g(X)
    }

    // START / END / STEP numeric buffer
    if (d !== null) {
      setTableState((t) => ({ ...t, inputBuf: t.inputBuf + String(d) }));
      return true;
    }
    if (k === 'DOT') {
      setTableState((t) => ({ ...t, inputBuf: t.inputBuf.includes('.') ? t.inputBuf : t.inputBuf + '.' }));
      return true;
    }
    if (k === 'NEG' || k === 'SUB') {
      setTableState((t) => ({
        ...t,
        inputBuf: t.inputBuf.startsWith('-') ? t.inputBuf.slice(1) : '-' + t.inputBuf,
      }));
      return true;
    }
    if (k === 'DEL') {
      setTableState((t) => ({ ...t, inputBuf: t.inputBuf.slice(0, -1) }));
      return true;
    }
    if (k === 'AC') {
      setTableState((t) => ({ ...t, stage: 'FX' }));
      setAst(cloneAstList(tableFx));
      setCursor({ path: [], index: tableFx.length });
      return true;
    }
    if (k === 'EQ') {
      const val = parseFloat(tableState.inputBuf || '0');
      if (Number.isNaN(val)) return true;
      if (tableState.stage === 'START') {
        setTableState((t) => ({ ...t, start: val, stage: 'END', inputBuf: String(t.end) }));
      } else if (tableState.stage === 'END') {
        setTableState((t) => ({ ...t, end: val, stage: 'STEP', inputBuf: String(t.step) }));
      } else if (tableState.stage === 'STEP') {
        const step = val === 0 ? 1 : Math.abs(val);
        const start = tableState.start;
        const end = tableState.end;
        const rows: TableScreenState['rows'] = [];
        const dir = end >= start ? 1 : -1;
        let x = start;
        let count = 0;
        while ((dir > 0 ? x <= end + 1e-10 : x >= end - 1e-10) && count < 60) {
          const cleanX = Number(x.toPrecision(10));
          let fxOut: number | string = 'Error';
          let gxOut: number | string | undefined = undefined;
          try {
            const ev = evaluateAst(tableFx, { mode: 'COMP', setup, memory, xOverride: cleanX });
            if (ev.kind === 'real') fxOut = ev.value;
          } catch {
            fxOut = 'Error';
          }
          if (tableGx.length > 0) {
            try {
              const evg = evaluateAst(tableGx, { mode: 'COMP', setup, memory, xOverride: cleanX });
              if (evg.kind === 'real') gxOut = evg.value;
            } catch {
              gxOut = 'Error';
            }
          }
          rows.push({ x: cleanX, fx: fxOut, gx: gxOut });
          x += dir * step;
          count += 1;
        }
        setTableState((t) => ({ ...t, step, stage: 'VIEW', rows, scrollRow: 0, inputBuf: '' }));
      }
      return true;
    }
    return true;
  };

  const handleKeyPress = useCallback(
    (k: KeyId) => {
      playClick();
      flashKey(k);

      if (!isOn) {
        if (k === 'ON') {
          setIsOn(true);
          setShift(false);
          setAlpha(false);
        }
        return;
      }

      if (k === 'ON') {
        setShift(false);
        setAlpha(false);
        setErrorMsg(null);
        setPopup({ type: 'NONE' });
        setPrompt({ kind: 'NONE', inputBuf: '' });
        resetForNewExpr([]);
        return;
      }

      // Error screen handling
      if (errorMsg) {
        if (k === 'AC') {
          setErrorMsg(null);
          resetForNewExpr([]);
        } else if (k === 'LEFT' || k === 'RIGHT') {
          setErrorMsg(null);
        }
        return;
      }

      // Modifiers
      if (k === 'SHIFT') {
        setShift((s) => !s);
        setAlpha(false);
        return;
      }
      if (k === 'ALPHA') {
        setAlpha((a) => !a);
        setShift(false);
        return;
      }

      // Global SHIFT shortcuts that work anytime
      if (shift && k === 'AC') {
        setShift(false);
        setIsOn(false);
        return;
      }
      if (shift && k === 'MODE') {
        setShift(false);
        setPopup({ type: 'SETUP', page: 1 });
        return;
      }
      if (!shift && !alpha && k === 'MODE') {
        setPopup({ type: 'MODE' });
        return;
      }
      if (shift && k === '9') {
        setShift(false);
        setPopup({ type: 'CLR' });
        return;
      }

      // Delegate to active popup menu
      if (popup.type !== 'NONE') {
        if (handlePopupKey(k)) {
          if (popup.type !== 'HYP_WAIT') setShift(false);
          setAlpha(false);
          return;
        }
      }

      // Delegate to active prompt
      if (prompt.kind !== 'NONE') {
        if (handlePromptKey(k)) return;
      }

      // Mode-specific SHIFT+1/4/5 menu access even while inside data/matrix/vector editors
      if (shift && k === '1' && mode === 'STAT') {
        setShift(false);
        setPopup({ type: 'STAT_OPT' });
        return;
      }
      if (shift && k === '4' && mode === 'MATRIX') {
        setShift(false);
        setMatVecEditor((e) => ({ ...e, active: false }));
        setPopup({ type: 'MATRIX_OPT' });
        return;
      }
      if (shift && k === '5' && mode === 'VECTOR') {
        setShift(false);
        setMatVecEditor((e) => ({ ...e, active: false }));
        setPopup({ type: 'VECTOR_OPT' });
        return;
      }

      // Mode-specific screen handlers
      if (mode === 'EQN') {
        if (handleEqnModeKey(k)) return;
      }
      if (mode === 'STAT' && statScreen.stage === 'DATA') {
        if (handleStatDataKey(k)) return;
      }
      if ((mode === 'MATRIX' || mode === 'VECTOR') && matVecEditor.active) {
        if (handleMatVecEditorKey(k)) return;
      }
      if (mode === 'TABLE') {
        if (handleTableKey(k)) return;
      }

      const wasShift = shift;
      const wasAlpha = alpha;
      setShift(false);
      setAlpha(false);

      // Mode-specific SHIFT+1/2/3/4/5 & CONST/CONV
      if (wasShift && k === '7') {
        setPopup({ type: 'CONST', digits: '' });
        return;
      }
      if (wasShift && k === '8') {
        setPopup({ type: 'CONV', digits: '' });
        return;
      }
      if (wasShift && k === '1' && mode === 'STAT') {
        setPopup({ type: 'STAT_OPT' });
        return;
      }
      if (wasShift && k === '2' && mode === 'CMPLX') {
        setPopup({ type: 'CMPLX_OPT' });
        return;
      }
      if (wasShift && k === '3' && mode === 'BASE') {
        setPopup({ type: 'BASE_OPT' });
        return;
      }
      if (wasShift && k === '4' && mode === 'MATRIX') {
        setPopup({ type: 'MATRIX_OPT' });
        return;
      }
      if (wasShift && k === '5' && mode === 'VECTOR') {
        setPopup({ type: 'VECTOR_OPT' });
        return;
      }
      if (wasShift && k === 'ANS') {
        setPopup({ type: 'DRG' });
        return;
      }
      if (wasShift && k === 'RCL') {
        setPopup({ type: 'STO_WAIT' });
        return;
      }
      if (!wasShift && !wasAlpha && k === 'RCL') {
        setPopup({ type: 'RCL_WAIT' });
        return;
      }
      if (wasShift && k === 'DEL') {
        setInsertMode((m) => !m);
        return;
      }

      // ALPHA variables & letters
      if (wasAlpha) {
        if (k === 'CALC') { insertText('='); return; }
        if (k === 'NEG') { insertText('A'); return; }
        if (k === 'DMS') { insertText('B'); return; }
        if (k === 'HYP') { insertText('C'); return; }
        if (k === 'SIN') { insertText('D'); return; }
        if (k === 'COS') { insertText('E'); return; }
        if (k === 'TAN') { insertText('F'); return; }
        if (k === 'RPAREN') { insertText('X'); return; }
        if (k === 'SD') { insertText('Y'); return; }
        if (k === 'MPLUS') { insertText('M'); return; }
        if (k === 'EXP10') { insertText('e'); return; }
        if (k === 'DOT') { insertText('RanInt#('); return; }
        if (k === 'ENG' && mode === 'CMPLX') { insertText('𝐢'); return; }
      }

      // BASE-N base switching keys (x², x^□, log, ln -> DEC, HEX, BIN, OCT) & A-F hex digits
      if (mode === 'BASE') {
        if (!wasShift && k === 'X2') { setBaseSystem('DEC'); return; }
        if (!wasShift && k === 'POW') { setBaseSystem('HEX'); return; }
        if (!wasShift && k === 'LOG') { setBaseSystem('BIN'); return; }
        if (!wasShift && k === 'LN') { setBaseSystem('OCT'); return; }
        if (baseSystem === 'HEX') {
          const hexMap: Partial<Record<KeyId, string>> = {
            NEG: 'A', DMS: 'B', HYP: 'C', SIN: 'D', COS: 'E', TAN: 'F',
          };
          if (hexMap[k]) {
            insertText(hexMap[k]!);
            return;
          }
        }
      }

      // Navigation & Editing
      if (k === 'AC') {
        resetForNewExpr([]);
        return;
      }
      if (k === 'DEL') {
        if (result) {
          setResult(null);
          return;
        }
        const res = deleteBeforeCursor(ast, cursor);
        setAst(res.ast);
        setCursor(res.cursor);
        return;
      }
      if (k === 'LEFT') {
        if (result) {
          setResult(null);
          setCursor({ path: [], index: ast.length });
        } else {
          setCursor(moveCursorLeft(ast, cursor));
        }
        return;
      }
      if (k === 'RIGHT') {
        if (result) {
          setResult(null);
          setCursor({ path: [], index: 0 });
        } else {
          setCursor(moveCursorRight(ast, cursor));
        }
        return;
      }
      if (k === 'UP') {
        if (result || ast.length === 0) {
          if (history.length > 0) {
            const nextIdx = Math.min(history.length - 1, historyNavIdx + 1);
            const item = history[nextIdx];
            setHistoryNavIdx(nextIdx);
            setAst(cloneAstList(item.inputAst));
            setCursor({ path: [], index: item.inputAst.length });
            setResult(null);
          }
        } else {
          setCursor(moveCursorUpDown(ast, cursor, 'UP'));
        }
        return;
      }
      if (k === 'DOWN') {
        if (historyNavIdx > 0) {
          const nextIdx = historyNavIdx - 1;
          const item = history[nextIdx];
          setHistoryNavIdx(nextIdx);
          setAst(cloneAstList(item.inputAst));
          setCursor({ path: [], index: item.inputAst.length });
          setResult(null);
        } else if (historyNavIdx === 0) {
          setHistoryNavIdx(-1);
          resetForNewExpr([]);
        } else {
          setCursor(moveCursorUpDown(ast, cursor, 'DOWN'));
        }
        return;
      }

      // S<=>D, ENG, DMS/FACT, M+, CALC/SOLVE, =
      if (k === 'SD') {
        if (result) {
          if (wasShift) {
            setSetup((s) => ({ ...s, fractionMode: s.fractionMode === 'ab/c' ? 'd/c' : 'ab/c' }));
            setResult((r) => (r ? { ...r, showDecimal: false, engShift: 0, dmsMode: false, factActive: false } : null));
          } else {
            setResult((r) =>
              r
                ? {
                    ...r,
                    showDecimal: !r.showDecimal,
                    engShift: 0,
                    dmsMode: false,
                    factActive: false,
                  }
                : null
            );
          }
        }
        return;
      }

      if (k === 'ENG') {
        if (mode === 'CMPLX' && !wasShift) {
          insertText('𝐢');
          return;
        }
        if (result && result.kind === 'real') {
          setResult((r) =>
            r ? { ...r, engShift: r.engShift + (wasShift ? 1 : -1), showDecimal: true, dmsMode: false } : null
          );
        }
        return;
      }

      if (k === 'DMS') {
        if (wasShift && result?.kind === 'real') {
          if (result.factText) {
            setResult((r) => (r ? { ...r, factActive: !r.factActive } : null));
          }
          return;
        }
        if (!wasShift && result?.kind === 'real') {
          setResult((r) => (r ? { ...r, dmsMode: !r.dmsMode } : null));
          return;
        }
        if (!wasShift) insertText('°');
        return;
      }

      if (k === 'MPLUS') {
        let delta = result?.realVal ?? 0;
        if (!result && ast.length > 0) {
          try {
            const ev = evaluateAst(ast, { mode, setup, memory, baseSystem });
            if (ev.kind === 'real') delta = ev.value;
          } catch {
            setErrorMsg('Syntax ERROR');
            return;
          }
        }
        const sign = wasShift ? -1 : 1;
        setMemory((m) => ({ ...m, M: m.M + sign * delta, Ans: delta }));
        if (!result && ast.length > 0) {
          runCurrentExpression(false, { ...memory, M: memory.M + sign * delta });
        }
        return;
      }

      if (k === 'CALC') {
        if (wasShift) {
          // SOLVE
          if (ast.length === 0) return;
          setPrompt({ kind: 'SOLVE_X', inputBuf: String(memory.X) });
          return;
        }
        // CALC
        const vars = collectAstVariables(ast);
        if (vars.length === 0) {
          runCurrentExpression(false);
        } else {
          const firstVar = vars[0];
          setPrompt({
            kind: 'CALC_VAR',
            varName: firstVar,
            varList: vars,
            varIndex: 0,
            inputBuf: String(memory[firstVar as keyof MemoryBank] ?? 0),
          });
        }
        return;
      }

      if (k === 'EQ') {
        runCurrentExpression(wasShift);
        return;
      }

      // Special Functions & Natural Templates
      if (k === 'FRAC') {
        if (wasShift) {
          insertTemplateNode({ id: genId(), type: 'mixedFrac', whole: [], num: [], den: [] }, 'whole');
        } else {
          insertTemplateNode({ id: genId(), type: 'frac', num: [], den: [] }, 'num', true);
        }
        return;
      }
      if (k === 'SQRT') {
        if (wasShift) {
          insertTemplateNode({ id: genId(), type: 'cbrt', inner: [] }, 'inner');
        } else {
          insertTemplateNode({ id: genId(), type: 'sqrt', inner: [] }, 'inner');
        }
        return;
      }
      if (k === 'X2') {
        insertTemplateNode(
          { id: genId(), type: 'pow', base: [], exp: [createTextNode(wasShift ? '3' : '2')] },
          'base',
          true
        );
        return;
      }
      if (k === 'POW') {
        if (wasShift) {
          insertTemplateNode({ id: genId(), type: 'nthRoot', index: [], inner: [] }, 'index');
        } else {
          insertTemplateNode({ id: genId(), type: 'pow', base: [], exp: [] }, 'exp', true);
        }
        return;
      }
      if (k === 'INV') {
        if (wasShift) {
          insertText('!');
        } else {
          insertTemplateNode(
            { id: genId(), type: 'pow', base: [], exp: [createTextNode('-1')] },
            'base',
            true
          );
        }
        return;
      }
      if (k === 'LOG') {
        if (wasShift) {
          insertTemplateNode({ id: genId(), type: 'pow', base: [createTextNode('10')], exp: [] }, 'exp');
        } else {
          insertText('log(');
        }
        return;
      }
      if (k === 'LN') {
        if (wasShift) {
          insertTemplateNode({ id: genId(), type: 'pow', base: [createTextNode('e')], exp: [] }, 'exp');
        } else {
          insertText('ln(');
        }
        return;
      }
      if (k === 'LOGBASE') {
        if (wasShift) {
          insertTemplateNode({ id: genId(), type: 'sum', expr: [], lower: [], upper: [] }, 'expr');
        } else {
          insertTemplateNode({ id: genId(), type: 'logBase', base: [], inner: [] }, 'base');
        }
        return;
      }
      if (k === 'INTEGRAL') {
        if (wasShift) {
          insertTemplateNode({ id: genId(), type: 'deriv', expr: [], at: [] }, 'expr');
        } else {
          insertTemplateNode({ id: genId(), type: 'integral', expr: [], lower: [], upper: [] }, 'expr');
        }
        return;
      }
      if (k === 'HYP') {
        if (wasShift) {
          insertTemplateNode({ id: genId(), type: 'abs', inner: [] }, 'inner');
        } else {
          setPopup({ type: 'HYP_WAIT' });
        }
        return;
      }
      if (k === 'SIN') { insertText(wasShift ? 'sin⁻¹(' : 'sin('); return; }
      if (k === 'COS') { insertText(wasShift ? 'cos⁻¹(' : 'cos('); return; }
      if (k === 'TAN') { insertText(wasShift ? 'tan⁻¹(' : 'tan('); return; }
      if (k === 'LPAREN') { insertText(wasShift ? '%' : '('); return; }
      if (k === 'RPAREN') { insertText(wasShift ? ',' : ')'); return; }
      if (k === 'NEG') { insertText(wasShift && mode === 'CMPLX' ? '∠' : '-'); return; }

      // Numeric & Basic Operators
      if (/^[0-9]$/.test(k)) {
        if (wasShift && k === '0') { insertText('Rnd('); return; }
        insertText(k);
        return;
      }
      if (k === 'DOT') {
        if (wasShift) { insertText('Ran#'); return; }
        insertText('.');
        return;
      }
      if (k === 'EXP10') {
        if (wasShift) { insertText('π'); return; }
        insertText('×10^');
        return;
      }
      if (k === 'ANS') {
        insertText(mode === 'MATRIX' ? 'MatAns' : mode === 'VECTOR' ? 'VctAns' : 'Ans');
        return;
      }
      if (k === 'ADD') { insertText(wasShift ? 'Pol(' : '+'); return; }
      if (k === 'SUB') { insertText(wasShift ? 'Rec(' : '-'); return; }
      if (k === 'MUL') { insertText(wasShift ? 'nPr' : '×'); return; }
      if (k === 'DIV') { insertText(wasShift ? 'nCr' : '÷'); return; }
    },
    [
      isOn,
      errorMsg,
      shift,
      alpha,
      popup,
      prompt,
      mode,
      baseSystem,
      ast,
      cursor,
      result,
      setup,
      memory,
      history,
      historyNavIdx,
      eqnState,
      statScreen,
      statRows,
      statType,
      matVecEditor,
      tableState,
      tableFx,
      tableGx,
      playClick,
    ]
  );

  // Physical Keyboard Support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      const k = e.key;
      if (k >= '0' && k <= '9') { handleKeyPress(k as KeyId); return; }
      if (k === '.') { handleKeyPress('DOT'); return; }
      if (k === '+') { handleKeyPress('ADD'); return; }
      if (k === '-') { handleKeyPress('SUB'); return; }
      if (k === '*') { handleKeyPress('MUL'); return; }
      if (k === '/') { e.preventDefault(); handleKeyPress('DIV'); return; }
      if (k === '^') { handleKeyPress('POW'); return; }
      if (k === '(') { handleKeyPress('LPAREN'); return; }
      if (k === ')') { handleKeyPress('RPAREN'); return; }
      if (k === ',') { setShift(true); handleKeyPress('RPAREN'); return; }
      if (k === 'Enter' || k === '=') { e.preventDefault(); handleKeyPress('EQ'); return; }
      if (k === 'Backspace') { e.preventDefault(); handleKeyPress('DEL'); return; }
      if (k === 'Escape') { e.preventDefault(); handleKeyPress('AC'); return; }
      if (k === 'ArrowLeft') { e.preventDefault(); handleKeyPress('LEFT'); return; }
      if (k === 'ArrowRight') { e.preventDefault(); handleKeyPress('RIGHT'); return; }
      if (k === 'ArrowUp') { e.preventDefault(); handleKeyPress('UP'); return; }
      if (k === 'ArrowDown') { e.preventDefault(); handleKeyPress('DOWN'); return; }
      if (k === 'F9') { e.preventDefault(); handleKeyPress('SHIFT'); return; }
      if (k === 'F10') { e.preventDefault(); handleKeyPress('ALPHA'); return; }

      const lower = k.toLowerCase();
      if (lower === 's') { handleKeyPress('SIN'); return; }
      if (lower === 'c') { handleKeyPress('COS'); return; }
      if (lower === 't') { handleKeyPress('TAN'); return; }
      if (lower === 'l') { handleKeyPress('LOG'); return; }
      if (lower === 'n') { handleKeyPress('LN'); return; }
      if (lower === 'r') { handleKeyPress('SQRT'); return; }
      if (lower === 'd') { handleKeyPress('SD'); return; }
      if (lower === 'p') {
        insertText('π');
        return;
      }
      if (lower === 'x') {
        insertText('X');
        return;
      }
      if (lower === 'e') {
        insertText('e');
        return;
      }
      if (lower === 'i' && mode === 'CMPLX') {
        insertText('𝐢');
        return;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKeyPress, mode]);

  // Preset Loader from Companion Panel
  const handleLoadExample = (presetId: string) => {
    setIsOn(true);
    setErrorMsg(null);
    setPopup({ type: 'NONE' });
    setPrompt({ kind: 'NONE', inputBuf: '' });

    if (presetId === 'EX_FRAC_SURD') {
      setMode('COMP');
      const exAst: AstList = [
        {
          id: genId(),
          type: 'frac',
          num: [
            { id: genId(), type: 'sqrt', inner: [createTextNode('2')] },
            createTextNode('+'),
            { id: genId(), type: 'sqrt', inner: [createTextNode('8')] },
          ],
          den: [createTextNode('2')],
        },
      ];
      setAst(exAst);
      setCursor({ path: [], index: 1 });
      const val = evaluateAst(exAst, { mode: 'COMP', setup, memory });
      finalizeEvalResult(val, exAst);
    } else if (presetId === 'EX_INTEGRAL') {
      setMode('COMP');
      const exAst: AstList = [
        {
          id: genId(),
          type: 'integral',
          expr: [{ id: genId(), type: 'pow', base: [createTextNode('X')], exp: [createTextNode('2')] }],
          lower: [createTextNode('0')],
          upper: [createTextNode('3')],
        },
      ];
      setAst(exAst);
      setCursor({ path: [], index: 1 });
      const val = evaluateAst(exAst, { mode: 'COMP', setup, memory });
      finalizeEvalResult(val, exAst);
    } else if (presetId === 'EX_DERIV') {
      setMode('COMP');
      const exAst: AstList = [
        {
          id: genId(),
          type: 'deriv',
          expr: [
            { id: genId(), type: 'pow', base: [createTextNode('X')], exp: [createTextNode('3')] },
            createTextNode('+2X'),
          ],
          at: [createTextNode('2')],
        },
      ];
      setAst(exAst);
      setCursor({ path: [], index: 1 });
      const val = evaluateAst(exAst, { mode: 'COMP', setup, memory });
      finalizeEvalResult(val, exAst);
    } else if (presetId === 'EX_SOLVE') {
      setMode('COMP');
      const exAst: AstList = [
        { id: genId(), type: 'pow', base: [createTextNode('X')], exp: [createTextNode('2')] },
        createTextNode('-5X+6=0'),
      ];
      setAst(exAst);
      setResult(null);
      setCursor({ path: [], index: exAst.length });
      setPrompt({ kind: 'SOLVE_X', inputBuf: '4' });
    } else if (presetId === 'EX_CMPLX') {
      setMode('CMPLX');
      const exAst: AstList = [createTextNode('(3+4𝐢)×(1-2𝐢)')];
      setAst(exAst);
      setCursor({ path: [], index: 1 });
      const val = evaluateAst(exAst, { mode: 'CMPLX', setup, memory });
      finalizeEvalResult(val, exAst);
    } else if (presetId === 'EX_EQN_QUAD') {
      setMode('EQN');
      const sol = solveQuadratic(2, -4, -6);
      setEqnState({
        stage: 'RESULT',
        eqnType: 'QUAD',
        coeffs: [2, -4, -6],
        cursorIdx: 2,
        inputBuf: '',
        solutions: sol,
        solIdx: 0,
      });
    } else if (presetId === 'EX_STAT') {
      setMode('STAT');
      setStatType('A+BX');
      setStatRows([
        { x: 1, y: 2.1, freq: 1 },
        { x: 2, y: 4.0, freq: 1 },
        { x: 3, y: 5.9, freq: 1 },
        { x: 4, y: 8.2, freq: 1 },
        { x: 5, y: 9.8, freq: 1 },
      ]);
      setStatScreen({ stage: 'DATA', cursorRow: 0, cursorCol: 0, inputBuf: '' });
    } else if (presetId === 'EX_TABLE') {
      setMode('TABLE');
      const fx: AstList = [
        { id: genId(), type: 'pow', base: [createTextNode('X')], exp: [createTextNode('2')] },
        createTextNode('-4'),
      ];
      setTableFx(fx);
      setTableGx([]);
      const rows = [-2, -1, 0, 1, 2, 3, 4].map((x) => ({ x, fx: x * x - 4 }));
      setTableState({ stage: 'VIEW', start: -2, end: 4, step: 1, inputBuf: '', rows, scrollRow: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Clean 3-Zone Top Header Bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            Casio fx-570LA PLUS
          </span>

          <div className="hidden md:flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400">
            <span>Natural-V.P.A.M.</span>
            <span aria-hidden="true">·</span>
            <span>8 Modos de cálculo</span>
            <span aria-hidden="true">·</span>
            <span>40 Constantes y Conversiones</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSoundEnabled((s) => !s)}
              title={soundEnabled ? 'Silenciar sonido de teclas' : 'Activar sonido de teclas'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Sonido' : 'Silencio'}</span>
            </button>
            <button
              type="button"
              onClick={() => setDarkTheme((d) => !d)}
              title="Cambiar tema claro/oscuro"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              {darkTheme ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{darkTheme ? 'Claro' : 'Oscuro'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Two-Column Laboratory Workspace */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Stage: Physical Casio fx-570LA PLUS Unit */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <CasioHardware
              onKeyPress={handleKeyPress}
              pressedKey={pressedKey}
              mode={mode}
              baseSystem={baseSystem}
              lcdProps={{
                isOn,
                shift,
                alpha,
                insertMode,
                mode,
                baseSystem,
                setup,
                memory,
                ast,
                cursor,
                result,
                errorMsg,
                popup,
                eqnState,
                statType,
                statRows,
                statScreen,
                matVecEditor,
                tableState,
                prompt,
                hasHistoryAbove: history.length > 0 && historyNavIdx < history.length - 1,
                hasHistoryBelow: historyNavIdx >= 0,
                solveExprMode: ast.some((n) => n.type === 'text' && n.value === '='),
              }}
            />
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Soporta teclado físico · Enter (=), Backspace (DEL), Esc (AC), Flechas</span>
            </div>
          </div>

          {/* Right Stage: Companion Tape, Memory, Constants & Interactive Guide */}
          <div className="lg:col-span-7">
            <CompanionPanel
              mode={mode}
              setup={setup}
              memory={memory}
              history={history}
              onRecallHistory={(entry) => {
                setIsOn(true);
                setErrorMsg(null);
                setPopup({ type: 'NONE' });
                setMode(entry.mode);
                setAst(cloneAstList(entry.inputAst));
                setCursor({ path: [], index: entry.inputAst.length });
                setResult(null);
              }}
              onClearHistory={() => {
                setHistory([]);
                setHistoryNavIdx(-1);
              }}
              onInsertConstant={(code) => {
                setIsOn(true);
                setErrorMsg(null);
                setPopup({ type: 'NONE' });
                insertText(`[C${code}]`);
              }}
              onInsertConversion={(code) => {
                setIsOn(true);
                setErrorMsg(null);
                setPopup({ type: 'NONE' });
                insertText(`[U${code}]`);
              }}
              onLoadExample={handleLoadExample}
              onSelectMode={(m) => {
                setIsOn(true);
                switchMode(m);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

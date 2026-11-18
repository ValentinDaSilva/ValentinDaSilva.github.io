export type CalcMode =
  | 'COMP'
  | 'CMPLX'
  | 'STAT'
  | 'BASE'
  | 'EQN'
  | 'MATRIX'
  | 'TABLE'
  | 'VECTOR';

export type AngleUnit = 'DEG' | 'RAD' | 'GRA';
export type DisplayFormat = 'NORM1' | 'NORM2' | 'FIX' | 'SCI';
export type FractionMode = 'ab/c' | 'd/c';
export type ComplexFormat = 'a+bi' | 'r<theta';
export type BaseSystem = 'DEC' | 'HEX' | 'BIN' | 'OCT';

export interface SetupConfig {
  ioMode: 'MATH' | 'LINE';
  angleUnit: AngleUnit;
  displayFormat: DisplayFormat;
  fixDigits: number; // 0-9
  sciDigits: number; // 0-9
  fractionMode: FractionMode;
  complexFormat: ComplexFormat;
  statFreq: 'ON' | 'OFF';
  contrast: number; // 0-10
}

export interface ComplexNum {
  re: number;
  im: number;
}

export type MatrixData = number[][]; // 1..3 x 1..3
export type VectorData = number[]; // length 2 or 3

export type StatType =
  | '1-VAR'
  | 'A+BX'
  | '_+CX2'
  | 'lnX'
  | 'e^X'
  | 'A*B^X'
  | 'A*X^B'
  | '1/X';

export interface StatRow {
  x: number;
  y?: number;
  freq: number;
}

export type EqnType = '2x2' | '3x3' | 'QUAD' | 'CUBIC';

export interface HistoryEntry {
  id: string;
  mode: CalcMode;
  inputAst: AstList;
  inputDisplay: string;
  resultDisplay: string;
  exactLatex?: string;
  decimalValue?: number;
  complexValue?: ComplexNum;
  timestamp: number;
}

// Natural-V.P.A.M. AST Nodes
export type AstNode =
  | { id: string; type: 'text'; value: string }
  | { id: string; type: 'frac'; num: AstList; den: AstList }
  | { id: string; type: 'mixedFrac'; whole: AstList; num: AstList; den: AstList }
  | { id: string; type: 'sqrt'; inner: AstList }
  | { id: string; type: 'cbrt'; inner: AstList }
  | { id: string; type: 'nthRoot'; index: AstList; inner: AstList }
  | { id: string; type: 'pow'; base: AstList; exp: AstList }
  | { id: string; type: 'logBase'; base: AstList; inner: AstList }
  | { id: string; type: 'abs'; inner: AstList }
  | { id: string; type: 'integral'; expr: AstList; lower: AstList; upper: AstList }
  | { id: string; type: 'deriv'; expr: AstList; at: AstList }
  | { id: string; type: 'sum'; expr: AstList; lower: AstList; upper: AstList };

export type AstList = AstNode[];

export interface CursorPathItem {
  nodeId: string;
  slot: string; // e.g., 'num', 'den', 'inner', 'base', 'exp', 'lower', 'upper', 'expr', 'at', 'whole', 'index'
}

export interface AstCursor {
  path: CursorPathItem[];
  index: number; // position in the target AstList (0..list.length)
}

export type ActivePopupMenu =
  | { type: 'NONE' }
  | { type: 'MODE' }
  | { type: 'SETUP'; page: 1 | 2 }
  | { type: 'CLR' }
  | { type: 'CLR_CONFIRM'; target: 'SETUP' | 'MEMORY' | 'ALL' }
  | { type: 'CONST'; digits: string }
  | { type: 'CONV'; digits: string }
  | { type: 'DRG' }
  | { type: 'CMPLX_OPT' }
  | { type: 'BASE_OPT' }
  | { type: 'STAT_TYPE' }
  | { type: 'STAT_OPT' }
  | { type: 'STAT_SUM' }
  | { type: 'STAT_VAR' }
  | { type: 'STAT_MINMAX' }
  | { type: 'STAT_REG' }
  | { type: 'MATRIX_OPT' }
  | { type: 'MATRIX_DIM_SELECT' }
  | { type: 'MATRIX_DIM_SIZE'; mat: 'A' | 'B' | 'C' }
  | { type: 'VECTOR_OPT' }
  | { type: 'VECTOR_DIM_SELECT' }
  | { type: 'VECTOR_DIM_SIZE'; vct: 'A' | 'B' | 'C' }
  | { type: 'EQN_SELECT' }
  | { type: 'STO_WAIT' }
  | { type: 'RCL_WAIT' }
  | { type: 'HYP_WAIT' };

export interface MemoryBank {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  X: number;
  Y: number;
  M: number;
  Ans: number;
  PreAns: number;
  AnsComplex: ComplexNum;
  MatA: MatrixData;
  MatB: MatrixData;
  MatC: MatrixData;
  MatAns: MatrixData;
  VctA: VectorData;
  VctB: VectorData;
  VctC: VectorData;
  VctAns: VectorData;
}

export interface CalcSessionState {
  isOn: boolean;
  shift: boolean;
  alpha: boolean;
  insertMode: boolean;
  mode: CalcMode;
  baseSystem: BaseSystem;
  setup: SetupConfig;
  memory: MemoryBank;
  statType: StatType;
  statRows: StatRow[];
}

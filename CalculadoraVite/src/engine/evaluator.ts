import { SCIENTIFIC_CONSTANTS, UNIT_CONVERSIONS } from './constants';
import {
  AngleUnit,
  AstList,
  AstNode,
  BaseSystem,
  CalcMode,
  ComplexNum,
  MatrixData,
  MemoryBank,
  SetupConfig,
  VectorData,
} from './types';

export class CalcError extends Error {
  constructor(
    public code: 'Syntax ERROR' | 'Math ERROR' | 'Dimension ERROR' | 'Argument ERROR' | 'Can\'t Solve'
  ) {
    super(code);
  }
}

export type EvalValue =
  | { kind: 'real'; value: number }
  | { kind: 'complex'; value: ComplexNum }
  | { kind: 'matrix'; value: MatrixData }
  | { kind: 'vector'; value: VectorData };

// Angle conversions
function toRadians(x: number, unit: AngleUnit): number {
  if (unit === 'DEG') return (x * Math.PI) / 180;
  if (unit === 'GRA') return (x * Math.PI) / 200;
  return x;
}

function fromRadians(rad: number, unit: AngleUnit): number {
  if (unit === 'DEG') return (rad * 180) / Math.PI;
  if (unit === 'GRA') return (rad * 200) / Math.PI;
  return rad;
}

// Complex arithmetic helpers
const cAdd = (a: ComplexNum, b: ComplexNum): ComplexNum => ({ re: a.re + b.re, im: a.im + b.im });
const cSub = (a: ComplexNum, b: ComplexNum): ComplexNum => ({ re: a.re - b.re, im: a.im - b.im });
const cMul = (a: ComplexNum, b: ComplexNum): ComplexNum => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});
const cDiv = (a: ComplexNum, b: ComplexNum): ComplexNum => {
  const denom = b.re * b.re + b.im * b.im;
  if (denom === 0) throw new CalcError('Math ERROR');
  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom,
  };
};
const cPowInt = (a: ComplexNum, n: number): ComplexNum => {
  if (!Number.isInteger(n)) throw new CalcError('Math ERROR');
  if (n === 0) return { re: 1, im: 0 };
  if (n < 0) return cDiv({ re: 1, im: 0 }, cPowInt(a, -n));
  let res: ComplexNum = { re: 1, im: 0 };
  for (let i = 0; i < n; i++) res = cMul(res, a);
  return res;
};
const cSqrt = (a: ComplexNum): ComplexNum => {
  const r = Math.hypot(a.re, a.im);
  const re = Math.sqrt((r + a.re) / 2);
  const im = (a.im >= 0 ? 1 : -1) * Math.sqrt((r - a.re) / 2);
  return { re, im };
};

// Factorial / Permutations / Combinations
function factorial(n: number): number {
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n) || n > 69) {
    throw new CalcError('Math ERROR');
  }
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function nPr(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n || n > 69) {
    throw new CalcError('Math ERROR');
  }
  let res = 1;
  for (let i = 0; i < r; i++) res *= n - i;
  return res;
}

function nCr(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n || n > 69) {
    throw new CalcError('Math ERROR');
  }
  const k = Math.min(r, n - r);
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - k + i)) / i;
  }
  return Math.round(res);
}

// Matrix operations
export function matDet(m: MatrixData): number {
  const rows = m.length;
  const cols = m[0]?.length ?? 0;
  if (rows !== cols || rows === 0) throw new CalcError('Dimension ERROR');
  if (rows === 1) return m[0][0];
  if (rows === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  if (rows === 3) {
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
  }
  throw new CalcError('Dimension ERROR');
}

export function matTrn(m: MatrixData): MatrixData {
  const rows = m.length;
  const cols = m[0]?.length ?? 0;
  const res: MatrixData = [];
  for (let j = 0; j < cols; j++) {
    const row: number[] = [];
    for (let i = 0; i < rows; i++) row.push(m[i][j]);
    res.push(row);
  }
  return res;
}

export function matInv(m: MatrixData): MatrixData {
  const rows = m.length;
  const cols = m[0]?.length ?? 0;
  if (rows !== cols || rows === 0) throw new CalcError('Dimension ERROR');
  const d = matDet(m);
  if (Math.abs(d) < 1e-13) throw new CalcError('Math ERROR');
  if (rows === 1) return [[1 / m[0][0]]];
  if (rows === 2) {
    return [
      [m[1][1] / d, -m[0][1] / d],
      [-m[1][0] / d, m[0][0] / d],
    ];
  }
  if (rows === 3) {
    const inv: MatrixData = [
      [
        (m[1][1] * m[2][2] - m[1][2] * m[2][1]) / d,
        (m[0][2] * m[2][1] - m[0][1] * m[2][2]) / d,
        (m[0][1] * m[1][2] - m[0][2] * m[1][1]) / d,
      ],
      [
        (m[1][2] * m[2][0] - m[1][0] * m[2][2]) / d,
        (m[0][0] * m[2][2] - m[0][2] * m[2][0]) / d,
        (m[0][2] * m[1][0] - m[0][0] * m[1][2]) / d,
      ],
      [
        (m[1][0] * m[2][1] - m[1][1] * m[2][0]) / d,
        (m[0][1] * m[2][0] - m[0][0] * m[2][1]) / d,
        (m[0][0] * m[1][1] - m[0][1] * m[1][0]) / d,
      ],
    ];
    return inv;
  }
  throw new CalcError('Dimension ERROR');
}

export function matMul(a: MatrixData, b: MatrixData): MatrixData {
  const rA = a.length;
  const cA = a[0]?.length ?? 0;
  const rB = b.length;
  const cB = b[0]?.length ?? 0;
  if (cA !== rB) throw new CalcError('Dimension ERROR');
  const out: MatrixData = [];
  for (let i = 0; i < rA; i++) {
    const row: number[] = [];
    for (let j = 0; j < cB; j++) {
      let sum = 0;
      for (let k = 0; k < cA; k++) sum += a[i][k] * b[k][j];
      row.push(sum);
    }
    out.push(row);
  }
  return out;
}

// Token stream for parser
type Tok =
  | { kind: 'num'; value: number }
  | { kind: 'var'; name: string }
  | { kind: 'const'; value: number }
  | { kind: 'conv'; code: string }
  | { kind: 'func'; name: string } // e.g. 'sin(', 'cos(', 'det(', etc.
  | { kind: 'op'; op: string } // '+', '-', '×', '÷', '^', 'nPr', 'nCr', '∠', '·', 'and', 'or', 'xor', 'xnor'
  | { kind: 'postfix'; op: string } // '!', '%', '°', '⁻¹', '²', '³'
  | { kind: 'lparen' }
  | { kind: 'rparen' }
  | { kind: 'comma' }
  | { kind: 'ast'; node: AstNode };

const FUNC_NAMES = [
  'sinh⁻¹(',
  'cosh⁻¹(',
  'tanh⁻¹(',
  'sin⁻¹(',
  'cos⁻¹(',
  'tan⁻¹(',
  'sinh(',
  'cosh(',
  'tanh(',
  'sin(',
  'cos(',
  'tan(',
  'log(',
  'ln(',
  'Abs(',
  'Rnd(',
  'Pol(',
  'Rec(',
  'Arg(',
  'Conjg(',
  'det(',
  'Trn(',
  'Not(',
  'Neg(',
  'RanInt#(',
  '10^(',
  'e^(',
  '√(',
  '³√(',
];

function tokenizeAstList(
  list: AstList,
  baseSystem?: BaseSystem
): Tok[] {
  // Flatten consecutive text nodes into a string stream with embedded AST structured nodes
  const rawItems: Array<{ kind: 'str'; text: string } | { kind: 'ast'; node: AstNode }> = [];
  for (const node of list) {
    if (node.type === 'text') {
      const prev = rawItems[rawItems.length - 1];
      if (prev && prev.kind === 'str') prev.text += node.value;
      else rawItems.push({ kind: 'str', text: node.value });
    } else {
      rawItems.push({ kind: 'ast', node });
    }
  }

  const tokens: Tok[] = [];

  for (const item of rawItems) {
    if (item.kind === 'ast') {
      tokens.push({ kind: 'ast', node: item.node });
      continue;
    }

    const s = item.text;
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (ch === ' ' || ch === '\t') {
        i += 1;
        continue;
      }

      // Check base-n HEX digits or normal numbers
      if (baseSystem === 'HEX' && /[0-9A-F]/.test(ch)) {
        // Check if it's a keyword like 'And' / 'Ans'
        if (s.startsWith('Ans', i)) {
          tokens.push({ kind: 'var', name: 'Ans' });
          i += 3;
          continue;
        }
        let j = i;
        while (j < s.length && /[0-9A-F]/.test(s[j])) j++;
        const sub = s.slice(i, j);
        const parsed = parseInt(sub, 16);
        if (Number.isNaN(parsed)) throw new CalcError('Syntax ERROR');
        tokens.push({ kind: 'num', value: parsed | 0 });
        i = j;
        continue;
      }

      if (/[0-9.]/.test(ch)) {
        let j = i;
        let seenDot = false;
        while (j < s.length && (/[0-9]/.test(s[j]) || (s[j] === '.' && !seenDot))) {
          if (s[j] === '.') seenDot = true;
          j++;
        }
        const numStr = s.slice(i, j);
        if (numStr === '.') throw new CalcError('Syntax ERROR');
        if (baseSystem) {
          const radix =
            baseSystem === 'BIN' ? 2 : baseSystem === 'OCT' ? 8 : 10;
          if (seenDot) throw new CalcError('Syntax ERROR');
          const parsed = parseInt(numStr, radix);
          if (Number.isNaN(parsed)) throw new CalcError('Syntax ERROR');
          tokens.push({ kind: 'num', value: parsed | 0 });
        } else {
          tokens.push({ kind: 'num', value: parseFloat(numStr) });
        }
        i = j;
        continue;
      }

      // ×10^ scientific shorthand token
      if (s.startsWith('×10^', i)) {
        tokens.push({ kind: 'op', op: 'E10' });
        i += 4;
        continue;
      }

      // Multi-char operators / keywords
      const wordOps = ['nPr', 'nCr', 'xnor', 'xor', 'and', 'or'];
      let matchedWordOp = false;
      for (const w of wordOps) {
        if (s.startsWith(w, i)) {
          tokens.push({ kind: 'op', op: w });
          i += w.length;
          matchedWordOp = true;
          break;
        }
      }
      if (matchedWordOp) continue;

      // Functions ending with '('
      let matchedFunc = false;
      for (const fn of FUNC_NAMES) {
        if (s.startsWith(fn, i)) {
          tokens.push({ kind: 'func', name: fn });
          i += fn.length;
          matchedFunc = true;
          break;
        }
      }
      if (matchedFunc) continue;

      // Special multi-char variables / tokens
      const multiVars = [
        'PreAns',
        'MatAns',
        'VctAns',
        'MatA',
        'MatB',
        'MatC',
        'VctA',
        'VctB',
        'VctC',
        'Ran#',
        'Ans',
      ];
      let matchedVar = false;
      for (const mv of multiVars) {
        if (s.startsWith(mv, i)) {
          if (mv === 'Ran#') {
            tokens.push({ kind: 'num', value: Math.random() });
          } else {
            tokens.push({ kind: 'var', name: mv });
          }
          i += mv.length;
          matchedVar = true;
          break;
        }
      }
      if (matchedVar) continue;

      // Scientific constant tag: [C01]..[C40]
      if (s[i] === '[' && s[i + 1] === 'C') {
        const end = s.indexOf(']', i);
        if (end > i) {
          const code = s.slice(i + 2, end);
          const found = SCIENTIFIC_CONSTANTS.find((c) => c.code === code);
          if (found) {
            tokens.push({ kind: 'const', value: found.value });
            i = end + 1;
            continue;
          }
        }
      }

      // Unit conversion tag: [U01]..[U40]
      if (s[i] === '[' && s[i + 1] === 'U') {
        const end = s.indexOf(']', i);
        if (end > i) {
          const code = s.slice(i + 2, end);
          tokens.push({ kind: 'conv', code });
          i = end + 1;
          continue;
        }
      }

      // Complex polar marker ▸r∠θ or ▸a+bi (handled at top level, ignore here if stray)
      if (ch === 'π') {
        tokens.push({ kind: 'const', value: Math.PI });
        i += 1;
        continue;
      }
      if (ch === 'e') {
        tokens.push({ kind: 'const', value: Math.E });
        i += 1;
        continue;
      }
      if (ch === '𝐢' || ch === 'i') {
        tokens.push({ kind: 'var', name: 'i' });
        i += 1;
        continue;
      }

      // Single-letter variables A,B,C,D,E,F,X,Y,M
      if (/^[A-FXYM]$/.test(ch)) {
        tokens.push({ kind: 'var', name: ch });
        i += 1;
        continue;
      }

      // Parentheses & comma
      if (ch === '(') {
        tokens.push({ kind: 'lparen' });
        i += 1;
        continue;
      }
      if (ch === ')') {
        tokens.push({ kind: 'rparen' });
        i += 1;
        continue;
      }
      if (ch === ',') {
        tokens.push({ kind: 'comma' });
        i += 1;
        continue;
      }

      // Postfix operators
      if (ch === '!' || ch === '%' || ch === '°') {
        tokens.push({ kind: 'postfix', op: ch });
        i += 1;
        continue;
      }
      if (ch === '²' || ch === '³') {
        tokens.push({ kind: 'postfix', op: ch });
        i += 1;
        continue;
      }
      if (s.startsWith('⁻¹', i)) {
        tokens.push({ kind: 'postfix', op: '⁻¹' });
        i += 2;
        continue;
      }

      // Binary operators
      if (ch === '+' || ch === '-' || ch === '−') {
        tokens.push({ kind: 'op', op: ch === '−' ? '-' : ch });
        i += 1;
        continue;
      }
      if (ch === '×' || ch === '*') {
        tokens.push({ kind: 'op', op: '×' });
        i += 1;
        continue;
      }
      if (ch === '÷' || ch === '/') {
        tokens.push({ kind: 'op', op: '÷' });
        i += 1;
        continue;
      }
      if (ch === '^') {
        tokens.push({ kind: 'op', op: '^' });
        i += 1;
        continue;
      }
      if (ch === '∠') {
        tokens.push({ kind: 'op', op: '∠' });
        i += 1;
        continue;
      }
      if (ch === '·') {
        tokens.push({ kind: 'op', op: '·' });
        i += 1;
        continue;
      }

      throw new CalcError('Syntax ERROR');
    }
  }

  return tokens;
}

export interface EvalContext {
  mode: CalcMode;
  setup: SetupConfig;
  memory: MemoryBank;
  baseSystem?: BaseSystem;
  xOverride?: number;
  sideEffectXY?: (x: number, y: number) => void;
}

export function evaluateAst(ast: AstList, ctx: EvalContext): EvalValue {
  if (ast.length === 0) throw new CalcError('Syntax ERROR');
  const tokens = tokenizeAstList(ast, ctx.mode === 'BASE' ? ctx.baseSystem : undefined);
  if (tokens.length === 0) throw new CalcError('Syntax ERROR');

  let pos = 0;
  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  const asReal = (v: EvalValue): number => {
    if (v.kind === 'real') return v.value;
    if (v.kind === 'complex' && Math.abs(v.value.im) < 1e-12) return v.value.re;
    throw new CalcError('Math ERROR');
  };

  const asComplex = (v: EvalValue): ComplexNum => {
    if (v.kind === 'complex') return v.value;
    if (v.kind === 'real') return { re: v.value, im: 0 };
    throw new CalcError('Math ERROR');
  };

  const parseOr = (): EvalValue => {
    let left = parseXor();
    while (peek()?.kind === 'op' && (peek() as { op: string }).op === 'or') {
      consume();
      const right = parseXor();
      left = { kind: 'real', value: (asReal(left) | 0) | (asReal(right) | 0) };
    }
    return left;
  };

  const parseXor = (): EvalValue => {
    let left = parseAnd();
    while (
      peek()?.kind === 'op' &&
      ((peek() as { op: string }).op === 'xor' || (peek() as { op: string }).op === 'xnor')
    ) {
      const op = (consume() as { op: string }).op;
      const right = parseAnd();
      const a = asReal(left) | 0;
      const b = asReal(right) | 0;
      left = { kind: 'real', value: op === 'xor' ? a ^ b : ~(a ^ b) };
    }
    return left;
  };

  const parseAnd = (): EvalValue => {
    let left = parseAddSub();
    while (peek()?.kind === 'op' && (peek() as { op: string }).op === 'and') {
      consume();
      const right = parseAddSub();
      left = { kind: 'real', value: (asReal(left) | 0) & (asReal(right) | 0) };
    }
    return left;
  };

  const parseAddSub = (): EvalValue => {
    let left = parseMulDiv();
    while (
      peek()?.kind === 'op' &&
      ((peek() as { op: string }).op === '+' || (peek() as { op: string }).op === '-')
    ) {
      const op = (consume() as { op: string }).op;
      const right = parseMulDiv();
      left = applyAddSub(left, right, op as '+' | '-');
    }
    return left;
  };

  const applyAddSub = (l: EvalValue, r: EvalValue, op: '+' | '-'): EvalValue => {
    const sign = op === '+' ? 1 : -1;
    if (l.kind === 'matrix' && r.kind === 'matrix') {
      if (l.value.length !== r.value.length || l.value[0].length !== r.value[0].length) {
        throw new CalcError('Dimension ERROR');
      }
      return {
        kind: 'matrix',
        value: l.value.map((row, i) => row.map((val, j) => val + sign * r.value[i][j])),
      };
    }
    if (l.kind === 'vector' && r.kind === 'vector') {
      if (l.value.length !== r.value.length) throw new CalcError('Dimension ERROR');
      return {
        kind: 'vector',
        value: l.value.map((val, i) => val + sign * r.value[i]),
      };
    }
    if (l.kind === 'complex' || r.kind === 'complex') {
      const cl = asComplex(l);
      const cr = asComplex(r);
      return {
        kind: 'complex',
        value: op === '+' ? cAdd(cl, cr) : cSub(cl, cr),
      };
    }
    return { kind: 'real', value: asReal(l) + sign * asReal(r) };
  };

  const canStartImplicitMul = (t: Tok | undefined): boolean => {
    if (!t) return false;
    return (
      t.kind === 'num' ||
      t.kind === 'var' ||
      t.kind === 'const' ||
      t.kind === 'func' ||
      t.kind === 'lparen' ||
      t.kind === 'ast'
    );
  };

  const parseMulDiv = (): EvalValue => {
    let left = parsePolar();
    while (true) {
      const next = peek();
      if (
        next?.kind === 'op' &&
        (next.op === '×' || next.op === '÷' || next.op === '·' || next.op === 'nPr' || next.op === 'nCr')
      ) {
        const op = (consume() as { op: string }).op;
        const right = parsePolar();
        if (op === 'nPr') {
          left = { kind: 'real', value: nPr(asReal(left), asReal(right)) };
        } else if (op === 'nCr') {
          left = { kind: 'real', value: nCr(asReal(left), asReal(right)) };
        } else if (op === '·') {
          if (left.kind !== 'vector' || right.kind !== 'vector' || left.value.length !== right.value.length) {
            throw new CalcError('Dimension ERROR');
          }
          const dot = left.value.reduce((acc, v, idx) => acc + v * right.value[idx], 0);
          left = { kind: 'real', value: dot };
        } else if (op === '×') {
          left = applyMul(left, right);
        } else {
          left = applyDiv(left, right);
        }
      } else if (canStartImplicitMul(next)) {
        const right = parsePolar();
        left = applyMul(left, right);
      } else {
        break;
      }
    }
    return left;
  };

  const applyMul = (l: EvalValue, r: EvalValue): EvalValue => {
    if (l.kind === 'matrix' && r.kind === 'matrix') {
      return { kind: 'matrix', value: matMul(l.value, r.value) };
    }
    if (l.kind === 'real' && r.kind === 'matrix') {
      return {
        kind: 'matrix',
        value: r.value.map((row) => row.map((v) => l.value * v)),
      };
    }
    if (l.kind === 'matrix' && r.kind === 'real') {
      return {
        kind: 'matrix',
        value: l.value.map((row) => row.map((v) => v * r.value)),
      };
    }
    if (l.kind === 'vector' && r.kind === 'vector') {
      if (l.value.length !== 3 || r.value.length !== 3) {
        throw new CalcError('Dimension ERROR');
      }
      const a = l.value;
      const b = r.value;
      return {
        kind: 'vector',
        value: [
          a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0],
        ],
      };
    }
    if (l.kind === 'real' && r.kind === 'vector') {
      return { kind: 'vector', value: r.value.map((v) => l.value * v) };
    }
    if (l.kind === 'vector' && r.kind === 'real') {
      return { kind: 'vector', value: l.value.map((v) => v * r.value) };
    }
    if (l.kind === 'complex' || r.kind === 'complex') {
      return { kind: 'complex', value: cMul(asComplex(l), asComplex(r)) };
    }
    return { kind: 'real', value: asReal(l) * asReal(r) };
  };

  const applyDiv = (l: EvalValue, r: EvalValue): EvalValue => {
    if (l.kind === 'matrix' && r.kind === 'real') {
      if (r.value === 0) throw new CalcError('Math ERROR');
      return { kind: 'matrix', value: l.value.map((row) => row.map((v) => v / r.value)) };
    }
    if (l.kind === 'vector' && r.kind === 'real') {
      if (r.value === 0) throw new CalcError('Math ERROR');
      return { kind: 'vector', value: l.value.map((v) => v / r.value) };
    }
    if (l.kind === 'complex' || r.kind === 'complex') {
      return { kind: 'complex', value: cDiv(asComplex(l), asComplex(r)) };
    }
    const den = asReal(r);
    if (den === 0) throw new CalcError('Math ERROR');
    return { kind: 'real', value: asReal(l) / den };
  };

  const parsePolar = (): EvalValue => {
    let left = parseUnary();
    while (peek()?.kind === 'op' && (peek() as { op: string }).op === '∠') {
      consume();
      const angle = asReal(parseUnary());
      const r = asReal(left);
      const rad = toRadians(angle, ctx.setup.angleUnit);
      left = {
        kind: 'complex',
        value: { re: r * Math.cos(rad), im: r * Math.sin(rad) },
      };
    }
    return left;
  };

  const parseUnary = (): EvalValue => {
    const next = peek();
    if (next?.kind === 'op' && (next.op === '+' || next.op === '-')) {
      consume();
      const val = parseUnary();
      if (next.op === '+') return val;
      if (val.kind === 'complex') return { kind: 'complex', value: { re: -val.value.re, im: -val.value.im } };
      if (val.kind === 'matrix') return { kind: 'matrix', value: val.value.map((r) => r.map((x) => -x)) };
      if (val.kind === 'vector') return { kind: 'vector', value: val.value.map((x) => -x) };
      return { kind: 'real', value: -val.value };
    }
    return parsePower();
  };

  const parsePower = (): EvalValue => {
    let base = parseSci10();
    if (peek()?.kind === 'op' && (peek() as { op: string }).op === '^') {
      consume();
      const exp = parseUnary();
      if (base.kind === 'complex') {
        return { kind: 'complex', value: cPowInt(base.value, asReal(exp)) };
      }
      const b = asReal(base);
      const e = asReal(exp);
      const res = Math.pow(b, e);
      if (Number.isNaN(res) || !Number.isFinite(res)) throw new CalcError('Math ERROR');
      return { kind: 'real', value: res };
    }
    return base;
  };

  const parseSci10 = (): EvalValue => {
    let left = parsePostfix();
    while (peek()?.kind === 'op' && (peek() as { op: string }).op === 'E10') {
      consume();
      const expVal = asReal(parseUnary());
      left = { kind: 'real', value: asReal(left) * Math.pow(10, expVal) };
    }
    return left;
  };

  const parsePostfix = (): EvalValue => {
    let val = parsePrimary();
    while (true) {
      const next = peek();
      if (next?.kind === 'postfix') {
        consume();
        if (next.op === '!') {
          val = { kind: 'real', value: factorial(asReal(val)) };
        } else if (next.op === '%') {
          val = { kind: 'real', value: asReal(val) / 100 };
        } else if (next.op === '°') {
          let totalDeg = asReal(val);
          const sign = totalDeg < 0 ? -1 : 1;
          totalDeg = Math.abs(totalDeg);
          if (peek()?.kind === 'num') {
            const mins = (consume() as { kind: 'num'; value: number }).value;
            if (peek()?.kind === 'postfix' && (peek() as { op: string }).op === '°') consume();
            totalDeg += mins / 60;
            if (peek()?.kind === 'num') {
              const secs = (consume() as { kind: 'num'; value: number }).value;
              if (peek()?.kind === 'postfix' && (peek() as { op: string }).op === '°') consume();
              totalDeg += secs / 3600;
            }
          }
          val = { kind: 'real', value: sign * totalDeg };
        } else if (next.op === '²') {
          if (val.kind === 'complex') val = { kind: 'complex', value: cMul(val.value, val.value) };
          else if (val.kind === 'matrix') val = { kind: 'matrix', value: matMul(val.value, val.value) };
          else {
            const x = asReal(val);
            val = { kind: 'real', value: x * x };
          }
        } else if (next.op === '³') {
          if (val.kind === 'complex') val = { kind: 'complex', value: cPowInt(val.value, 3) };
          else if (val.kind === 'matrix') {
            val = { kind: 'matrix', value: matMul(matMul(val.value, val.value), val.value) };
          } else {
            const x = asReal(val);
            val = { kind: 'real', value: x * x * x };
          }
        } else if (next.op === '⁻¹') {
          if (val.kind === 'complex') val = { kind: 'complex', value: cDiv({ re: 1, im: 0 }, val.value) };
          else if (val.kind === 'matrix') val = { kind: 'matrix', value: matInv(val.value) };
          else {
            const x = asReal(val);
            if (x === 0) throw new CalcError('Math ERROR');
            val = { kind: 'real', value: 1 / x };
          }
        }
      } else if (next?.kind === 'conv') {
        consume();
        const conv = UNIT_CONVERSIONS.find((c) => c.code === next.code);
        if (!conv) throw new CalcError('Syntax ERROR');
        const num = asReal(val);
        val = {
          kind: 'real',
          value: conv.custom ? conv.custom(num) : num * (conv.factor ?? 1),
        };
      } else {
        break;
      }
    }
    return val;
  };

  const parsePrimary = (): EvalValue => {
    const tok = peek();
    if (!tok) throw new CalcError('Syntax ERROR');

    if (tok.kind === 'num' || tok.kind === 'const') {
      consume();
      // Check DMS trailing numbers like 12°30°15°
      return { kind: 'real', value: tok.value };
    }

    if (tok.kind === 'var') {
      consume();
      const name = tok.name;
      if (name === 'i') {
        if (ctx.mode !== 'CMPLX') throw new CalcError('Syntax ERROR');
        return { kind: 'complex', value: { re: 0, im: 1 } };
      }
      if (name === 'X' && ctx.xOverride !== undefined) {
        return { kind: 'real', value: ctx.xOverride };
      }
      if (name === 'Ans') {
        if (ctx.mode === 'CMPLX') {
          return { kind: 'complex', value: ctx.memory.AnsComplex };
        }
        return { kind: 'real', value: ctx.memory.Ans };
      }
      if (name === 'PreAns') return { kind: 'real', value: ctx.memory.PreAns };
      if (name === 'MatA') return { kind: 'matrix', value: ctx.memory.MatA };
      if (name === 'MatB') return { kind: 'matrix', value: ctx.memory.MatB };
      if (name === 'MatC') return { kind: 'matrix', value: ctx.memory.MatC };
      if (name === 'MatAns') return { kind: 'matrix', value: ctx.memory.MatAns };
      if (name === 'VctA') return { kind: 'vector', value: ctx.memory.VctA };
      if (name === 'VctB') return { kind: 'vector', value: ctx.memory.VctB };
      if (name === 'VctC') return { kind: 'vector', value: ctx.memory.VctC };
      if (name === 'VctAns') return { kind: 'vector', value: ctx.memory.VctAns };

      const memRecord = ctx.memory as unknown as Record<string, number>;
      if (typeof memRecord[name] === 'number') {
        return { kind: 'real', value: memRecord[name] };
      }
      throw new CalcError('Syntax ERROR');
    }

    if (tok.kind === 'lparen') {
      consume();
      const val = parseOr();
      if (peek()?.kind === 'rparen') consume();
      return val;
    }

    if (tok.kind === 'func') {
      consume();
      const args: EvalValue[] = [parseOr()];
      while (peek()?.kind === 'comma') {
        consume();
        args.push(parseOr());
      }
      if (peek()?.kind === 'rparen') consume();
      return evalFunction(tok.name, args);
    }

    if (tok.kind === 'ast') {
      consume();
      return evalStructuredNode(tok.node);
    }

    throw new CalcError('Syntax ERROR');
  };

  const evalFunction = (name: string, args: EvalValue[]): EvalValue => {
    const a0 = args[0];
    switch (name) {
      case 'sin(': {
        const x = asReal(a0);
        const rad = toRadians(x, ctx.setup.angleUnit);
        return { kind: 'real', value: Math.sin(rad) };
      }
      case 'cos(': {
        const x = asReal(a0);
        const rad = toRadians(x, ctx.setup.angleUnit);
        return { kind: 'real', value: Math.cos(rad) };
      }
      case 'tan(': {
        const x = asReal(a0);
        const rad = toRadians(x, ctx.setup.angleUnit);
        if (Math.abs(Math.cos(rad)) < 1e-14) throw new CalcError('Math ERROR');
        return { kind: 'real', value: Math.tan(rad) };
      }
      case 'sin⁻¹(': {
        const x = asReal(a0);
        if (x < -1 || x > 1) throw new CalcError('Math ERROR');
        return { kind: 'real', value: fromRadians(Math.asin(x), ctx.setup.angleUnit) };
      }
      case 'cos⁻¹(': {
        const x = asReal(a0);
        if (x < -1 || x > 1) throw new CalcError('Math ERROR');
        return { kind: 'real', value: fromRadians(Math.acos(x), ctx.setup.angleUnit) };
      }
      case 'tan⁻¹(': {
        const x = asReal(a0);
        return { kind: 'real', value: fromRadians(Math.atan(x), ctx.setup.angleUnit) };
      }
      case 'sinh(':
        return { kind: 'real', value: Math.sinh(asReal(a0)) };
      case 'cosh(':
        return { kind: 'real', value: Math.cosh(asReal(a0)) };
      case 'tanh(':
        return { kind: 'real', value: Math.tanh(asReal(a0)) };
      case 'sinh⁻¹(':
        return { kind: 'real', value: Math.asinh(asReal(a0)) };
      case 'cosh⁻¹(': {
        const x = asReal(a0);
        if (x < 1) throw new CalcError('Math ERROR');
        return { kind: 'real', value: Math.acosh(x) };
      }
      case 'tanh⁻¹(': {
        const x = asReal(a0);
        if (x <= -1 || x >= 1) throw new CalcError('Math ERROR');
        return { kind: 'real', value: Math.atanh(x) };
      }
      case 'log(': {
        const x = asReal(a0);
        if (x <= 0) throw new CalcError('Math ERROR');
        return { kind: 'real', value: Math.log10(x) };
      }
      case 'ln(': {
        const x = asReal(a0);
        if (x <= 0) throw new CalcError('Math ERROR');
        return { kind: 'real', value: Math.log(x) };
      }
      case '10^(':
        return { kind: 'real', value: Math.pow(10, asReal(a0)) };
      case 'e^(':
        return { kind: 'real', value: Math.exp(asReal(a0)) };
      case '√(': {
        if (a0.kind === 'complex') return { kind: 'complex', value: cSqrt(a0.value) };
        const x = asReal(a0);
        if (x < 0) {
          if (ctx.mode === 'CMPLX') return { kind: 'complex', value: cSqrt({ re: x, im: 0 }) };
          throw new CalcError('Math ERROR');
        }
        return { kind: 'real', value: Math.sqrt(x) };
      }
      case '³√(':
        return { kind: 'real', value: Math.cbrt(asReal(a0)) };
      case 'Abs(': {
        if (a0.kind === 'complex') {
          return { kind: 'real', value: Math.hypot(a0.value.re, a0.value.im) };
        }
        if (a0.kind === 'vector') {
          return {
            kind: 'real',
            value: Math.hypot(...a0.value),
          };
        }
        return { kind: 'real', value: Math.abs(asReal(a0)) };
      }
      case 'Arg(': {
        const c = asComplex(a0);
        if (c.re === 0 && c.im === 0) throw new CalcError('Math ERROR');
        return { kind: 'real', value: fromRadians(Math.atan2(c.im, c.re), ctx.setup.angleUnit) };
      }
      case 'Conjg(': {
        const c = asComplex(a0);
        return { kind: 'complex', value: { re: c.re, im: -c.im } };
      }
      case 'Rnd(': {
        const x = asReal(a0);
        return { kind: 'real', value: Number(x.toPrecision(10)) };
      }
      case 'RanInt#(': {
        if (args.length !== 2) throw new CalcError('Argument ERROR');
        const min = Math.ceil(asReal(args[0]));
        const max = Math.floor(asReal(args[1]));
        if (min > max) throw new CalcError('Argument ERROR');
        return { kind: 'real', value: Math.floor(Math.random() * (max - min + 1)) + min };
      }
      case 'Pol(': {
        if (args.length !== 2) throw new CalcError('Argument ERROR');
        const x = asReal(args[0]);
        const y = asReal(args[1]);
        const r = Math.hypot(x, y);
        const theta = fromRadians(Math.atan2(y, x), ctx.setup.angleUnit);
        ctx.sideEffectXY?.(r, theta);
        return { kind: 'real', value: r };
      }
      case 'Rec(': {
        if (args.length !== 2) throw new CalcError('Argument ERROR');
        const r = asReal(args[0]);
        const theta = toRadians(asReal(args[1]), ctx.setup.angleUnit);
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        ctx.sideEffectXY?.(x, y);
        return { kind: 'real', value: x };
      }
      case 'det(': {
        if (a0.kind !== 'matrix') throw new CalcError('Dimension ERROR');
        return { kind: 'real', value: matDet(a0.value) };
      }
      case 'Trn(': {
        if (a0.kind !== 'matrix') throw new CalcError('Dimension ERROR');
        return { kind: 'matrix', value: matTrn(a0.value) };
      }
      case 'Not(':
        return { kind: 'real', value: ~(asReal(a0) | 0) };
      case 'Neg(':
        return { kind: 'real', value: -(asReal(a0) | 0) };
      default:
        throw new CalcError('Syntax ERROR');
    }
  };

  const evalStructuredNode = (node: AstNode): EvalValue => {
    switch (node.type) {
      case 'frac': {
        const num = evaluateAst(node.num, ctx);
        const den = evaluateAst(node.den, ctx);
        return applyDiv(num, den);
      }
      case 'mixedFrac': {
        const whole = asReal(evaluateAst(node.whole, ctx));
        const num = asReal(evaluateAst(node.num, ctx));
        const den = asReal(evaluateAst(node.den, ctx));
        if (den === 0) throw new CalcError('Math ERROR');
        const sign = whole < 0 ? -1 : 1;
        return { kind: 'real', value: whole + (sign * num) / den };
      }
      case 'sqrt': {
        const inner = evaluateAst(node.inner, ctx);
        if (inner.kind === 'complex') return { kind: 'complex', value: cSqrt(inner.value) };
        const x = asReal(inner);
        if (x < 0) {
          if (ctx.mode === 'CMPLX') return { kind: 'complex', value: cSqrt({ re: x, im: 0 }) };
          throw new CalcError('Math ERROR');
        }
        return { kind: 'real', value: Math.sqrt(x) };
      }
      case 'cbrt': {
        const x = asReal(evaluateAst(node.inner, ctx));
        return { kind: 'real', value: Math.cbrt(x) };
      }
      case 'nthRoot': {
        const n = asReal(evaluateAst(node.index, ctx));
        const x = asReal(evaluateAst(node.inner, ctx));
        if (n === 0) throw new CalcError('Math ERROR');
        if (x < 0) {
          if (Number.isInteger(n) && Math.abs(n) % 2 === 1) {
            return { kind: 'real', value: -Math.pow(-x, 1 / n) };
          }
          throw new CalcError('Math ERROR');
        }
        return { kind: 'real', value: Math.pow(x, 1 / n) };
      }
      case 'pow': {
        const base = evaluateAst(node.base, ctx);
        const exp = evaluateAst(node.exp, ctx);
        if (base.kind === 'complex') {
          return { kind: 'complex', value: cPowInt(base.value, asReal(exp)) };
        }
        if (base.kind === 'matrix') {
          const e = asReal(exp);
          if (e === -1) return { kind: 'matrix', value: matInv(base.value) };
          if (e === 2) return { kind: 'matrix', value: matMul(base.value, base.value) };
          if (e === 3) return { kind: 'matrix', value: matMul(matMul(base.value, base.value), base.value) };
          throw new CalcError('Math ERROR');
        }
        const b = asReal(base);
        const e = asReal(exp);
        const res = Math.pow(b, e);
        if (Number.isNaN(res) || !Number.isFinite(res)) throw new CalcError('Math ERROR');
        return { kind: 'real', value: res };
      }
      case 'logBase': {
        const base = asReal(evaluateAst(node.base, ctx));
        const inner = asReal(evaluateAst(node.inner, ctx));
        if (base <= 0 || base === 1 || inner <= 0) throw new CalcError('Math ERROR');
        return { kind: 'real', value: Math.log(inner) / Math.log(base) };
      }
      case 'abs': {
        const inner = evaluateAst(node.inner, ctx);
        if (inner.kind === 'complex') return { kind: 'real', value: Math.hypot(inner.value.re, inner.value.im) };
        if (inner.kind === 'vector') return { kind: 'real', value: Math.hypot(...inner.value) };
        return { kind: 'real', value: Math.abs(asReal(inner)) };
      }
      case 'integral': {
        const a = asReal(evaluateAst(node.lower, ctx));
        const b = asReal(evaluateAst(node.upper, ctx));
        return { kind: 'real', value: simpsonIntegral(node.expr, a, b, ctx) };
      }
      case 'deriv': {
        const x0 = asReal(evaluateAst(node.at, ctx));
        return { kind: 'real', value: numericalDerivative(node.expr, x0, ctx) };
      }
      case 'sum': {
        const a = Math.round(asReal(evaluateAst(node.lower, ctx)));
        const b = Math.round(asReal(evaluateAst(node.upper, ctx)));
        if (b < a || b - a > 100000) throw new CalcError('Math ERROR');
        let total = 0;
        for (let k = a; k <= b; k++) {
          total += asReal(evaluateAst(node.expr, { ...ctx, xOverride: k }));
        }
        return { kind: 'real', value: total };
      }
      case 'text':
        throw new CalcError('Syntax ERROR');
    }
  };

  const result = parseOr();
  if (pos < tokens.length) throw new CalcError('Syntax ERROR');
  return result;
}

/**
 * Composite Simpson quadrature (with adaptive subdivision)
 */
function simpsonIntegral(expr: AstList, a: number, b: number, ctx: EvalContext): number {
  if (a === b) return 0;
  const f = (x: number): number => {
    const val = evaluateAst(expr, { ...ctx, xOverride: x });
    if (val.kind !== 'real' || !Number.isFinite(val.value)) throw new CalcError('Math ERROR');
    return val.value;
  };
  const n = 200; // even intervals
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  }
  return (sum * h) / 3;
}

/**
 * 4-point central difference numerical derivative
 */
function numericalDerivative(expr: AstList, x0: number, ctx: EvalContext): number {
  const f = (x: number): number => {
    const val = evaluateAst(expr, { ...ctx, xOverride: x });
    if (val.kind !== 'real' || !Number.isFinite(val.value)) throw new CalcError('Math ERROR');
    return val.value;
  };
  const h = Math.max(1e-5, Math.abs(x0) * 1e-5);
  return (-f(x0 + 2 * h) + 8 * f(x0 + h) - 8 * f(x0 - h) + f(x0 - 2 * h)) / (12 * h);
}

/**
 * Newton-Raphson SOLVE for X
 */
export function solveForX(
  lhsAst: AstList,
  rhsAst: AstList,
  initialX: number,
  ctx: EvalContext
): { root: number; residual: number } {
  const g = (x: number): number => {
    const l = evaluateAst(lhsAst, { ...ctx, xOverride: x });
    const r = rhsAst.length > 0 ? evaluateAst(rhsAst, { ...ctx, xOverride: x }) : { kind: 'real' as const, value: 0 };
    if (l.kind !== 'real' || r.kind !== 'real') throw new CalcError('Math ERROR');
    return l.value - r.value;
  };

  let x = Number.isFinite(initialX) ? initialX : 0;
  for (let iter = 0; iter < 80; iter++) {
    const fx = g(x);
    if (Math.abs(fx) < 1e-12) return { root: x, residual: fx };
    const h = Math.max(1e-6, Math.abs(x) * 1e-6);
    const df = (g(x + h) - g(x - h)) / (2 * h);
    if (Math.abs(df) < 1e-14) {
      x += 0.1;
      continue;
    }
    const step = fx / df;
    x -= step;
    if (Math.abs(step) < 1e-12 * Math.max(1, Math.abs(x))) {
      const res = g(x);
      return { root: x, residual: res };
    }
  }
  const finalRes = g(x);
  if (Math.abs(finalRes) > 1e-4) throw new CalcError("Can't Solve");
  return { root: x, residual: finalRes };
}

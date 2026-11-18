import { BaseSystem, ComplexNum, StatRow, StatType } from './types';

/**
 * Formats a 32-bit signed integer in BASE-N mode
 */
export function formatBaseN(val: number, base: BaseSystem): string {
  const int32 = val | 0;
  if (base === 'DEC') return int32.toString(10);
  const unsigned = int32 >>> 0;
  if (base === 'HEX') return unsigned.toString(16).toUpperCase();
  if (base === 'OCT') return unsigned.toString(8);
  // BIN: show up to 16 or 32 bits cleanly, grouped by 4
  const binStr = unsigned === 0 ? '0' : unsigned.toString(2);
  return binStr;
}

export interface EqnSolutionItem {
  label: string;
  value: number | ComplexNum;
}

/**
 * 2x2 Linear System:
 * a1 X + b1 Y = c1
 * a2 X + b2 Y = c2
 */
export function solveLinear2x2(coeffs: number[]): EqnSolutionItem[] | 'NO_SOL' | 'INF_SOL' {
  const [a1, b1, c1, a2, b2, c2] = coeffs;
  const det = a1 * b2 - a2 * b1;
  const dx = c1 * b2 - c2 * b1;
  const dy = a1 * c2 - a2 * c1;
  if (Math.abs(det) < 1e-13) {
    if (Math.abs(dx) < 1e-13 && Math.abs(dy) < 1e-13) return 'INF_SOL';
    return 'NO_SOL';
  }
  return [
    { label: 'X=', value: dx / det },
    { label: 'Y=', value: dy / det },
  ];
}

/**
 * 3x3 Linear System via Gaussian Elimination with Partial Pivoting
 */
export function solveLinear3x3(coeffs: number[]): EqnSolutionItem[] | 'NO_SOL' | 'INF_SOL' {
  const m = [
    [coeffs[0], coeffs[1], coeffs[2], coeffs[3]],
    [coeffs[4], coeffs[5], coeffs[6], coeffs[7]],
    [coeffs[8], coeffs[9], coeffs[10], coeffs[11]],
  ];

  for (let col = 0; col < 3; col++) {
    let pivot = col;
    for (let row = col + 1; row < 3; row++) {
      if (Math.abs(m[row][col]) > Math.abs(m[pivot][col])) pivot = row;
    }
    if (pivot !== col) {
      const tmp = m[col];
      m[col] = m[pivot];
      m[pivot] = tmp;
    }
    if (Math.abs(m[col][col]) < 1e-13) {
      return 'NO_SOL';
    }
    for (let row = col + 1; row < 3; row++) {
      const factor = m[row][col] / m[col][col];
      for (let k = col; k < 4; k++) m[row][k] -= factor * m[col][k];
    }
  }

  const z = m[2][3] / m[2][2];
  const y = (m[1][3] - m[1][2] * z) / m[1][1];
  const x = (m[0][3] - m[0][1] * y - m[0][2] * z) / m[0][0];

  return [
    { label: 'X=', value: x },
    { label: 'Y=', value: y },
    { label: 'Z=', value: z },
  ];
}

/**
 * Quadratic Equation: aX^2 + bX + c = 0
 */
export function solveQuadratic(a: number, b: number, c: number): EqnSolutionItem[] {
  if (Math.abs(a) < 1e-14) {
    if (Math.abs(b) < 1e-14) return [];
    return [{ label: 'X=', value: -c / b }];
  }
  const disc = b * b - 4 * a * c;
  const vx = -b / (2 * a);
  const vy = a * vx * vx + b * vx + c;
  const minMaxLabelX = a > 0 ? 'X-Min=' : 'X-Max=';
  const minMaxLabelY = a > 0 ? 'Y-Min=' : 'Y-Max=';

  if (disc >= 0) {
    const sq = Math.sqrt(disc);
    const x1 = (-b + sq) / (2 * a);
    const x2 = (-b - sq) / (2 * a);
    return [
      { label: 'X₁=', value: x1 },
      { label: 'X₂=', value: x2 },
      { label: minMaxLabelX, value: vx },
      { label: minMaxLabelY, value: vy },
    ];
  } else {
    const im = Math.sqrt(-disc) / (2 * a);
    const re = -b / (2 * a);
    return [
      { label: 'X₁=', value: { re, im: Math.abs(im) } },
      { label: 'X₂=', value: { re, im: -Math.abs(im) } },
      { label: minMaxLabelX, value: vx },
      { label: minMaxLabelY, value: vy },
    ];
  }
}

/**
 * Cubic Equation: aX^3 + bX^2 + cX + d = 0
 */
export function solveCubic(a: number, b: number, c: number, d: number): EqnSolutionItem[] {
  if (Math.abs(a) < 1e-14) return solveQuadratic(b, c, d);
  const A = b / a;
  const B = c / a;
  const C = d / a;

  const p = B - (A * A) / 3;
  const q = (2 * A * A * A) / 27 - (A * B) / 3 + C;
  const disc = (q * q) / 4 + (p * p * p) / 27;
  const shift = -A / 3;

  if (disc > 1e-12) {
    const sqrtDisc = Math.sqrt(disc);
    const u = Math.cbrt(-q / 2 + sqrtDisc);
    const v = Math.cbrt(-q / 2 - sqrtDisc);
    const x1 = u + v + shift;
    const realPart = -(u + v) / 2 + shift;
    const imagPart = ((u - v) * Math.sqrt(3)) / 2;
    return [
      { label: 'X₁=', value: x1 },
      { label: 'X₂=', value: { re: realPart, im: Math.abs(imagPart) } },
      { label: 'X₃=', value: { re: realPart, im: -Math.abs(imagPart) } },
    ];
  } else if (Math.abs(disc) <= 1e-12) {
    if (Math.abs(q) < 1e-12) {
      return [
        { label: 'X₁=', value: shift },
        { label: 'X₂=', value: shift },
        { label: 'X₃=', value: shift },
      ];
    }
    const u = Math.cbrt(-q / 2);
    return [
      { label: 'X₁=', value: 2 * u + shift },
      { label: 'X₂=', value: -u + shift },
      { label: 'X₃=', value: -u + shift },
    ];
  } else {
    const r = Math.sqrt((-p * p * p) / 27);
    const phi = Math.acos(Math.max(-1, Math.min(1, -q / (2 * r))));
    const m = 2 * Math.sqrt(-p / 3);
    const x1 = m * Math.cos(phi / 3) + shift;
    const x2 = m * Math.cos((phi + 2 * Math.PI) / 3) + shift;
    const x3 = m * Math.cos((phi + 4 * Math.PI) / 3) + shift;
    return [
      { label: 'X₁=', value: x1 },
      { label: 'X₂=', value: x2 },
      { label: 'X₃=', value: x3 },
    ];
  }
}

export interface StatSummary {
  n: number;
  sumX: number;
  sumX2: number;
  meanX: number;
  sigmaX: number;
  sX: number;
  minX: number;
  maxX: number;
  q1: number;
  med: number;
  q3: number;
  sumY: number;
  sumY2: number;
  sumXY: number;
  meanY: number;
  sigmaY: number;
  sY: number;
  minY: number;
  maxY: number;
  regA: number;
  regB: number;
  regC: number;
  regR: number;
}

function linearFit(xs: number[], ys: number[], ws: number[]) {
  let n = 0;
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (let i = 0; i < xs.length; i++) {
    const w = ws[i];
    n += w;
    sx += w * xs[i];
    sy += w * ys[i];
    sxx += w * xs[i] * xs[i];
    syy += w * ys[i] * ys[i];
    sxy += w * xs[i] * ys[i];
  }
  const denom = n * sxx - sx * sx;
  const B = denom !== 0 ? (n * sxy - sx * sy) / denom : 0;
  const A = n !== 0 ? (sy - B * sx) / n : 0;
  const rDenom = Math.sqrt(Math.max(0, (n * sxx - sx * sx) * (n * syy - sy * sy)));
  const r = rDenom !== 0 ? (n * sxy - sx * sy) / rDenom : 0;
  return { A, B, r };
}

export function computeStatSummary(rows: StatRow[], statType: StatType): StatSummary {
  const valid = rows.filter((r) => Number.isFinite(r.x) && r.freq > 0);
  if (valid.length === 0) {
    return {
      n: 0, sumX: 0, sumX2: 0, meanX: 0, sigmaX: 0, sX: 0, minX: 0, maxX: 0, q1: 0, med: 0, q3: 0,
      sumY: 0, sumY2: 0, sumXY: 0, meanY: 0, sigmaY: 0, sY: 0, minY: 0, maxY: 0,
      regA: 0, regB: 0, regC: 0, regR: 0,
    };
  }

  let n = 0;
  let sumX = 0;
  let sumX2 = 0;
  let sumY = 0;
  let sumY2 = 0;
  let sumXY = 0;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const expandedX: number[] = [];

  for (const row of valid) {
    const f = row.freq;
    const x = row.x;
    const y = row.y ?? 0;
    n += f;
    sumX += f * x;
    sumX2 += f * x * x;
    sumY += f * y;
    sumY2 += f * y * y;
    sumXY += f * x * y;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (expandedX.length < 2000) {
      const copies = Math.min(500, Math.round(f));
      for (let k = 0; k < copies; k++) expandedX.push(x);
    }
  }

  const meanX = sumX / n;
  const meanY = sumY / n;
  const varPopX = Math.max(0, sumX2 / n - meanX * meanX);
  const varPopY = Math.max(0, sumY2 / n - meanY * meanY);
  const sigmaX = Math.sqrt(varPopX);
  const sigmaY = Math.sqrt(varPopY);
  const sX = n > 1 ? Math.sqrt(Math.max(0, (sumX2 - n * meanX * meanX) / (n - 1))) : 0;
  const sY = n > 1 ? Math.sqrt(Math.max(0, (sumY2 - n * meanY * meanY) / (n - 1))) : 0;

  expandedX.sort((a, b) => a - b);
  const medianOf = (arr: number[]): number => {
    if (arr.length === 0) return 0;
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 === 1 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
  };
  const med = medianOf(expandedX);
  const half = Math.floor(expandedX.length / 2);
  const lowerHalf = expandedX.slice(0, half);
  const upperHalf = expandedX.length % 2 === 0 ? expandedX.slice(half) : expandedX.slice(half + 1);
  const q1 = medianOf(lowerHalf.length > 0 ? lowerHalf : expandedX);
  const q3 = medianOf(upperHalf.length > 0 ? upperHalf : expandedX);

  let regA = 0;
  let regB = 0;
  let regC = 0;
  let regR = 0;

  if (statType !== '1-VAR' && valid.length >= 2) {
    const xs = valid.map((r) => r.x);
    const ys = valid.map((r) => r.y ?? 0);
    const ws = valid.map((r) => r.freq);

    if (statType === 'A+BX') {
      const fit = linearFit(xs, ys, ws);
      regA = fit.A; regB = fit.B; regR = fit.r;
    } else if (statType === 'lnX') {
      const fit = linearFit(xs.map((x) => Math.log(Math.max(1e-12, x))), ys, ws);
      regA = fit.A; regB = fit.B; regR = fit.r;
    } else if (statType === 'e^X') {
      const fit = linearFit(xs, ys.map((y) => Math.log(Math.max(1e-12, y))), ws);
      regA = Math.exp(fit.A); regB = fit.B; regR = fit.r;
    } else if (statType === 'A*B^X') {
      const fit = linearFit(xs, ys.map((y) => Math.log(Math.max(1e-12, y))), ws);
      regA = Math.exp(fit.A); regB = Math.exp(fit.B); regR = fit.r;
    } else if (statType === 'A*X^B') {
      const fit = linearFit(
        xs.map((x) => Math.log(Math.max(1e-12, x))),
        ys.map((y) => Math.log(Math.max(1e-12, y))),
        ws
      );
      regA = Math.exp(fit.A); regB = fit.B; regR = fit.r;
    } else if (statType === '1/X') {
      const fit = linearFit(xs.map((x) => 1 / (x === 0 ? 1e-12 : x)), ys, ws);
      regA = fit.A; regB = fit.B; regR = fit.r;
    } else if (statType === '_+CX2') {
      // Quadratic least squares: y = A + Bx + Cx^2
      let s0 = 0, s1 = 0, s2 = 0, s3 = 0, s4 = 0, t0 = 0, t1 = 0, t2 = 0;
      for (let i = 0; i < xs.length; i++) {
        const w = ws[i], x = xs[i], y = ys[i], x2 = x * x;
        s0 += w; s1 += w * x; s2 += w * x2; s3 += w * x2 * x; s4 += w * x2 * x2;
        t0 += w * y; t1 += w * x * y; t2 += w * x2 * y;
      }
      const sol = solveLinear3x3([s0, s1, s2, t0, s1, s2, s3, t1, s2, s3, s4, t2]);
      if (Array.isArray(sol)) {
        regA = Number(sol[0].value);
        regB = Number(sol[1].value);
        regC = Number(sol[2].value);
      }
    }
  }

  return {
    n, sumX, sumX2, meanX, sigmaX, sX, minX, maxX, q1, med, q3,
    sumY, sumY2, sumXY, meanY, sigmaY, sY, minY, maxY,
    regA, regB, regC, regR,
  };
}

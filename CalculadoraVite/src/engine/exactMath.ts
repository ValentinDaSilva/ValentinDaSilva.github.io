import { ComplexNum, FractionMode, SetupConfig } from './types';

export interface ExactResult {
  kind: 'rational' | 'surd' | 'pi' | 'decimal';
  // Represents (num / den) * sqrt(rad)  or  (num / den) * pi
  num: number;
  den: number;
  rad: number; // 1 if purely rational
  piFactor?: boolean;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

/**
 * Continued-fraction rational approximation within tolerance.
 */
export function floatToFraction(
  value: number,
  maxDen = 10000,
  tol = 1e-10
): { num: number; den: number } | null {
  if (!Number.isFinite(value)) return null;
  if (Math.abs(value) < tol) return { num: 0, den: 1 };

  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  if (x > 1e8) return null;

  let h1 = 1;
  let h2 = 0;
  let k1 = 0;
  let k2 = 1;
  let b = x;

  for (let i = 0; i < 32; i++) {
    const a = Math.floor(b);
    const auxH = a * h1 + h2;
    const auxK = a * k1 + k2;
    if (auxK > maxDen) break;
    h2 = h1;
    h1 = auxH;
    k2 = k1;
    k1 = auxK;
    const approx = h1 / k1;
    if (Math.abs(x - approx) <= tol * Math.max(1, x)) {
      const g = gcd(h1, k1);
      return { num: sign * (h1 / g), den: k1 / g };
    }
    const rem = b - a;
    if (rem < 1e-13) break;
    b = 1 / rem;
  }

  const approx = h1 / k1;
  if (k1 <= maxDen && Math.abs(x - approx) <= tol * Math.max(1, x)) {
    const g = gcd(h1, k1);
    return { num: sign * (h1 / g), den: k1 / g };
  }
  return null;
}

/**
 * Simplifies sqrt(n) into k * sqrt(rad) for integer n > 0
 */
function simplifySquareFree(n: number): { k: number; rad: number } {
  let k = 1;
  let rad = Math.round(n);
  for (let d = 2; d * d <= rad; d++) {
    while (rad % (d * d) === 0) {
      k *= d;
      rad /= d * d;
    }
  }
  return { k, rad };
}

/**
 * Attempts to represent a real number in Casio MathIO exact symbolic form:
 * - Rational p/q (den <= 999)
 * - Surd (p/q) * sqrt(r) for small square-free r (2..47)
 * - Pi multiple (p/q) * pi
 */
export function toExactResult(value: number): ExactResult {
  if (!Number.isFinite(value)) {
    return { kind: 'decimal', num: value, den: 1, rad: 1 };
  }
  if (Math.abs(value) < 1e-12) {
    return { kind: 'rational', num: 0, den: 1, rad: 1 };
  }

  // 1. Check exact rational
  const rat = floatToFraction(value, 1000, 1e-10);
  if (rat && Math.abs(rat.num) < 1e6) {
    return { kind: 'rational', num: rat.num, den: rat.den, rad: 1 };
  }

  // 2. Check rational multiple of pi
  const piRatio = value / Math.PI;
  const piFrac = floatToFraction(piRatio, 180, 1e-10);
  if (piFrac && piFrac.num !== 0 && Math.abs(piFrac.num) <= 360) {
    return { kind: 'pi', num: piFrac.num, den: piFrac.den, rad: 1, piFactor: true };
  }

  // 3. Check rational multiple of sqrt(r) for square-free r <= 47
  const squareFreeList = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 29, 30, 31, 33, 34, 35, 37, 38, 39, 41, 42, 43, 46, 47];
  for (const r of squareFreeList) {
    const ratio = value / Math.sqrt(r);
    const f = floatToFraction(ratio, 200, 1e-10);
    if (f && f.num !== 0 && Math.abs(f.num) <= 500) {
      const { k, rad } = simplifySquareFree(r);
      return { kind: 'surd', num: f.num * k, den: f.den, rad };
    }
  }

  return { kind: 'decimal', num: value, den: 1, rad: 1 };
}

export function formatExactText(exact: ExactResult, fracMode: FractionMode): string {
  if (exact.kind === 'decimal') {
    return '';
  }
  const { num, den, rad } = exact;
  if (num === 0) return '0';
  const sign = num < 0 ? '-' : '';
  const absNum = Math.abs(num);

  if (exact.kind === 'rational') {
    if (den === 1) return `${num}`;
    if (fracMode === 'ab/c' && absNum > den) {
      const whole = Math.floor(absNum / den);
      const rem = absNum % den;
      return `${sign}${whole} ${rem}/${den}`;
    }
    return `${num}/${den}`;
  }

  if (exact.kind === 'pi') {
    const numStr = absNum === 1 ? 'π' : `${absNum}π`;
    if (den === 1) return `${sign}${numStr}`;
    return `${sign}${numStr}/${den}`;
  }

  // surd
  const surdPart = rad === 1 ? '' : `√${rad}`;
  const numPart = absNum === 1 && surdPart ? surdPart : `${absNum}${surdPart}`;
  if (den === 1) return `${sign}${numPart}`;
  return `${sign}${numPart}/${den}`;
}

/**
 * Formats a floating point number following Casio fx-570LA PLUS display rules:
 * - Handles floating-point near-zero snapping (< 1e-12 -> 0)
 * - Supports NORM1, NORM2, FIX (0..9), SCI (0..9)
 * - Caps visible mantissa at 10 digits with ×10^n notation
 */
export function formatCasioNumber(
  raw: number,
  setup: Pick<SetupConfig, 'displayFormat' | 'fixDigits' | 'sciDigits'>,
  engShift = 0
): string {
  if (Number.isNaN(raw)) return 'Math ERROR';
  if (!Number.isFinite(raw)) return 'Math ERROR';

  const val = Math.abs(raw) < 1e-12 ? 0 : raw;
  if (val === 0) {
    if (setup.displayFormat === 'FIX') {
      return setup.fixDigits === 0 ? '0' : `0.${'0'.repeat(setup.fixDigits)}`;
    }
    if (setup.displayFormat === 'SCI') {
      const d = Math.max(0, setup.sciDigits - 1);
      return d > 0 ? `0.${'0'.repeat(d)}×10^00` : '0×10^00';
    }
    return '0';
  }

  if (engShift !== 0) {
    const baseExp = Math.floor(Math.log10(Math.abs(val)) / 3) * 3 + engShift * 3;
    const mantissa = val / Math.pow(10, baseExp);
    const mStr = trimTrailingZeros(mantissa.toPrecision(10));
    return `${mStr}×10^${formatExp(baseExp)}`;
  }

  if (setup.displayFormat === 'FIX') {
    if (Math.abs(val) >= 1e10) {
      const exp = Math.floor(Math.log10(Math.abs(val)));
      const mant = val / Math.pow(10, exp);
      return `${trimTrailingZeros(mant.toFixed(Math.min(9, setup.fixDigits)))}×10^${formatExp(exp)}`;
    }
    return val.toFixed(setup.fixDigits);
  }

  if (setup.displayFormat === 'SCI') {
    const exp = Math.floor(Math.log10(Math.abs(val)));
    const mant = val / Math.pow(10, exp);
    const decimals = Math.max(0, setup.sciDigits - 1);
    let mStr = mant.toFixed(decimals);
    if (Math.abs(parseFloat(mStr)) >= 10) {
      mStr = (parseFloat(mStr) / 10).toFixed(decimals);
      return `${mStr}×10^${formatExp(exp + 1)}`;
    }
    return `${mStr}×10^${formatExp(exp)}`;
  }

  // NORM1 or NORM2
  const abs = Math.abs(val);
  const lowThreshold = setup.displayFormat === 'NORM1' ? 1e-2 : 1e-9;
  if (abs >= 1e10 || abs < lowThreshold) {
    const exp = Math.floor(Math.log10(abs));
    const mant = val / Math.pow(10, exp);
    let mStr = trimTrailingZeros(mant.toPrecision(10));
    if (Math.abs(parseFloat(mStr)) >= 10) {
      mStr = trimTrailingZeros((parseFloat(mStr) / 10).toPrecision(10));
      return `${mStr}×10^${formatExp(exp + 1)}`;
    }
    return `${mStr}×10^${formatExp(exp)}`;
  }

  // Standard 10-digit representation
  const str = Number(val.toPrecision(10)).toString();
  if (str.includes('e')) {
    const [m, e] = str.split('e');
    return `${trimTrailingZeros(m)}×10^${formatExp(parseInt(e, 10))}`;
  }
  return str;
}

function formatExp(exp: number): string {
  const sign = exp < 0 ? '-' : '';
  const abs = Math.abs(exp);
  return `${sign}${abs < 10 ? '0' + abs : abs}`;
}

function trimTrailingZeros(s: string): string {
  if (!s.includes('.')) return s;
  return s.replace(/\.?0+$/, '');
}

/**
 * Formats a complex number in either a+bi or r∠θ
 */
export function formatComplex(
  c: ComplexNum,
  setup: SetupConfig
): string {
  const re = Math.abs(c.re) < 1e-12 ? 0 : c.re;
  const im = Math.abs(c.im) < 1e-12 ? 0 : c.im;

  if (setup.complexFormat === 'r<theta') {
    const r = Math.hypot(re, im);
    let thetaRad = Math.atan2(im, re);
    let theta = thetaRad;
    if (setup.angleUnit === 'DEG') theta = (thetaRad * 180) / Math.PI;
    else if (setup.angleUnit === 'GRA') theta = (thetaRad * 200) / Math.PI;
    return `${formatCasioNumber(r, setup)}∠${formatCasioNumber(theta, setup)}`;
  }

  if (im === 0) return formatCasioNumber(re, setup);
  if (re === 0) {
    if (Math.abs(im - 1) < 1e-11) return 'i';
    if (Math.abs(im + 1) < 1e-11) return '-i';
    return `${formatCasioNumber(im, setup)}i`;
  }
  const sign = im >= 0 ? '+' : '-';
  const absIm = Math.abs(im);
  const imPart = Math.abs(absIm - 1) < 1e-11 ? 'i' : `${formatCasioNumber(absIm, setup)}i`;
  return `${formatCasioNumber(re, setup)}${sign}${imPart}`;
}

/**
 * Prime factorization (FACT) for integers up to 9999999999
 */
export function primeFactorize(value: number): string | null {
  if (!Number.isInteger(value) || Math.abs(value) < 2 || Math.abs(value) > 1e10) {
    return null;
  }
  let n = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  const factors: Array<{ p: number; exp: number }> = [];

  let d = 2;
  while (d * d <= n) {
    let count = 0;
    while (n % d === 0) {
      n /= d;
      count += 1;
    }
    if (count > 0) factors.push({ p: d, exp: count });
    d = d === 2 ? 3 : d + 2;
    if (d > 100000) break;
  }
  if (n > 1) factors.push({ p: n, exp: 1 });

  return (
    sign +
    factors
      .map((f) => (f.exp > 1 ? `${f.p}^${f.exp}` : `${f.p}`))
      .join('×')
  );
}

/**
 * Formats a decimal degree value as Degrees°Minutes'Seconds.ss"
 */
export function formatDMS(value: number): string {
  if (!Number.isFinite(value)) return 'Math ERROR';
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const deg = Math.floor(abs + 1e-12);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat + 1e-10);
  const sec = Math.max(0, (minFloat - min) * 60);
  const secRounded = Math.round(sec * 100) / 100;
  return `${sign}${deg}°${min}′${secRounded}″`;
}

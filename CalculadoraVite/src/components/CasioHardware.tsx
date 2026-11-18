import React from 'react';
import { BaseSystem, CalcMode } from '../engine/types';
import { LcdScreen } from './LcdScreen';

export type KeyId =
  | 'SHIFT' | 'ALPHA' | 'MODE' | 'ON'
  | 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
  | 'CALC' | 'INTEGRAL' | 'INV' | 'LOGBASE'
  | 'FRAC' | 'SQRT' | 'X2' | 'POW' | 'LOG' | 'LN'
  | 'NEG' | 'DMS' | 'HYP' | 'SIN' | 'COS' | 'TAN'
  | 'RCL' | 'ENG' | 'LPAREN' | 'RPAREN' | 'SD' | 'MPLUS'
  | '7' | '8' | '9' | 'DEL' | 'AC'
  | '4' | '5' | '6' | 'MUL' | 'DIV'
  | '1' | '2' | '3' | 'ADD' | 'SUB'
  | '0' | 'DOT' | 'EXP10' | 'ANS' | 'EQ';

interface CasioHardwareProps {
  onKeyPress: (key: KeyId) => void;
  pressedKey: KeyId | null;
  mode: CalcMode;
  baseSystem: BaseSystem;
  lcdProps: React.ComponentProps<typeof LcdScreen>;
}

interface SciKeyDef {
  id: KeyId;
  main: React.ReactNode;
  shift?: string;
  alpha?: string;
  base?: string;
  title: string;
}

export const CasioHardware: React.FC<CasioHardwareProps> = ({
  onKeyPress,
  pressedKey,
  mode,
  baseSystem,
  lcdProps,
}) => {
  const keyClass = (id: KeyId, baseCls: string) =>
    `calc-key ${baseCls} ${pressedKey === id ? 'is-pressed ring-1 ring-white/40' : ''}`;

  const renderSciKey = (k: SciKeyDef) => (
    <div key={k.id} className="flex flex-col items-center">
      <div className="h-[13px] w-full flex items-end justify-between px-[2px] text-[8.5px] leading-none font-semibold tracking-tight select-none mb-[2px]">
        <span className="text-[#eab543] truncate">{k.shift ?? ''}</span>
        <span className="text-[#e8627c] truncate">{k.alpha ?? ''}</span>
      </div>
      <button
        type="button"
        onClick={() => onKeyPress(k.id)}
        title={k.title}
        aria-label={k.title}
        className={keyClass(
          k.id,
          'w-full h-[27px] rounded-[5px] bg-gradient-to-b from-[#343a42] to-[#23282e] border border-[#14171a] shadow-[0_2px_0_#111417,inset_0_1px_0_rgba(255,255,255,0.14)] text-[#f1f5f9] text-[11px] font-semibold flex items-center justify-center relative cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400'
        )}
      >
        <span>{k.main}</span>
        {k.base && (
          <span
            className={`absolute -bottom-[10px] right-0 text-[7.5px] font-mono font-bold ${
              mode === 'BASE' && baseSystem === k.base ? 'text-cyan-300' : 'text-[#67b8d6]/80'
            }`}
          >
            {k.base}
          </span>
        )}
      </button>
    </div>
  );

  const renderNumKey = (
    id: KeyId,
    main: string,
    shiftLabel: string | undefined,
    alphaLabel: string | undefined,
    variant: 'light' | 'coral' | 'op',
    title: string
  ) => {
    const surface =
      variant === 'coral'
        ? 'bg-gradient-to-b from-[#d97757] to-[#be5939] border-[#7e341e] shadow-[0_2.5px_0_#5e2413,inset_0_1px_0_rgba(255,255,255,0.28)] text-white'
        : variant === 'op'
        ? 'bg-gradient-to-b from-[#cfd5dc] to-[#aeb6c0] border-[#6a727c] shadow-[0_2.5px_0_#4c525a,inset_0_1px_0_rgba(255,255,255,0.55)] text-[#1a2026]'
        : 'bg-gradient-to-b from-[#eef1f4] to-[#cfd5dc] border-[#767e88] shadow-[0_2.5px_0_#535961,inset_0_1px_0_rgba(255,255,255,0.8)] text-[#14191f]';

    return (
      <div key={id} className="flex flex-col items-center">
        <div className="h-[13px] w-full flex items-end justify-center gap-1 px-[2px] text-[8.5px] leading-none font-semibold tracking-tight select-none mb-[2px]">
          {shiftLabel && <span className="text-[#eab543] truncate">{shiftLabel}</span>}
          {alphaLabel && <span className="text-[#e8627c] truncate">{alphaLabel}</span>}
        </div>
        <button
          type="button"
          onClick={() => onKeyPress(id)}
          title={title}
          aria-label={title}
          className={keyClass(
            id,
            `w-full h-[35px] rounded-[6px] border font-bold ${
              id === 'EXP10' || id === 'ANS' || id === 'DEL' || id === 'AC' ? 'text-[12.5px]' : 'text-[15px]'
            } flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400 ${surface}`
          )}
        >
          {main}
        </button>
      </div>
    );
  };

  const row2: SciKeyDef[] = [
    { id: 'FRAC', main: '□/□', shift: 'a b/c', title: 'Fracción (SHIFT: Fracción mixta)' },
    { id: 'SQRT', main: '√□', shift: '³√□', title: 'Raíz cuadrada (SHIFT: Raíz cúbica)' },
    { id: 'X2', main: 'x²', shift: 'x³', base: 'DEC', title: 'Cuadrado (SHIFT: Cubo)' },
    { id: 'POW', main: 'x^□', shift: 'ⁿ√□', base: 'HEX', title: 'Potencia (SHIFT: Raíz n-ésima)' },
    { id: 'LOG', main: 'log', shift: '10^□', base: 'BIN', title: 'Logaritmo base 10 (SHIFT: 10^x)' },
    { id: 'LN', main: 'ln', shift: 'e^□', base: 'OCT', title: 'Logaritmo natural (SHIFT: e^x)' },
  ];

  const row3: SciKeyDef[] = [
    { id: 'NEG', main: '(-)', alpha: 'A', title: 'Signo negativo (ALPHA: A)' },
    { id: 'DMS', main: '° ′ ″', shift: 'FACT', alpha: 'B', title: 'Grados/Min/Seg (SHIFT: FACT, ALPHA: B)' },
    { id: 'HYP', main: 'hyp', alpha: 'C', title: 'Funciones hiperbólicas (ALPHA: C)' },
    { id: 'SIN', main: 'sin', shift: 'sin⁻¹', alpha: 'D', title: 'Seno (SHIFT: Arcoseno, ALPHA: D)' },
    { id: 'COS', main: 'cos', shift: 'cos⁻¹', alpha: 'E', title: 'Coseno (SHIFT: Arcocoseno, ALPHA: E)' },
    { id: 'TAN', main: 'tan', shift: 'tan⁻¹', alpha: 'F', title: 'Tangente (SHIFT: Arcotangente, ALPHA: F)' },
  ];

  const row4: SciKeyDef[] = [
    { id: 'RCL', main: 'RCL', shift: 'STO', title: 'Recuperar variable (SHIFT: Guardar STO)' },
    { id: 'ENG', main: 'ENG', shift: '←', alpha: '𝐢', title: 'Notación ingeniería (CMPLX: i)' },
    { id: 'LPAREN', main: '(', shift: '%', title: 'Paréntesis izquierdo (SHIFT: %)' },
    { id: 'RPAREN', main: ')', shift: ',', alpha: 'X', title: 'Paréntesis derecho (SHIFT: Coma, ALPHA: X)' },
    { id: 'SD', main: 'S⇔D', shift: 'a b/c', alpha: 'Y', title: 'Fracción ↔ Decimal (ALPHA: Y)' },
    { id: 'MPLUS', main: 'M+', shift: 'M−', alpha: 'M', title: 'Sumar a memoria M (SHIFT: M−, ALPHA: M)' },
  ];

  return (
    <div className="w-[348px] sm:w-[368px] mx-auto select-none">
      {/* Outer Beveled Charcoal Body */}
      <div className="rounded-[22px] bg-gradient-to-b from-[#2f353d] via-[#272c33] to-[#1e2228] p-[14px] pb-[18px] border border-[#3e4650] shadow-[0_22px_45px_-12px_rgba(15,23,42,0.55),inset_0_1px_1px_rgba(255,255,255,0.16)]">
        {/* Upper Metallic Faceplate (Brand + Solar + LCD) */}
        <div className="rounded-[14px] bg-gradient-to-b from-[#3d444e] to-[#2e343c] p-[11px] border border-[#525b68]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
          {/* Header Row: Brand & Solar Cell */}
          <div className="flex items-start justify-between gap-2 mb-2 px-0.5">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-white font-extrabold tracking-[0.12em] text-[15px] leading-none">
                  CASIO
                </span>
                <span className="text-[#cbd5e1] italic font-semibold text-[11px] tracking-tight">
                  fx-570LA PLUS
                </span>
              </div>
              <div className="text-[8.5px] font-bold tracking-[0.09em] text-[#7dd3fc] mt-[3px]">
                NATURAL-V.P.A.M.
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="w-[74px] h-[22px] rounded-[3px] solar-panel-grid border border-[#1a1c1e] shadow-[inset_0_1px_3px_rgba(0,0,0,0.65)]" />
              <span className="text-[6.5px] tracking-[0.06em] text-[#94a3b8] font-semibold mt-[2px]">
                TWO WAY POWER
              </span>
            </div>
          </div>

          {/* Recessed LCD Screen Frame */}
          <div className="rounded-[8px] bg-[#1b2024] p-[4px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.65)]">
            <LcdScreen {...lcdProps} />
          </div>
        </div>

        {/* Top Control Cluster: SHIFT/ALPHA + Metallic REPLAY D-Pad + MODE/ON */}
        <div className="relative mt-[12px] mb-[6px] px-1">
          <div className="grid grid-cols-6 items-center gap-[6px]">
            {/* Col 1: SHIFT + CALC */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-[#eab543] mb-[2px]">SHIFT</span>
                <button
                  type="button"
                  onClick={() => onKeyPress('SHIFT')}
                  title="SHIFT (tecla secundaria)"
                  aria-label="SHIFT"
                  className={keyClass(
                    'SHIFT',
                    'w-[38px] h-[22px] rounded-full bg-gradient-to-b from-[#67717e] to-[#49515b] border border-[#24282e] shadow-[0_2px_0_#191c20,inset_0_1px_0_rgba(255,255,255,0.28)] cursor-pointer'
                  )}
                />
              </div>
              {renderSciKey({
                id: 'CALC',
                main: 'CALC',
                shift: 'SOLVE',
                alpha: '=',
                title: 'CALC (SHIFT: SOLVE, ALPHA: =)',
              })}
            </div>

            {/* Col 2: ALPHA + ∫dx */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-[#e8627c] mb-[2px]">ALPHA</span>
                <button
                  type="button"
                  onClick={() => onKeyPress('ALPHA')}
                  title="ALPHA (variables A-F, X, Y, M)"
                  aria-label="ALPHA"
                  className={keyClass(
                    'ALPHA',
                    'w-[38px] h-[22px] rounded-full bg-gradient-to-b from-[#67717e] to-[#49515b] border border-[#24282e] shadow-[0_2px_0_#191c20,inset_0_1px_0_rgba(255,255,255,0.28)] cursor-pointer'
                  )}
                />
              </div>
              {renderSciKey({
                id: 'INTEGRAL',
                main: '∫dx',
                shift: 'd/dx',
                title: 'Integral definida (SHIFT: Derivada d/dx)',
              })}
            </div>

            {/* Col 3-4: Signature Curved Silver REPLAY D-Pad */}
            <div className="col-span-2 flex flex-col items-center justify-center">
              <div className="relative w-[92px] h-[68px] rounded-[36px] bg-gradient-to-b from-[#cbd5e1] via-[#94a3b8] to-[#64748b] p-[3px] shadow-[0_3px_6px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center">
                <div className="w-full h-full rounded-[33px] bg-gradient-to-b from-[#464f5a] to-[#2c333b] relative flex items-center justify-center border border-[#1e2329]">
                  <span className="text-[6.5px] font-bold tracking-[0.12em] text-[#cbd5e1]/75 pointer-events-none select-none">
                    REPLAY
                  </span>

                  <button
                    type="button"
                    onClick={() => onKeyPress('UP')}
                    title="Arriba / Historial anterior"
                    aria-label="Flecha arriba"
                    className={keyClass(
                      'UP',
                      'absolute top-[2px] left-1/2 -translate-x-1/2 w-[30px] h-[18px] flex items-center justify-center text-[#e2e8f0] hover:text-white text-[10px] cursor-pointer'
                    )}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => onKeyPress('DOWN')}
                    title="Abajo / Historial siguiente"
                    aria-label="Flecha abajo"
                    className={keyClass(
                      'DOWN',
                      'absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[30px] h-[18px] flex items-center justify-center text-[#e2e8f0] hover:text-white text-[10px] cursor-pointer'
                    )}
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => onKeyPress('LEFT')}
                    title="Izquierda"
                    aria-label="Flecha izquierda"
                    className={keyClass(
                      'LEFT',
                      'absolute left-[3px] top-1/2 -translate-y-1/2 w-[20px] h-[28px] flex items-center justify-center text-[#e2e8f0] hover:text-white text-[10px] cursor-pointer'
                    )}
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => onKeyPress('RIGHT')}
                    title="Derecha"
                    aria-label="Flecha derecha"
                    className={keyClass(
                      'RIGHT',
                      'absolute right-[3px] top-1/2 -translate-y-1/2 w-[20px] h-[28px] flex items-center justify-center text-[#e2e8f0] hover:text-white text-[10px] cursor-pointer'
                    )}
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>

            {/* Col 5: MODE + x⁻¹ */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex flex-col items-center">
                <div className="text-[7.5px] font-bold mb-[2px] whitespace-nowrap">
                  <span className="text-[#e2e8f0]">MODE </span>
                  <span className="text-[#eab543]">SETUP</span>
                </div>
                <button
                  type="button"
                  onClick={() => onKeyPress('MODE')}
                  title="MODE (SHIFT: SETUP)"
                  aria-label="MODE / SETUP"
                  className={keyClass(
                    'MODE',
                    'w-[38px] h-[22px] rounded-full bg-gradient-to-b from-[#67717e] to-[#49515b] border border-[#24282e] shadow-[0_2px_0_#191c20,inset_0_1px_0_rgba(255,255,255,0.28)] cursor-pointer'
                  )}
                />
              </div>
              {renderSciKey({
                id: 'INV',
                main: 'x⁻¹',
                shift: 'x!',
                title: 'Inverso x⁻¹ (SHIFT: Factorial x!)',
              })}
            </div>

            {/* Col 6: ON + log_a(□) */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-[#e2e8f0] mb-[2px]">ON</span>
                <button
                  type="button"
                  onClick={() => onKeyPress('ON')}
                  title="Encender calculadora (ON)"
                  aria-label="ON"
                  className={keyClass(
                    'ON',
                    'w-[38px] h-[22px] rounded-full bg-gradient-to-b from-[#67717e] to-[#49515b] border border-[#24282e] shadow-[0_2px_0_#191c20,inset_0_1px_0_rgba(255,255,255,0.28)] cursor-pointer'
                  )}
                />
              </div>
              {renderSciKey({
                id: 'LOGBASE',
                main: 'logₐ□',
                shift: '∑',
                title: 'Logaritmo base a (SHIFT: Sumatoria ∑)',
              })}
            </div>
          </div>
        </div>

        {/* Scientific Keypad Rows 2–4 */}
        <div className="grid grid-cols-6 gap-x-[6px] gap-y-[7px] px-1 mt-1">
          {row2.map(renderSciKey)}
          {row3.map(renderSciKey)}
          {row4.map(renderSciKey)}
        </div>

        {/* Hairline Divider */}
        <div className="h-[1px] bg-white/10 my-[10px] mx-1" />

        {/* Numeric & Main Operations Keypad (5 cols × 4 rows) */}
        <div className="grid grid-cols-5 gap-x-[7px] gap-y-[6px] px-1">
          {renderNumKey('7', '7', 'CONST', undefined, 'light', '7 (SHIFT: CONST constantes)')}
          {renderNumKey('8', '8', 'CONV', undefined, 'light', '8 (SHIFT: CONV conversiones)')}
          {renderNumKey('9', '9', 'CLR', undefined, 'light', '9 (SHIFT: CLR borrar memoria)')}
          {renderNumKey('DEL', 'DEL', 'INS', undefined, 'coral', 'DEL (SHIFT: INS insertar)')}
          {renderNumKey('AC', 'AC', 'OFF', undefined, 'coral', 'AC (SHIFT: OFF apagar)')}

          {renderNumKey('4', '4', 'MATRIX', undefined, 'light', '4 (SHIFT: MATRIX)')}
          {renderNumKey('5', '5', 'VECTOR', undefined, 'light', '5 (SHIFT: VECTOR)')}
          {renderNumKey('6', '6', undefined, undefined, 'light', '6')}
          {renderNumKey('MUL', '×', 'nPr', undefined, 'op', 'Multiplicar (SHIFT: Permutaciones nPr)')}
          {renderNumKey('DIV', '÷', 'nCr', undefined, 'op', 'Dividir (SHIFT: Combinaciones nCr)')}

          {renderNumKey('1', '1', 'STAT', undefined, 'light', '1 (SHIFT: STAT estadística)')}
          {renderNumKey('2', '2', 'CMPLX', undefined, 'light', '2 (SHIFT: CMPLX complejos)')}
          {renderNumKey('3', '3', 'BASE', undefined, 'light', '3 (SHIFT: BASE-N)')}
          {renderNumKey('ADD', '+', 'Pol', undefined, 'op', 'Sumar (SHIFT: Pol)')}
          {renderNumKey('SUB', '−', 'Rec', undefined, 'op', 'Restar (SHIFT: Rec)')}

          {renderNumKey('0', '0', 'Rnd', undefined, 'light', '0 (SHIFT: Rnd redondear)')}
          {renderNumKey('DOT', '.', 'Ran#', 'RanInt', 'light', '. (SHIFT: Ran#, ALPHA: RanInt)')}
          {renderNumKey('EXP10', '×10ˣ', 'π', 'e', 'light', '×10^x (SHIFT: π, ALPHA: e)')}
          {renderNumKey('ANS', 'Ans', 'DRG▶', undefined, 'light', 'Ans (SHIFT: DRG▶ unidad ángulo)')}
          {renderNumKey('EQ', '=', '≈', undefined, 'op', 'Igual / Ejecutar (SHIFT: ≈ decimal)')}
        </div>
      </div>
    </div>
  );
};

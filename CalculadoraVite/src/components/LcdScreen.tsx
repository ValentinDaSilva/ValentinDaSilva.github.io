import React from 'react';
import { SCIENTIFIC_CONSTANTS, UNIT_CONVERSIONS } from '../engine/constants';
import { ExactResult, formatCasioNumber, formatComplex } from '../engine/exactMath';
import { EqnSolutionItem, formatBaseN } from '../engine/modes';
import {
  ActivePopupMenu,
  AstCursor,
  AstList,
  AstNode,
  BaseSystem,
  CalcMode,
  ComplexNum,
  CursorPathItem,
  EqnType,
  MatrixData,
  MemoryBank,
  SetupConfig,
  StatRow,
  StatType,
  VectorData,
} from '../engine/types';

export interface LcdDisplayResult {
  kind: 'real' | 'complex' | 'matrix' | 'vector' | 'text';
  realVal?: number;
  exact?: ExactResult;
  complexVal?: ComplexNum;
  matrixVal?: MatrixData;
  vectorVal?: VectorData;
  textVal?: string;
  showDecimal: boolean; // toggled by S<=>D
  engShift: number;
  dmsMode: boolean;
  dmsText?: string;
  factText?: string;
  factActive: boolean;
}

export interface EqnScreenState {
  stage: 'EDIT' | 'RESULT';
  eqnType: EqnType;
  coeffs: number[];
  cursorIdx: number;
  inputBuf: string;
  solutions: EqnSolutionItem[];
  solIdx: number;
  specialMsg?: string;
}

export interface StatScreenState {
  stage: 'DATA' | 'CALC';
  cursorRow: number;
  cursorCol: 0 | 1 | 2; // 0:X, 1:Y, 2:FREQ
  inputBuf: string;
}

export interface MatVecEditorState {
  active: boolean;
  kind: 'MATRIX' | 'VECTOR';
  target: 'A' | 'B' | 'C';
  row: number;
  col: number;
  inputBuf: string;
}

export interface TableScreenState {
  stage: 'FX' | 'GX' | 'START' | 'END' | 'STEP' | 'VIEW';
  start: number;
  end: number;
  step: number;
  inputBuf: string;
  rows: Array<{ x: number; fx: number | string; gx?: number | string }>;
  scrollRow: number;
}

export interface PromptState {
  kind: 'NONE' | 'CALC_VAR' | 'SOLVE_X' | 'SOLVE_RESULT' | 'FIX_DIGITS' | 'SCI_DIGITS' | 'NORM_SELECT' | 'CONTRAST';
  varName?: string;
  varList?: string[];
  varIndex?: number;
  inputBuf: string;
  solveRoot?: number;
  solveResidual?: number;
}

interface LcdScreenProps {
  isOn: boolean;
  shift: boolean;
  alpha: boolean;
  insertMode: boolean;
  mode: CalcMode;
  baseSystem: BaseSystem;
  setup: SetupConfig;
  memory: MemoryBank;
  ast: AstList;
  cursor: AstCursor;
  result: LcdDisplayResult | null;
  errorMsg: string | null;
  popup: ActivePopupMenu;
  eqnState: EqnScreenState;
  statType: StatType;
  statRows: StatRow[];
  statScreen: StatScreenState;
  matVecEditor: MatVecEditorState;
  tableState: TableScreenState;
  prompt: PromptState;
  hasHistoryAbove: boolean;
  hasHistoryBelow: boolean;
  solveExprMode: boolean;
}

const CursorMark: React.FC<{ insertMode: boolean }> = ({ insertMode }) => (
  <span
    className={`lcd-cursor inline-block align-middle ${
      insertMode ? 'w-[2px] h-[1.1em] bg-[#131d14]' : 'w-[5px] h-[1.15em] bg-[#131d14]/85'
    }`}
    aria-hidden="true"
  />
);

function renderExactFraction(exact: ExactResult, fracMode: 'ab/c' | 'd/c'): React.ReactNode {
  const { num, den, rad, kind } = exact;
  const sign = num < 0 ? '−' : '';
  const absNum = Math.abs(num);

  if (kind === 'rational') {
    if (den === 1) return <span>{sign}{absNum}</span>;
    if (fracMode === 'ab/c' && absNum > den) {
      const whole = Math.floor(absNum / den);
      const rem = absNum % den;
      return (
        <span className="inline-flex items-center gap-0.5 align-middle">
          <span>{sign}{whole}</span>
          <span className="inline-flex flex-col items-center leading-none text-[0.78em]">
            <span className="border-b border-[#131d14] px-0.5 pb-[1px]">{rem}</span>
            <span className="px-0.5 pt-[1px]">{den}</span>
          </span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 align-middle">
        {sign && <span>{sign}</span>}
        <span className="inline-flex flex-col items-center leading-none text-[0.82em]">
          <span className="border-b border-[#131d14] px-1 pb-[1px]">{absNum}</span>
          <span className="px-1 pt-[1px]">{den}</span>
        </span>
      </span>
    );
  }

  if (kind === 'pi') {
    const numStr = absNum === 1 ? 'π' : `${absNum}π`;
    if (den === 1) return <span>{sign}{numStr}</span>;
    return (
      <span className="inline-flex items-center gap-0.5 align-middle">
        {sign && <span>{sign}</span>}
        <span className="inline-flex flex-col items-center leading-none text-[0.82em]">
          <span className="border-b border-[#131d14] px-1 pb-[1px]">{numStr}</span>
          <span className="px-1 pt-[1px]">{den}</span>
        </span>
      </span>
    );
  }

  // surd
  const surdNode = (
    <span className="inline-flex items-center">
      {absNum !== 1 && <span>{absNum}</span>}
      <span className="inline-flex items-center">
        <span className="text-[0.95em] leading-none">√</span>
        <span className="border-t border-[#131d14] px-[1px] leading-tight">{rad}</span>
      </span>
    </span>
  );
  if (den === 1) {
    return (
      <span className="inline-flex items-center">
        {sign && <span>{sign}</span>}
        {surdNode}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 align-middle">
      {sign && <span>{sign}</span>}
      <span className="inline-flex flex-col items-center leading-none text-[0.82em]">
        <span className="border-b border-[#131d14] px-1 pb-[1px]">{surdNode}</span>
        <span className="px-1 pt-[1px]">{den}</span>
      </span>
    </span>
  );
}

function pathMatches(a: CursorPathItem[], b: CursorPathItem[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].nodeId !== b[i].nodeId || a[i].slot !== b[i].slot) return false;
  }
  return true;
}

const RenderAstList: React.FC<{
  list: AstList;
  currentPath: CursorPathItem[];
  cursor: AstCursor;
  insertMode: boolean;
  showCursor: boolean;
}> = ({ list, currentPath, cursor, insertMode, showCursor }) => {
  const isHere = showCursor && pathMatches(currentPath, cursor.path);

  const renderSlot = (node: AstNode, slot: string, slotList: AstList, placeholder = '□') => {
    const slotPath = [...currentPath, { nodeId: node.id, slot }];
    const cursorInSlot = showCursor && pathMatches(slotPath, cursor.path);
    if (slotList.length === 0) {
      return cursorInSlot ? (
        <span className="inline-flex items-center border border-dashed border-[#131d14]/45 px-[2px] min-w-[9px] min-h-[14px] justify-center">
          <CursorMark insertMode={insertMode} />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center border border-dashed border-[#131d14]/55 w-[9px] h-[12px] text-[9px] opacity-60">
          {placeholder === '□' ? '' : placeholder}
        </span>
      );
    }
    return (
      <RenderAstList
        list={slotList}
        currentPath={slotPath}
        cursor={cursor}
        insertMode={insertMode}
        showCursor={showCursor}
      />
    );
  };

  return (
    <span className="inline-flex items-center flex-wrap gap-y-0.5 align-middle">
      {list.map((node, idx) => {
        const cursorBefore = isHere && cursor.index === idx;
        let rendered: React.ReactNode = null;

        if (node.type === 'text') {
          const disp = node.value.startsWith('[C')
            ? SCIENTIFIC_CONSTANTS.find((c) => `[C${c.code}]` === node.value)?.symbol ?? node.value
            : node.value.startsWith('[U')
            ? UNIT_CONVERSIONS.find((u) => `[U${u.code}]` === node.value)?.label ?? node.value
            : node.value;
          rendered = <span className="whitespace-pre">{disp}</span>;
        } else if (node.type === 'frac') {
          rendered = (
            <span className="inline-flex flex-col items-center mx-[2px] align-middle text-[0.82em] leading-tight">
              <span className="border-b border-[#131d14] px-1 pb-[1px] min-w-[14px] text-center">
                {renderSlot(node, 'num', node.num)}
              </span>
              <span className="px-1 pt-[1px] min-w-[14px] text-center">
                {renderSlot(node, 'den', node.den)}
              </span>
            </span>
          );
        } else if (node.type === 'mixedFrac') {
          rendered = (
            <span className="inline-flex items-center gap-[2px] mx-[2px] align-middle">
              <span>{renderSlot(node, 'whole', node.whole)}</span>
              <span className="inline-flex flex-col items-center text-[0.8em] leading-tight">
                <span className="border-b border-[#131d14] px-1 pb-[1px]">
                  {renderSlot(node, 'num', node.num)}
                </span>
                <span className="px-1 pt-[1px]">
                  {renderSlot(node, 'den', node.den)}
                </span>
              </span>
            </span>
          );
        } else if (node.type === 'sqrt') {
          rendered = (
            <span className="inline-flex items-stretch mx-[1px] align-middle">
              <span className="text-[1.15em] leading-none font-bold pr-[1px]">√</span>
              <span className="border-t border-[#131d14] pt-[1px] px-[2px]">
                {renderSlot(node, 'inner', node.inner)}
              </span>
            </span>
          );
        } else if (node.type === 'cbrt') {
          rendered = (
            <span className="inline-flex items-stretch mx-[1px] align-middle">
              <span className="text-[0.65em] self-start -mr-[1px] font-bold">3</span>
              <span className="text-[1.15em] leading-none font-bold pr-[1px]">√</span>
              <span className="border-t border-[#131d14] pt-[1px] px-[2px]">
                {renderSlot(node, 'inner', node.inner)}
              </span>
            </span>
          );
        } else if (node.type === 'nthRoot') {
          rendered = (
            <span className="inline-flex items-stretch mx-[1px] align-middle">
              <span className="text-[0.68em] self-start mr-[1px] leading-none">
                {renderSlot(node, 'index', node.index)}
              </span>
              <span className="text-[1.15em] leading-none font-bold pr-[1px]">√</span>
              <span className="border-t border-[#131d14] pt-[1px] px-[2px]">
                {renderSlot(node, 'inner', node.inner)}
              </span>
            </span>
          );
        } else if (node.type === 'pow') {
          rendered = (
            <span className="inline-flex items-baseline mx-[1px]">
              <span>{renderSlot(node, 'base', node.base)}</span>
              <span className="text-[0.72em] -translate-y-[0.48em] ml-[1px]">
                {renderSlot(node, 'exp', node.exp)}
              </span>
            </span>
          );
        } else if (node.type === 'logBase') {
          rendered = (
            <span className="inline-flex items-baseline mx-[1px]">
              <span>log</span>
              <span className="text-[0.68em] translate-y-[0.25em] mx-[1px]">
                {renderSlot(node, 'base', node.base)}
              </span>
              <span>(</span>
              <span>{renderSlot(node, 'inner', node.inner)}</span>
              <span>)</span>
            </span>
          );
        } else if (node.type === 'abs') {
          rendered = (
            <span className="inline-flex items-center mx-[1px]">
              <span className="font-bold px-[1px]">|</span>
              <span>{renderSlot(node, 'inner', node.inner)}</span>
              <span className="font-bold px-[1px]">|</span>
            </span>
          );
        } else if (node.type === 'integral') {
          rendered = (
            <span className="inline-flex items-center gap-[2px] mx-[1px]">
              <span className="inline-flex flex-col items-center leading-none">
                <span className="text-[0.65em]">{renderSlot(node, 'upper', node.upper)}</span>
                <span className="text-[1.25em] leading-[0.85] font-serif">∫</span>
                <span className="text-[0.65em]">{renderSlot(node, 'lower', node.lower)}</span>
              </span>
              <span>({renderSlot(node, 'expr', node.expr)})dx</span>
            </span>
          );
        } else if (node.type === 'deriv') {
          rendered = (
            <span className="inline-flex items-center gap-[2px] mx-[1px]">
              <span className="inline-flex flex-col items-center leading-none text-[0.7em]">
                <span className="border-b border-[#131d14] px-[2px]">d</span>
                <span>dx</span>
              </span>
              <span>({renderSlot(node, 'expr', node.expr)})</span>
              <span className="text-[0.72em] self-end">
                |x={renderSlot(node, 'at', node.at)}
              </span>
            </span>
          );
        } else if (node.type === 'sum') {
          rendered = (
            <span className="inline-flex items-center gap-[2px] mx-[1px]">
              <span className="inline-flex flex-col items-center leading-none">
                <span className="text-[0.62em]">{renderSlot(node, 'upper', node.upper)}</span>
                <span className="text-[1.15em] leading-[0.88] font-bold">∑</span>
                <span className="text-[0.62em]">x={renderSlot(node, 'lower', node.lower)}</span>
              </span>
              <span>({renderSlot(node, 'expr', node.expr)})</span>
            </span>
          );
        }

        return (
          <React.Fragment key={node.id}>
            {cursorBefore && <CursorMark insertMode={insertMode} />}
            {rendered}
          </React.Fragment>
        );
      })}
      {isHere && cursor.index === list.length && <CursorMark insertMode={insertMode} />}
    </span>
  );
};

export const LcdScreen: React.FC<LcdScreenProps> = ({
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
  hasHistoryAbove,
  hasHistoryBelow,
  solveExprMode,
}) => {
  // Adjust LCD ink opacity with contrast setting (0..10)
  const inkOpacity = 0.72 + (setup.contrast / 10) * 0.28;

  if (!isOn) {
    return (
      <div className="w-full h-full min-h-[124px] rounded-[6px] bg-[#9aa792] border-2 border-[#363d38] shadow-[inset_0_3px_8px_rgba(0,0,0,0.4)] flex items-center justify-center">
        <span className="text-[11px] font-mono tracking-widest text-[#1a221b]/35 select-none">
          APAGADA · PULSE ON
        </span>
      </div>
    );
  }

  const angleLetter = setup.angleUnit === 'DEG' ? 'D' : setup.angleUnit === 'RAD' ? 'R' : 'G';

  const renderStatusBar = () => (
    <div className="flex items-center justify-between text-[9px] font-mono font-bold tracking-tight border-b border-[#131d14]/15 pb-[2px] mb-[3px] select-none leading-none">
      <div className="flex items-center gap-[4px]">
        <span className={`px-[3px] py-[1px] rounded-[1px] ${shift ? 'bg-[#131d14] text-[#c7d4bd]' : 'opacity-15'}`}>
          S
        </span>
        <span className={`px-[3px] py-[1px] rounded-[1px] ${alpha ? 'bg-[#131d14] text-[#c7d4bd]' : 'opacity-15'}`}>
          A
        </span>
        <span className={memory.M !== 0 ? 'opacity-100' : 'opacity-15'}>M</span>
        {popup.type === 'STO_WAIT' && <span className="bg-[#131d14] text-[#c7d4bd] px-[3px] py-[1px]">STO</span>}
        {popup.type === 'RCL_WAIT' && <span className="bg-[#131d14] text-[#c7d4bd] px-[3px] py-[1px]">RCL</span>}
        {popup.type === 'HYP_WAIT' && <span className="bg-[#131d14] text-[#c7d4bd] px-[3px] py-[1px]">HYP</span>}
        {mode === 'CMPLX' && <span className="px-[2px]">CMPLX</span>}
        {mode === 'STAT' && <span className="px-[2px]">STAT</span>}
        {mode === 'BASE' && <span className="px-[2px]">{baseSystem}</span>}
        {mode === 'EQN' && <span className="px-[2px]">EQN</span>}
        {mode === 'MATRIX' && <span className="px-[2px]">MAT</span>}
        {mode === 'VECTOR' && <span className="px-[2px]">VCT</span>}
        {mode === 'TABLE' && <span className="px-[2px]">TABLE</span>}
      </div>

      <div className="flex items-center gap-[4px]">
        <span className="bg-[#131d14] text-[#c7d4bd] px-[3px] py-[1px] rounded-[1px]">{angleLetter}</span>
        {setup.displayFormat === 'FIX' && (
          <span className="bg-[#131d14] text-[#c7d4bd] px-[2px] py-[1px]">FIX</span>
        )}
        {setup.displayFormat === 'SCI' && (
          <span className="bg-[#131d14] text-[#c7d4bd] px-[2px] py-[1px]">SCI</span>
        )}
        <span className={setup.ioMode === 'MATH' ? 'opacity-100' : 'opacity-20'}>Math</span>
        <span className="inline-flex items-center gap-[1px] text-[8px]">
          <span className={hasHistoryAbove ? 'opacity-100' : 'opacity-15'}>▲</span>
          <span className={hasHistoryBelow ? 'opacity-100' : 'opacity-15'}>▼</span>
        </span>
      </div>
    </div>
  );

  const renderPopupContent = () => {
    switch (popup.type) {
      case 'MODE':
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-[2px] text-[11px] font-mono leading-tight pt-0.5">
            <div>1:COMP</div>
            <div>2:CMPLX</div>
            <div>3:STAT</div>
            <div>4:BASE-N</div>
            <div>5:EQN</div>
            <div>6:MATRIX</div>
            <div>7:TABLE</div>
            <div>8:VECTOR</div>
          </div>
        );
      case 'SETUP':
        return popup.page === 1 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-[2px] text-[11px] font-mono leading-tight">
            <div>1:MthIO</div>
            <div>2:LineIO</div>
            <div>3:Deg</div>
            <div>4:Rad</div>
            <div>5:Gra</div>
            <div>6:Fix</div>
            <div>7:Sci</div>
            <div className="flex justify-between"><span>8:Norm</span><span>▼</span></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-[2px] text-[11px] font-mono leading-tight">
            <div>1:ab/c</div>
            <div>2:d/c</div>
            <div>3:CMPLX</div>
            <div>4:STAT</div>
            <div>5:CONT</div>
            <div className="flex justify-between"><span></span><span>▲</span></div>
          </div>
        );
      case 'CLR':
        return (
          <div className="flex flex-col gap-0.5 text-[11.5px] font-mono pt-1">
            <div>1:Setup</div>
            <div>2:Memory</div>
            <div>3:All</div>
          </div>
        );
      case 'CLR_CONFIRM':
        return (
          <div className="flex flex-col items-center justify-center h-[84px] text-center font-mono">
            <div className="text-[12px] font-bold">Reset {popup.target}?</div>
            <div className="text-[10px] mt-2">[=] : Yes &nbsp;&nbsp; [AC] : Cancel</div>
          </div>
        );
      case 'CONST': {
        const preview = popup.digits.length === 2 ? SCIENTIFIC_CONSTANTS.find((c) => c.code === popup.digits) : null;
        return (
          <div className="flex flex-col justify-between h-[84px] font-mono">
            <div className="text-[12px] font-bold">CONST {popup.digits.padEnd(2, '_')}</div>
            <div className="text-[10px] opacity-85 truncate">
              {preview ? `${preview.symbol} (${preview.nameEs})` : 'Ingrese número 01~40'}
            </div>
          </div>
        );
      }
      case 'CONV': {
        const preview = popup.digits.length === 2 ? UNIT_CONVERSIONS.find((c) => c.code === popup.digits) : null;
        return (
          <div className="flex flex-col justify-between h-[84px] font-mono">
            <div className="text-[12px] font-bold">CONV {popup.digits.padEnd(2, '_')}</div>
            <div className="text-[10px] opacity-85 truncate">
              {preview ? `${preview.label} (${preview.nameEs})` : 'Ingrese número 01~40'}
            </div>
          </div>
        );
      }
      case 'DRG':
        return (
          <div className="flex items-center justify-around h-[80px] text-[12px] font-mono font-bold">
            <span>1:°</span>
            <span>2:r</span>
            <span>3:g</span>
          </div>
        );
      case 'CMPLX_OPT':
        return (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono pt-1">
            <div>1:arg</div>
            <div>2:Conjg</div>
            <div>3:▸r∠θ</div>
            <div>4:▸a+bi</div>
          </div>
        );
      case 'BASE_OPT':
        return (
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] font-mono pt-0.5">
            <div>1:and</div>
            <div>2:or</div>
            <div>3:xor</div>
            <div>4:xnor</div>
            <div>5:Not</div>
            <div>6:Neg</div>
          </div>
        );
      case 'STAT_TYPE':
        return (
          <div className="grid grid-cols-2 gap-x-2 gap-y-[2px] text-[10.5px] font-mono">
            <div>1:1-VAR</div>
            <div>2:A+BX</div>
            <div>3:_+CX²</div>
            <div>4:ln X</div>
            <div>5:e^X</div>
            <div>6:A·B^X</div>
            <div>7:A·X^B</div>
            <div>8:1/X</div>
          </div>
        );
      case 'STAT_OPT':
        return (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono pt-1">
            <div>1:Type</div>
            <div>2:Data</div>
            <div>3:Sum</div>
            <div>4:Var</div>
            <div>5:MinMax</div>
            {statType !== '1-VAR' && <div>6:Reg</div>}
          </div>
        );
      case 'STAT_SUM':
        return (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono pt-1">
            <div>1:∑x²</div>
            <div>2:∑x</div>
            <div>3:∑y²</div>
            <div>4:∑y</div>
            <div>5:∑xy</div>
          </div>
        );
      case 'STAT_VAR':
        return (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono pt-1">
            <div>1:n</div>
            <div>2:x̄</div>
            <div>3:σx</div>
            <div>4:sx</div>
            <div>5:ȳ</div>
            <div>6:σy</div>
          </div>
        );
      case 'STAT_MINMAX':
        return (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono pt-1">
            <div>1:minX</div>
            <div>2:maxX</div>
            <div>3:Q1</div>
            <div>4:Med</div>
            <div>5:Q3</div>
          </div>
        );
      case 'STAT_REG':
        return (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono pt-1">
            <div>1:A</div>
            <div>2:B</div>
            <div>3:r</div>
            <div>4:x̂</div>
            <div>5:ŷ</div>
            {statType === '_+CX2' && <div>6:C</div>}
          </div>
        );
      case 'MATRIX_OPT':
        return (
          <div className="grid grid-cols-2 gap-x-2 gap-y-[2px] text-[11px] font-mono pt-0.5">
            <div>1:Dim</div>
            <div>2:Data</div>
            <div>3:MatA</div>
            <div>4:MatB</div>
            <div>5:MatC</div>
            <div>6:MatAns</div>
            <div>7:det</div>
            <div>8:Trn</div>
          </div>
        );
      case 'MATRIX_DIM_SELECT':
        return (
          <div className="flex flex-col gap-1 text-[11.5px] font-mono pt-1">
            <div className="text-[10px] opacity-75">Dim Matrix?</div>
            <div className="flex gap-4">
              <span>1:MatA</span>
              <span>2:MatB</span>
              <span>3:MatC</span>
            </div>
          </div>
        );
      case 'MATRIX_DIM_SIZE':
        return (
          <div className="grid grid-cols-3 gap-1 text-[10.5px] font-mono pt-0.5">
            <div>1:3×3</div>
            <div>2:3×2</div>
            <div>3:3×1</div>
            <div>4:2×3</div>
            <div>5:2×2</div>
            <div>6:2×1</div>
            <div>7:1×3</div>
            <div>8:1×2</div>
            <div>9:1×1</div>
          </div>
        );
      case 'VECTOR_OPT':
        return (
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] font-mono pt-0.5">
            <div>1:Dim</div>
            <div>2:Data</div>
            <div>3:VctA</div>
            <div>4:VctB</div>
            <div>5:VctC</div>
            <div>6:VctAns</div>
            <div>7:Dot (·)</div>
          </div>
        );
      case 'VECTOR_DIM_SELECT':
        return (
          <div className="flex flex-col gap-1 text-[11.5px] font-mono pt-1">
            <div className="text-[10px] opacity-75">Dim Vector?</div>
            <div className="flex gap-4">
              <span>1:VctA</span>
              <span>2:VctB</span>
              <span>3:VctC</span>
            </div>
          </div>
        );
      case 'VECTOR_DIM_SIZE':
        return (
          <div className="flex flex-col gap-1 text-[11.5px] font-mono pt-1">
            <div>Mat/Vct {popup.vct} m?</div>
            <div className="flex gap-5 pt-1">
              <span>1: 3</span>
              <span>2: 2</span>
            </div>
          </div>
        );
      case 'EQN_SELECT':
        return (
          <div className="flex flex-col gap-[2px] text-[10.5px] font-mono leading-tight">
            <div>1: anX+bnY=cn</div>
            <div>2: anX+bnY+cnZ=dn</div>
            <div>3: aX²+bX+c=0</div>
            <div>4: aX³+bX²+cX+d=0</div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPromptOverlay = () => {
    if (prompt.kind === 'FIX_DIGITS') {
      return (
        <div className="flex flex-col justify-center h-[84px] font-mono">
          <div className="text-[12px] font-bold">Fix 0~9?</div>
          <div className="text-[10px] opacity-75 mt-1">Pulse una tecla numérica 0–9</div>
        </div>
      );
    }
    if (prompt.kind === 'SCI_DIGITS') {
      return (
        <div className="flex flex-col justify-center h-[84px] font-mono">
          <div className="text-[12px] font-bold">Sci 0~9?</div>
          <div className="text-[10px] opacity-75 mt-1">Cifras significativas (0=10)</div>
        </div>
      );
    }
    if (prompt.kind === 'NORM_SELECT') {
      return (
        <div className="flex flex-col justify-center h-[84px] font-mono">
          <div className="text-[12px] font-bold">Norm 1~2?</div>
          <div className="text-[10px] opacity-75 mt-1">1:Norm1 (10⁻²) &nbsp; 2:Norm2 (10⁻⁹)</div>
        </div>
      );
    }
    if (prompt.kind === 'CONTRAST') {
      return (
        <div className="flex flex-col justify-center h-[84px] font-mono">
          <div className="text-[11px] font-bold mb-1">CONTRAST: ◀ LIGHT | DARK ▶</div>
          <div className="w-full h-3 border border-[#131d14] p-[1px]">
            <div
              className="h-full bg-[#131d14]"
              style={{ width: `${(setup.contrast / 10) * 100}%` }}
            />
          </div>
        </div>
      );
    }
    if (prompt.kind === 'CALC_VAR' || prompt.kind === 'SOLVE_X') {
      return (
        <div className="flex flex-col justify-between h-[84px] font-mono">
          <div className="text-[11px] font-bold">
            {prompt.kind === 'SOLVE_X' ? 'Solve for X' : `${prompt.varName}?`}
          </div>
          <div className="text-right text-[15px] font-bold">
            {prompt.inputBuf || '0'}
            <CursorMark insertMode={insertMode} />
          </div>
        </div>
      );
    }
    if (prompt.kind === 'SOLVE_RESULT') {
      return (
        <div className="flex flex-col justify-between h-[84px] font-mono">
          <div className="text-[11px]">
            X = <span className="font-bold text-[14px]">{formatCasioNumber(prompt.solveRoot ?? 0, setup)}</span>
          </div>
          <div className="text-right text-[10px] opacity-80">
            L−R = {formatCasioNumber(prompt.solveResidual ?? 0, setup)}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderEqnScreen = () => {
    if (eqnState.stage === 'RESULT') {
      if (eqnState.specialMsg) {
        return (
          <div className="flex flex-col items-center justify-center h-[84px] font-mono">
            <div className="text-[13px] font-bold">{eqnState.specialMsg}</div>
            <div className="text-[9.5px] mt-2 opacity-75">Pulse [AC] o [=] para volver</div>
          </div>
        );
      }
      const item = eqnState.solutions[eqnState.solIdx];
      if (!item) return null;
      const valDisplay =
        typeof item.value === 'number'
          ? formatCasioNumber(item.value, setup)
          : formatComplex(item.value, setup);

      return (
        <div className="flex flex-col justify-between h-[84px] font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold">{item.label}</span>
            <span className="text-[9px] opacity-75">
              ▲▼ ({eqnState.solIdx + 1}/{eqnState.solutions.length})
            </span>
          </div>
          <div className="text-right text-[16px] font-bold tracking-tight">
            {valDisplay}
          </div>
        </div>
      );
    }

    // Coefficient Editor
    const labels =
      eqnState.eqnType === '2x2'
        ? ['a₁', 'b₁', 'c₁', 'a₂', 'b₂', 'c₂']
        : eqnState.eqnType === '3x3'
        ? ['a₁', 'b₁', 'c₁', 'd₁', 'a₂', 'b₂', 'c₂', 'd₂', 'a₃', 'b₃', 'c₃', 'd₃']
        : eqnState.eqnType === 'QUAD'
        ? ['a', 'b', 'c']
        : ['a', 'b', 'c', 'd'];

    const cols = eqnState.eqnType === '2x2' ? 3 : eqnState.eqnType === '3x3' ? 4 : labels.length;
    const activeRow = Math.floor(eqnState.cursorIdx / cols);
    const startIdx = activeRow * cols;
    const rowItems = labels.slice(startIdx, startIdx + cols);

    return (
      <div className="flex flex-col justify-between h-[84px] font-mono">
        <div className="grid gap-1 text-[10px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {rowItems.map((lbl, cIdx) => {
            const globalIdx = startIdx + cIdx;
            const isSel = globalIdx === eqnState.cursorIdx;
            return (
              <div
                key={lbl}
                className={`border border-[#131d14]/40 px-1 py-0.5 truncate ${
                  isSel ? 'bg-[#131d14] text-[#c7d4bd]' : ''
                }`}
              >
                <div className="text-[8px] opacity-75">{lbl}</div>
                <div className="text-right font-bold">{eqnState.coeffs[globalIdx] ?? 0}</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-[#131d14]/20 pt-0.5 text-[11px]">
          <span className="opacity-75">{labels[eqnState.cursorIdx]}=</span>
          <span className="font-bold">
            {eqnState.inputBuf !== '' ? eqnState.inputBuf : eqnState.coeffs[eqnState.cursorIdx] ?? 0}
            <CursorMark insertMode={insertMode} />
          </span>
        </div>
      </div>
    );
  };

  const renderStatDataScreen = () => {
    const showY = statType !== '1-VAR';
    const showFreq = setup.statFreq === 'ON';
    const visibleStart = Math.max(0, statScreen.cursorRow - 1);
    const visibleRows = [visibleStart, visibleStart + 1, visibleStart + 2];

    return (
      <div className="flex flex-col justify-between h-[84px] font-mono text-[10px]">
        <div className="border border-[#131d14]/35">
          <div className="grid grid-cols-12 bg-[#131d14]/10 border-b border-[#131d14]/25 text-center font-bold text-[9px]">
            <div className="col-span-2 border-r border-[#131d14]/25">#</div>
            <div className={`${showY ? 'col-span-4' : showFreq ? 'col-span-6' : 'col-span-10'} border-r border-[#131d14]/25`}>x</div>
            {showY && <div className={`${showFreq ? 'col-span-3' : 'col-span-6'} border-r border-[#131d14]/25`}>y</div>}
            {showFreq && <div className="col-span-3">FREQ</div>}
          </div>
          {visibleRows.map((rIdx) => {
            const row = statRows[rIdx];
            return (
              <div key={rIdx} className="grid grid-cols-12 border-b last:border-b-0 border-[#131d14]/15 leading-[15px]">
                <div className="col-span-2 text-center border-r border-[#131d14]/25 opacity-75">{rIdx + 1}</div>
                <div
                  className={`${showY ? 'col-span-4' : showFreq ? 'col-span-6' : 'col-span-10'} px-1 text-right border-r border-[#131d14]/25 truncate ${
                    statScreen.cursorRow === rIdx && statScreen.cursorCol === 0 ? 'bg-[#131d14] text-[#c7d4bd]' : ''
                  }`}
                >
                  {row ? row.x : ''}
                </div>
                {showY && (
                  <div
                    className={`${showFreq ? 'col-span-3' : 'col-span-6'} px-1 text-right border-r border-[#131d14]/25 truncate ${
                      statScreen.cursorRow === rIdx && statScreen.cursorCol === 1 ? 'bg-[#131d14] text-[#c7d4bd]' : ''
                    }`}
                  >
                    {row ? row.y ?? 0 : ''}
                  </div>
                )}
                {showFreq && (
                  <div
                    className={`col-span-3 px-1 text-right truncate ${
                      statScreen.cursorRow === rIdx && statScreen.cursorCol === 2 ? 'bg-[#131d14] text-[#c7d4bd]' : ''
                    }`}
                  >
                    {row ? row.freq : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10.5px]">
          <span className="opacity-70">{statType} · [AC] p/ calcular</span>
          <span className="font-bold">
            {statScreen.inputBuf || '—'}
            <CursorMark insertMode={insertMode} />
          </span>
        </div>
      </div>
    );
  };

  const renderMatVecEditor = () => {
    if (matVecEditor.kind === 'MATRIX') {
      const mat =
        matVecEditor.target === 'A'
          ? memory.MatA
          : matVecEditor.target === 'B'
          ? memory.MatB
          : memory.MatC;
      const cols = mat[0]?.length ?? 1;
      return (
        <div className="flex flex-col justify-between h-[84px] font-mono text-[10px]">
          <div className="flex justify-between font-bold text-[9.5px]">
            <span>Mat{matVecEditor.target} ({mat.length}×{cols})</span>
            <span>[AC] p/ operar</span>
          </div>
          <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {mat.map((rowArr, r) =>
              rowArr.map((val, c) => {
                const isSel = r === matVecEditor.row && c === matVecEditor.col;
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`border border-[#131d14]/35 px-1 text-right truncate ${
                      isSel ? 'bg-[#131d14] text-[#c7d4bd]' : ''
                    }`}
                  >
                    {val}
                  </div>
                );
              })
            )}
          </div>
          <div className="flex justify-between text-[10.5px] border-t border-[#131d14]/20 pt-0.5">
            <span>[{matVecEditor.row + 1},{matVecEditor.col + 1}]=</span>
            <span className="font-bold">
              {matVecEditor.inputBuf !== '' ? matVecEditor.inputBuf : mat[matVecEditor.row]?.[matVecEditor.col] ?? 0}
              <CursorMark insertMode={insertMode} />
            </span>
          </div>
        </div>
      );
    }

    const vct =
      matVecEditor.target === 'A'
        ? memory.VctA
        : matVecEditor.target === 'B'
        ? memory.VctB
        : memory.VctC;
    return (
      <div className="flex flex-col justify-between h-[84px] font-mono text-[10px]">
        <div className="flex justify-between font-bold text-[9.5px]">
          <span>Vct{matVecEditor.target} ({vct.length}D)</span>
          <span>[AC] p/ operar</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {vct.map((val, c) => (
            <div
              key={c}
              className={`border border-[#131d14]/35 px-1 py-0.5 text-right truncate ${
                c === matVecEditor.col ? 'bg-[#131d14] text-[#c7d4bd]' : ''
              }`}
            >
              {val}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10.5px] border-t border-[#131d14]/20 pt-0.5">
          <span>[{matVecEditor.col + 1}]=</span>
          <span className="font-bold">
            {matVecEditor.inputBuf !== '' ? matVecEditor.inputBuf : vct[matVecEditor.col] ?? 0}
            <CursorMark insertMode={insertMode} />
          </span>
        </div>
      </div>
    );
  };

  const renderTableScreen = () => {
    if (tableState.stage === 'FX' || tableState.stage === 'GX') {
      return (
        <div className="flex flex-col justify-between h-[84px] font-mono">
          <div className="text-[11px] font-bold">
            {tableState.stage === 'FX' ? 'f(X)=' : 'g(X)= (opcional, [=] p/ omitir)'}
          </div>
          <div className="text-[14px] overflow-x-auto whitespace-nowrap">
            <RenderAstList
              list={ast}
              currentPath={[]}
              cursor={cursor}
              insertMode={insertMode}
              showCursor={true}
            />
          </div>
        </div>
      );
    }
    if (tableState.stage === 'START' || tableState.stage === 'END' || tableState.stage === 'STEP') {
      const label = tableState.stage === 'START' ? 'Start?' : tableState.stage === 'END' ? 'End?' : 'Step?';
      return (
        <div className="flex flex-col justify-between h-[84px] font-mono">
          <div className="text-[12px] font-bold">{label}</div>
          <div className="text-right text-[16px] font-bold">
            {tableState.inputBuf || '0'}
            <CursorMark insertMode={insertMode} />
          </div>
        </div>
      );
    }
    // VIEW
    const slice = tableState.rows.slice(tableState.scrollRow, tableState.scrollRow + 3);
    return (
      <div className="flex flex-col justify-between h-[84px] font-mono text-[10px]">
        <div className="border border-[#131d14]/35">
          <div className="grid grid-cols-3 bg-[#131d14]/10 border-b border-[#131d14]/25 font-bold text-center text-[9px]">
            <div className="border-r border-[#131d14]/25">X</div>
            <div className="border-r border-[#131d14]/25">f(X)</div>
            <div>g(X)</div>
          </div>
          {slice.map((r, i) => (
            <div key={i} className="grid grid-cols-3 border-b last:border-b-0 border-[#131d14]/15 leading-[16px]">
              <div className="px-1 text-right border-r border-[#131d14]/25 truncate">{r.x}</div>
              <div className="px-1 text-right border-r border-[#131d14]/25 truncate">
                {typeof r.fx === 'number' ? formatCasioNumber(r.fx, setup) : r.fx}
              </div>
              <div className="px-1 text-right truncate">
                {r.gx === undefined ? '—' : typeof r.gx === 'number' ? formatCasioNumber(r.gx, setup) : r.gx}
              </div>
            </div>
          ))}
        </div>
        <div className="text-[9px] text-right opacity-75">▲▼ Desplazar · [AC] Editar</div>
      </div>
    );
  };

  const renderResultArea = () => {
    if (!result) return null;

    if (result.kind === 'matrix' && result.matrixVal) {
      const m = result.matrixVal;
      return (
        <div className="flex items-end justify-end">
          <div
            className="grid gap-x-2 gap-y-0 border-l-2 border-r-2 border-[#131d14] px-1.5 text-[10.5px] font-mono font-bold leading-tight"
            style={{ gridTemplateColumns: `repeat(${m[0]?.length ?? 1}, auto)` }}
          >
            {m.flatMap((row, r) =>
              row.map((v, c) => (
                <span key={`${r}-${c}`} className="text-right">
                  {formatCasioNumber(v, setup)}
                </span>
              ))
            )}
          </div>
        </div>
      );
    }

    if (result.kind === 'vector' && result.vectorVal) {
      return (
        <div className="flex items-end justify-end">
          <div className="flex gap-2 border-l-2 border-r-2 border-[#131d14] px-1.5 text-[11px] font-mono font-bold">
            {result.vectorVal.map((v, i) => (
              <span key={i}>{formatCasioNumber(v, setup)}</span>
            ))}
          </div>
        </div>
      );
    }

    if (result.kind === 'complex' && result.complexVal) {
      return (
        <div className="text-right text-[16px] font-mono font-bold tracking-tight leading-none">
          {formatComplex(result.complexVal, setup)}
        </div>
      );
    }

    if (result.kind === 'text') {
      return (
        <div className="text-right text-[15px] font-mono font-bold tracking-tight leading-none">
          {result.textVal}
        </div>
      );
    }

    // Real number
    const val = result.realVal ?? 0;
    if (mode === 'BASE') {
      return (
        <div className="flex items-baseline justify-between font-mono">
          <span className="text-[10px] font-bold opacity-75">{baseSystem}</span>
          <span className="text-[16px] font-bold tracking-tight">{formatBaseN(val, baseSystem)}</span>
        </div>
      );
    }

    if (result.factActive && result.factText) {
      return (
        <div className="text-right text-[15px] font-mono font-bold leading-none">
          {result.factText}
        </div>
      );
    }

    if (result.dmsMode && result.dmsText) {
      return (
        <div className="text-right text-[15px] font-mono font-bold leading-none">
          {result.dmsText}
        </div>
      );
    }

    if (
      !result.showDecimal &&
      setup.ioMode === 'MATH' &&
      result.engShift === 0 &&
      result.exact &&
      result.exact.kind !== 'decimal'
    ) {
      return (
        <div className="text-right text-[15px] font-mono font-bold leading-tight">
          {renderExactFraction(result.exact, setup.fractionMode)}
        </div>
      );
    }

    return (
      <div className="text-right text-[16px] font-mono font-bold tracking-tight leading-none">
        {formatCasioNumber(val, setup, result.engShift)}
      </div>
    );
  };

  return (
    <div
      className="relative w-full h-full min-h-[124px] rounded-[6px] bg-[#c7d4bd] lcd-pixel-grid border-2 border-[#363d38] shadow-[inset_0_3px_8px_rgba(0,0,0,0.38)] px-2.5 py-1.5 flex flex-col justify-between overflow-hidden"
      style={{ color: `rgba(19, 29, 20, ${inkOpacity})` }}
    >
      {renderStatusBar()}

      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        {errorMsg ? (
          <div className="flex flex-col items-center justify-center flex-1 font-mono text-center">
            <div className="text-[14px] sm:text-[14px] font-bold tracking-tight">{errorMsg}</div>
            <div className="text-[10px] mt-2 opacity-80">[AC] : Cancelar &nbsp; [◀][▶] : Ir</div>
          </div>
        ) : popup.type !== 'NONE' && popup.type !== 'STO_WAIT' && popup.type !== 'RCL_WAIT' && popup.type !== 'HYP_WAIT' ? (
          renderPopupContent()
        ) : prompt.kind !== 'NONE' ? (
          renderPromptOverlay()
        ) : mode === 'EQN' ? (
          renderEqnScreen()
        ) : mode === 'STAT' && statScreen.stage === 'DATA' ? (
          renderStatDataScreen()
        ) : (mode === 'MATRIX' || mode === 'VECTOR') && matVecEditor.active ? (
          renderMatVecEditor()
        ) : mode === 'TABLE' ? (
          renderTableScreen()
        ) : (
          <>
            {/* Expression Input Line */}
            <div className="text-[15px] sm:text-[13.5px] font-mono leading-snug overflow-x-auto overflow-y-hidden whitespace-nowrap thin-scroll min-h-[38px] flex items-center">
              {solveExprMode && <span className="text-[10px] mr-1 opacity-75">EQ:</span>}
              <RenderAstList
                list={ast}
                currentPath={[]}
                cursor={cursor}
                insertMode={insertMode}
                showCursor={!result}
              />
            </div>

            {/* Result Output Line */}
            <div className="min-h-[30px] flex items-end justify-end overflow-x-auto thin-scroll">
              {renderResultArea()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

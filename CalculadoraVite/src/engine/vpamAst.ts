import { AstCursor, AstList, AstNode, CursorPathItem } from './types';

let uidCounter = 1;
export function genId(): string {
  uidCounter += 1;
  return `n${uidCounter}_${Math.random().toString(36).slice(2, 6)}`;
}

export function cloneAstList(list: AstList): AstList {
  return list.map((node) => {
    switch (node.type) {
      case 'text':
        return { ...node };
      case 'frac':
        return { ...node, num: cloneAstList(node.num), den: cloneAstList(node.den) };
      case 'mixedFrac':
        return {
          ...node,
          whole: cloneAstList(node.whole),
          num: cloneAstList(node.num),
          den: cloneAstList(node.den),
        };
      case 'sqrt':
      case 'cbrt':
      case 'abs':
        return { ...node, inner: cloneAstList(node.inner) };
      case 'nthRoot':
        return { ...node, index: cloneAstList(node.index), inner: cloneAstList(node.inner) };
      case 'pow':
        return { ...node, base: cloneAstList(node.base), exp: cloneAstList(node.exp) };
      case 'logBase':
        return { ...node, base: cloneAstList(node.base), inner: cloneAstList(node.inner) };
      case 'integral':
        return {
          ...node,
          expr: cloneAstList(node.expr),
          lower: cloneAstList(node.lower),
          upper: cloneAstList(node.upper),
        };
      case 'deriv':
        return { ...node, expr: cloneAstList(node.expr), at: cloneAstList(node.at) };
      case 'sum':
        return {
          ...node,
          expr: cloneAstList(node.expr),
          lower: cloneAstList(node.lower),
          upper: cloneAstList(node.upper),
        };
    }
  });
}

export function getSlotOrder(node: AstNode): string[] {
  switch (node.type) {
    case 'text':
      return [];
    case 'frac':
      return ['num', 'den'];
    case 'mixedFrac':
      return ['whole', 'num', 'den'];
    case 'sqrt':
    case 'cbrt':
    case 'abs':
      return ['inner'];
    case 'nthRoot':
      return ['index', 'inner'];
    case 'pow':
      return ['base', 'exp'];
    case 'logBase':
      return ['base', 'inner'];
    case 'integral':
      return ['expr', 'lower', 'upper'];
    case 'deriv':
      return ['expr', 'at'];
    case 'sum':
      return ['expr', 'lower', 'upper'];
  }
}

export function getSlotList(node: AstNode, slot: string): AstList | null {
  if (node.type === 'text') return null;
  const record = node as unknown as Record<string, unknown>;
  const val = record[slot];
  return Array.isArray(val) ? (val as AstList) : null;
}

export function getTargetList(root: AstList, path: CursorPathItem[]): AstList {
  let curr = root;
  for (const step of path) {
    const found = curr.find((n) => n.id === step.nodeId);
    if (!found) return root;
    const next = getSlotList(found, step.slot);
    if (!next) return root;
    curr = next;
  }
  return curr;
}

export function createTextNode(value: string): AstNode {
  return { id: genId(), type: 'text', value };
}

export function insertNodesAtCursor(
  root: AstList,
  cursor: AstCursor,
  nodes: AstNode[],
  enterSlot?: { nodeIndex: number; slot: string }
): { ast: AstList; cursor: AstCursor } {
  const cloned = cloneAstList(root);
  const target = getTargetList(cloned, cursor.path);
  const safeIdx = Math.max(0, Math.min(cursor.index, target.length));
  target.splice(safeIdx, 0, ...nodes);

  if (enterSlot && nodes[enterSlot.nodeIndex]) {
    const targetNode = nodes[enterSlot.nodeIndex];
    const slotList = getSlotList(targetNode, enterSlot.slot);
    const innerIdx = slotList ? slotList.length : 0;
    return {
      ast: cloned,
      cursor: {
        path: [...cursor.path, { nodeId: targetNode.id, slot: enterSlot.slot }],
        index: innerIdx,
      },
    };
  }

  return {
    ast: cloned,
    cursor: {
      path: [...cursor.path],
      index: safeIdx + nodes.length,
    },
  };
}

export function deleteBeforeCursor(
  root: AstList,
  cursor: AstCursor
): { ast: AstList; cursor: AstCursor } {
  const cloned = cloneAstList(root);
  const target = getTargetList(cloned, cursor.path);

  if (cursor.index > 0) {
    const removed = target[cursor.index - 1];
    // If removing a structured node, check if it has inner content or just remove whole node
    if (removed.type === 'text') {
      target.splice(cursor.index - 1, 1);
      return {
        ast: cloned,
        cursor: { path: [...cursor.path], index: cursor.index - 1 },
      };
    } else {
      // Remove template node
      target.splice(cursor.index - 1, 1);
      return {
        ast: cloned,
        cursor: { path: [...cursor.path], index: cursor.index - 1 },
      };
    }
  }

  // cursor.index === 0: if inside a slot, move out or unwrap empty template
  if (cursor.path.length > 0) {
    const parentPath = cursor.path.slice(0, -1);
    const lastStep = cursor.path[cursor.path.length - 1];
    const parentList = getTargetList(cloned, parentPath);
    const parentNodeIdx = parentList.findIndex((n) => n.id === lastStep.nodeId);
    if (parentNodeIdx >= 0) {
      const parentNode = parentList[parentNodeIdx];
      const slots = getSlotOrder(parentNode);
      const slotPos = slots.indexOf(lastStep.slot);
      if (slotPos > 0) {
        const prevSlot = slots[slotPos - 1];
        const prevList = getSlotList(parentNode, prevSlot) ?? [];
        return {
          ast: cloned,
          cursor: {
            path: [...parentPath, { nodeId: parentNode.id, slot: prevSlot }],
            index: prevList.length,
          },
        };
      }
      // If at start of first slot and all slots are empty, delete the wrapper node
      const allEmpty = slots.every((s) => (getSlotList(parentNode, s)?.length ?? 0) === 0);
      if (allEmpty) {
        parentList.splice(parentNodeIdx, 1);
        return {
          ast: cloned,
          cursor: { path: parentPath, index: parentNodeIdx },
        };
      }
      // Otherwise jump just before parent node
      return {
        ast: cloned,
        cursor: { path: parentPath, index: parentNodeIdx },
      };
    }
  }

  return { ast: cloned, cursor };
}

export function moveCursorLeft(root: AstList, cursor: AstCursor): AstCursor {
  const target = getTargetList(root, cursor.path);

  if (cursor.index > 0) {
    const prevNode = target[cursor.index - 1];
    const slots = getSlotOrder(prevNode);
    if (slots.length > 0) {
      const lastSlot = slots[slots.length - 1];
      const list = getSlotList(prevNode, lastSlot) ?? [];
      return {
        path: [...cursor.path, { nodeId: prevNode.id, slot: lastSlot }],
        index: list.length,
      };
    }
    return { path: [...cursor.path], index: cursor.index - 1 };
  }

  // At index 0 of current list -> move to previous slot or exit node left
  if (cursor.path.length > 0) {
    const parentPath = cursor.path.slice(0, -1);
    const lastStep = cursor.path[cursor.path.length - 1];
    const parentList = getTargetList(root, parentPath);
    const parentIdx = parentList.findIndex((n) => n.id === lastStep.nodeId);
    if (parentIdx >= 0) {
      const parentNode = parentList[parentIdx];
      const slots = getSlotOrder(parentNode);
      const slotPos = slots.indexOf(lastStep.slot);
      if (slotPos > 0) {
        const prevSlot = slots[slotPos - 1];
        const prevList = getSlotList(parentNode, prevSlot) ?? [];
        return {
          path: [...parentPath, { nodeId: parentNode.id, slot: prevSlot }],
          index: prevList.length,
        };
      }
      return { path: parentPath, index: parentIdx };
    }
  }

  // Wrap around to end of root if already at start of root
  return { path: [], index: root.length };
}

export function moveCursorRight(root: AstList, cursor: AstCursor): AstCursor {
  const target = getTargetList(root, cursor.path);

  if (cursor.index < target.length) {
    const nextNode = target[cursor.index];
    const slots = getSlotOrder(nextNode);
    if (slots.length > 0) {
      const firstSlot = slots[0];
      return {
        path: [...cursor.path, { nodeId: nextNode.id, slot: firstSlot }],
        index: 0,
      };
    }
    return { path: [...cursor.path], index: cursor.index + 1 };
  }

  // At end of current list -> move to next slot or exit node right
  if (cursor.path.length > 0) {
    const parentPath = cursor.path.slice(0, -1);
    const lastStep = cursor.path[cursor.path.length - 1];
    const parentList = getTargetList(root, parentPath);
    const parentIdx = parentList.findIndex((n) => n.id === lastStep.nodeId);
    if (parentIdx >= 0) {
      const parentNode = parentList[parentIdx];
      const slots = getSlotOrder(parentNode);
      const slotPos = slots.indexOf(lastStep.slot);
      if (slotPos >= 0 && slotPos + 1 < slots.length) {
        const nextSlot = slots[slotPos + 1];
        return {
          path: [...parentPath, { nodeId: parentNode.id, slot: nextSlot }],
          index: 0,
        };
      }
      return { path: parentPath, index: parentIdx + 1 };
    }
  }

  // Wrap around to start of root if already at end
  return { path: [], index: 0 };
}

export function moveCursorUpDown(
  root: AstList,
  cursor: AstCursor,
  dir: 'UP' | 'DOWN'
): AstCursor {
  // Check nearest enclosing multi-vertical-slot node (frac, mixedFrac, pow, integral, sum, logBase)
  for (let i = cursor.path.length - 1; i >= 0; i--) {
    const step = cursor.path[i];
    const parentPath = cursor.path.slice(0, i);
    const parentList = getTargetList(root, parentPath);
    const node = parentList.find((n) => n.id === step.nodeId);
    if (!node) continue;

    if (node.type === 'frac') {
      if (dir === 'DOWN' && step.slot === 'num') {
        return { path: [...parentPath, { nodeId: node.id, slot: 'den' }], index: node.den.length };
      }
      if (dir === 'UP' && step.slot === 'den') {
        return { path: [...parentPath, { nodeId: node.id, slot: 'num' }], index: node.num.length };
      }
    }
    if (node.type === 'mixedFrac') {
      if (dir === 'DOWN' && step.slot === 'num') {
        return { path: [...parentPath, { nodeId: node.id, slot: 'den' }], index: node.den.length };
      }
      if (dir === 'UP' && step.slot === 'den') {
        return { path: [...parentPath, { nodeId: node.id, slot: 'num' }], index: node.num.length };
      }
    }
    if (node.type === 'pow') {
      if (dir === 'DOWN' && step.slot === 'exp') {
        return { path: [...parentPath, { nodeId: node.id, slot: 'base' }], index: node.base.length };
      }
      if (dir === 'UP' && step.slot === 'base') {
        return { path: [...parentPath, { nodeId: node.id, slot: 'exp' }], index: node.exp.length };
      }
    }
    if (node.type === 'integral' || node.type === 'sum') {
      if (dir === 'UP' && step.slot === 'lower') {
        return { path: [...parentPath, { nodeId: node.id, slot: 'upper' }], index: node.upper.length };
      }
      if (dir === 'DOWN' && step.slot === 'upper') {
        return { path: [...parentPath, { nodeId: node.id, slot: 'lower' }], index: node.lower.length };
      }
    }
  }
  return cursor;
}

/**
 * Extracts contiguous "base" tokens immediately to the left of the cursor (for x², x³, x^-1, x^□).
 */
export function popPrecedingBaseTokens(
  root: AstList,
  cursor: AstCursor
): { ast: AstList; cursor: AstCursor; baseNodes: AstList } {
  const cloned = cloneAstList(root);
  const target = getTargetList(cloned, cursor.path);
  const idx = cursor.index;
  if (idx === 0) {
    return { ast: cloned, cursor, baseNodes: [] };
  }

  const prev = target[idx - 1];
  // If previous node is a closing paren ')', grab matching balanced '( ... )'
  if (prev.type === 'text' && prev.value === ')') {
    let depth = 0;
    let start = idx - 1;
    while (start >= 0) {
      const n = target[start];
      if (n.type === 'text') {
        if (n.value === ')') depth += 1;
        else if (n.value === '(' || n.value.endsWith('(')) {
          depth -= 1;
          if (depth === 0) break;
        }
      }
      start -= 1;
    }
    if (start >= 0) {
      const baseNodes = target.splice(start, idx - start);
      return {
        ast: cloned,
        cursor: { path: [...cursor.path], index: start },
        baseNodes,
      };
    }
  }

  // If previous node is a structured non-text node (frac, sqrt, etc.), wrap that single node
  if (prev.type !== 'text') {
    const baseNodes = target.splice(idx - 1, 1);
    return {
      ast: cloned,
      cursor: { path: [...cursor.path], index: idx - 1 },
      baseNodes,
    };
  }

  // Collect contiguous alphanumeric / decimal / variable / Ans / constant tokens
  const isBaseChar = (v: string) =>
    /^[0-9.A-FXYMπe𝐢]$/.test(v) || v === 'Ans' || v === 'PreAns' || v === '𝐢';
  if (isBaseChar(prev.value)) {
    let start = idx - 1;
    while (start > 0 && target[start - 1].type === 'text') {
      const tv = (target[start - 1] as { type: 'text'; value: string }).value;
      if (/^[0-9.]$/.test(tv)) {
        start -= 1;
      } else {
        break;
      }
    }
    const baseNodes = target.splice(start, idx - start);
    return {
      ast: cloned,
      cursor: { path: [...cursor.path], index: start },
      baseNodes,
    };
  }

  return { ast: cloned, cursor, baseNodes: [] };
}

export function astToReadableString(list: AstList): string {
  return list
    .map((node) => {
      switch (node.type) {
        case 'text':
          return node.value;
        case 'frac':
          return `(${astToReadableString(node.num)})/(${astToReadableString(node.den)})`;
        case 'mixedFrac':
          return `(${astToReadableString(node.whole)}+${astToReadableString(node.num)}/${astToReadableString(node.den)})`;
        case 'sqrt':
          return `√(${astToReadableString(node.inner)})`;
        case 'cbrt':
          return `³√(${astToReadableString(node.inner)})`;
        case 'nthRoot':
          return `${astToReadableString(node.index)}√(${astToReadableString(node.inner)})`;
        case 'pow':
          return `${astToReadableString(node.base)}^(${astToReadableString(node.exp)})`;
        case 'logBase':
          return `log_${astToReadableString(node.base)}(${astToReadableString(node.inner)})`;
        case 'abs':
          return `Abs(${astToReadableString(node.inner)})`;
        case 'integral':
          return `∫(${astToReadableString(node.expr)}, ${astToReadableString(node.lower)}, ${astToReadableString(node.upper)})`;
        case 'deriv':
          return `d/dx(${astToReadableString(node.expr)}, ${astToReadableString(node.at)})`;
        case 'sum':
          return `∑(${astToReadableString(node.expr)}, ${astToReadableString(node.lower)}, ${astToReadableString(node.upper)})`;
      }
    })
    .join('');
}

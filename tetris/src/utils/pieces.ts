import type { ActivePiece, TetrominoType, Rotation } from '../types';
import { TETROMINOES, BOARD_COLS, SPAWN_ROW } from '../constants';

const ALL_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export function randomBag(): TetrominoType[] {
  const bag = [...ALL_TYPES];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

export function spawn(type: TetrominoType): ActivePiece {
  const col = Math.floor((BOARD_COLS - 4) / 2);
  return { type, rotation: 0, row: SPAWN_ROW, col };
}

export function getCells(piece: ActivePiece): [number, number][] {
  const shape = TETROMINOES[piece.type][piece.rotation];
  return shape.map(([dr, dc]) => [piece.row + dr, piece.col + dc]);
}

function topPadding(type: TetrominoType, rotation: Rotation): number {
  return Math.min(...TETROMINOES[type][rotation].map(([r]) => r));
}

export function rotatePiece(piece: ActivePiece, dir: 1 | -1): ActivePiece {
  const next = ((piece.rotation + dir + 4) % 4) as Rotation;
  const rowAdjust = topPadding(piece.type, piece.rotation) - topPadding(piece.type, next);
  return { ...piece, rotation: next, row: piece.row + rowAdjust };
}

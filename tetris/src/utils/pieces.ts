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
  // Center horizontally: bounding box is 4 wide, board is BOARD_COLS wide
  const col = Math.floor((BOARD_COLS - 4) / 2);
  return { type, rotation: 0, row: SPAWN_ROW, col };
}

export function getCells(piece: ActivePiece): [number, number][] {
  const shape = TETROMINOES[piece.type][piece.rotation];
  return shape.map(([dr, dc]) => [piece.row + dr, piece.col + dc]);
}

export function rotatePiece(piece: ActivePiece, dir: 1 | -1): ActivePiece {
  const next = ((piece.rotation + dir + 4) % 4) as Rotation;
  return { ...piece, rotation: next };
}

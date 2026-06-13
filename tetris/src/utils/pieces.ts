import type { ActivePiece, TetrominoType, Rotation } from '../types';
import { TETROMINOES, BOARD_COLS, SPAWN_ROW } from '../constants';

const ALL_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// 7-bag 方式: 7 種をシャッフルして 1 セットにする。
// 同じミノが長期間出ない/続けて出すぎることを防ぐ。
// Fisher-Yates アルゴリズムで in-place シャッフル。
export function randomBag(): TetrominoType[] {
  const bag = [...ALL_TYPES];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

// バウンディングボックスは 4 列幅なので、
// (BOARD_COLS - 4) / 2 = 3 列目がセンタリング位置になる。
export function spawn(type: TetrominoType): ActivePiece {
  const col = Math.floor((BOARD_COLS - 4) / 2);
  return { type, rotation: 0, row: SPAWN_ROW, col };
}

// ピースの相対オフセットを絶対盤面座標に変換する。
// board.ts の衝突判定・マージ処理はすべてこの座標を使う。
export function getCells(piece: ActivePiece): [number, number][] {
  const shape = TETROMINOES[piece.type][piece.rotation];
  return shape.map(([dr, dc]) => [piece.row + dr, piece.col + dc]);
}

// +4 してから %4 することで、-1 方向の回転でも負数にならない。
export function rotatePiece(piece: ActivePiece, dir: 1 | -1): ActivePiece {
  const next = ((piece.rotation + dir + 4) % 4) as Rotation;
  return { ...piece, rotation: next };
}

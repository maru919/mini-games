import type { Board, ActivePiece, Cell } from '../types';
import { BOARD_COLS, BOARD_ROWS } from '../constants';
import { getCells } from './pieces';

export function createBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () => Array<Cell>(BOARD_COLS).fill(null));
}

// r < 0 のチェックが必要なのは、スポーン直後のミノが盤面上端より
// 上にはみ出した座標を持つことがあるため（上部は見えない余白）。
// その行は存在しないので範囲外チェックで弾けばよい。
export function isValidPosition(board: Board, piece: ActivePiece): boolean {
  for (const [r, c] of getCells(piece)) {
    if (r < 0 || r >= BOARD_ROWS || c < 0 || c >= BOARD_COLS) return false;
    if (r >= 0 && board[r][c] !== null) return false;
  }
  return true;
}

// React の状態として扱うため board を毎回コピーする（ミュータブル操作を避ける）。
export function mergePiece(board: Board, piece: ActivePiece): Board {
  const next = board.map(row => [...row]) as Board;
  for (const [r, c] of getCells(piece)) {
    if (r >= 0 && r < BOARD_ROWS) next[r][c] = piece.type;
  }
  return next;
}

// 埋まっていない行だけを残し、足りなくなった分を上部に空行として補う。
// こうすることで「揃った行が消えて上から落ちてくる」重力を再現できる。
// 戻り値: [新しい盤面, 消去ライン数]
export function clearLines(board: Board): [Board, number] {
  const remaining = board.filter(row => row.some(cell => cell === null));
  const cleared = BOARD_ROWS - remaining.length;
  const empty = Array.from({ length: cleared }, () => Array<Cell>(BOARD_COLS).fill(null));
  return [[...empty, ...remaining] as Board, cleared];
}

// 壁際での回転を救済するシンプルなウォールキック。
// SRS 準拠ではなく「左右に ±1、±2 ずらして再判定」という簡易版。
// I ミノは 4 列幅なので ±2 の試みも追加している。
export function tryKick(
  board: Board,
  piece: ActivePiece,
): ActivePiece | null {
  if (isValidPosition(board, piece)) return piece;
  const right = { ...piece, col: piece.col + 1 };
  if (isValidPosition(board, right)) return right;
  const left = { ...piece, col: piece.col - 1 };
  if (isValidPosition(board, left)) return left;
  // I ミノ向けの追加キック
  const right2 = { ...piece, col: piece.col + 2 };
  if (isValidPosition(board, right2)) return right2;
  const left2 = { ...piece, col: piece.col - 2 };
  if (isValidPosition(board, left2)) return left2;
  return null;
}

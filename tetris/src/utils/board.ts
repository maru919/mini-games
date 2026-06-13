import type { Board, ActivePiece, Cell } from '../types';
import { BOARD_COLS, BOARD_ROWS } from '../constants';
import { getCells } from './pieces';

export function createBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () => Array<Cell>(BOARD_COLS).fill(null));
}

export function isValidPosition(board: Board, piece: ActivePiece): boolean {
  for (const [r, c] of getCells(piece)) {
    if (r < 0 || r >= BOARD_ROWS || c < 0 || c >= BOARD_COLS) return false;
    if (r >= 0 && board[r][c] !== null) return false;
  }
  return true;
}

export function mergePiece(board: Board, piece: ActivePiece): Board {
  const next = board.map(row => [...row]) as Board;
  for (const [r, c] of getCells(piece)) {
    if (r >= 0 && r < BOARD_ROWS) next[r][c] = piece.type;
  }
  return next;
}

// Returns [new board, number of lines cleared]
export function clearLines(board: Board): [Board, number] {
  const remaining = board.filter(row => row.some(cell => cell === null));
  const cleared = BOARD_ROWS - remaining.length;
  const empty = Array.from({ length: cleared }, () => Array<Cell>(BOARD_COLS).fill(null));
  return [[...empty, ...remaining] as Board, cleared];
}

// Simple wall-kick: try original, then shift right, then shift left
export function tryKick(
  board: Board,
  piece: ActivePiece,
): ActivePiece | null {
  if (isValidPosition(board, piece)) return piece;
  const right = { ...piece, col: piece.col + 1 };
  if (isValidPosition(board, right)) return right;
  const left = { ...piece, col: piece.col - 1 };
  if (isValidPosition(board, left)) return left;
  // Extra kick for I piece
  const right2 = { ...piece, col: piece.col + 2 };
  if (isValidPosition(board, right2)) return right2;
  const left2 = { ...piece, col: piece.col - 2 };
  if (isValidPosition(board, left2)) return left2;
  return null;
}

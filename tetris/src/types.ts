export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type Cell = TetrominoType | null;
export type Board = Cell[][];
export type Rotation = 0 | 1 | 2 | 3;
export type GamePhase = 'ready' | 'playing' | 'paused' | 'gameover';

export interface ActivePiece {
  type: TetrominoType;
  rotation: Rotation;
  row: number;
  col: number;
}

export interface GameState {
  board: Board;
  active: ActivePiece | null;
  queue: TetrominoType[];
  phase: GamePhase;
  score: number;
  lines: number;
  level: number;
}

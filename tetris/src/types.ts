// ゲーム全体で使う型定義。
// Cell が TetrominoType | null になっているのは、盤面の各マスが
// 「何色のミノで埋まっているか」を直接保持するため。
// 別途 color テーブルを引く必要がなく、描画側がシンプルになる。

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type Cell = TetrominoType | null;
export type Board = Cell[][];
export type Rotation = 0 | 1 | 2 | 3;
export type GamePhase = 'ready' | 'playing' | 'paused' | 'gameover';

// ActivePiece の row/col は 4×4 バウンディングボックスの左上座標。
// 実際のセル座標は constants の TETROMINOES オフセットを足して求める。
export interface ActivePiece {
  type: TetrominoType;
  rotation: Rotation;
  row: number;
  col: number;
}

// active が null になるのはゲームオーバー判定の瞬間のみ。
// queue は常に少なくとも次の 1 ピース分を保持するよう useTetris が管理する。
export interface GameState {
  board: Board;
  active: ActivePiece | null;
  queue: TetrominoType[];
  phase: GamePhase;
  score: number;
  lines: number;
  level: number;
}

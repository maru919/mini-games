// 盤面を描画するコンポーネント。
// 固定済みブロック（board）と落下中ピース（active）を合成して表示する。

import type { Board as BoardType, ActivePiece } from '../types';
import { BOARD_COLS, BOARD_ROWS } from '../constants';
import { getCells } from '../utils/pieces';
import { Cell } from './Cell';

interface Props {
  board: BoardType;
  active: ActivePiece | null;
  paused: boolean;
}

export function Board({ board, active, paused }: Props) {
  // アクティブピースのセル座標を Set にしておくことで、
  // 200 セルのレンダリングループ内での判定を O(1) にする。
  const activeCells = active
    ? new Set(getCells(active).map(([r, c]) => `${r},${c}`))
    : new Set<string>();

  return (
    <div
      className="tetris-board"
      style={{ '--cols': BOARD_COLS, '--rows': BOARD_ROWS } as React.CSSProperties}
    >
      {paused && <div className="board-overlay">一時停止中</div>}
      {Array.from({ length: BOARD_ROWS }, (_, r) =>
        Array.from({ length: BOARD_COLS }, (_, c) => {
          const key = `${r},${c}`;
          // アクティブピースのセルは board の内容より優先して描画する
          const cellType = activeCells.has(key) ? active!.type : board[r][c];
          return <Cell key={key} cell={cellType} />;
        })
      )}
    </div>
  );
}

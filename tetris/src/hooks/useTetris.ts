// ゲームの全状態を管理する中核フック。
// 状態遷移は純粋関数の reducer に集約し、副作用（タイマー）は useEffect で分離する。
// memory ゲームの useMemoryGame と同じパターン。

import { useReducer, useEffect, useRef } from 'react';
import type { GameState, ActivePiece } from '../types';
import { createBoard, isValidPosition, mergePiece, clearLines, tryKick } from '../utils/board';
import { randomBag, spawn, rotatePiece } from '../utils/pieces';
import { LINE_SCORE, LINES_PER_LEVEL, LEVEL_SPEEDS } from '../constants';

type Action =
  | { type: 'MOVE'; dx: number }
  | { type: 'ROTATE'; dir: 1 | -1 }
  | { type: 'SOFT_DROP' }
  | { type: 'HARD_DROP' }
  | { type: 'TICK' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'RESTART' };

// 2 つのバッグを最初から用意しておくことで、queue[0] が常に「次のピース」として
// 参照できる状態を保つ（表示用に最低 1 つ先読みが必要）。
function newGame(): GameState {
  const bag1 = randomBag();
  const bag2 = randomBag();
  const queue = [...bag1, ...bag2];
  const [type, ...rest] = queue;
  return {
    board: createBoard(),
    active: spawn(type),
    queue: rest,
    phase: 'playing',
    score: 0,
    lines: 0,
    level: 0,
  };
}

// キューが 7 未満になったら新しいバッグを補充する。
// スポーン位置で衝突 = 積み上がりすぎてゲームオーバー。
function nextPiece(state: GameState): GameState {
  let queue = state.queue;
  if (queue.length < 7) queue = [...queue, ...randomBag()];
  const [type, ...rest] = queue;
  const active = spawn(type);
  if (!isValidPosition(state.board, active)) {
    return { ...state, active: null, queue: rest, phase: 'gameover' };
  }
  return { ...state, active, queue: rest };
}

// ピース固定 → ライン消去 → スコア/レベル更新 → 次ピース生成 を 1 トランザクションで行う。
// スコアは「消去ライン数に応じた基点 × (レベル+1)」で計算（レベルが上がるほど高得点）。
function lockAndAdvance(state: GameState, piece: ActivePiece): GameState {
  const merged = mergePiece(state.board, piece);
  const [cleared, count] = clearLines(merged);
  const lines = state.lines + count;
  const level = Math.floor(lines / LINES_PER_LEVEL);
  const score = state.score + (LINE_SCORE[count] ?? 0) * (level + 1);
  return nextPiece({ ...state, board: cleared, lines, level, score });
}

// ハードドロップの着地位置を 1 行ずつ下にずらして求める。
function hardDropRow(board: GameState['board'], piece: ActivePiece): ActivePiece {
  let p = piece;
  while (isValidPosition(board, { ...p, row: p.row + 1 })) {
    p = { ...p, row: p.row + 1 };
  }
  return p;
}

function reducer(state: GameState, action: Action): GameState {
  // RESTART と TOGGLE_PAUSE は phase を問わず常に受け付ける
  if (action.type === 'RESTART') return newGame();

  if (action.type === 'TOGGLE_PAUSE') {
    if (state.phase === 'playing') return { ...state, phase: 'paused' };
    if (state.phase === 'paused') return { ...state, phase: 'playing' };
    return state;
  }

  // 以降のアクションは playing 状態かつアクティブなピースが存在する場合のみ処理
  if (state.phase !== 'playing' || state.active === null) return state;
  const { board, active } = state;

  switch (action.type) {
    case 'MOVE': {
      const moved = { ...active, col: active.col + action.dx };
      if (isValidPosition(board, moved)) return { ...state, active: moved };
      return state;
    }

    case 'ROTATE': {
      const rotated = rotatePiece(active, action.dir);
      // 回転後に壁やブロックと重なる場合はウォールキックで救済
      const kicked = tryKick(board, rotated);
      if (kicked) return { ...state, active: kicked };
      return state;
    }

    // SOFT_DROP と TICK は「1 行下に移動」という同じ処理。
    // SOFT_DROP だけプレイヤー操作ボーナス (+1点) を付与する。
    case 'SOFT_DROP':
    case 'TICK': {
      const dropped = { ...active, row: active.row + 1 };
      if (isValidPosition(board, dropped)) {
        const score = action.type === 'SOFT_DROP' ? state.score + 1 : state.score;
        return { ...state, active: dropped, score };
      }
      // これ以上下に移動できない → ピースを固定して次へ
      return lockAndAdvance(state, active);
    }

    case 'HARD_DROP': {
      const landed = hardDropRow(board, active);
      // 落下した行数 × 2 点のボーナス
      const rows = landed.row - active.row;
      const score = state.score + rows * 2;
      return lockAndAdvance({ ...state, score }, landed);
    }
  }
}

export function useTetris() {
  const [state, dispatch] = useReducer(reducer, undefined, newGame);
  const intervalRef = useRef<number | null>(null);

  const clearLoop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // phase または level が変わるたびにタイマーをリセットする。
  // level 変化で速度が変わるため、インターバルを作り直す必要がある。
  // paused/gameover 時はタイマーを止めて TICK が飛ばないようにする。
  useEffect(() => {
    clearLoop();
    if (state.phase !== 'playing') return;
    const speed = LEVEL_SPEEDS[Math.min(state.level, LEVEL_SPEEDS.length - 1)];
    intervalRef.current = window.setInterval(() => {
      dispatch({ type: 'TICK' });
    }, speed);
    return clearLoop;
  }, [state.phase, state.level]);

  // コンポーネントアンマウント時にタイマーを必ず解放する
  useEffect(() => () => clearLoop(), []);

  return { state, dispatch };
}

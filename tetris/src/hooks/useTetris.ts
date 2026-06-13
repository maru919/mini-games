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

function lockAndAdvance(state: GameState, piece: ActivePiece): GameState {
  const merged = mergePiece(state.board, piece);
  const [cleared, count] = clearLines(merged);
  const lines = state.lines + count;
  const level = Math.floor(lines / LINES_PER_LEVEL);
  const score = state.score + (LINE_SCORE[count] ?? 0) * (level + 1);
  return nextPiece({ ...state, board: cleared, lines, level, score });
}

function hardDropRow(board: GameState['board'], piece: ActivePiece): ActivePiece {
  let p = piece;
  while (isValidPosition(board, { ...p, row: p.row + 1 })) {
    p = { ...p, row: p.row + 1 };
  }
  return p;
}

function reducer(state: GameState, action: Action): GameState {
  if (action.type === 'RESTART') return newGame();

  if (action.type === 'TOGGLE_PAUSE') {
    if (state.phase === 'playing') return { ...state, phase: 'paused' };
    if (state.phase === 'paused') return { ...state, phase: 'playing' };
    return state;
  }

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
      const kicked = tryKick(board, rotated);
      if (kicked) return { ...state, active: kicked };
      return state;
    }

    case 'SOFT_DROP':
    case 'TICK': {
      const dropped = { ...active, row: active.row + 1 };
      if (isValidPosition(board, dropped)) {
        const score = action.type === 'SOFT_DROP' ? state.score + 1 : state.score;
        return { ...state, active: dropped, score };
      }
      return lockAndAdvance(state, active);
    }

    case 'HARD_DROP': {
      const landed = hardDropRow(board, active);
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

  useEffect(() => {
    clearLoop();
    if (state.phase !== 'playing') return;
    const speed = LEVEL_SPEEDS[Math.min(state.level, LEVEL_SPEEDS.length - 1)];
    intervalRef.current = window.setInterval(() => {
      dispatch({ type: 'TICK' });
    }, speed);
    return clearLoop;
  }, [state.phase, state.level]);

  useEffect(() => () => clearLoop(), []);

  return { state, dispatch };
}

// キーボードイベントをゲームアクションに変換するフック。
// dispatch を受け取って window に登録するだけなので、
// ゲームロジック（useTetris）から入力処理を切り離せる。

import { useEffect } from 'react';
import type { Dispatch } from 'react';

type Action =
  | { type: 'MOVE'; dx: number }
  | { type: 'ROTATE'; dir: 1 | -1 }
  | { type: 'SOFT_DROP' }
  | { type: 'HARD_DROP' }
  | { type: 'TICK' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'RESTART' };

// e.code はレイアウト非依存のキー識別子（QWERTY/AZERTY 問わず同じ値）。
// e.key と異なり、日本語 IME や修飾キーの影響を受けにくい。
const KEY_MAP: Record<string, () => Action | null> = {
  ArrowLeft:  () => ({ type: 'MOVE', dx: -1 }),
  ArrowRight: () => ({ type: 'MOVE', dx: 1 }),
  ArrowDown:  () => ({ type: 'SOFT_DROP' }),
  ArrowUp:    () => ({ type: 'ROTATE', dir: 1 }),
  KeyX:       () => ({ type: 'ROTATE', dir: 1 }),
  KeyZ:       () => ({ type: 'ROTATE', dir: -1 }),
  Space:      () => ({ type: 'HARD_DROP' }),
  Escape:     () => ({ type: 'TOGGLE_PAUSE' }),
  KeyP:       () => ({ type: 'TOGGLE_PAUSE' }),
};

// 矢印キーとスペースはブラウザのデフォルト動作（ページスクロール）を
// 抑止しないとゲーム操作が画面スクロールに奪われてしまう。
const PREVENT_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space']);

export function useKeyboard(dispatch: Dispatch<Action>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (PREVENT_KEYS.has(e.code)) e.preventDefault();
      const factory = KEY_MAP[e.code];
      if (!factory) return;
      const action = factory();
      if (action) dispatch(action);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);
}

import type { CardSet, Difficulty } from './types';

export const DIFFICULTIES: Difficulty[] = [
  { id: 'easy',   label: 'かんたん (4×4)',   cols: 4, rows: 4, pairs: 8  },
  { id: 'normal', label: 'ふつう (6×6)',     cols: 6, rows: 6, pairs: 18 },
  { id: 'hard',   label: 'むずかしい (8×8)', cols: 8, rows: 8, pairs: 32 },
];

export const CARD_SETS: CardSet[] = [
  { id: 'emoji', label: '絵文字' },
  { id: 'color', label: '単色' },
];

export const EMOJI_POOL: string[] = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼',
  '🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔',
  '🐧','🦆','🦉','🐴','🦄','🐝','🐢','🐙',
  '🦀','🐬','🍎','🍌','🍇','🍓','🍑','🌸',
];

// HSL色空間で hue を等間隔に配置した色を生成する。
// S/L は視認性とコントラストのバランスを取った固定値。
export function generateColorPool(count: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    `hsl(${Math.round((i * 360) / count)}, 68%, 55%)`
  );
}

export const MISMATCH_DELAY_MS = 900;

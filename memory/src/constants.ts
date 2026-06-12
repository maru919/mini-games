import type { Difficulty } from './types';

export const DIFFICULTIES: Difficulty[] = [
  { id: 'easy',   label: 'かんたん (4×4)',  cols: 4, rows: 4, pairs: 8  },
  { id: 'normal', label: 'ふつう (6×6)',    cols: 6, rows: 6, pairs: 18 },
  { id: 'hard',   label: 'むずかしい (8×8)', cols: 8, rows: 8, pairs: 32 },
];

export const EMOJI_POOL: string[] = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼',
  '🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔',
  '🐧','🦆','🦉','🐴','🦄','🐝','🐢','🐙',
  '🦀','🐬','🍎','🍌','🍇','🍓','🍑','🌸',
];

export const MISMATCH_DELAY_MS = 900;

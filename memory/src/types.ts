export type PlayerId = 1 | 2;
export type GamePhase = 'playing' | 'checking' | 'finished';
export type DifficultyId = 'easy' | 'normal' | 'hard';

export interface Difficulty {
  id: DifficultyId;
  label: string;
  cols: number;
  rows: number;
  pairs: number;
}

export interface CardData {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  matchedBy: PlayerId | null;
}

export interface Scores {
  1: number;
  2: number;
}

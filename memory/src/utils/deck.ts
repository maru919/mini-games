import type { CardData, Difficulty } from '../types';
import { EMOJI_POOL } from '../constants';
import { shuffle } from './shuffle';

export function buildDeck(difficulty: Difficulty): CardData[] {
  const emojis = shuffle(EMOJI_POOL).slice(0, difficulty.pairs);
  const pairs = [...emojis, ...emojis];
  return shuffle(pairs).map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

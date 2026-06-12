import type { CardData, Difficulty } from '../types';
import { EMOJI_POOL } from '../constants';
import { shuffle } from './shuffle';

export function buildDeck(difficulty: Difficulty): CardData[] {
  const uniqueCount = difficulty.pairs / 2;
  const emojis = shuffle(EMOJI_POOL).slice(0, uniqueCount);
  const quads = [...emojis, ...emojis, ...emojis, ...emojis];
  return shuffle(quads).map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
    matchedBy: null,
  }));
}

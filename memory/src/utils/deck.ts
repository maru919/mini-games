import type { CardData, CardSet, Difficulty } from '../types';
import { EMOJI_POOL, generateColorPool } from '../constants';
import { shuffle } from './shuffle';

export function buildDeck(difficulty: Difficulty, cardSet: CardSet): CardData[] {
  const uniqueCount = difficulty.pairs / 2;

  const faces: string[] =
    cardSet.id === 'color'
      ? generateColorPool(uniqueCount)
      : shuffle(EMOJI_POOL).slice(0, uniqueCount);

  const quads = [...faces, ...faces, ...faces, ...faces];
  return shuffle(quads).map((face, index) => ({
    id: index,
    face,
    isFlipped: false,
    isMatched: false,
    matchedBy: null,
  }));
}

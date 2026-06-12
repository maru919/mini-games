import { useReducer, useRef, useEffect } from 'react';
import type { CardData, CardSet, Difficulty, GamePhase, PlayerId, Scores } from '../types';
import { buildDeck } from '../utils/deck';
import { MISMATCH_DELAY_MS } from '../constants';

interface State {
  cards: CardData[];
  phase: GamePhase;
  currentPlayer: PlayerId;
  scores: Scores;
  firstPickId: number | null;
}

type Action =
  | { type: 'FLIP'; id: number }
  | { type: 'RESOLVE_MISMATCH'; idA: number; idB: number }
  | { type: 'RESTART'; deck: CardData[] };

function initState([difficulty, cardSet]: [Difficulty, CardSet]): State {
  return {
    cards: buildDeck(difficulty, cardSet),
    phase: 'playing',
    currentPlayer: 1,
    scores: { 1: 0, 2: 0 },
    firstPickId: null,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FLIP': {
      if (state.phase !== 'playing') return state;
      const card = state.cards.find((c) => c.id === action.id);
      if (!card || card.isFlipped || card.isMatched) return state;

      const flipped = state.cards.map((c) =>
        c.id === action.id ? { ...c, isFlipped: true } : c,
      );

      if (state.firstPickId === null) {
        return { ...state, cards: flipped, firstPickId: action.id };
      }

      const firstCard = state.cards.find((c) => c.id === state.firstPickId)!;
      const isMatch = firstCard.face === card.face;

      if (isMatch) {
        const matched = flipped.map((c) =>
          c.id === action.id || c.id === state.firstPickId
            ? { ...c, isFlipped: false, isMatched: true, matchedBy: state.currentPlayer }
            : c,
        );
        const newScore = state.scores[state.currentPlayer] + 1;
        const scores: Scores = { ...state.scores, [state.currentPlayer]: newScore };
        const allMatched = matched.every((c) => c.isMatched);
        return {
          ...state,
          cards: matched,
          scores,
          firstPickId: null,
          phase: allMatched ? 'finished' : 'playing',
        };
      }

      return { ...state, cards: flipped, firstPickId: null, phase: 'checking' };
    }

    case 'RESOLVE_MISMATCH': {
      if (state.phase !== 'checking') return state;
      const restored = state.cards.map((c) =>
        c.id === action.idA || c.id === action.idB ? { ...c, isFlipped: false } : c,
      );
      const next: PlayerId = state.currentPlayer === 1 ? 2 : 1;
      return { ...state, cards: restored, phase: 'playing', currentPlayer: next };
    }

    case 'RESTART': {
      return {
        cards: action.deck,
        phase: 'playing',
        currentPlayer: 1,
        scores: { 1: 0, 2: 0 },
        firstPickId: null,
      };
    }
  }
}

export function useMemoryGame(difficulty: Difficulty, cardSet: CardSet) {
  const [state, dispatch] = useReducer(reducer, [difficulty, cardSet], initState);
  const timeoutRef = useRef<number | null>(null);

  const clearPending = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => () => clearPending(), []);

  const flipCard = (id: number) => {
    if (state.phase === 'checking' || state.phase === 'finished') return;

    const prev = state;
    dispatch({ type: 'FLIP', id });

    if (prev.firstPickId !== null && prev.phase === 'playing') {
      const firstCard = prev.cards.find((c) => c.id === prev.firstPickId);
      const secondCard = prev.cards.find((c) => c.id === id);
      if (firstCard && secondCard && firstCard.face !== secondCard.face) {
        const idA = prev.firstPickId;
        const idB = id;
        clearPending();
        timeoutRef.current = window.setTimeout(() => {
          dispatch({ type: 'RESOLVE_MISMATCH', idA, idB });
        }, MISMATCH_DELAY_MS);
      }
    }
  };

  const restart = () => {
    clearPending();
    dispatch({ type: 'RESTART', deck: buildDeck(difficulty, cardSet) });
  };

  return {
    cards: state.cards,
    phase: state.phase,
    currentPlayer: state.currentPlayer,
    scores: state.scores,
    flipCard,
    restart,
  };
}

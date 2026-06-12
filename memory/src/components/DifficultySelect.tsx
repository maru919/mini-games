import { useState } from 'react';
import type { CardSet, Difficulty } from '../types';
import { CARD_SETS, DIFFICULTIES } from '../constants';

interface Props {
  onSelect: (difficulty: Difficulty, cardSet: CardSet) => void;
}

export function DifficultySelect({ onSelect }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES[0]);
  const [cardSet, setCardSet] = useState<CardSet>(CARD_SETS[0]);

  return (
    <div className="difficulty-select">
      <h1>🎴 神経衰弱</h1>
      <p className="subtitle">2人対戦 — 同じ絵柄を当てたら連続手番</p>

      <section className="setup-section">
        <h2 className="setup-label">難易度</h2>
        <div className="setup-buttons">
          {DIFFICULTIES.map(d => (
            <button
              key={d.id}
              className={`setup-btn${difficulty.id === d.id ? ' selected' : ''}`}
              onClick={() => setDifficulty(d)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>

      <section className="setup-section">
        <h2 className="setup-label">カードセット</h2>
        <div className="setup-buttons">
          {CARD_SETS.map(cs => (
            <button
              key={cs.id}
              className={`setup-btn${cardSet.id === cs.id ? ' selected' : ''}`}
              onClick={() => setCardSet(cs)}
            >
              {cs.label}
            </button>
          ))}
        </div>
      </section>

      <button className="start-btn" onClick={() => onSelect(difficulty, cardSet)}>
        スタート
      </button>
    </div>
  );
}

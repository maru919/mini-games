import type { Difficulty } from '../types';
import { DIFFICULTIES } from '../constants';

interface Props {
  onSelect: (difficulty: Difficulty) => void;
}

export function DifficultySelect({ onSelect }: Props) {
  return (
    <div className="difficulty-select">
      <h1>🎴 神経衰弱</h1>
      <p className="subtitle">2人対戦 — 同じ絵柄を当てたら連続手番</p>
      <div className="difficulty-buttons">
        {DIFFICULTIES.map(d => (
          <button key={d.id} className="difficulty-btn" onClick={() => onSelect(d)}>
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}

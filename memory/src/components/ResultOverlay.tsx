import type { Scores } from '../types';

interface Props {
  scores: Scores;
  onRestart: () => void;
  onQuit: () => void;
}

export function ResultOverlay({ scores, onRestart, onQuit }: Props) {
  const winner =
    scores[1] > scores[2] ? 'Player 1 🟥' :
    scores[2] > scores[1] ? 'Player 2 🟦' : null;

  return (
    <div className="overlay-backdrop">
      <div className="overlay">
        <div className="overlay-emoji">🎉</div>
        <h2 className="overlay-title">
          {winner ? `${winner} の勝ち！` : '引き分け！'}
        </h2>
        <div className="overlay-scores">
          <div>🟥 Player 1: {scores[1]} ペア</div>
          <div>🟦 Player 2: {scores[2]} ペア</div>
        </div>
        <div className="overlay-actions">
          <button onClick={onRestart}>もう一度</button>
          <button onClick={onQuit}>メニューへ</button>
        </div>
      </div>
    </div>
  );
}

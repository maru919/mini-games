import type { PlayerId, Scores } from '../types';

interface Props {
  currentPlayer: PlayerId;
  scores: Scores;
  onRestart: () => void;
  onQuit: () => void;
}

export function ScoreBar({ currentPlayer, scores, onRestart, onQuit }: Props) {
  return (
    <div className="score-bar">
      <div className={`player-score${currentPlayer === 1 ? ' active' : ''}`}>
        <span className="player-label">🟥 Player 1</span>
        <span className="score">{scores[1]} ペア</span>
        {currentPlayer === 1 && <span className="turn-badge">← いまの番</span>}
      </div>
      <div className="score-bar-actions">
        <button onClick={onRestart}>もう一度</button>
        <button onClick={onQuit}>メニューへ</button>
      </div>
      <div className={`player-score${currentPlayer === 2 ? ' active' : ''}`}>
        {currentPlayer === 2 && <span className="turn-badge">いまの番 →</span>}
        <span className="player-label">🟦 Player 2</span>
        <span className="score">{scores[2]} ペア</span>
      </div>
    </div>
  );
}

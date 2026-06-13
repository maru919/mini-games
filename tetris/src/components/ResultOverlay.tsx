interface Props {
  score: number;
  lines: number;
  level: number;
  onRestart: () => void;
  onQuit: () => void;
}

export function ResultOverlay({ score, lines, level, onRestart, onQuit }: Props) {
  return (
    <div className="result-overlay">
      <div className="result-card">
        <h2 className="result-title">ゲームオーバー</h2>
        <div className="result-stats">
          <div className="result-stat">
            <span className="stat-label">スコア</span>
            <span className="stat-value result-score">{score.toLocaleString()}</span>
          </div>
          <div className="result-stat">
            <span className="stat-label">ライン</span>
            <span className="stat-value">{lines}</span>
          </div>
          <div className="result-stat">
            <span className="stat-label">レベル</span>
            <span className="stat-value">{level + 1}</span>
          </div>
        </div>
        <div className="result-actions">
          <button className="btn btn--primary" onClick={onRestart}>もう一度</button>
          <button className="btn btn--ghost" onClick={onQuit}>やめる</button>
        </div>
      </div>
    </div>
  );
}

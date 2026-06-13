import type { GameState } from '../types';

interface Props {
  state: GameState;
  onTogglePause: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export function StatusBar({ state, onTogglePause, onRestart, onQuit }: Props) {
  return (
    <div className="status-bar">
      <div className="stat">
        <span className="stat-label">スコア</span>
        <span className="stat-value">{state.score.toLocaleString()}</span>
      </div>
      <div className="stat">
        <span className="stat-label">レベル</span>
        <span className="stat-value">{state.level + 1}</span>
      </div>
      <div className="stat">
        <span className="stat-label">ライン</span>
        <span className="stat-value">{state.lines}</span>
      </div>
      <div className="status-actions">
        {state.phase !== 'gameover' && (
          <button className="btn btn--sm" onClick={onTogglePause}>
            {state.phase === 'paused' ? '▶ 再開' : '⏸ 停止'}
          </button>
        )}
        <button className="btn btn--sm" onClick={onRestart}>↺ リスタート</button>
        <button className="btn btn--sm btn--ghost" onClick={onQuit}>✕ やめる</button>
      </div>
    </div>
  );
}

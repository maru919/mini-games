// アプリのルートコンポーネント。
// StartScreen ⇄ GameScreen の切り替えのみを担う。

import { useState } from 'react';
import './App.css';
import { useTetris } from './hooks/useTetris';
import { useKeyboard } from './hooks/useKeyboard';
import { Board } from './components/Board';
import { NextPiece } from './components/NextPiece';
import { StatusBar } from './components/StatusBar';
import { ResultOverlay } from './components/ResultOverlay';
import { StartScreen } from './components/StartScreen';

function GameScreen({ onQuit }: { onQuit: () => void }) {
  const { state, dispatch } = useTetris();
  useKeyboard(dispatch);

  // queue[0] が次のピース。キューが空になることは設計上ないが、
  // フォールバックとして 'I' を指定している。
  const nextType = state.queue[0] ?? 'I';

  return (
    <div className="game-screen">
      <StatusBar
        state={state}
        onTogglePause={() => dispatch({ type: 'TOGGLE_PAUSE' })}
        onRestart={() => dispatch({ type: 'RESTART' })}
        onQuit={onQuit}
      />
      <div className="game-area">
        <Board board={state.board} active={state.active} paused={state.phase === 'paused'} />
        <NextPiece type={nextType} />
      </div>
      {state.phase === 'gameover' && (
        <ResultOverlay
          score={state.score}
          lines={state.lines}
          level={state.level}
          onRestart={() => dispatch({ type: 'RESTART' })}
          onQuit={onQuit}
        />
      )}
    </div>
  );
}

export default function App() {
  const [playing, setPlaying] = useState(false);
  // key を変えることで GameScreen を強制再マウントし、
  // useTetris の状態（スコア・盤面など）をリセットする。
  const [key, setKey] = useState(0);

  if (!playing) {
    return <StartScreen onStart={() => setPlaying(true)} />;
  }

  return (
    <GameScreen
      key={key}
      onQuit={() => { setPlaying(false); setKey(k => k + 1); }}
    />
  );
}

import { useState } from 'react';
import './App.css';
import type { Difficulty } from './types';
import { DifficultySelect } from './components/DifficultySelect';
import { Board } from './components/Board';
import { ScoreBar } from './components/ScoreBar';
import { ResultOverlay } from './components/ResultOverlay';
import { useMemoryGame } from './hooks/useMemoryGame';

function GameScreen({ difficulty, onQuit }: { difficulty: Difficulty; onQuit: () => void }) {
  const { cards, phase, currentPlayer, scores, flipCard, restart } = useMemoryGame(difficulty);

  return (
    <div className="game-screen">
      <ScoreBar
        currentPlayer={currentPlayer}
        scores={scores}
        onRestart={restart}
        onQuit={onQuit}
      />
      <Board cards={cards} cols={difficulty.cols} onCardClick={flipCard} />
      {phase === 'finished' && (
        <ResultOverlay scores={scores} onRestart={restart} onQuit={onQuit} />
      )}
    </div>
  );
}

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  if (!difficulty) {
    return <DifficultySelect onSelect={setDifficulty} />;
  }

  return (
    <GameScreen
      key={difficulty.id}
      difficulty={difficulty}
      onQuit={() => setDifficulty(null)}
    />
  );
}

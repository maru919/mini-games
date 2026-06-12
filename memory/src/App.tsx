import { useState } from 'react';
import './App.css';
import type { CardSet, Difficulty } from './types';
import { DifficultySelect } from './components/DifficultySelect';
import { Board } from './components/Board';
import { ScoreBar } from './components/ScoreBar';
import { ResultOverlay } from './components/ResultOverlay';
import { useMemoryGame } from './hooks/useMemoryGame';

interface GameConfig { difficulty: Difficulty; cardSet: CardSet }

function GameScreen({ config, onQuit }: { config: GameConfig; onQuit: () => void }) {
  const { difficulty, cardSet } = config;
  const { cards, phase, currentPlayer, scores, flipCard, restart } = useMemoryGame(difficulty, cardSet);

  return (
    <div className="game-screen">
      <ScoreBar
        currentPlayer={currentPlayer}
        scores={scores}
        onRestart={restart}
        onQuit={onQuit}
      />
      <Board cards={cards} cols={difficulty.cols} cardSetId={cardSet.id} onCardClick={flipCard} />
      {phase === 'finished' && (
        <ResultOverlay scores={scores} onRestart={restart} onQuit={onQuit} />
      )}
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState<GameConfig | null>(null);

  if (!config) {
    return (
      <DifficultySelect
        onSelect={(difficulty, cardSet) => setConfig({ difficulty, cardSet })}
      />
    );
  }

  return (
    <GameScreen
      key={`${config.difficulty.id}-${config.cardSet.id}`}
      config={config}
      onQuit={() => setConfig(null)}
    />
  );
}

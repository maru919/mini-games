import type { CardData } from '../types';

interface Props {
  card: CardData;
  onClick: (id: number) => void;
}

export function Card({ card, onClick }: Props) {
  const faceUp = card.isFlipped || card.isMatched;

  return (
    <button
      className={`card${faceUp ? ' is-flipped' : ''}${card.isMatched ? ' is-matched' : ''}`}
      onClick={() => onClick(card.id)}
      disabled={card.isMatched}
      aria-label={faceUp ? card.emoji : '裏向きカード'}
    >
      <div className="card-inner">
        <div className="card-face card-back">🎴</div>
        <div className="card-face card-front">{card.emoji}</div>
      </div>
    </button>
  );
}

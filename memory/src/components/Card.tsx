import type { CardData, CardSetId } from '../types';

interface Props {
  card: CardData;
  cardSetId: CardSetId;
  onClick: (id: number) => void;
}

export function Card({ card, cardSetId, onClick }: Props) {
  const faceUp = card.isFlipped || card.isMatched;
  const matchedClass = card.matchedBy ? ` matched-by-${card.matchedBy}` : '';
  const className = `card${faceUp ? ' is-flipped' : ''}${card.isMatched ? ` is-matched${matchedClass}` : ''}`;

  const isColor = cardSetId === 'color';
  const isEbidan = cardSetId === 'ebidan';

  const frontClass = [
    'card-face card-front',
    isColor ? 'card-color-face' : '',
    isEbidan ? 'card-photo-face' : '',
  ].filter(Boolean).join(' ');

  const frontStyle = isColor ? { backgroundColor: card.face } : undefined;

  return (
    <button
      className={className}
      onClick={() => onClick(card.id)}
      disabled={card.isMatched}
      aria-label={faceUp ? (card.faceName ?? card.face) : '裏向きカード'}
    >
      <div className="card-inner">
        <div className="card-face card-back">🎴</div>
        <div className={frontClass} style={frontStyle}>
          {isEbidan ? (
            <>
              <img
                src={card.face}
                alt={card.faceName}
                className="card-photo"
                loading="lazy"
              />
              {card.faceName && (
                <span className="card-name-overlay">{card.faceName}</span>
              )}
            </>
          ) : isColor ? null : (
            card.face
          )}
        </div>
      </div>
    </button>
  );
}

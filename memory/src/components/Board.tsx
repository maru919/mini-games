import type { CardData, CardSetId } from '../types';
import { Card } from './Card';

interface Props {
  cards: CardData[];
  cols: number;
  cardSetId: CardSetId;
  onCardClick: (id: number) => void;
}

export function Board({ cards, cols, cardSetId, onCardClick }: Props) {
  return (
    <div className="board" style={{ '--cols': cols } as React.CSSProperties}>
      {cards.map(card => (
        <Card key={card.id} card={card} cardSetId={cardSetId} onClick={onCardClick} />
      ))}
    </div>
  );
}

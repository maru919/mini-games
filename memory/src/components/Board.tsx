import type { CardData } from '../types';
import { Card } from './Card';

interface Props {
  cards: CardData[];
  cols: number;
  onCardClick: (id: number) => void;
}

export function Board({ cards, cols, onCardClick }: Props) {
  return (
    <div className="board" style={{ '--cols': cols } as React.CSSProperties}>
      {cards.map(card => (
        <Card key={card.id} card={card} onClick={onCardClick} />
      ))}
    </div>
  );
}

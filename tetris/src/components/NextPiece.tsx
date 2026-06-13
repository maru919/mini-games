import type { TetrominoType } from '../types';
import { TETROMINOES, TETROMINO_COLORS } from '../constants';

interface Props {
  type: TetrominoType;
}

export function NextPiece({ type }: Props) {
  const cells = TETROMINOES[type][0];
  const color = TETROMINO_COLORS[type];

  return (
    <div className="next-piece">
      <p className="next-label">NEXT</p>
      <div className="next-grid">
        {Array.from({ length: 4 }, (_, r) =>
          Array.from({ length: 4 }, (_, c) => {
            const filled = cells.some(([cr, cc]) => cr === r && cc === c);
            return (
              <div
                key={`${r},${c}`}
                className={`next-cell${filled ? ' next-cell--filled' : ''}`}
                style={filled ? { '--cell-color': color } as React.CSSProperties : undefined}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

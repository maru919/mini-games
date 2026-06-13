import type { Cell as CellType } from '../types';
import { TETROMINO_COLORS } from '../constants';

interface Props {
  cell: CellType;
  isActive?: boolean;
}

export function Cell({ cell, isActive }: Props) {
  const color = cell ? TETROMINO_COLORS[cell] : undefined;
  return (
    <div
      className={`cell${cell || isActive ? ' cell--filled' : ''}`}
      style={color ? { '--cell-color': color } as React.CSSProperties : undefined}
    />
  );
}

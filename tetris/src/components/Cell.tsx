// 盤面の 1 マスを描画するコンポーネント。
// ミノの種類を CSS カスタムプロパティ --cell-color として渡すことで、
// クラス名を増やさずに各ミノの色を表現できる。

import type { Cell as CellType } from '../types';
import { TETROMINO_COLORS } from '../constants';

interface Props {
  cell: CellType;
  isActive?: boolean; // 将来のゴースト（着地予測）表示に備えて残している
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

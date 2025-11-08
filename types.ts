
export type Player = 'w' | 'b';
export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';

export interface Piece {
  player: Player;
  type: PieceType;
}

export type SquareData = Piece | null;

export type Board = SquareData[][];

export interface Position {
  row: number;
  col: number;
}

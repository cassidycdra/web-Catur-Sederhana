
import React from 'react';
import { Piece, Player, PieceType } from '../types';

interface PieceProps {
  piece: Piece;
}

const PIECE_MAP: { [key in Player]: { [key in PieceType]: string } } = {
  w: {
    p: '♙',
    r: '♖',
    n: '♘',
    b: '♗',
    q: '♕',
    k: '♔',
  },
  b: {
    p: '♟',
    r: '♜',
    n: '♞',
    b: '♝',
    q: '♛',
    k: '♚',
  },
};

const PieceComponent: React.FC<PieceProps> = ({ piece }) => {
  const pieceColor = piece.player === 'w' ? 'text-white' : 'text-gray-900';
  
  return (
    <div className={`text-4xl md:text-5xl drop-shadow-lg z-10 select-none ${pieceColor}`}>
      {PIECE_MAP[piece.player][piece.type]}
    </div>
  );
};

export default PieceComponent;

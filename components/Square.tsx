
import React from 'react';
import { SquareData } from '../types';
import PieceComponent from './Piece';

interface SquareProps {
  piece: SquareData;
  isLight: boolean;
  onClick: () => void;
  isSelected: boolean;
  isPossibleMove: boolean;
}

const Square: React.FC<SquareProps> = ({ piece, isLight, onClick, isSelected, isPossibleMove }) => {
  const bgColor = isLight ? 'bg-indigo-300' : 'bg-indigo-600';
  
  let overlayColor = '';
  if (isSelected) {
    overlayColor = 'bg-yellow-400/70';
  } else if (isPossibleMove) {
    overlayColor = piece ? 'bg-red-500/70' : 'bg-green-500/50';
  }

  return (
    <div
      onClick={onClick}
      className={`w-full h-full flex items-center justify-center cursor-pointer relative ${bgColor} transition-colors duration-200`}
    >
      {piece && <PieceComponent piece={piece} />}
      {overlayColor && <div className={`absolute inset-0 ${overlayColor} rounded-full m-2 transition-all duration-150`}></div>}
    </div>
  );
};

export default Square;

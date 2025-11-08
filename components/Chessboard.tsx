
import React from 'react';
import { Board, Position } from '../types';
import Square from './Square';

interface ChessboardProps {
  board: Board;
  onSquareClick: (row: number, col: number) => void;
  selectedPiece: Position | null;
  validMoves: Position[];
}

const Chessboard: React.FC<ChessboardProps> = ({ board, onSquareClick, selectedPiece, validMoves }) => {
  return (
    <div className="w-[90vw] h-[90vw] md:w-[60vh] md:h-[60vh] lg:w-[70vh] lg:h-[70vh] shadow-2xl rounded-lg overflow-hidden grid grid-cols-8 grid-rows-8 border-4 border-purple-400/50">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
          const isPossibleMove = validMoves.some(move => move.row === rowIndex && move.col === colIndex);
          
          return (
            <Square
              key={`${rowIndex}-${colIndex}`}
              piece={piece}
              isLight={(rowIndex + colIndex) % 2 !== 0}
              onClick={() => onSquareClick(rowIndex, colIndex)}
              isSelected={isSelected}
              isPossibleMove={isPossibleMove}
            />
          );
        })
      )}
    </div>
  );
};

export default Chessboard;

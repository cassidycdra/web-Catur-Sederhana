
import React, { useState, useEffect, useCallback } from 'react';
import Chessboard from './components/Chessboard';
import { Board, Player, Position } from './types';
import { getInitialBoard, getValidMoves, isKingInCheck, isCheckmate } from './services/chessLogic';

const App: React.FC = () => {
  const [board, setBoard] = useState<Board>(getInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('w');
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [status, setStatus] = useState<string>("White's Turn");
  const [gameOver, setGameOver] = useState<boolean>(false);

  const updateStatus = useCallback(() => {
    if (isCheckmate(board, currentPlayer)) {
        setStatus(`Checkmate! ${currentPlayer === 'w' ? 'Black' : 'White'} wins!`);
        setGameOver(true);
    } else if (isKingInCheck(board, currentPlayer)) {
        setStatus(`${currentPlayer === 'w' ? 'White' : 'Black'}'s Turn - Check!`);
    } else {
        setStatus(`${currentPlayer === 'w' ? 'White' : 'Black'}'s Turn`);
    }
  }, [board, currentPlayer]);

  useEffect(() => {
    updateStatus();
  }, [board, currentPlayer, updateStatus]);

  const handleSquareClick = (row: number, col: number) => {
    if (gameOver) return;

    if (selectedPiece) {
      const isMoveValid = validMoves.some(move => move.row === row && move.col === col);
      
      if (isMoveValid) {
        const newBoard = board.map(r => [...r]);
        const piece = newBoard[selectedPiece.row][selectedPiece.col];
        newBoard[row][col] = piece;
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'w' ? 'b' : 'w');
        setSelectedPiece(null);
        setValidMoves([]);
      } else if (board[row][col] && board[row][col]?.player === currentPlayer) {
        // Select another piece of the same color
        const newSelectedPiece = { row, col };
        setSelectedPiece(newSelectedPiece);
        const piece = board[row][col];
        if(piece) {
            setValidMoves(getValidMoves(board, piece, newSelectedPiece));
        }
      } else {
        // Deselect
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } else {
      const piece = board[row][col];
      if (piece && piece.player === currentPlayer) {
        const newSelectedPiece = { row, col };
        setSelectedPiece(newSelectedPiece);
        setValidMoves(getValidMoves(board, piece, newSelectedPiece));
      }
    }
  };

  const resetGame = () => {
    setBoard(getInitialBoard());
    setCurrentPlayer('w');
    setSelectedPiece(null);
    setValidMoves([]);
    setGameOver(false);
    setStatus("White's Turn");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="flex-grow">
            <Chessboard 
                board={board}
                onSquareClick={handleSquareClick}
                selectedPiece={selectedPiece}
                validMoves={validMoves}
            />
        </div>
        <div className="w-full md:w-64 flex flex-col items-center md:items-start gap-4 p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-2xl">
          <h1 className="text-3xl font-bold tracking-wider">React Chess</h1>
          <div className="w-full h-1 bg-white/20 rounded-full"></div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-semibold mb-2">Game Status</h2>
            <p className={`text-lg p-3 rounded-md ${gameOver ? 'bg-red-500/50' : 'bg-green-500/50'}`}>
              {status}
            </p>
          </div>
          <button 
            onClick={resetGame}
            className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
          >
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

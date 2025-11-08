
import { Board, Piece, Player, Position, SquareData } from '../types';

export const getInitialBoard = (): Board => {
  const initialBoard: Board = Array(8).fill(null).map(() => Array(8).fill(null));

  const placePiece = (row: number, col: number, player: Player, type: Piece['type']) => {
    initialBoard[row][col] = { player, type };
  };

  // Pawns
  for (let i = 0; i < 8; i++) {
    placePiece(1, i, 'b', 'p');
    placePiece(6, i, 'w', 'p');
  }

  // Rooks
  placePiece(0, 0, 'b', 'r');
  placePiece(0, 7, 'b', 'r');
  placePiece(7, 0, 'w', 'r');
  placePiece(7, 7, 'w', 'r');

  // Knights
  placePiece(0, 1, 'b', 'n');
  placePiece(0, 6, 'b', 'n');
  placePiece(7, 1, 'w', 'n');
  placePiece(7, 6, 'w', 'n');

  // Bishops
  placePiece(0, 2, 'b', 'b');
  placePiece(0, 5, 'b', 'b');
  placePiece(7, 2, 'w', 'b');
  placePiece(7, 5, 'w', 'b');

  // Queens
  placePiece(0, 3, 'b', 'q');
  placePiece(7, 3, 'w', 'q');

  // Kings
  placePiece(0, 4, 'b', 'k');
  placePiece(7, 4, 'w', 'k');

  return initialBoard;
};

const isWithinBoard = (row: number, col: number) => row >= 0 && row < 8 && col >= 0 && col < 8;

const getPawnMoves = (board: Board, piece: Piece, position: Position): Position[] => {
  const moves: Position[] = [];
  const { row, col } = position;
  const { player } = piece;
  const direction = player === 'w' ? -1 : 1;
  const startRow = player === 'w' ? 6 : 1;

  // Move forward
  if (isWithinBoard(row + direction, col) && !board[row + direction][col]) {
    moves.push({ row: row + direction, col });
    // Double move from start
    if (row === startRow && isWithinBoard(row + 2 * direction, col) && !board[row + 2 * direction][col]) {
      moves.push({ row: row + 2 * direction, col });
    }
  }

  // Capture
  const captureOffsets = [-1, 1];
  for (const offset of captureOffsets) {
    if (isWithinBoard(row + direction, col + offset)) {
      const target = board[row + direction][col + offset];
      if (target && target.player !== player) {
        moves.push({ row: row + direction, col: col + offset });
      }
    }
  }

  return moves;
};

const getRookMoves = (board: Board, piece: Piece, position: Position): Position[] => {
    const moves: Position[] = [];
    const { row, col } = position;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (const [dr, dc] of directions) {
        for (let i = 1; i < 8; i++) {
            const newRow = row + i * dr;
            const newCol = col + i * dc;

            if (!isWithinBoard(newRow, newCol)) break;

            const target = board[newRow][newCol];
            if (target) {
                if (target.player !== piece.player) {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
            moves.push({ row: newRow, col: newCol });
        }
    }
    return moves;
};

const getKnightMoves = (board: Board, piece: Piece, position: Position): Position[] => {
    const moves: Position[] = [];
    const { row, col } = position;
    const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];

    for (const [dr, dc] of offsets) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (isWithinBoard(newRow, newCol)) {
            const target = board[newRow][newCol];
            if (!target || target.player !== piece.player) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
    return moves;
};

const getBishopMoves = (board: Board, piece: Piece, position: Position): Position[] => {
    const moves: Position[] = [];
    const { row, col } = position;
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    
    for (const [dr, dc] of directions) {
        for (let i = 1; i < 8; i++) {
            const newRow = row + i * dr;
            const newCol = col + i * dc;

            if (!isWithinBoard(newRow, newCol)) break;

            const target = board[newRow][newCol];
            if (target) {
                if (target.player !== piece.player) {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
            moves.push({ row: newRow, col: newCol });
        }
    }
    return moves;
};

const getQueenMoves = (board: Board, piece: Piece, position: Position): Position[] => {
    return [
        ...getRookMoves(board, piece, position),
        ...getBishopMoves(board, piece, position),
    ];
};

const getKingMoves = (board: Board, piece: Piece, position: Position): Position[] => {
    const moves: Position[] = [];
    const { row, col } = position;
    const offsets = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];

    for (const [dr, dc] of offsets) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (isWithinBoard(newRow, newCol)) {
            const target = board[newRow][newCol];
            if (!target || target.player !== piece.player) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
    return moves;
};


export const getValidMoves = (board: Board, piece: Piece, position: Position): Position[] => {
  let moves: Position[] = [];
  switch (piece.type) {
    case 'p': moves = getPawnMoves(board, piece, position); break;
    case 'r': moves = getRookMoves(board, piece, position); break;
    case 'n': moves = getKnightMoves(board, piece, position); break;
    case 'b': moves = getBishopMoves(board, piece, position); break;
    case 'q': moves = getQueenMoves(board, piece, position); break;
    case 'k': moves = getKingMoves(board, piece, position); break;
  }
  
  // Filter out moves that would leave the king in check
  return moves.filter(move => {
    const newBoard = board.map(r => [...r]);
    newBoard[move.row][move.col] = piece;
    newBoard[position.row][position.col] = null;
    return !isKingInCheck(newBoard, piece.player);
  });
};

export const isKingInCheck = (board: Board, player: Player): boolean => {
    let kingPosition: Position | null = null;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.type === 'k' && piece.player === player) {
                kingPosition = { row: r, col: c };
                break;
            }
        }
        if (kingPosition) break;
    }

    if (!kingPosition) return false;

    const opponent: Player = player === 'w' ? 'b' : 'w';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.player === opponent) {
                // We use a simplified move generation here that doesn't check for king safety,
                // otherwise we get an infinite loop.
                let moves: Position[] = [];
                switch (piece.type) {
                    case 'p': moves = getPawnMoves(board, piece, {row: r, col: c}); break;
                    case 'r': moves = getRookMoves(board, piece, {row: r, col: c}); break;
                    case 'n': moves = getKnightMoves(board, piece, {row: r, col: c}); break;
                    case 'b': moves = getBishopMoves(board, piece, {row: r, col: c}); break;
                    case 'q': moves = getQueenMoves(board, piece, {row: r, col: c}); break;
                    case 'k': moves = getKingMoves(board, piece, {row: r, col: c}); break;
                }

                if (moves.some(move => move.row === kingPosition!.row && move.col === kingPosition!.col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

export const isCheckmate = (board: Board, player: Player): boolean => {
    if (!isKingInCheck(board, player)) {
        return false;
    }

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.player === player) {
                const moves = getValidMoves(board, piece, { row: r, col: c });
                if (moves.length > 0) {
                    return false; // Found a valid move, not checkmate
                }
            }
        }
    }

    return true; // No valid moves found for any piece
}

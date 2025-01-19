import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
  imports: [CommonModule]
})
export class GameBoardComponent {
  grid: string[][] = []; // 3x3 grid
  currentPlayer: string = ''; // The first player (X or O)
  gameStatus: string = ''; // Game status (e.g., Win, Draw)
  selectedPlayer: string = ''; // The player selected (X or O)
  gameStarted: boolean = false; // Track if the game has started
  gameMode: string = ''; // 'single' or 'multi' for game mode

  constructor() {
    this.resetGame();
  }

  // Initialize or reset the game
  resetGame(): void {
    this.grid = Array(3).fill(null).map(() => Array(3).fill(''));
    this.currentPlayer = this.selectedPlayer || 'X'; // Default to X if not selected
    this.gameStatus = 'Playing';
  }

  // Start the game after player selection
  // Start the game after player selection
  startGame(): void {
    if (this.selectedPlayer) {
      this.gameStarted = true;
      if (this.gameMode === 'single') {
        // If AI plays 'O' and single-player mode is selected, AI will go second
        if (this.selectedPlayer === 'X') {
          this.currentPlayer = 'X'; // Player 'X' starts first
        } else {
          this.currentPlayer = 'X'; // AI plays 'X', Player 'O' starts second
          this.aiMove(); // AI goes first if Player chooses 'O'
        }
      }
      this.resetGame(); // Reset game after player selection
    }
  }


  // Handle player selection
  selectPlayer(player: string): void {
    this.selectedPlayer = player;
  }

  // Handle player move
  makeMove(row: number, col: number): void {
    if (!this.grid[row][col] && this.gameStatus === 'Playing') {
      this.grid[row][col] = this.currentPlayer;

      // Check for a win
      if (this.checkWin(this.grid)) {
        this.gameStatus = `${this.currentPlayer} Wins!`;
      } else if (this.isDraw(this.grid)) {
        this.gameStatus = 'Draw!';
      } else {
        // Switch the current player after a valid move
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

        // If in single-player mode, let the AI make its move
        if (this.gameMode === 'single') {
          this.aiMove(); // AI makes its move after the player's turn
        }
      }
    }
  }


  // Set game mode (Single or Multi)
  setGameMode(mode: string): void {
    this.gameMode = mode;
    this.gameStarted = false;
  }

  // AI's move logic using Minimax algorithm
  // AI's move logic using Minimax algorithm
  aiMove(): void {
    // Determine the AI's symbol based on the player's choice
    const aiSymbol = this.selectedPlayer === 'X' ? 'O' : 'X';
    const bestMove = this.getBestMove(this.grid, aiSymbol); // Get the best move for the AI, passing the symbol dynamically

    this.grid[bestMove[0]][bestMove[1]] = aiSymbol; // AI plays the best move

    // Check if the AI won after making the move
    if (this.checkWin(this.grid)) {
      this.gameStatus = `${aiSymbol} Wins!`;
    } else if (this.isDraw(this.grid)) {
      this.gameStatus = 'Draw!';
    } else {
      // Switch back to the player after AI's move
      this.currentPlayer = this.selectedPlayer;
    }
  }

  // Minimax algorithm to determine the best move for the AI
  minimax(board: string[][], depth: number, isMaximizing: boolean, aiSymbol: string, playerSymbol: string): number {
    // Check for terminal conditions (win, draw)
    if (this.checkWin(board)) {
      return isMaximizing ? -10 + depth : 10 - depth;
    }
    if (this.isDraw(board)) {
      return 0;
    }

    let bestScore = isMaximizing ? -Infinity : Infinity;
    const availableMoves = this.getAvailableMoves(board);

    // Loop through each available move
    for (let move of availableMoves) {
      const [row, col] = move;
      board[row][col] = isMaximizing ? aiSymbol : playerSymbol; // Make the move
      const score = this.minimax(board, depth + 1, !isMaximizing, aiSymbol, playerSymbol); // Recursively get the score
      board[row][col] = ''; // Undo the move

      bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore); // Maximize for AI, minimize for player
    }

    return bestScore;
  }

  // Get the best move for the AI (Minimax)
  getBestMove(board: string[][], aiSymbol: string): [number, number] {
    const playerSymbol = aiSymbol === 'X' ? 'O' : 'X'; // Get the opposite player symbol
    let bestMove: [number, number] = [-1, -1];
    let bestScore = -Infinity;

    const availableMoves = this.getAvailableMoves(board);
    for (let move of availableMoves) {
      const [row, col] = move;
      board[row][col] = aiSymbol; // Try AI's move
      const score = this.minimax(board, 0, false, aiSymbol, playerSymbol); // Get the score using Minimax
      board[row][col] = ''; // Undo the move

      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col]; // Keep track of the best move
      }
    }

    return bestMove;
  }

  // Check if there are available moves left
  getAvailableMoves(board: string[][]): [number, number][] {
    const moves: [number, number][] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === '') {
          moves.push([row, col]);
        }
      }
    }
    return moves;
  }

  // Check for a win
  checkWin(board: string[][]): boolean {
    const winningCombinations = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]]
    ];

    return winningCombinations.some(combination =>
      combination.every(([row, col]) => board[row][col] === 'O') ||
      combination.every(([row, col]) => board[row][col] === 'X')
    );
  }

  // Check for a draw
  isDraw(board: string[][]): boolean {
    return board.every(row => row.every(cell => cell !== ''));
  }
  // Reset the game and go back to the starting page
  resetPage(): void {
    this.resetGame();
    this.selectedPlayer = '';
    this.gameStarted = false;
    this.gameMode = '';
  }
}
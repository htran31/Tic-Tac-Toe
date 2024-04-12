/*---------------------------------------------------------------------------------------
MiniMax Algorithm:
    Goal is to find the optimal next move.
    One player is "maximizer", tries to choose moves that result in maximum score.
    Other is "minimizer", tries to minimize score.
    Basically, both players playing optimally, choosing moves that benefit them. 
    In the case of Tic-tac-toe, choosing moves that result in winning.


Minimax(s):
    if Terminal(s):
        return Value(s)
    if Player(s) == MAX:
        value = -infinity
        for a in Actions(s):
            value = Max(value, Minimax(Result(s,a)))
        return value
    if Player(s) == MIN:
        value = infinity
        for a in Actions(s):
            value = Min(value, Minimax(Result(s,a)))
        return value


References:
    https://www.youtube.com/watch?v=SLgZhpDsrfc
    https://www.youtube.com/watch?v=4KyYjERkmPg
    
---------------------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", function () {
    const boardElement = document.getElementById("board");
    const messageElement = document.getElementById("message");
    const resetButton = document.getElementById("reset");

    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    //to check player's win cases
    function checkWinner(board, player) {
        //row and column check
        for (let i = 0; i < 3; i++) {
            if ((board[i][0] == player && board[i][1] == player && board[i][2] == player) ||
                (board[0][i] == player && board[1][i] == player && board[2][i] == player)) {
                return true;
            }
        }
        //diagonal check
        if ((board[0][0] == player && board[1][1] == player && board[2][2] == player) ||
            (board[0][2] == player && board[1][1] == player && board[2][0] == player)) {
            return true;
        }
        return false;
    }

    //to check if the board is full
    function isBoardFull(board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    return false;
                }
            }
        }
        return true;
    }

    //to check available postitions to move
    function getAvailableMoves(board) {
        let moves = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    moves.push({ i, j });
                }
            }
        }
        return moves;
    }

    // Minimax Algorithm
    function minimax(board, depth, isMaximizing) {
        if (checkWinner(board, '🚀')) {
            return 10 - depth;
        } else if (checkWinner(board, '🌟')) {
            return depth - 10;
        } else if (isBoardFull(board)) {
            return 0;
        }
        if (isMaximizing) {
            let bestScore = -Infinity;
            let moves = getAvailableMoves(board);
            for (let move of moves) {
                board[move.i][move.j] = '🚀';
                let score = minimax(board, depth + 1, false);
                board[move.i][move.j] = '';
                bestScore = Math.max(score, bestScore);
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            let moves = getAvailableMoves(board);
            for (let move of moves) {
                board[move.i][move.j] = '🌟';
                let score = minimax(board, depth + 1, true);
                board[move.i][move.j] = '';
                bestScore = Math.min(score, bestScore);
            }
            return bestScore;
        }
    }
    //to check best options for the computer to move
    function makeComputerMove(board) {
        let bestMove = { i: -1, j: -1 };
        let bestScore = -Infinity;
        let moves = getAvailableMoves(board);
        for (let move of moves) {
            board[move.i][move.j] = '🚀';
            let score = minimax(board, 0, false);
            board[move.i][move.j] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        board[bestMove.i][bestMove.j] = '🚀';
    }
    //to draw the board
    function createBoard() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener("click", handleCellClick);
                boardElement.appendChild(cell);
            }
        }
    }
    //to handle clicks on the board cells
    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        if (board[row][col] === '') {
            board[row][col] = '🌟';
            event.target.textContent = '🌟';

            //to check game state (winner or tie)
            if (checkWinner(board, '🌟')) {
                messageElement.textContent = 'Player wins!';
                disableBoard();
            } else if (isBoardFull(board)) {
                messageElement.textContent = 'It\'s a tie!';
                disableBoard();
            } else {
                makeComputerMove(board);
                updateBoardDisplay();
                if (checkWinner(board, '🚀')) {
                    messageElement.textContent = 'Computer wins!';
                    disableBoard();
                } else if (isBoardFull(board)) {
                    messageElement.textContent = 'It\'s a tie!';
                    disableBoard();
                }
            }
        }
    }

    //to display of the game board's update
    function updateBoardDisplay() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            cell.textContent = board[row][col];
        });
    }

    //to disable the board after the game ends
    function disableBoard() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.removeEventListener("click", handleCellClick);
        });
    }

    //to reset the game
    function resetGame() {
        board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        messageElement.textContent = '';
        updateBoardDisplay();
        enableBoard();
    }

    //to enable the board
    function enableBoard() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.addEventListener("click", handleCellClick);
        });
    }

    //to initialize the game
    createBoard();
    enableBoard();
    reset.addEventListener("click", resetGame);
});

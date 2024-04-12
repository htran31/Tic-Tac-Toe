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

const readline = require('readline');
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

//to convert position number to row and column indices
function getPositionIndices(position) {
    const row = Math.floor((position - 1) / 3);
    const col = (position - 1) % 3;
    return { row, col };
}

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
    if (checkWinner(board, 'O')) {
        return 10 - depth;
    } else if (checkWinner(board, 'X')) {
        return depth - 10;
    } else if (isBoardFull(board)) {
        return 0;
    }
    if (isMaximizing) {
        let bestScore = -Infinity;
        let moves = getAvailableMoves(board);
        for (let move of moves) {
            board[move.i][move.j] = 'O';
            let score = minimax(board, depth + 1, false);
            board[move.i][move.j] = '';
            bestScore = Math.max(score, bestScore);
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        let moves = getAvailableMoves(board);
        for (let move of moves) {
            board[move.i][move.j] = 'X';
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
        board[move.i][move.j] = 'O';
        let score = minimax(board, 0, false);
        board[move.i][move.j] = '';
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    board[bestMove.i][bestMove.j] = 'O';
}

//to draw the board (in the console)
function printBoard(board) {
    for (let row of board) {
        console.log(row.join(' | '));
    }
}

//for main game loop
function playGame() {
    printBoard(board);
    //player's turn
    read.question('Enter position (1-9): ', position => {
        position = parseInt(position);
        if (position < 1 || position > 9) {
            console.log('Invalid position, please enter a number between 1 and 9.');
            playGame();
            return;
        }
        const { row, col } = getPositionIndices(position);
        if (board[row][col] === '') {
            board[row][col] = 'X';
        } else {
            console.log('Invalid move, try again.');
            playGame();
            return;
        }
        //check if player wins
        if (checkWinner(board, 'X')) {
            console.log('Player wins!');
            read.close();
            return;
        }
        //check if it's a tie
        if (isBoardFull(board)) {
            console.log('It\'s a tie!');
            read.close();
            return;
        }

        //computer's turn
        makeComputerMove(board);
        //check if computer wins
        if (checkWinner(board, 'O')) {
            console.log('Computer wins!');
            read.close();
            return;
        }
        //check if it's a tie
        if (isBoardFull(board)) {
            console.log('It\'s a tie!');
            read.close();
            return;
        }
        playGame();
    });
}
playGame();

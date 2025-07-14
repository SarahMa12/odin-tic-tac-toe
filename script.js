const nameForm = document.getElementById('name-form');
const fields = document.querySelectorAll('.field');
const turnDiv = document.querySelector('.turn');

let gameActive = false;

const board = (function() {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    function getBoard() {
        return board;
    }

    function setCell(player, row, col) {
        board[row][col] = player;
    }

    function clearBoard() {
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++) {
                board[row][col] = "";
            }
        }
    }

    function checkTie() {
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++) {
                if(board[row][col] == "") {
                    return false;
                }
            }
        }

        return true;
    }

    function checkWinner() {
        for(let row = 0; row < 3; row++) {
            if(board[row][0] != "" && board[row][0] == board[row][1] && board[row][1] == board[row][2]) {
                return board[row][0];
            }
        }

        for(let col = 0; col < 3; col++) {
            if(board[0][col] != "" && board[0][col] == board[1][col] && board[1][col] == board[2][col]) {
                return board[0][col];
            }
        }

        if(board[0][0] != "" && board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
            return board[0][0];
        }

        if(board[0][2] != "" && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
            return board[0][2];
        }

        return null;
    }

    return { getBoard, setCell, clearBoard, checkTie, checkWinner };
})();

const displayController = (function() {
    let playerTurn = 1;
    let player1;
    let player2;

    function setPlayerNames(p1, p2) {
        player1 = p1;
        player2 = p2;
    }

    function getPlayerName(playerNum) {
        return playerNum === 1 ? player1 : player2;
    }

    function displayPlayerTurn() {
        if(playerTurn == 1) {
            turnDiv.textContent = `${player1}'s turn`;
        } else {
            turnDiv.textContent = `${player2}'s turn`;
        }
    }

    function getPlayerTurn() {
        return playerTurn;
    }

    function setPlayerTurn(player) {
        playerTurn = player;
    }

    function nextTurn() {
        playerTurn = (playerTurn == 1) ? 2 : 1;
    }

    return { setPlayerNames, getPlayerName, displayPlayerTurn, getPlayerTurn, setPlayerTurn, nextTurn }; 
})();

function createPlayer(name, player) {

    return { name, player };
}


nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    board.clearBoard();

    const player1Name = (nameForm.player1.value.trim() == "") ? 'Player 1' : nameForm.player1.value.trim();
    const player2Name = (nameForm.player2.value.trim() == "") ? 'Player 2' : nameForm.player2.value.trim();;
    displayController.setPlayerNames(player1Name, player2Name);
    createPlayer(player1Name, 1);
    createPlayer(player2Name, 2);
    board.clearBoard();
    clearBoardUI();
    gameActive = true;
    displayController.setPlayerTurn(1);
    displayController.displayPlayerTurn();
});

function clearBoardUI() {
    fields.forEach(field => {
        field.textContent = "";
    });
};

const spotToCoords = {
    spot1: [0, 0],
    spot2: [0, 1],
    spot3: [0, 2],
    spot4: [1, 0],
    spot5: [1, 1],
    spot6: [1, 2],
    spot7: [2, 0],
    spot8: [2, 1],
    spot9: [2, 2],
};

fields.forEach(field => {
    field.addEventListener('click', () => {
        if(!gameActive) { return; }
        if(field.hasChildNodes()) { return; }

        const [row, col] = spotToCoords[field.id];
        board.setCell(displayController.getPlayerTurn(), row, col);

        const img = document.createElement('img');
        if(displayController.getPlayerTurn() == 1) {
            img.src = "./images/x-vector.svg";
        } else {
            img.src = "./images/o-vector.svg";
            img.width = 98;
        }
        field.appendChild(img);

        const winner = board.checkWinner();
        if(winner !== null) {
            const winnerName = displayController.getPlayerName(winner);
            turnDiv.textContent = `${winnerName} wins!`;
            gameActive = false;
            return;
        }

        if(board.checkTie()) {
            turnDiv.textContent = `It's a tie!`;
            gameActive = false;
            return;
        }

        displayController.nextTurn();
        displayController.displayPlayerTurn();
    });
});
// Example player board representation
let player1Board = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25, 26, 27],
    [28, 29, 30, 31, 32, 33, 34, 35, 36],
    [37, 38, 39, 40, 41, 42, 43, 44, 45],
    [46, 47, 48, 49, 50, 51, 52, 53, 54],
    [55, 56, 57, 58, 59, 60, 61, 62, 63],
    [64, 65, 66, 67, 68, 69, 70, 71, 72],
    [73, 74, 75, 76, 77, 78, 79, 80, 81]
]

let player2Board = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25, 26, 27],
    [28, 29, 30, 31, 32, 33, 34, 35, 36],
    [37, 38, 39, 40, 41, 42, 43, 44, 45],
    [46, 47, 48, 49, 50, 51, 52, 53, 54],
    [55, 56, 57, 58, 59, 60, 61, 62, 63],
    [64, 65, 66, 67, 68, 69, 70, 71, 72],
    [73, 74, 75, 76, 77, 78, 79, 80, 81]
] 

// Takes a Player's board representation and maps the values
// onto the HTML Table
const mapToGrid = (board) => {
    let gameGrid = document.querySelector("#game-grid-1");
    board.forEach((row, index1) => {
        row.forEach((cell, index2) => {
            gameGrid.children[0].children[index1].children[index2].innerHTML = cell;
        })
    })
}

const toggleColor = (cell, color) => {
    let cellElem = document.querySelector('#' + cell.id);
    cellElem.onclick = () => {
        if (cellElem.style.backgroundColor !== color) {
            cellElem.style = `background-color: ${color};`;
        } else {
            cellElem.style = "";
        }
    }
}

// Allows for the execution of a callback function
// on every single grid within the Game Table
const execOnGrid = (boardId, fn) => {
    console.log(`Executing ${fn.name}`)
    let gameGrid = document.querySelector(boardId);
    for (let row of gameGrid.children[0].children) {
        for (let cell of row.children) {
            fn(cell);
        }
    }
}

// Starts the game
const startGame = () => {
    console.log("Starting Game");
    mapToGrid(player1Board);
}

/*
* Method: gameOver
* Pre: None
* Params: winnerName: "The winners board"
* Post: Game is reset and winner is announced
*/
const gameOver = (winnerName) => {
    clearBoard("#game-grid-1");
    console.log(`Game Won by: ${winnerName}`);
    alert(`Game Won by: ${winnerName}`)
}

/*
* Method: clearBoard
* Pre: None
* Params: boardName: "Name of the board being cleared"
* Post: The game board cell values, styles, and onclicks are removed
*/
const clearBoard = (boardName) => {
    execOnGrid(boardName, (cell) => {
        cell.innerHTML = "";
        cell.style = "";
        cell.onclick = "";
    })
}

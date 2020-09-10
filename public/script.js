import Space from "./space.js"

// Example player board representation
// Isaac: I marked the indices with x and y to make it clearer
// X's go from left to right
// Y's go from top to bottom 

const newBoard = () => {
    let board = []
    for(let y=1; y<10; y++){
        let row = []
        for(let x=1; x<10; x++){
            let space = new Space(x, y);
            row.push(space)
        }
        board.push(row)
    }

    return board
}

const player1Board = newBoard();
const player2Board = newBoard();

// Takes a Player's board representation and maps the values
// onto the HTML Table
const mapToGrid = (board, boardId) => {
    let gameGrid = document.querySelector(boardId);

    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            console.log(board[i][j].state)
            gameGrid.children[0].children[i].children[j].innerHTML = board[i][j].state;
        }
    }
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
    mapToGrid(player1Board, "#game-grid-1");
    mapToGrid(player2Board, "#game-grid-2");
}

/*
* Method: gameOver
* Pre: None
* Params: winnerName: "The winners board"
* Post: Game is reset and winner is announced
*/
const gameOver = (winnerName) => {
    clearBoard("#game-grid-1");
    clearBoard("#game-grid-2");
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



document.addEventListener("DOMContentLoaded", function () {

    /*Fire Command
    
    - Waiting for what the states of each board is (Whoever is working on it)
    Adding even listeners to every table and cell when attacking 
    Need name of gameboard2 to contiue then change turns 
    
    const fireturn =(playerboard) => 
    {}
    */

    let gameboard1 = document.getElementById("game-grid-1");
    for (let i = 0; i < gameboard1.rows.length; i++) {
        for (let j = 0; j < gameboard1.rows[i].cells.length; j++) {
            gameboard1.rows[i].cells[j].addEventListener("click", (cell) => {
                console.log("clicked on this cell");
                if (gameboard1.rows[i].cells[j].innerHTML == "1") //Will be S if its a ship using 1 to test 
                {
                    gameboard1.rows[i].cells[j].innerHTML = "HIT"; //WIll be changed to H if its a hit
                }
                else {
                    gameboard1.rows[i].cells[j].innerHTML = "MISS"; //WIll be changed to H if its a hit
                }
            });

        }

    }

    let gameboard2 = document.getElementById("game-grid-2");
    for (let i = 0; i < gameboard2.rows.length; i++) {
        for (let j = 0; j < gameboard2.rows[i].cells.length; j++) {
            gameboard2.rows[i].cells[j].addEventListener("click", (cell) => {
                console.log("clicked on this cell");
                if (gameboard2.rows[i].cells[j].innerHTML == "1") //Will be S if its a ship using 1 to test 
                {
                    gameboard2.rows[i].cells[j].innerHTML = "HIT"; //WIll be changed to H if its a hit
                }
                else {
                    gameboard2.rows[i].cells[j].innerHTML = "MISS"; //WIll be changed to H if its a hit
                }
            });

        }

    }

    document.getElementById("start").addEventListener("click", startGame)

})
import Space from "./space.js"

// Example player board representation
// Isaac: I marked the indices with x and y to make it clearer
// X's go from left to right
// Y's go from top to bottom 
// Coordinate not exactly what you think it is. To go South of board from top right you need to do +x and to go north -x and same for y +y to go right and -y to go left. 
function newBoard() 
{
    let board = []
    for(let y=0; y<9; y++){
        let row = []
        for(let x=0; x<9; x++){
            let space = new Space(y, x);
            row.push(space)
        }
        board.push(row)
    }

    return board
}

let player1Board = newBoard();
let player2Board = newBoard();





// Takes a Player's board representation and maps the values
// onto the HTML Table
const mapToGrid = (board, boardId) => {
    let gameGrid = document.querySelector(boardId);

    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            console.log(board[i][j].state)
            gameGrid.children[0].children[i].children[j].innerHTML = board[i][j].coordinate.x+", " + board[i][j].coordinate.y + " (" + i + ","+ j + ")";
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
    player1Board[0][1].state = "Ship";
    console.log(player1Board[0][1].state);
    mapToGrid(player2Board, "#game-grid-2");
    displayboard(player1Board,"#game-grid-1");
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
    
    Fire Function purely changing the backboard state. 
    
    const fireturn =(stateboard,turn) => 
    {}
    */
    let gameboard1 = document.getElementById("game-grid-1");
    for (let i = 0; i < gameboard1.rows.length; i++) {
        for (let j = 0; j < gameboard1.rows[i].cells.length; j++) {
            gameboard1.rows[j].cells[i].addEventListener("click", (cell) => {
                console.log(j,i);
                if (player1Board[j][i].state == "Ship") //Will be S if its a ship using 1 to test 
                {
                    player1Board[j][i].state == "Hit";
                    gameboard1.rows[j].cells[i].style.backgroundColor = "red"; //This will be else where
                }
                else {
                    player1Board[j][i].state == "Miss";
                }
            });

        }

    }

    let gameboard2 = document.getElementById("game-grid-2");
    for (let i = 0; i < gameboard2.rows.length; i++) {
        for (let j = 0; j < gameboard2.rows[i].cells.length; j++) {
            gameboard2.rows[j].cells[i].addEventListener("click", (cell) => {
                console.log(j,i);
                if (player2Board[j][i].state == "Ship") //Will be S if its a ship using 1 to test 
                {
                    player2Board[j][i].state = "Hit"; 
                    gameboard2.rows[j].cells[i].style.backgroundColor = "red"; //This will be else where
                }
                else {
                    player2Board[j][i].state = "Miss";
                }
            });

        }

    }

    document.getElementById("start").addEventListener("click", startGame)

})

//Function display the state 
//Might messed up the index cause j and i are flipped haha thanks Issac!
const displayboard = (statebackboard,ID) =>
{
    let gameboard1 = document.querySelector(ID);

    for (let i = 0; i < gameboard1.rows.length; i++) 
    {
        for (let j = 0; j < gameboard1.rows[i].cells.length; j++) 
        {
            if (statebackboard[j][i].state == "Ship")
            {
                gameboard1.rows[j].cells[i].innerHTML = "Ship";
            }
            if (statebackboard[j][i].state == "Empty")
            {
                gameboard1.rows[j].cells[i].innerHTML = "~";
            }
            if (statebackboard[j][i].state == "Miss")
            {
                gameboard1.rows[j].cells[i].innerHTML = "X";
            }
            if (statebackboard[j][i].state == "Hit")
            {
                gameboard1.rows[j].cells[i].style.backgroundColor = "red"; 
            }
        }
    }
}

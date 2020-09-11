import Space from "./space.js"
import { ShipContainer, Ship } from "./ship.js";

// Example player board representation
// Isaac: I marked the indices with x and y to make it clearer
// X's go from left to right
// Y's go from top to bottom 
// Coordinate not exactly what you think it is. To go South of board from top right you need to do +x and to go north -x and same for y +y to go right and -y to go left. 
const newBoard = () => {
    let board = []
    for (let y = 0; y < 9; y++) {
        let row = []
        for (let x = 0; x < 9; x++) {
            let space = new Space(y, x);
            row.push(space)
        }
        board.push(row)
    }

    return board
}


//Given an x,y where 0 <= x,y < 9, and a state (back)board of Spaces, find the cooresponding Space for that coordinate on the board
const findSpace = (x, y, board) => {
    for (let row of board) {
        for (let cell of row) {
            if (cell.coordinate.x == x && cell.coordinate.y == y) {
                return cell
            }
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

const player1Board = newBoard();
const player2Board = newBoard();
const player1OppBoard = newBoard();
const player2OppBoard = newBoard();

let numberOfShips = 0;

const showPlayerBoard = (board, gridId, opponentBoard, opponentId) => {
    confirm("Switch Players");
    displayboard(board, gridId);
    displayboard(opponentBoard, opponentId);
}

const selectNumberShips = () => {
    let promptText = document.querySelector("#player-prompt-text");
    promptText.hidden = false;
    promptText.innerHTML = "Enter the Number of Ships (1-5): ";
    document.querySelector("#player-prompt-submit").addEventListener("click", () => {
        do {
            numberOfShips = parseInt(document.querySelector("#player-prompt-value"));
            if (numberOfShips < 0 || numberOfShips > 5 || isNaN(numberOfShips)) {
                document.querySelector("#prompt-error").innerHTML = "INVALID INPUT!";
            }
        } while (numberOfShips < 0 || numberOfShips > 5 || isNaN(numberOfShips));
    });
}

const placeShip = (board, x, y, player) => {
    if (board[y][x].state === "Ship") {
        alert("Do not double place ships!");
    } else {
        let direction = "";
        while (!["up", "down", "left", "right"].includes(direction)) {
            direction = prompt(`Direction the rest of the ship is facing: (up, down, left, right)`);
        }
        let valid;
        for (let j = 0; j < (player === "Player 1" ? p1Ships : p2Ships) + 1; j++) {
            console.log("for", j, valid);
            valid = true;
            try {
                console.log(x, y);
                if (board[
                    y - (j * (direction === "up" ? 1 : direction === "down" ? -1 : 0))
                ][
                    x - (j * (direction === "left" ? 1 : direction === "right" ? -1 : 0))
                ].state === "Ship") {
                    console.log("inside");
                    valid = false;
                    alert("Do not overlap ships");
                    break;
                }
            } catch {
                console.log("catch");
                alert("Place ships within boundaries");
                valid = false;
                break;
            }
        }
        if (valid) {
            for (let j = 0; j < (player === "Player 1" ? p1Ships : p2Ships) + 1; j++) {
                board[
                    y - (j * (direction === "up" ? 1 : direction === "down" ? -1 : 0))
                ][
                    x - (j * (direction === "left" ? 1 : direction === "right" ? -1 : 0))
                ].state = "Ship";
                displayboard(board, player === "Player 1" ? "#game-grid-1" : "#game-grid-2");
            }
            if (player === "Player 1") {
                player1Ships.addShip(new Ship(p1Ships + 1, new Space(y, x), direction));
                p1Ships++;
            } else {
                player2Ships.addShip(new Ship(p2Ships + 1, new Space(y, x), direction));
                p2Ships++;
            }
        }
    }
    if (currentPhase === "p1-ship" && p1Ships === numberOfShips) {
        alert("Player 1 Ship Phase Complete");
        displayboard(player2OppBoard, "#game-grid-1");
        console.log(player2OppBoard);
        displayboard(player2Board, "#game-grid-2");
        confirm("Switch Players!");
        currentPhase = "p2-ship";
    }
    else if (currentPhase === "p2-ship" && p2Ships === numberOfShips) {
        alert("Player 2 Ship Phase Complete");
        displayboard(player1OppBoard, "#game-grid-2");
        displayboard(player1Board, "#game-grid-1");
        confirm("Switch Players!");
        currentPhase = "p1-turn";
    }
}

const checkGameOver = () => {
    if (player1Ships.allSunk()) {
        gameOver("Player 1");
        currentPhase = "game-over";
        return true;
    } else if (player2Ships.allSunk()) {
        gameOver("Player 2");
        currentPhase = "game-over";
        return true;
    }
    return false;
}

const player1Ships = new ShipContainer(numberOfShips);
const player2Ships = new ShipContainer(numberOfShips);

const player1Hit = (x, y) => {
    if (player2Board[y][x].state === "Ship") {
        alert("HIT!!!!!");
        player1OppBoard[y][x].state = "Hit";
        player1Ships.hit(x, y);
        displayboard(player1OppBoard, "#game-grid-2");
    } else {
        alert("MISS");
        player1OppBoard[y][x].state = "Miss";
        currentPhase = "p2-turn";
        displayboard(player1OppBoard, "#game-grid-2");
        alert("Switch Players!");
        displayboard(player2Board, "#game-grid-2");
        displayboard(player2OppBoard, "#game-grid-1");
    }
}

const player2Hit = (x, y) => {
    if (player1Board[y][x].state === "Ship") {
        alert("HIT!!!!!");
        player2OppBoard[y][x].state = "Hit";
        player2Ships.hit(x, y);
        displayboard(player2OppBoard, "#game-grid-1");
    } else {
        alert("MISS");
        player2OppBoard[y][x].state = "Miss";
        currentPhase = "p1-turn";
        displayboard(player2OppBoard, "#game-grid-1");
        alert("Switch Players!");
        displayboard(player1Board, "#game-grid-1");
        displayboard(player1OppBoard, "#game-grid-2");
    }
}

// Starts the game
const startGame = () => {
    if (currentPhase === "starting") {
        displayboard(player1Board, "#game-grid-1");
        displayboard(player2Board, "#game-grid-2");
        do {
            numberOfShips = parseInt(prompt("Enter number of ships (1-5): "));
            if (numberOfShips < 0 || numberOfShips > 5 || isNaN(numberOfShips)) {
                alert("Invalid Input");
            }
        } while (numberOfShips < 0 || numberOfShips > 5 || isNaN(numberOfShips));
        console.log(numberOfShips, "Number of ships");
        currentPhase = "p1-ship";
    } else {
        alert("Dont spam the button dumbass");
    }
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

let currentPhase = "starting"; // starting, p1-ship, p1-turn, p2-ship, p2-turn, game-over

let p1Ships = 0;

let p2Ships = 0;

document.addEventListener("DOMContentLoaded", function () {

    /*Fire Command
    
    Fire Function purely changing the backboard state. 
    
    const fireturn =(stateboard,turn) => 
    {}
    */
    let gameboard1 = document.getElementById("game-grid-1");
    for (let i = 0; i < gameboard1.rows.length; i++) {
        for (let j = 0; j < gameboard1.rows[i].cells.length; j++) {
            gameboard1.rows[j].cells[i].addEventListener("click", () => {
                console.log(player1Ships);
                if (currentPhase === "p1-ship") {
                    placeShip(player1Board, i, j, "Player 1");
                } else if (currentPhase === "p1-turn") {
                    // do nothing if they click there own board during there turn
                } else if (currentPhase === "p2-ship") {
                    // do nothing if enemy clicks p1 board during ship
                } else if (currentPhase === "p2-turn") {
                    player2Hit(i, j);
                } else if (currentPhase === "game-over") {
                    alert("Game Over, refresh page");
                }
                checkGameOver();
            });

        }

    }

    let gameboard2 = document.getElementById("game-grid-2");
    for (let i = 0; i < gameboard2.rows.length; i++) {
        for (let j = 0; j < gameboard2.rows[i].cells.length; j++) {
            gameboard2.rows[j].cells[i].addEventListener("click", (cell) => {
                console.log(player2Ships);
                console.log(j, i);
                if (currentPhase === "p2-ship") {
                    placeShip(player2Board, i, j, "Player 2");
                } else if (currentPhase === "p2-turn") {
                    // do nothing if they click there own board during there turn
                } else if (currentPhase === "p1-ship") {
                    // do nothing if enemy clicks p1 board during ship
                } else if (currentPhase === "p1-turn") {
                    player1Hit(i, j);
                } else if (currentPhase === "game-over") {
                    alert("Game Over, refresh page");
                }
                checkGameOver();
            });

        }

    }

    document.getElementById("start").addEventListener("click", startGame);
    document.getElementById("game-over").addEventListener("click", () => gameOver("Person"));
})

//Function display the state 
//Might messed up the index cause j and i are flipped haha thanks Issac!
const displayboard = (statebackboard, ID) => {
    let gameboard1 = document.querySelector(ID);

    for (let i = 0; i < gameboard1.rows.length; i++) {
        for (let j = 0; j < gameboard1.rows[i].cells.length; j++) {
            if (statebackboard[j][i].state == "Ship") {
                gameboard1.rows[j].cells[i].innerHTML = "Ship";
            }
            if (statebackboard[j][i].state == "Empty") {
                gameboard1.rows[j].cells[i].innerHTML = "~";
            }
            if (statebackboard[j][i].state == "Miss") {
                gameboard1.rows[j].cells[i].innerHTML = "X";
            }
            if (statebackboard[j][i].state == "Hit") {
                gameboard1.rows[j].cells[i].innerHTML = "O";
                gameboard1.rows[j].cells[i].style.backgroundColor = "red";
            }
        }
    }
}

const checkBounds = (ship) => {
    for (let i = 0; i < ship.length; i++) {
        let x = ship.List[i].coordinate.x;
        let y = ship.List[i].coordinate.y;

        if ((x < 0 && x > 8) || (y < 0 && y > 8)) {
            return false;
        }
    }
}
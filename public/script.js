import Space from "./space.js"
import { ShipContainer, Ship } from "./ship.js";

// Global variables
let player1Ships;
let player2Ships;
let player1Board;
let player2Board;
let player1OppBoard;
let player2OppBoard;

let numberOfShips = 0;

let currentPhase = "starting"; // starting, p1-ship, p1-turn, p2-ship, p2-turn, game-over

let p1Ships = 0;
let p2Ships = 0;
// End Global variables

/*
* Method: newBoard
* Pre: None
* Params: None
* Post: new stateboard/backboard is generated (9x9 board)
*/
const newBoard = () => {
    // Coordinate not exactly what you think it is. 
    // To go South of board from top right you need to do +x and to go north -x and same for y +y to go right and -y to go left. 
    let board = [];
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

/*
* Method: findSpace
* Pre: Stateboard exists
* Params: 'x': x-coordinate; 'y': y-coordinate; 'board': pre-existing stateboard
* Post: Returns the space on the stateboard with corresponding x, y coordinates
*/
const findSpace = (x, y, board) => {
    for (let row of board) {
        for (let cell of row) {
            if (cell.coordinate.x === x && cell.coordinate.y === y) {
                return cell
            }
        }
    }
}

/*
* Method: placeShip
* Pre: Stateboard exists, game has started, currentPhase is in one of the "X-ship" phases
* Params: 'board': the stateboard being modified; 'x': x-coordinate; 'y': y-coordinate; 'player': name of the player
* Post: A new ship has been placed on the given board, player ship count increments, add ship to ship container, new board displayed
*/
const placeShip = (board, x, y, player) => {
    if (board[x][y].state === "Ship") {
        alert("Do not double place ships!");
    } else {
        document.querySelector("#instruction").innerText = "Use Arrow Keys to Orient\n\nPress Enter to Confirm Placement"
        board[x][y].state = "Ship"
        displayboard(board, player === "Player 1" ? "#game-grid-1" : "#game-grid-2");
        board[x][y].state = "Empty"
        let direction = "";
        let done = false;
        function keyListener(e) {
            if (e.key == "ArrowLeft") {
                direction = "left"
            }
            else if (e.key == "ArrowRight") {
                direction = "right"
            }
            else if (e.key == "ArrowDown" || (player == "Player 1" ? p1Ships : p2Ships) === 0) {
                direction = "down"
            }
            else if (e.key == "ArrowUp") {
                direction = "up"
            }
            else if (e.key == "Enter") {
                direction = direction
            }
            else {
                direction = ""
            }

            let valid = true;

            for (let ship of (player === "Player 1" ? player1Ships.ships : player2Ships.ships)) {
                for (let space of ship.List) {
                    if (findSpace(space.coordinate.x, space.coordinate.y, board).state == "Ship" && space.coordinate.x == x && space.coordinate.y == y) {
                        console.log("inside");
                        valid = false;
                        alert("Do not overlap ships");
                        break;
                    }
                    else if (space.coordinate.x < 0 || space.coordinate.x > 8 || space.coordinate.y < 0 || space.coordinate.y > 8) {
                        console.log("outside")
                        valid = false;
                        alert("Place ship on board")
                    }

                }
            }

            if (valid) {
                let s = new Ship((player == "Player 1" ? p1Ships : p2Ships) + 1, new Space(x, y), direction)
                if (checkBounds(s, board)) {
                    for (let space of s.List) {
                        findSpace(space.coordinate.x, space.coordinate.y, board).state = "Ship"
                    }

                    displayboard(board, player === "Player 1" ? "#game-grid-1" : "#game-grid-2");

                    for (let space of s.List) {
                        findSpace(space.coordinate.x, space.coordinate.y, board).state = "Empty"
                    }
                }
                else {
                    displayboard(board, player === "Player 1" ? "#game-grid-1" : "#game-grid-2");
                }
            }
        }
        if (!done && ((p1Ships === numberOfShips && p2Ships != numberOfShips && player === "Player 2") || (p1Ships != numberOfShips))) {
            document.addEventListener('keydown', keyListener);

            document.addEventListener('keydown', function enterListener(e) {
                const clickListener = () => {
                    document.removeEventListener('keydown', enterListener);
                    document.removeEventListener('keydown', keyListener);
                }

                document.addEventListener('click', clickListener);
                let ship = {}
                if (player === "Player 1") {
                    ship = new Ship(p1Ships + 1, new Space(x, y), direction)
                } else {
                    ship = new Ship(p2Ships + 1, new Space(x, y), direction)
                }
                if (e.key == "Enter") {
                    let ship = {}
                    if (direction != "") {
                        if (player === "Player 1") {
                            ship = new Ship(p1Ships + 1, new Space(x, y), direction)
                        } else {
                            ship = new Ship(p2Ships + 1, new Space(x, y), direction)
                        }
                        if (checkBounds(ship, board)) {
                            if (direction === "up" || direction === "down" || direction === "right" || direction === "left") {
                                console.log(direction)
                                if (player === "Player 1") {
                                    player1Ships.addShip(new Ship(p1Ships + 1, new Space(x, y), direction));
                                    p1Ships++;
                                } else {
                                    player2Ships.addShip(new Ship(p2Ships + 1, new Space(x, y), direction));
                                    p2Ships++;
                                }
                                for (let ship of (player === "Player 1" ? player1Ships.ships : player2Ships.ships)) {
                                    for (let space of ship.List) {
                                        findSpace(space.coordinate.x, space.coordinate.y, board).state = "Ship"
                                    }
                                }
                                displayboard(board, player === "Player 1" ? "#game-grid-1" : "#game-grid-2");
                                document.removeEventListener('keydown', keyListener);
                                document.removeEventListener('keydown', enterListener)
                                if (!((player === "Player 1" ? p1Ships : p2Ships) == numberOfShips)) {
                                    alert("Place Ship #" + ((player === "Player 1" ? p1Ships : p2Ships) + 1))
                                }
                                if (currentPhase === "p1-ship" && p1Ships === numberOfShips) {
                                    alert("Player 1 Ship Phase Complete");
                                    displayboard(player2OppBoard, "#game-grid-1");
                                    displayboard(player2Board, "#game-grid-2");
                                    confirm("Switch Players!");
                                    alert("Player 2, Place Ship #1")
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

                        } else {
                            alert("Invalid Ship, Try again")
                            displayboard(board, player === "Player 1" ? "#game-grid-1" : "#game-grid-2");
                            document.removeEventListener('keydown', keyListener);
                            document.removeEventListener('click', clickListener);
                            document.removeEventListener('keydown', enterListener);
                        }
                    }
                    else {
                        alert("Use Arrow Keys to Place")
                    }
                }

            })
        }
    }
}

/*
* Method: checkGameOver
* Pre: Game is running
* Params: None
* Post: Game will end if all ships given are in a state of being sunken, changes phase to game-over if game is over
*/
const checkGameOver = () => {
    if (currentPhase !== "p1-turn" && currentPhase !== "p2-turn") {
        return;
    }
    if (player1Ships.allSunk()) {
        gameOver("Player 2");
        currentPhase = "game-over";
        return true;
    } else if (player2Ships.allSunk()) {
        gameOver("Player 1");
        currentPhase = "game-over";
        return true;
    }
    return false;
}

/*
* Method: player1Hit
* Pre: Game is running, currentPhase in 'p1-turn'
* Params: 'x': x-coordinate; 'y': y-coordinate;
* Post: Player either hits or misses, new board state is displayed, changes phase on miss
*/
const player1Hit = (x, y) => {
    if (player2Board[y][x].state === "Ship") {
        alert("HIT!!!!!");
        player2Board[y][x].state = "Sunk";
        player1OppBoard[y][x].state = "Hit";
        player2Ships.hit(y, x);
        displayboard(player1OppBoard, "#game-grid-2");
    } else {
        if (player2Board[y][x].state !== "Sunk") {
            alert("MISS");
            player1OppBoard[y][x].state = "Miss";
        } else {
            alert("Already fired there");
        }
        currentPhase = "p2-turn";
        displayboard(player1OppBoard, "#game-grid-2");
        alert("Switch Players!");
        displayboard(player2Board, "#game-grid-2");
        displayboard(player2OppBoard, "#game-grid-1");
    }
}

/*
* Method: player2Hit
* Pre: Game is running, currentPhase in 'p2-turn'
* Params: 'x': x-coordinate; 'y': y-coordinate;
* Post: Player either hits or misses, new board state is displayed, changes phase on miss
*/
const player2Hit = (x, y) => {
    if (player1Board[y][x].state === "Ship") {
        alert("HIT!!!!!");
        player1Board[y][x].state = "Sunk";
        player2OppBoard[y][x].state = "Hit";
        player1Ships.hit(y, x);
        displayboard(player2OppBoard, "#game-grid-1");
    } else {
        if (player1Board[y][x].state !== "Sunk") {
            alert("MISS");
            player2OppBoard[y][x].state = "Miss";
        } else {
            alert("Already fired there");
        }
        currentPhase = "p1-turn";
        displayboard(player2OppBoard, "#game-grid-1");
        alert("Switch Players!");
        displayboard(player1Board, "#game-grid-1");
        displayboard(player1OppBoard, "#game-grid-2");
    }
}

/*
* Method: startgame
* Pre: None 
* Params: None
* Post: Starts game if not started, changes phase to ship placement, displays board, resets game if game-over phase
*/
const startGame = () => {
    if (currentPhase === "starting") {
        player1Ships = new ShipContainer();
        player2Ships = new ShipContainer();
        player1Board = newBoard();
        player2Board = newBoard();
        player1OppBoard = newBoard();
        player2OppBoard = newBoard();
        displayboard(player1Board, "#game-grid-1");
        displayboard(player2Board, "#game-grid-2");
        do {
            numberOfShips = parseInt(prompt("Enter number of ships (1-5): "));
            if (numberOfShips < 0 || numberOfShips > 5 || isNaN(numberOfShips)) {
                alert("Invalid Input");
            }
        } while (numberOfShips < 0 || numberOfShips > 5 || isNaN(numberOfShips));
        currentPhase = "p1-ship";
        alert("Player 1, Place Ship #1")
    } else if (currentPhase === "game-over") {
        location.reload();
    } else {
        alert("You are mid-game, cannot start");
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
    document.querySelector("#start").innerHTML = 'Reset Game';
}

/*
* Method: clearBoard
* Pre: None
* Params: boardName: "Name of the board being cleared"
* Post: The game board cell values, styles, and onclicks are removed
*/
const clearBoard = (boardName) => {
    let gameGrid = document.querySelector(boardName);
    for (let i = 0; i < gameGrid.rows.length - 1; i++) {
        for (let j = 0; j < gameGrid.rows[i + 1].cells.length - 1; j++) {
            gameGrid.rows[j + 1].cells[i + 1].innerHTML = "";
            gameGrid.rows[j + 1].cells[i + 1].style = "background-color:#0066ff;";
            gameGrid.rows[j + 1].cells[i + 1].onclick = "";
        }
    }
}

// Adds HTML Table event listeners for handling battleship click events
document.addEventListener("DOMContentLoaded", function () {
    let gameboard1 = document.getElementById("game-grid-1");
    for (let i = 0; i < gameboard1.rows.length - 1; i++) {
        for (let j = 0; j < gameboard1.rows[i + 1].cells.length - 1; j++) {
            gameboard1.rows[j + 1].cells[i + 1].addEventListener("click", () => {
                if (currentPhase === "p1-ship") {
                    placeShip(player1Board, j, i, "Player 1");
                } else if (currentPhase === "p1-turn") {
                    // do nothing if they click there own board during there turn
                } else if (currentPhase === "p2-ship") {
                    // do nothing if enemy clicks p1 board during ship
                } else if (currentPhase === "p2-turn") {
                    player2Hit(i, j);
                } else if (currentPhase === "game-over") {
                    alert("Game Over, Reset Game");
                }
                checkGameOver();
            });
        }
    }

    let gameboard2 = document.getElementById("game-grid-2");
    for (let i = 0; i < gameboard2.rows.length - 1; i++) {
        for (let j = 0; j < gameboard2.rows[i + 1].cells.length - 1; j++) {
            gameboard2.rows[j + 1].cells[i + 1].addEventListener("click", (cell) => {
                if (currentPhase === "p2-ship") {
                    placeShip(player2Board, j, i, "Player 2");
                } else if (currentPhase === "p2-turn") {
                    // do nothing if they click there own board during there turn
                } else if (currentPhase === "p1-ship") {
                    // do nothing if enemy clicks p1 board during ship
                } else if (currentPhase === "p1-turn") {
                    player1Hit(i, j);
                } else if (currentPhase === "game-over") {
                    alert("Game Over, Reset Game");
                }
                checkGameOver();
            });
        }
    }

    // Adds event listener for the 'Start Game' button
    document.getElementById("start").addEventListener("click", startGame);
})

/*
* Method: displayBoard
* Pre: Game is running
* Params: 'statebackboard': stateboard for a player, 'ID': CSS ID tag for Table
* Post: Maps stateboard state to the table given by the ID param
*/
const displayboard = (statebackboard, ID) => {
    let gameBoard = document.querySelector(ID);

    for (let i = 0; i < gameBoard.rows.length - 1; i++) {
        for (let j = 0; j < gameBoard.rows[i + 1].cells.length - 1; j++) {
            if (statebackboard[j][i].state === "Ship") {
                gameBoard.rows[j + 1].cells[i + 1].innerHTML = "";
                gameBoard.rows[j + 1].cells[i + 1].style.backgroundColor = "grey";
            }
            if (statebackboard[j][i].state === "Empty") {
                gameBoard.rows[j + 1].cells[i + 1].innerHTML = "<img src='image/Waterforbattleship.jpg'  alt='water'/>";
                gameBoard.rows[j + 1].cells[i + 1].style.backgroundColor = "#0066FF";   //same as in index.html
            }
            if (statebackboard[j][i].state === "Miss") {
                gameBoard.rows[j + 1].cells[i + 1].innerHTML = "";;
                gameBoard.rows[j + 1].cells[i + 1].style.backgroundColor = "white";
            }
            if (statebackboard[j][i].state === "Hit" || statebackboard[j][i].state === "Sunk") {
                gameBoard.rows[j + 1].cells[i + 1].innerHTML = "<img src='image/hit.jpg'  alt='explosion hit'/>";
                gameBoard.rows[j + 1].cells[i + 1].style.backgroundColor = "black";
            }
        }
    }
}

/*
* Method: checkBounds
* Pre: Game is running, currentPhase in 'x-ship' phases
* Params: 'ship': ship.js object; 'board': stateboard
* Post: Verifies that a ship object does not violate any placement rules for a given board param
*/
const checkBounds = (ship, board) => {
    for (let i = 0; i < ship.length; i++) {
        if (ship == null || ship == {}) {
            return false
        }
        let x = ship.List[i].coordinate.x;
        let y = ship.List[i].coordinate.y;

        if ((x < 0 || x > 8) || (y < 0 || y > 8)) {
            return false;
        }
        else {
            if (findSpace(x, y, board).state == 'Ship') {
                return false
            }
        }
    }
    return true
}

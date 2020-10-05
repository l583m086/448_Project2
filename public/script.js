import Space from "./space.js"
import { ShipContainer, Ship } from "./ship.js";

// Global variables
let player1Ships;
let player2Ships;
let player1Board;
let player2Board;
let player1OppBoard;
let player2OppBoard;

let playerShips;
let computerShips;
let playerBoard;
let computerBoard;
let playerOppBoard;
let computerOppBoard;

let numberOfShips = 0;

let currentPhase = "starting"; // starting, p1-ship, p1-turn, p2-ship, p2-turn, game-over
let mode = "";
let level = "";
let p1Ships = 0;
let p2Ships = 0;
let pShips = 0;

const singlePlayerMode = document.querySelector('#singleplayerMode')
const multiPlayerMode = document.querySelector('#multiplayerMode')
const startGameButton = document.querySelector('#start')


//Scoreboard Variables


let p1HitCount = 0;
let p2HitCount = 0;

let p1MissCount = 0;
let p2MissCount = 0;

let p1MisslesFired = 0;
let p2MisslesFired = 0;


const m_player1Score = document.getElementById("player1Score");
const m_player2Score = document.getElementById("player2Score");
const m_player1ShipsSunk = document.getElementById("player1ShipsSunk");
const m_player2ShipsSunk = document.getElementById("player2ShipsSunk");
const m_player1HitCount = document.getElementById("player1HitCount");
const m_player2HitCount = document.getElementById("player2HitCount");
const m_player1MissCount = document.getElementById("player1MissCount");
const m_player2MissCount = document.getElementById("player2MissCount");
const m_player1MisslesFired = document.getElementById("player1MisslesFired");
const m_player2MisslesFired = document.getElementById("player2MisslesFired");
const m_player1HitAccuracy = document.getElementById("player1HitAccuracy");
const m_player2HitAccuracy = document.getElementById("player2HitAccuracy");
const m_aiNameChange = document.getElementById("aiName");





// End Global variables

/*
* Method: newBoard
* Pre: None
* Params: None
* Post: new stateboard/backboard is generated (9x9 board)
*/

singlePlayerMode.addEventListener("click", startSinglePlayerMode)
multiPlayerMode.addEventListener("click", startMultiPlayerMode)

/*
* Method: startSinglePlayerMode
* Pre Conditions: None
* Parameters: None
* Post Conditions: Starts the single player mode, adds easy, medium, and hard mode options, and changes player IDs to "Player" and "AI"
*/
function startSinglePlayerMode(){
    document.querySelector("#instruction").innerText = "Single Player Mode"
    document.getElementById("multiplayerMode").disabled = true;
    document.getElementById("singleplayerMode").disabled = false;
    mode = "singlePlayer"
    document.getElementById('level').style.display = 'block'
    document.querySelector('#easy').addEventListener("click", startEasyMode)
    document.querySelector('#medium').addEventListener("click", startMediumMode)
    document.querySelector('#hard').addEventListener("click", startHardMode)
    document.querySelector('#player1Id').innerText = "Player"
    document.querySelector('#player2Id').innerText = "AI"
    m_aiNameChange.innerHTML = "AI"
}

/*
* Method: startEasyMode
* Pre Conditions: 'generateAttack' must be active
* Parameters: none
* Post Conditions: AI is placed on easy difficulty
*/
function startEasyMode(){
    level = "easy"
    startGameButton.addEventListener("click", startSinglePlayerGame)
}

/*
* Method: startEasyMode
* Pre Conditions: 'generateAttack' must be active
* Parameters: none
* Post Conditions: AI is placed on medium difficulty
*/
function startMediumMode(){
    level = "medium"
    startGameButton.addEventListener("click", startSinglePlayerGame)
}

/*
* Method: startEasyMode
* Pre Conditions: 'generateAttack' must be active
* Parameters: none
* Post Conditions: AI is placed on hard difficulty
*/
function startHardMode(){
    level = "hard"
    startGameButton.addEventListener("click", startSinglePlayerGame)
}

/*
* Method: startMultiPlayerMode
* Pre Conditions: None
* Parameters: None
* Post Conditions: Enables the display(s) on HTML and CSS to interact with the multiplayer mode of the game
*/
function startMultiPlayerMode(){
    document.querySelector("#instruction").innerText = "Multiplayer Player Mode"
    document.getElementById("singleplayerMode").disabled = true;
    document.getElementById("multiplayerMode").disabled = false;
    mode = "multiplayer"
    m_aiNameChange.innerHTML = "Player 2"
    document.getElementById('level').style.display = 'none'
    document.querySelector('#player1Id').innerText = "Player1"
    document.querySelector('#player2Id').innerText = "Player2"
    startGameButton.addEventListener("click", startMultiplayerGame);
}
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
* Pre: Stateboard exists, game has started, currentPhase is in one of the 'X-ship' phases
* Params: 'board': the stateboard being modified; 'x': x-coordinate; 'y': y-coordinate; 'player': name of the player
* Post: A new ship has been placed on the given board, player ship count increments, add ship to ship container, new board displayed
*/
const placeShip = (board, x, y, player) => {
    if (board[x][y].state === "Ship") {
        alert("Do not double place ships!");
    } else {
        document.querySelector("#instruction").innerText = "Use Arrow Keys to Orient\nPress Enter to Confirm Placement"
        board[x][y].state = "Ship"
        displayboard(board, player === "Player 1" ? "#game-grid-1" : "#game-grid-2");
        board[x][y].state = "Empty"
        let direction = "";
        let done = false;

        /*
        * Method: keyListener
        * Pre: A player has clicked a space on the board to place a ship
        * Params: the event of a key being pressed (happens automatically)
        * Post: sets a temporary direction corresponding to the direction of the arrow key pressed; Also, creates a 'temp' ship and displays it on the board; The 'temp' ship can be placed by calling the 'enterListener' function, which is called by pressing enter with these same conditions
        */
        function keyListener(e) {
            const clickListener = () => {
                document.removeEventListener('keydown', enterListener);
                document.removeEventListener('keydown', keyListener);
            }

            document.addEventListener('click', clickListener);
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

        /*
        * Method: enterListener
        * Pre: a player has clicked a space on the board to place a ships AND a direction has been set by 'keyListener'
        * Params: the event of a key being pressed (method checks if key was the enter key)
        * Post: a real ship is placed where the 'temp' ship made by 'keyListener' was; adds a ship to the relevant ship container and increments the numberOfShips
        */
        function enterListener(e) {
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
                                m_player1Score.innerHTML = p1Ships;
                            } else {
                                player2Ships.addShip(new Ship(p2Ships + 1, new Space(x, y), direction));
                                p2Ships++;
                                m_player2Score.innerHTML = p2Ships;
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

        }


        if (!done && ((p1Ships === numberOfShips && p2Ships != numberOfShips && player === "Player 2") || (p1Ships != numberOfShips))) {
            document.addEventListener('keydown', keyListener);
            document.addEventListener('keydown', enterListener);
            let clickCount = 0;
            const clickListener = () => {
                if (clickCount == 1) {
                    document.removeEventListener('keydown', enterListener);
                    document.removeEventListener('keydown', keyListener);
                    document.removeEventListener('click', clickListener);
                }
                clickCount++
            }

            document.addEventListener('click', clickListener);
        }
    }
}

/*
* Method: singlePlayerPlaceShip
* Pre Conditions: Checks to make sure ships are not overlapping
* Parameters: board, x, y
* Post Conditions: Allows player 1 to place ships in the single player mode
*/
const singlePlayerPlaceShip = (board, x, y) => {
    if(board[x][y] == "Ship"){
        alert("Do not overlap the ships")
    }
    else{
        document.querySelector("#instruction").innerText = "Use Arrow Keys to Orient\nPress Enter to Confirm Placement"
        board[x][y].state = "Ship"
        displayboard(board, '#game-grid-1')
        board[x][y].state = "Empty"
        let direction = ""
        let done = false
        document.addEventListener('keydown', keyListener)
        function keyListener (e){
            const clickListener = () => {
                document.removeEventListener('keydown', enterListener);
                document.removeEventListener('keydown', keyListener);
            }
            if (e.key == "ArrowLeft") {
                direction = "left"
                console.log(direction)
            }
            else if (e.key == "ArrowRight") {
                direction = "right"
                console.log(direction)
            }
            else if (e.key == "ArrowDown") {
                direction = "down"
                console.log(direction)
            }
            else if (e.key == "ArrowUp") {
                direction = "up"
                console.log(direction)
            }
            else if (e.key == "Enter") {
                direction = direction
                console.log(direction)
            }
            else {
                direction = " "
            }
            let valid = true;

            for (let ship of playerShips.ships) {
                for (let space of ship.List) {
                    console.log(valid)
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
                let s = new Ship(pShips + 1, new Space(x, y), direction)

                if (checkBounds(s, board)) {
                    console.log(s)
                    for (let space of s.List) {
                        findSpace(space.coordinate.x, space.coordinate.y, board).state = "Ship"
                    }

                    displayboard(board, "#game-grid-1");

                    for (let space of s.List) {
                        findSpace(space.coordinate.x, space.coordinate.y, board).state = "Empty"
                    }
                }
                else {
                    displayboard(board, "#game-grid-1");
                }
            }
        }

        function enterListener(e) {
            const clickListener = () => {
                document.removeEventListener('keydown', enterListener);
                document.removeEventListener('keydown', keyListener);
            }
            let ship = {}
            ship = new Ship(pShips + 1, new Space(x, y), direction)
            if(e.key === "Enter"){
                let ship = {}
                if (direction !== "" || pShips === 0 ) {
                    ship = new Ship(pShips + 1, new Space(x, y), direction)
                    console.log(ship)
                    if (checkBounds(ship, board)) {
                        console.log("Check bound return true")
                        if (direction === "up" || direction === "down" || direction === "right" || direction === "left" || pShips === 0) {
                            playerShips.addShip(new Ship(pShips + 1, new Space(x, y), direction));
                            pShips++;
                            for (let ship of playerShips.ships) {
                                for (let space of ship.List) {
                                    findSpace(space.coordinate.x, space.coordinate.y, board).state = "Ship"
                                }
                            }
                            displayboard(board,"#game-grid-1");
                            document.removeEventListener('keydown', keyListener);
                            document.removeEventListener('keydown', enterListener)
                            if (!(pShips == numberOfShips)) {
                                let num = pShips + 1
                                alert("Place Ship #" + num)
                            }
                            if (currentPhase === "p-ship" && pShips === numberOfShips) {
                                alert("Player Place Ship Phase Complete");
                                displayboard(playerBoard, "#game-grid-1");
                                displayboard(playerOppBoard, "#game-grid-2");
                                currentPhase = "p-turn"
                            }
                        }

                    } else {
                        alert("Invalid Ship, Try again")
                        displayboard(board, "#game-grid-1");
                        document.removeEventListener('keydown', keyListener);
                        document.removeEventListener('click', clickListener);
                        document.removeEventListener('keydown', enterListener);
                    }
                }
                else {
                    alert("Use Arrow Keys to Place")
                }
            }
        }

        if (!done && ((pShips !== numberOfShips))) {
            document.addEventListener('keydown', keyListener);
            document.addEventListener('keydown', enterListener);
            let clickCount = 0;
            const clickListener = () => {
                if (clickCount == 1) {
                    document.removeEventListener('keydown', enterListener);
                    document.removeEventListener('keydown', keyListener);
                    document.removeEventListener('click', clickListener);
                }
                clickCount++
            }

            document.addEventListener('click', clickListener);
        }
    }

}

/*
* Method: autoGenerateShip
* Pre Conditions: Checks for a valid starting place and a valid ship
* Parameters: board, numberOfShips
* Post Conditions: If the starting place and ship are valid, the ship is added to the ship container for the AI in single player mode
*/
function autoGenerateShip(board, numberOfShips){
    let directions = ['up', 'down', 'left', 'right']
    let maxBound = 8
    let minBound = 0
    let randomXStart = 0
    let randomYStart = 0
    let shipLength = 0
    let randomDirection = 0
    let valid = false

    for(let i = 0; i < numberOfShips; i++){
        valid = false
        // Check if start place is not taken

        // Check if the ship is valid
        do{
            do{
                randomXStart = Math.floor(Math.random()*(maxBound - minBound) + minBound)
                randomYStart =  Math.floor(Math.random()*(maxBound - minBound) + minBound)
            }while(board[randomXStart][randomYStart].state === "Ship")

            shipLength = i + 1
            randomDirection = Math.floor(Math.random()*directions.length)
            let ship = new Ship(shipLength, new Space(randomXStart, randomXStart), directions[randomDirection])

            if(checkBounds(ship, board)){
                // If the ship is valid, add it to the ship cotainer
                valid = true
                computerShips.addShip(ship)
                for (let ship of computerShips.ships) {
                    for (let space of ship.List) {
                        findSpace(space.coordinate.x, space.coordinate.y, board).state = "Ship"
                    }
                }
            }
        }while(!valid)
    }
    // displayboard(board, "#game-grid-2")
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

/*
* Method: checkGameOver
* Pre: Game is running
* Params: None
* Post: Game will end if all ships given are in a state of being sunken, changes phase to game-over if game is over
*/
const checkGameOver = () => {
    console.log("Check Game Over get called")
    if(mode === "multiplayer"){
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
    else{
        if (currentPhase !== "p-turn") {
            return;
        }
        if (computerShips.allSunk()) {
            console.log("Game Over")
            gameOver("Player");
            currentPhase = "game-over";
            return true;
        }
        else if(playerShips.allSunk()){
            console.log("Game Over")
            gameOver("AI");
            currentPhase = "game-over";
            return true;
        }
        return false;
    }

}

/*
* Method: player1Hit
* Pre: Game is running, currentPhase in 'p1-turn'
* Params: 'x': x-coordinate; 'y': y-coordinate;
* Post: Player either hits or misses, new board state is displayed, changes phase on miss
*/
const player1Hit = (x, y) => {
    p1MisslesFired += 1; //For Scoreboard
    m_player1MisslesFired.innerHTML = p1MisslesFired; //For Scoreboard
    if (player2Board[y][x].state === "Ship") {
        alert("HIT!!!!!");
        p1HitCount += 1; //For Scoreboard
        m_player1HitCount.innerHTML = p1HitCount; //For Scoreboard
        player2Board[y][x].state = "Sunk";
        player1OppBoard[y][x].state = "Hit";
        player2Ships.hit(y, x);
        m_player2Score.innerHTML = p2Ships - (player2Ships.sunkShips); //For Scoreboard
        m_player1ShipsSunk.innerHTML = player2Ships.sunkShips; //For Scoreboard
        displayboard(player1OppBoard, "#game-grid-2");
    } else {
        if (player2Board[y][x].state !== "Sunk") {
            alert("MISS");
            p1MissCount += 1; //For Scoreboard
            m_player1MissCount.innerHTML = p1MissCount; //For Scoreboard
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
    m_player1HitAccuracy.innerHTML = ((p1HitCount/p1MisslesFired)*100).toFixed(2) + "%"; //For Scoreboard
}

/*
* Method: player2Hit
* Pre: Game is running, currentPhase in 'p2-turn'
* Params: 'x': x-coordinate; 'y': y-coordinate;
* Post: Player either hits or misses, new board state is displayed, changes phase on miss
*/
const player2Hit = (x, y) => {
    p2MisslesFired += 1; //For Scoreboard
    m_player2MisslesFired.innerHTML = p2MisslesFired; //For Scoreboard
    if (player1Board[y][x].state === "Ship") {
        alert("HIT!!!!!");
        p2HitCount += 1; //For Scoreboard
        m_player2HitCount.innerHTML = p2HitCount; //For Scoreboard
        player1Board[y][x].state = "Sunk";
        player2OppBoard[y][x].state = "Hit";
        player1Ships.hit(y, x);
        m_player1Score.innerHTML = p1Ships - (player1Ships.sunkShips); //For Scoreboard
        m_player2ShipsSunk.innerHTML = player1Ships.sunkShips; //For Scoreboard
        displayboard(player2OppBoard, "#game-grid-1");
    } else {
        if (player1Board[y][x].state !== "Sunk") {
            alert("MISS");
            p2MissCount += 1; //For Scoreboard
            m_player2MissCount.innerHTML = p2MissCount; //For Scoreboard
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
    m_player2HitAccuracy.innerHTML = ((p2HitCount/p2MisslesFired)*100).toFixed(2) + "%"; //For Scoreboard
}
/*
* Method: playerHit
* Pre: Game is running, currentPhase in 'p-turn'
* Params: 'x': x-coordinate; 'y': y-coordinate;
* Post: Player either hits or misses, new board state is displayed, changes phase on miss
*/
const playerHit = (x, y) => {
    p1MisslesFired += 1; //For Scoreboard
    m_player1MisslesFired.innerHTML = p1MisslesFired; //For Scoreboard
    if (computerBoard[y][x].state === "Ship") {
        alert("HIT!!!!!");
        p1HitCount += 1; //For Scoreboard
        m_player1HitCount.innerHTML = p1HitCount; //For Scoreboard
        computerBoard[y][x].state = "Sunk";
        playerOppBoard[y][x].state = "Hit";
        computerShips.hit(y, x);
        m_player2Score.innerHTML = p2Ships - (computerShips.sunkShips); //For Scoreboard
        m_player1ShipsSunk.innerHTML = computerShips.sunkShips; //For Scoreboard
        displayboard(playerBoard, '#game-grid-1')
        displayboard(playerOppBoard, "#game-grid-2");
        if(checkGameOver()){
            return
        }
        currentPhase = "ai-turn"
        generateAttack(level)
    } else {
        if (computerBoard[y][x].state !== "Sunk") {
            alert("MISS");
            p1MissCount += 1; //For Scoreboard
            m_player1MissCount.innerHTML = p1MissCount; //For Scoreboard
            playerOppBoard[y][x].state = "Miss";
            displayboard(playerBoard, '#game-grid-1')
            displayboard(playerOppBoard, "#game-grid-2");

            currentPhase = "ai-turn"
            generateAttack(level)

        } else {
            alert("Already fired there");
            currentPhase = "p-turn";
        }
    }
    m_player1HitAccuracy.innerHTML = ((p1HitCount/p1MisslesFired)*100).toFixed(2) + "%"; //For Scoreboard
}

let mediumRowPastMove = -1
let mediumColPastMove = -1

/*
* Method: generateAttack
* Pre Conditions: Game is running, currentPhase in 'ai-turn'
* Params: 'level': submitted by the user at the beginning of the game
* Post Conditions: AI either hits or misses, new board state is displayed, changes phase on miss
*/
const generateAttack = (level) =>{
    console.log("generate attack get called")
    displayboard(computerBoard, '#game-grid-2')
    displayboard(computerOppBoard, '#game-grid-1')
    if(level === "easy"){

        let maxBound = 8
        let minBound = 0
        let randomRowStart = 0
        let randomColStart = 0
        let state = ""
        do{
            randomRowStart = Math.floor(Math.random()*(maxBound - minBound) + minBound)
            randomColStart =  Math.floor(Math.random()*(maxBound - minBound) + minBound)
            let state = computerOppBoard[randomRowStart][randomColStart].state

        }while(state === "Miss" || state === "Hit" || state === "Sunk")
        // Check if AI hits the ship
        p2MisslesFired += 1; //For Scoreboard
        m_player2MisslesFired.innerHTML = p2MisslesFired; //For Scoreboard
        if (playerBoard[randomRowStart][randomColStart].state === "Ship") {
            alert("AI HIT!!!!!")
            p2HitCount += 1; //For Scoreboard
            m_player2HitCount.innerHTML = p2HitCount; //For Scoreboard
            makeBoardChanges(playerBoard, computerOppBoard,playerShips, randomRowStart, randomColStart);
            // Print AI moves
            displayboard(computerOppBoard, "#game-grid-1");
            displayboard(computerBoard, "#game-grid-2")
            if(playerShips.allSunk()){
                console.log("Game Over")
                gameOver("AI");
                currentPhase = "game-over";
                return
            }
            document.querySelector("#instruction").innerText = "Use Enter Key to skip"
            document.addEventListener('keydown', enterListener)
            function enterListener(e){
                if(e.key === "Enter"){
                    displayboard(playerBoard, "#game-grid-1");
                    displayboard(playerOppBoard, "#game-grid-2")
                    currentPhase = "p-turn";
                    document.querySelector("#instruction").innerText = "Use Left Click to Attack\nPress Enter to Confirm Attack"
                    // checkGameOver()
                }
            }

        } else {
            alert("AI MISS")
            p2MissCount += 1; //For Scoreboard
            m_player2MissCount.innerHTML = p2MissCount; //For Scoreboard
            computerOppBoard[randomRowStart][randomColStart].state = "Miss";
            console.log("print AI moves")
            displayboard(computerOppBoard, "#game-grid-1");
            displayboard(computerBoard, "#game-grid-2")
            document.querySelector("#instruction").innerText = "Press Enter Key To Skip"
            document.addEventListener('keydown', enterListener)
            function enterListener(e){
                if(e.key === "Enter"){
                    displayboard(playerBoard, "#game-grid-1");
                    displayboard(playerOppBoard, "#game-grid-2")
                    currentPhase = "p-turn";
                    document.querySelector("#instruction").innerText = "Use Left Click to Attack\nPress Enter to Confirm Attack"
                    checkGameOver();
                }
            }
        }
        m_player2HitAccuracy.innerHTML = ((p2HitCount/p2MisslesFired)*100).toFixed(2) + "%"; //For Scoreboard
    }
    else if(level === "medium"){
        //Check if the last move was a hit or miss
        if((mediumRowPastMove === -1) && (mediumColPastMove === -1)){
        //If last move was a miss, generate a random attack
            let maxBound = 8
            let minBound = 0
            let randomRowStart = 0
            let randomColStart = 0
            let state = ""
            do{
                randomRowStart = Math.floor(Math.random()*(maxBound - minBound) + minBound)
                randomColStart =  Math.floor(Math.random()*(maxBound - minBound) + minBound)
                state = computerOppBoard[randomRowStart][randomColStart].state

            }while(state === "Miss" || state === "Hit" || state === "Sunk")
            // Check if AI hits the ship
            p2MisslesFired += 1; //For Scoreboard
            m_player2MisslesFired.innerHTML = p2MisslesFired; //For Scoreboard
            console.log("Last hit was a miss. This is the new attack")
            console.log(randomRowStart)
            console.log(randomColStart)
            if (playerBoard[randomRowStart][randomColStart].state === "Ship") {
                //If this random attack is a hit save it to the past move
                mediumRowPastMove = randomRowStart
                mediumColPastMove = randomColStart
                console.log("This was a HIT, save it to past move")
                alert("AI HIT!!!!!")
                p2HitCount += 1; //For Scoreboard
                m_player2HitCount.innerHTML = p2HitCount; //For Scoreboard
                makeBoardChanges(playerBoard, computerOppBoard,playerShips, randomRowStart, randomColStart);
                // Print AI moves
                displayboard(computerOppBoard, "#game-grid-1");
                displayboard(computerBoard, "#game-grid-2")
                if(playerShips.allSunk()){
                    console.log("Game Over")
                    gameOver("AI");
                    currentPhase = "game-over";
                    return
                }
                document.querySelector("#instruction").innerText = "Use Enter Key to skip"
                document.addEventListener('keydown', enterListener)
                function enterListener(e){
                    if(e.key === "Enter"){
                        displayboard(playerBoard, "#game-grid-1");
                        displayboard(playerOppBoard, "#game-grid-2")
                        currentPhase = "p-turn";
                        document.querySelector("#instruction").innerText = "Use Left Click to Attack\nPress Enter to Confirm Attack"
                        // checkGameOver()
                    }
                }

            } else {
                // If the attack the was a miss, set the past move back to -1
                alert("AI MISS")
                p2MissCount += 1; //For Scoreboard
                console.log("That was a miss, set past move back to -1")
                m_player2MissCount.innerHTML = p2MissCount; //For Scoreboard
                mediumRowPastMove = -1
                mediumColPastMove = -1
                computerOppBoard[randomRowStart][randomColStart].state = "Miss";
                displayboard(computerOppBoard, "#game-grid-1");
                displayboard(computerBoard, "#game-grid-2")
                document.querySelector("#instruction").innerText = "Press Enter Key To Skip"
                document.addEventListener('keydown', enterListener)
                function enterListener(e){
                    if(e.key === "Enter"){
                        displayboard(playerBoard, "#game-grid-1");
                        displayboard(playerOppBoard, "#game-grid-2")
                        currentPhase = "p-turn";
                        document.querySelector("#instruction").innerText = "Use Left Click to Attack\nPress Enter to Confirm Attack"
                        checkGameOver();
                    }
                }
            }
        }
        else{
            // If past move was a hit, check around if there is another ship space
            // Check up
            p2MisslesFired += 1; //For Scoreboard
            m_player2MisslesFired.innerHTML = p2MisslesFired; //For Scoreboard
            console.log("Past move was a hit, checking the surrounding")
            if((mediumRowPastMove) > 0 && (playerBoard[mediumRowPastMove - 1][mediumColPastMove].state === "Ship")){
                console.log("Up has a ship")
                makeBoardChanges(playerBoard, computerOppBoard,playerShips, mediumRowPastMove - 1, mediumColPastMove);
                mediumRowPastMove = mediumRowPastMove - 1
                alert("AI HIT!!!!!")
                p2HitCount += 1; //For Scoreboard
                m_player2HitCount.innerHTML = p2HitCount; //For Scoreboard
                displayboard(computerOppBoard, "#game-grid-1");
                displayboard(computerBoard, "#game-grid-2")
                if(playerShips.allSunk()){
                    console.log("Game Over")
                    gameOver("AI");
                    currentPhase = "game-over";
                    return
                }
                document.querySelector("#instruction").innerText = "Use Enter Key to skip"
                document.addEventListener('keydown', enterListener)
                function enterListener(e){
                    if(e.key === "Enter"){
                        displayboard(playerBoard, "#game-grid-1");
                        displayboard(playerOppBoard, "#game-grid-2")
                        currentPhase = "p-turn";
                        document.querySelector("#instruction").innerText = "Use Left Click to Attack\nPress Enter to Confirm Attack"
                        // checkGameOver()
                    }
                }
            }
            //Check right
            else if((mediumColPastMove) < 8 && (playerBoard[mediumRowPastMove][mediumColPastMove + 1].state === "Ship")){
                makeBoardChanges(playerBoard, computerOppBoard,playerShips, mediumRowPastMove, mediumColPastMove + 1);
                console.log("Right has a ship")
                mediumColPastMove = mediumColPastMove + 1
                alert("AI HIT!!!!!")
                p2HitCount += 1; //For Scoreboard
                m_player2HitCount.innerHTML = p2HitCount; //For Scoreboard
                displayboard(computerOppBoard, "#game-grid-1");
                displayboard(computerBoard, "#game-grid-2")
                if(playerShips.allSunk()){
                    console.log("Game Over")
                    gameOver("AI");
                    currentPhase = "game-over";
                    return
                }
                document.querySelector("#instruction").innerText = "Use Enter Key to skip"
                document.addEventListener('keydown', enterListener)
                function enterListener(e){
                    if(e.key === "Enter"){
                        displayboard(playerBoard, "#game-grid-1");
                        displayboard(playerOppBoard, "#game-grid-2")
                        currentPhase = "p-turn";
                        document.querySelector("#instruction").innerText = "Use Left Click to Attack\nPress Enter to Confirm Attack"
                        // checkGameOver()
                    }
                }
            }
            //Check down
            else if((mediumRowPastMove) < 8 && (playerBoard[mediumRowPastMove + 1][mediumColPastMove].state === "Ship")){
                makeBoardChanges(playerBoard, computerOppBoard,playerShips, mediumColPastMove + 1, mediumColPastMove);
                mediumRowPastMove = mediumColPastMove + 1
                console.log("Down has a ship")
                alert("AI HIT!!!!!")
                p2HitCount += 1; //For Scoreboard
                m_player2HitCount.innerHTML = p2HitCount; //For Scoreboard
                displayboard(computerOppBoard, "#game-grid-1");
                displayboard(computerBoard, "#game-grid-2")
                if(playerShips.allSunk()){
                    console.log("Game Over")
                    gameOver("AI");
                    currentPhase = "game-over";
                    return
                }
                document.querySelector("#instruction").innerText = "Use Enter Key to skip"
                document.addEventListener('keydown', enterListener)
                function enterListener(e){
                    if(e.key === "Enter"){
                        displayboard(playerBoard, "#game-grid-1");
                        displayboard(playerOppBoard, "#game-grid-2")
                        currentPhase = "p-turn";
                        document.querySelector("#instruction").innerText = "Use Left Click to Attack\nPress Enter to Confirm Attack"
                        // checkGameOver()
                    }
                }
            }
            //Check left
            else if((mediumColPastMove) > 0 && (playerBoard[mediumRowPastMove][mediumColPastMove - 1].state === "Ship")){
                makeBoardChanges(playerBoard, computerOppBoard,playerShips, mediumRowPastMove, mediumColPastMove - 1);
                mediumColPastMove = mediumColPastMove - 1
                console.log("Left has a ship")
                alert("AI HIT!!!!!")
                p2HitCount += 1; //For Scoreboard
                m_player2HitCount.innerHTML = p2HitCount; //For Scoreboard
                displayboard(computerOppBoard, "#game-grid-1");
                displayboard(computerBoard, "#game-grid-2")
                if(playerShips.allSunk()){
                    console.log("Game Over")
                    gameOver("AI");
                    currentPhase = "game-over";
                    return
                }
                document.querySelector("#instruction").innerText = "Use Enter Key to skip"
                document.addEventListener('keydown', enterListener)
                function enterListener(e){
                    if(e.key === "Enter"){
                        displayboard(playerBoard, "#game-grid-1");
                        displayboard(playerOppBoard, "#game-grid-2")
                        currentPhase = "p-turn";
                        document.querySelector("#instruction").innerText = "Use Left Click to Attack\nPress Enter to Confirm Attack"
                        // checkGameOver()
                    }
                }
            }
            // If there is no Ship arround, shoot randomly
            else{
                let max = 8
                let min = 0
                let rowStart = 0
                let colStart = 0
                let state = ""
                do{
                    rowStart = Math.floor(Math.random()*(max - min) + min)
                    colStart =  Math.floor(Math.random()*(max - min) + min)
                    state = computerOppBoard[rowStart][colStart].state

                }while(state === "Miss" || state === "Hit" || state === "Sunk")
                // Check if AI hits the ship
                console.log("Shoot randomly since there's no ships around")
                if (playerBoard[rowStart][colStart].state === "Ship") {
                    console.log("That random shoot was a hit")
                    //If this random attack is a hit save it to the past move
                    mediumRowPastMove = rowStart
                    mediumColPastMove = colStart
                    alert("AI HIT!!!!!")
                    p2HitCount += 1; //For Scoreboard
                    m_player2HitCount.innerHTML = p2HitCount; //For Scoreboard
                    makeBoardChanges(playerBoard, computerOppBoard,playerShips, rowStart, colStart);
                    // Print AI moves
                    displayboard(computerOppBoard, "#game-grid-1");
                    displayboard(computerBoard, "#game-grid-2")
                    if(playerShips.allSunk()){
                        console.log("Game Over")
                        gameOver("AI");
                        currentPhase = "game-over";
                        return
                    }
                    document.querySelector("#instruction").innerText = "Use Enter Key to skip"
                    document.addEventListener('keydown', enterListener)
                    function enterListener(e){
                        if(e.key === "Enter"){
                            displayboard(playerBoard, "#game-grid-1");
                            displayboard(playerOppBoard, "#game-grid-2")
                            currentPhase = "p-turn";
                            document.querySelector("#instruction").innerText = "Use Left Click to Attack\nPress Enter to Confirm Attack"
                            // checkGameOver()
                        }
                    }

                } else {
                    // If the attack the was a miss, set the past move back to -1
                    console.log("That random shoot was a miss")
                    alert("AI MISS")
                    p2MissCount += 1; //For Scoreboard
                    m_player2MissCount.innerHTML = p2MissCount; //For Scoreboard
                    mediumRowPastMove = -1
                    mediumColPastMove = -1

                    computerOppBoard[rowStart][colStart].state = "Miss";
                    displayboard(computerOppBoard, "#game-grid-1");
                    displayboard(computerBoard, "#game-grid-2")
                    document.querySelector("#instruction").innerText = "Press Enter Key To Skip"
                    document.addEventListener('keydown', enterListener)
                    function enterListener(e){
                        if(e.key === "Enter"){
                            displayboard(playerBoard, "#game-grid-1");
                            displayboard(playerOppBoard, "#game-grid-2")
                            currentPhase = "p-turn";
                            document.querySelector("#instruction").innerText = "Use Left Click to Attack\nPress Enter to Confirm Attack"
                            checkGameOver();
                        }
                    }
                }
            }
        }
        m_player2HitAccuracy.innerHTML = ((p2HitCount/p2MisslesFired)*100).toFixed(2) + "%"; //For Scoreboard
    }
    else if(level === "hard"){
        let XStart = 0
        let YStart = 0
        let state = ""
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                console.log(playerBoard[i][j].state)
                if(playerBoard[i][j].state === "Ship"){
                    XStart = i
                    YStart = j
                    break
                }
            }
        }
        p2MisslesFired += 1; //For Scoreboard
        m_player2MisslesFired.innerHTML = p2MisslesFired; //For Scoreboard
        // Check if AI hits the ship
        alert("AI HIT!!!!!")
        makeBoardChanges(playerBoard, computerOppBoard,playerShips, XStart, YStart);
        p2HitCount += 1; //For Scoreboard
        m_player2HitCount.innerHTML = p2HitCount; //For Scoreboard
        m_player1Score.innerHTML = p1Ships - (playerShips.sunkShips); //For Scoreboard
        m_player2ShipsSunk.innerHTML = playerShips.sunkShips; //For Scoreboard
        m_player2HitAccuracy.innerHTML = "100%"; //For Scoreboard
        // Print AI moves
        displayboard(computerOppBoard, "#game-grid-1");
        if(playerShips.allSunk()){
            console.log("Game Over")
            gameOver("AI");
            currentPhase = "game-over";
            return
        }
        displayboard(computerBoard, "#game-grid-2")
        document.addEventListener('keydown', enterListener)
        document.querySelector("#instruction").innerText = "Press Enter to skip"
        function enterListener(e){
            if(e.key === "Enter"){
                displayboard(playerBoard, "#game-grid-1");
                displayboard(playerOppBoard, "#game-grid-2")
                currentPhase = "p-turn";
                document.querySelector("#instruction").innerText = "Use Left Click to Attack\nPress Enter to Confirm Attack"
                // checkGameOver()
            }
        }
    }
}

/*
* Method: makeBoardChanges
* Pre Conditions: Current game is running
* Parameters: 'currentBoard', 'oppBoard', 'ships', 'row', 'col'
* Post Conditions: Game continues, simply a method that saves code space
*/
function makeBoardChanges(currentBoard, oppBoard, ships, row, col){
    currentBoard[row][col].state = "Sunk";
    oppBoard[row][col].state = "Hit";
    ships.hit(row, col);
    return;
}

/*
* Method: startSinglePlayerGame
* Pre Conditions: None
* Parameters: None
* Post Conditions: Starts game if not started, and changes the phase to ship placement, displays board, resets game if game-over phase occurs
*/
const startSinglePlayerGame = () => {
    if(currentPhase === "starting"){
        document.querySelector("#instruction").innerText = "Use Left Click to place ship"
        document.getElementById('scoreboard').style.display = 'block'
        document.getElementById('level').style.display = 'none'
        playerShips = new ShipContainer();
        computerShips = new ShipContainer();
        playerBoard = newBoard()
        computerBoard = newBoard()
        playerOppBoard = newBoard()
        computerOppBoard = newBoard()
        console.log(currentPhase)
        displayboard(playerBoard, "#game-grid-1");
        displayboard(computerBoard, "#game-grid-2");
        do {
            numberOfShips = parseInt(prompt("Enter number of ships (1-5): "));
            if (numberOfShips < 0 || numberOfShips > 5 || isNaN(numberOfShips)) {
                alert("Invalid Input");
            }
        } while (numberOfShips < 0 || numberOfShips > 5 || isNaN(numberOfShips));
        p1Ships = numberOfShips; //For Scoreboard
        p2Ships = numberOfShips; //For Scoreboard
        m_player1Score.innerHTML = p1Ships;
        m_player2Score.innerHTML = p2Ships;
        autoGenerateShip(computerBoard, numberOfShips)
        displayboard(computerBoard, "#game-grid-2");
        currentPhase = "p-ship"
        alert("Place Ship #1");
        single()
    }
    else if (currentPhase === "game-over") {
        location.reload();
    } else {
        alert("You are mid-game, cannot start");
    }
}


/*
* Method: startMultiplayerGame
* Pre: None
* Params: None
* Post: Starts game if not started, changes phase to ship placement, displays board, resets game if game-over phase
*/
const startMultiplayerGame = () => {
    if (currentPhase === "starting") {
        document.querySelector("#instruction").innerText = "Use Left Click to place ship"
        document.getElementById('scoreboard').style.display = 'block'
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
        mode = "multiplayer"
        alert("Player 1, Place Ship #1")
        multi()
    } else if (currentPhase === "game-over") {
        location.reload();
    } else {
        alert("You are mid-game, cannot start");
    }
}

/*
* Method: multi
* Pre Conditions: None
* Parameters: None
* Post Conditions: Checks for different phases in multiplayer including game over
*/
const multi = () =>{
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
}

/*
* Method: single
* Pre Conditions: None
* Parameters: None
* Post Conditions: Checks for different phases in singleplayer mode including game over
*/
const single = () =>{
    checkGameOver()
        let gameboard1 = document.getElementById("game-grid-1");
            for (let i = 0; i < gameboard1.rows.length - 1; i++) {
                for (let j = 0; j < gameboard1.rows[i + 1].cells.length - 1; j++) {
                    gameboard1.rows[j + 1].cells[i + 1].addEventListener("click", () => {
                        if (currentPhase === "p-ship") {
                            singlePlayerPlaceShip(playerBoard, j, i);
                        } else if (currentPhase === "p-turn") {

                        } else if (currentPhase === "ai-turn") {

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
                        if (currentPhase === "p-ship") {
                            // do nothing if enemy clicks p1 board during ship
                        } else if (currentPhase === "p-turn") {
                            playerHit(i, j);
                        } else if (currentPhase === "game-over") {
                            alert("Game Over, Reset Game");
                        }
                        else if (currentPhase === "ai-turn") {

                        }
                        checkGameOver();
                    });
                }
            }

}
// document.addEventListener("DOMContentLoaded", multi)


/*
* Method: gameOver
* Pre: None
* Params: winnerName: 'The winners board'
* Post: Game is reset and winner is announced
*/
const gameOver = (winnerName) => {
    clearBoard("#game-grid-1");
    clearBoard("#game-grid-2");
    console.log(`Game Won by: ${winnerName}`);
    alert(`Game Won by: ${winnerName}`)
    document.querySelector("#instruction").innerText = "Press Reset to restart the game"
    document.querySelector("#start").innerHTML = 'Reset Game';
}

/*
* Method: clearBoard
* Pre: None
* Params: boardName: 'Name of the board being cleared'
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

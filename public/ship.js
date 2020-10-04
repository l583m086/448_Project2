import Space from "./space.js"

/*
* Class: ShipContainer
* Pre: None
* Params: None
* Post: Creates ShipContainer
*/
export class ShipContainer {
  /*
  * Class: ShipContainer
  * Pre: None
  * Params: None
  * Post: Creates ShipContainer
  */
  constructor() {
    this.ships = [];
    this.shipsCount = 0;
    this.sunkShips = 0;
  }

  /*
  * Method: addShip
  * Pre: ShipContainer constructed
  * Params: 'ship': Ship to be added
  * Post: ShipContainer ship list has new ship, counter incremented
  */
  addShip = (ship) => {
    this.ships.push(ship);
    this.shipsCount++;
  }


  /*
  * Method: hit
  * Pre: Game is running, currentPhase in a 'x-turn' phase
  * Params: 'x': x-coordinate; 'y': y-coordinate;
  * Post: Determines whether a ship is hit given the x, y coordinates, sinks given ship if all ship spaces hit
  */
  hit = (x, y) => {
    this.ships.forEach((ship) => {
      ship.List.forEach((space) => {
        if (space.coordinate.x === x && space.coordinate.y === y) {
          ship.setCounter(ship.counter + 1);
          if (ship.isSunk) {
            this.sinkShip();
          }
          return;
        }
      })
    })
  }

  /*
  * Method: sinkShip
  * Pre: Game is running, currentPhase in a 'x-turn' phase
  * Params: None
  * Post: Alert's players to the fact that a ship has been sunk, increments sunk ship counter
  */
  sinkShip = () => {
    this.sunkShips = this.sunkShips + 1;
    alert("You sunk my ship");
  }

  getSunkShips = () =>{
    return this.sunkShips
  }

  getShipCount = () =>{
    return this.shipsCount
  }

  /*
  * Method: allSunk
  * Pre: Game is running
  * Params: None
  * Post: Returns true if all ships are sunk, false if not
  */
  allSunk = () => {
    return this.sunkShips === this.shipsCount;
  }
}

/*
* Class: Ship
* Pre: None
* Params: None
* Post: New class 'Ship' that stores a variable 'length'
*/
export class Ship {
  /*
  * Method: Constructor
  * Pre: None
  * Params: 'length': ship length, 'space': Space.js object for coordinates of ship head; 'dir': [up, down, left, right] for ship direction
  * Post: Creates Ship object, stores Space objects in this.List, Space objects created using 'space' and 'dir' params
  */
  constructor(length, space, dir) {
    this.length = length;
    this.isSunk = false;
    this.counter = 0;
    this.space = space;
    this.List = [];

    for (let i = 0; i < length; i++) {
      if (i === 0) {
        this.List.push(space);
      }
      else if (dir == 'up') {
        this.List.push(new Space((space.coordinate.x - i), (space.coordinate.y)));
      }
      else if (dir == 'down') {
        this.List.push(new Space((space.coordinate.x + i), (space.coordinate.y)));
      }
      else if (dir == 'left') {
        this.List.push(new Space((space.coordinate.x), (space.coordinate.y - i)));
      }
      else if (dir == 'right') {
        this.List.push(new Space((space.coordinate.x), (space.coordinate.y + i)));
      }

    }
  }

  /*
  * Method: setCounter
  * Pre: Ship object has been created
  * Params: 'x': new counter value
  * Post: Sets value of this.counter to x, modifies this.isSunk if ship is sunk
  */
  setCounter(x) {
    this.counter = x;
    if (x === this.length) {
      this.isSunk = true;
    }
  }
}

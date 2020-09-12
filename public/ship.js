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
  * Params: "ship": Ship to be added
  * Post: ShipContainer ship list has new ship, counter incremented
  */
  addShip = (ship) => {
    this.ships.push(ship);
    this.shipsCount++;
  }

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

  sinkShip = () => {
    this.sunkShips = this.sunkShips + 1;
    alert("You sunk my ship");
  }

  allSunk = () => {
    return this.sunkShips === this.shipsCount;
  }
}

export class Ship { //New class 'Ship' that stores a variable 'length'
  constructor(length, space, dir) { //Ship Object constructor that takes in variable 'length'
    this.length = length; //Given length of a ship object (1, 2, 3 ,4, and 5)
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

  getLength() { //Getter that returns the 'length' of the ship object
    return this.length;
  }

  getCounter() {  //Getter that returns the 'counter' variable when called
    return this.counter;
  }

  setCounter(x) { //Setter that modifys the 'counter' variabe when called
    this.counter = x;
    if (x === this.length) {
      this.isSunk = true;
    }
  }
}

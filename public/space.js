// Possible state values for Space object
const states = {
    EMPTY: "Empty",
    PLACED: "Ship",
    MISS: "Miss",
    HIT: "Hit",
    SUNK: "Sunk"
}

/*
* Class: Space
* Pre: None
* Post: new Space object returned
*/
export default class Space {
    /*
    * Class: Space
    * Pre: None
    * Params: 'x': x-coordinate; 'y': y-coordinate;
    * Post: New Space object returned, default m_state set to empty
    */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.m_state = states.EMPTY;
    }

    /*
    * Method: coordinate
    * Pre: Space exists, called with .coordinate
    * Params: None
    * Post: Getter for the values of the x and y coordinates on this Space object. Returned as {x: this.x, y: this.y}
    */
    get coordinate() {
        return (
            {
                x: this.x,
                y: this.y
            }
        )
    }

    /*
    * Method: state
    * Pre: Space exists, called with .state
    * Params: None
    * Post: Getter for the values of the m_state of this Space object
    */
    get state() {
        return this.m_state;
    }

    /*
    * Method: state
    * Pre: Space exists, called with .state = {newState}
    * Params: None
    * Post: Setter for the values of the m_state. Modifies state based upon possible state values;
    */
    set state(state) {
        switch (state) {
            case states.PLACED:
                this.m_state = states.PLACED
                break;
            case states.MISS:
                this.m_state = states.MISS
                break;
            case states.HIT:
                this.m_state = states.HIT
                break;
            case states.SUNK:
                this.m_state = states.SUNK;
                break;
            default:
                this.m_state = states.EMPTY
                break;
        }
    }
}
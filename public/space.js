const states = {
    EMPTY: "Empty",
    PLACED: "Ship",
    MISS: "Miss",
    HIT: "Hit",
    SUNK: "Sunk"
}

export default class Space {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.m_state = states.EMPTY;
    }

    get coordinate() {
        return (
            {
                x: this.x,
                y: this.y
            }
        )
    }

    get state() {
        return this.m_state;
    }

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
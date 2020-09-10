const states = {
    EMPTY: "Empty",
    PLACED: "Ship",
    MISS: "Miss",
    HIT: "Hit"
}

export default class Space {
    constructor(x, y) {
        this.x = x;
        this.y = y; 
        this.m_state = states.EMPTY;
        this.m_color = "blue";
    }

    get coordinate() {
        return (
            {
                x : this.x,
                y : this.y
            }
        )
    }

    get state() {
        return this.m_state; 
    }

    get color() {
        return this.m_color
    }

    set state(state){
        switch(state){
            case states.PLACED:
                this.m_state = states.PLACED
                this.m_color = "grey"
                break;
            case states.MISS:
                this.m_state = states.MISS
                this.m_color = "white"
                break;
            case states.HIT:
                this.m_state = states.HIT
                this.m_color = "red"
                break;
            default:
                this.m_state = states.EMPTY
                this.m_color = "blue"
                break; 
        }
    }
}
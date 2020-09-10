const states = {
    EMPTY: 0,
    PLACED: 1,
    MISS: 2,
    HIT: 3
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
                m_state = states.PLACED
                m_color = "grey"
            case states.MISS:
                m_state = states.MISS
                m_color = "white"
            case states.HIT:
                m_state = states.HIT
                m_color = "red"
            default:
                m_state = states.EMPTY
                m_color = "blue"
        }
    }
}
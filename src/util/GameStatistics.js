import CEvent from './CustomEvent'

export default class GameStatistics {
    constructor(matcher) {
        this.matcher = matcher;
        this.accumulator = [];

        this.hitEvent = new CEvent();
        this.missEvent = new CEvent();
    }

    handleActiveNotes(activeNotes) {
        if(this.matcher.match(activeNotes)) {
            this.hitEvent.fire();
        }

        if(isNotEmpty(activeNotes)) {
            this.addActiveNotes(activeNotes);
        }
        else {
            if (isNotEmpty(this.accumulator)) {
                this.missEvent.fire();
                // console.log(activeNotes, this.accumulator);
            }
            this.accumulator = [];
        }
    }

    addActiveNotes(activeNotes) {
        activeNotes.forEach(n => {
            if(this.accumulator.indexOf(n) < 0) {
                this.accumulator.push(n);
            }
        }, this);
    }
}

function isEmpty(array) {
    return array && array.length === 0;
}

function isNotEmpty(array) {
    return !array || array.length === 0;
}
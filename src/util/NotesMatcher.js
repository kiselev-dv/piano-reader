import CEvent from "./CustomEvent";
import { activeNotesAsABC } from "./Notes";

const ABC_NOTE_REGEXP = /([_^]?[abcdefgABCDEFG]{1}[,']*)/g;

export function abc2MIDI(abc) {
    const sharp = (abc.indexOf('^') > -1);
    const flat  = (abc.indexOf('_') > -1);

    const note = abc.match(/[ABCDEFGabcdefg]/)[0];
    const isLowercase = note.toLowerCase() === note;

    const octaveUp   = abc.match(/[']+/) ? abc.match(/[']+/)[0].length : 0;
    const octaveDown = abc.match(/[,]+/) ? abc.match(/[,]+/)[0].length : 0;

    let number = ['c', 'c', 'd', 'd', 'e', 'f', 'f', 'g', 'g', 'a', 'a', 'b'].indexOf(note.toLowerCase());

    if (sharp) {
        number ++;
    }

    if (flat) {
        number ++;
    }

    if (isLowercase) {
        number += 12;
    }

    number += 12 * octaveUp;
    number -= 12 * octaveDown;

    number += 12 * 5;

    return number;
}

export function system2MIDINotes(system) {
    let noteNumbers = [];

    if(system) {
        system.forEach(line => {
            noteNumbers = noteNumbers.concat(abc2Notes(line.abc));
        });
    }

    return noteNumbers;
}

export function splitABC(abc) {
    return [...abc.matchAll(ABC_NOTE_REGEXP)].map(m => m[0]);
}

export function abc2Notes(abc) {
    return splitABC(abc).map(n => abc2MIDI(n));
}

export default class NotesMatcher {
    constructor(system) {

        this.matchEvent = new CEvent();
        this.hitEvent = new CEvent();
        this.missEvent = new CEvent();

        if (system) {
            this.reset(system);
        }
    }

    reset(system) {
        this.system = system;
        this.notes = system2MIDINotes(this.system);

        this.matchOneByOne = !hasChord(this.system);

        this._matched = [];
        this._missed = [];
    }

    setActiveNotes(activeNotes) {

        // If we are matching chord,
        // all of the chord notes should be pressed
        // at once.
        // So we don't keep state ( this._matched )
        if (!this.matchOneByOne) {
            this._matched = [];
        }

        let allMatched = arraysMatch(this.notes, this._matched);

        // We already have match, but state haven't
        // been reset yet
        if (allMatched) {
            this.matchEvent.fire(this.notes);
        }

        // Notes which haven't been matched yet
        let notesToMatch = this.notes.filter(n => !this._matched.includes(n));

        // I we are matching notes one by one,
        // take the next one after matched
        if (this.matchOneByOne && !allMatched) {
            if (this.notes.length > 0 && this._matched.length < this.notes.length) {
                notesToMatch = [this.notes[this._matched.length]]
            }
        }

        this._missed = activeNotes.filter(n => !notesToMatch.includes(n));

        if (this._missed.length !== 0) {
            this.missEvent.fire(this._missed);
        }

        const matchedActiveNotes = activeNotes.filter(n => notesToMatch.includes(n));
        if (!allMatched && matchedActiveNotes.length > 0) {
            this.hitEvent.fire(matchedActiveNotes);
        }

        // Update inner state
        matchedActiveNotes.forEach(n => this._matched.push(n));

        console.log(this.notes, this._matched);

        allMatched = arraysMatch(this.notes, this._matched);
        if (allMatched && this._missed.length === 0) {
            this.matchEvent.fire(this._matched);
        }
    }

    activeNotesAsABC(activeNotes) {
        const showAsChord = !this.matchOneByOne || this.notes.length <= 1;
        return activeNotesAsABC(activeNotes, showAsChord);
    }

    match(activeNotes) {
        let matched = [];

        // All active notes are in lesson notes
        for (let n of activeNotes) {
            if(this.notes.indexOf(n) >= 0) {
                matched.push(n);
            }
        }

        // All notes are matched
        return matched.length === activeNotes.length
            && matched.length === this.notes.length;
    }
}

function arraysMatch(a, b) {
    return a.length === b.length && a.every(ea => b.includes(ea));
}

function hasChord(system) {
    return system.some(line => line.abc.includes("[") )
}

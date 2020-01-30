import Event from './CustomEvent';

const NOTES = ['C', '^C', 'D', '^D', 'E', 'F', '^F', 'G', '^G', 'A', '^A', 'B'];

export function midi2ABC(key) {
    const octave = (key / 12 | 0) - 5;
    const note = key % 12;

    const char = NOTES[note];

    if (octave === 0) {
        return char;
    }
    if (octave === 1) {
        return char.toLowerCase();
    }
    if (octave > 1) {
        return char.toLowerCase() + "'".repeat(octave - 1);
    }
    if (octave < 0) {
        return char + ",".repeat(octave * -1);
    }

    return null;
}

export function activeNotesAsABC(notes, chord) {
    let activeAbc = "";

    if (notes) {
        notes.forEach(n => {
            activeAbc += midi2ABC(n);
        });
    }

    if (activeAbc && chord) {
        activeAbc = '[' + activeAbc + ']';
    }

    return activeAbc;
}

export default class NotesState {
    constructor() {
        this.activeNotes = [];
        this.stateChangeEvent = new Event();
    }

    addNote(note) {
        const index = this.activeNotes.indexOf(note);
        if (index < 0) {
            this.activeNotes.push(note);
        }

        this.stateChangeEvent.fire(this.activeNotes);
    }

    removeNote(note) {
        const index = this.activeNotes.indexOf(note);
        if (index > -1) {
            this.activeNotes.splice(index, 1);
        }

        this.stateChangeEvent.fire(this.activeNotes);
    }

    handleMidiMessage(msg) {
        const data = msg.data;

        const command = data[0];
        const note = data[1];
        // const velocity = (data.length > 2) ? data[2] : 0;

        if (command === 144) {
            this.addNote(note);
        }

        if (command === 128) {
            this.removeNote(note);
        }
    }

    handleKeyboard(note, off) {
        if (!off) {
            this.addNote(note);
        }
        else {
            this.removeNote(note);
        }
    }
}
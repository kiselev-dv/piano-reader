
const ABC_NOTE_REGEXP = /([_^]?[abcdefgABCDEFG]{1}[,']*)/g;

export function abc2MIDI(abc) {
    const sharp = abc.match(/[^]/);
    const flat = abc.match(/[_]/);

    const note = abc.match(/[ABCDEFGabcdefg]/)[0];
    const isLowercase = note.toLowerCase() === note;

    const octaveUp   = abc.match(/[']+/) ? abc.match(/[']+/)[0].length : 0;
    const octaveDown = abc.match(/[,]+/) ? abc.match(/[,]+/)[0].length : 0;

    let number = ['c', 'c', 'd', 'd', 'e', 'f', 'f', 'g', 'g', 'a', 'a', 'b'].indexOf(note.toLowerCase)

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

export function lesson2Notes(lesson) {
    const noteNumbers = [];

    if(lesson) {
        lesson.forEach(line => {
            [...line.abc.matchAll(ABC_NOTE_REGEXP)].forEach(noteABC => {
                noteABC && noteNumbers.push(abc2MIDI(noteABC[0]))
            });
        });
    }

    return noteNumbers;
}

export default class NotesMatcher {
    constructor(lesson) {
        this.lesson = lesson;
        this.lessonNoteNumbers = lesson2Notes(this.lesson);

        console.log(this.lessonNoteNumbers);
    }

    match(activeNotes) {
        if (activeNotes) {
            for(let noteNumber of activeNotes) {

            }
        }
    }
}
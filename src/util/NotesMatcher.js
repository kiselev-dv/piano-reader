import {activeNotesAsABC} from './Notes'
import { act } from '@testing-library/react';

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

export function lesson2Notes(lesson) {
    let noteNumbers = [];

    if(lesson) {
        lesson.forEach(line => {
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
    constructor(lesson) {
        this.lesson = lesson;
        this.lessonNoteNumbers = lesson2Notes(this.lesson);
    }

    match(activeNotes) {
        let matched = [];

        // All active ntes are in lesson notes
        for (let n of activeNotes) {
            if(this.lessonNoteNumbers.indexOf(n) >= 0) {
                matched.push(n);
            }
        }

        console.log(matched);

        // All notes are matched
        return matched.length === activeNotes.length && matched.length === this.lessonNoteNumbers.length;
    }
}
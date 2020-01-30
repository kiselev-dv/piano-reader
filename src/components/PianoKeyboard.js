import React from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

export default function PianoKeyboard(props) {

    // 61 key keyboard
    const firstNote = MidiNumbers.fromNote('c2');
    const lastNote = MidiNumbers.fromNote('c7');
    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: MidiNumbers.fromNote('c4'),
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    return (
        <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={props.playNote}
            stopNote={props.stopNote}
            width={props.width}
            keyWidthToHeight={0.2}
            keyboardShortcuts={keyboardShortcuts}
            activeNotes={props.activeNotes}
        />
    );
}
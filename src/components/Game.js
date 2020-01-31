import React from 'react'

import PianoKeyboard from './PianoKeyboard';
import MidiSelector from './MidiSelector';
import Stave from './Stave'

import NotesState, {activeNotesAsABC} from '../util/Notes'
import NotesMatcher from '../util/NotesMatcher'

import {generateOneClefClasses} from '../util/ClassesGenerator'

function bindLast(fn, that, ...args) {
    return function(...callArgs) {
        fn.call(that, ...callArgs, ...args);
    }
}

function sampleArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

const lessons = [
    {
        name: "Grand Stave",
        system: [
            {clef:'treble', abc: "[CGcgc']"},
            {clef:'bass', abc: "[F,C,F,,C,,]"}
        ]
    }
];

export default class Game extends React.Component {

    constructor(props) {
        super(props);

        this.notes = new NotesState();
        this.notes.stateChangeEvent.on(this.handleActiveNotes.bind(this));

        const lessons = generateOneClefClasses("C G c g c'");

        this.state = {
            activeNotes: [],
            activeABC: '',
            lesson: lessons[0],
            lessons: lessons
        };
        this.matcher = new NotesMatcher(this.state.lesson.system);
    }

    handleActiveNotes(activeNotes) {
        this.setState({
            activeNotes: activeNotes,
            activeABC: activeNotesAsABC(activeNotes, true)
        });

        if(this.matcher.match(activeNotes)) {
            setTimeout(() => {
                const lesson = sampleArray(this.state.lessons);
                this.setState({lesson});
                this.matcher = new NotesMatcher(lesson.system);
            }, 300);
        }
    }

    handleMidiConnect(input) {
        const notes = this.notes;
        input.onmidimessage = notes.handleMidiMessage.bind(notes);
    }

    render() {
        return (
            <div id="game">
                <MidiSelector onConnect={this.handleMidiConnect.bind(this)}/>
                <Stave
                    activeABC={this.state.activeABC}
                    grandStave={false}
                    system={this.state.lesson.system}/>
                <PianoKeyboard width={1600}
                    activeNotes={this.state.activeNotes}
                    playNote={bindLast(this.notes.handleKeyboard, this.notes, false)}
                    stopNote={bindLast(this.notes.handleKeyboard, this.notes, true)}
                />
            </div>
        )
    }
}
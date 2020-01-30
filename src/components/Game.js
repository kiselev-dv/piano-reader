import React from 'react'

import PianoKeyboard from './PianoKeyboard';
import MidiSelector from './MidiSelector';
import Stave from './Stave'

import NotesState, {activeNotesAsABC} from '../util/Notes'
import NotesMatcher from '../util/NotesMatcher'

function bindLast(fn, that, ...args) {
    return function(...callArgs) {
        fn.call(that, ...callArgs, ...args);
    }
}

export default class Game extends React.Component {

    constructor(props) {
        super(props);

        this.notes = new NotesState();
        this.notes.stateChangeEvent.on(this.handleActiveNotes.bind(this));

        this.state = {
            activeNotes: [],
            activeABC: '',
            lesson: [
                {clef:'treble', abc: "[CGcgc']"},
                {clef:'bass', abc: "[F,C,F,,C,,]"}
            ]
        };

        this.matcher = new NotesMatcher(this.state.lesson);
    }

    handleActiveNotes(activeNotes) {
        this.matcher.match(activeNotes);
        this.setState({
            activeNotes: activeNotes,
            activeABC: activeNotesAsABC(activeNotes, true)
        });
    }

    handleMidiConnect(input) {
        const notes = this.notes;
        input.onmidimessage = notes.handleMidiMessage.bind(notes);
    }

    render() {
        return (
            <div>
                <MidiSelector onConnect={this.handleMidiConnect.bind(this)}/>
                <Stave
                    activeABC={this.state.activeABC}
                    grandStave={false}
                    voices={this.state.lesson}/>
                <PianoKeyboard width={1600}
                    activeNotes={this.state.activeNotes}
                    playNote={bindLast(this.notes.handleKeyboard, this.notes, false)}
                    stopNote={bindLast(this.notes.handleKeyboard, this.notes, true)}
                />
            </div>
        )
    }
}
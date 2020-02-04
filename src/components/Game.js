import React from 'react'

import PianoKeyboard from './PianoKeyboard';
import MidiSelector from './MidiSelector';
import Lessons, {COURSES} from './Lessons'
import Stave from './Stave'

import NotesState, {activeNotesAsABC} from '../util/Notes'
import NotesMatcher from '../util/NotesMatcher'
import GameStatistics from '../util/GameStatistics'

function bindLast(fn, that, ...args) {
    return function(...callArgs) {
        fn.call(that, ...callArgs, ...args);
    }
}

function sampleArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export default class Game extends React.Component {

    constructor(props) {
        super(props);

        this.notes = new NotesState();
        this.notes.stateChangeEvent.on(this.handleActiveNotes.bind(this));

        const lessons = COURSES[0].generator();

        this._hit = 0;
        this._miss = 0;

        this.state = {
            activeNotes: [],
            activeABC: '',
            lesson: lessons[0],
            lessons: lessons,
            showStaveABC: false
        };

        this.matcher = new NotesMatcher(this.state.lesson.system);
        this.stat = new GameStatistics(this.matcher);

        this.stat.hitEvent.on(this.hit.bind(this));
        this.stat.missEvent.on(this.miss.bind(this));
    }

    handleActiveNotes(activeNotes) {
        const activeABC = activeNotesAsABC(activeNotes, true)
        this.setState({
            activeNotes: activeNotes,
            activeABC: activeABC
        });

        this.stat.handleActiveNotes(activeNotes);
    }

    handleMidiConnect(input) {
        const notes = this.notes;
        input.onmidimessage = notes.handleMidiMessage.bind(notes);
    }

    handleCourseChange(course) {
        const lessons = course.generator();
        const state = {
            lesson: lessons[0],
            lessons: lessons
        };
        this.setState(state);

        this._hit = 0;
        this._miss = 0;
    }

    hit() {
        this._hit ++;

        setTimeout(() => {
            const lesson = sampleArray(this.state.lessons);
            this.setState({lesson});
            this.matcher.reset(lesson.system);
        }, 300);
    }

    miss() {
        this._miss ++;
    }

    render() {
        return (
            <div id="game">
                <MidiSelector onConnect={this.handleMidiConnect.bind(this)}/>
                <div>
                    Hit: {this._hit}, Miss: {this._miss},
                    &nbsp;<input
                        type="checkbox"
                        onChange={e => {this.setState({showStaveABC:e.target.checked});}}></input>
                    &nbsp;<label>Show stave ABC</label>
                </div>
                <Lessons lesson={COURSES[0]} lessons={COURSES}
                    onSelect={this.handleCourseChange.bind(this)} />
                <Stave
                    activeABC={this.state.activeABC}
                    grandStave={false}
                    system={this.state.lesson.system}
                    renderABC={this.state.showStaveABC}/>
                <PianoKeyboard width={1600}
                    activeNotes={this.state.activeNotes}
                    playNote={bindLast(this.notes.handleKeyboard, this.notes, false)}
                    stopNote={bindLast(this.notes.handleKeyboard, this.notes, true)}
                />
            </div>
        )
    }
}
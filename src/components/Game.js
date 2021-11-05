import React from 'react'

import PianoKeyboard from './PianoKeyboard';
import MidiSelector from './MidiSelector';
import LessonsList from './LessonsList'
import Stave from './Stave'

import { LESSONS } from '../lessons/lessons'

import NotesState from '../util/Notes'
import NotesMatcher from '../util/NotesMatcher'

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

        const lesson = LESSONS[0];

        const exercises = lesson.createExercises();

        this._hit = 0;
        this._miss = 0;

        this.state = {
            lesson,

            activeNotes: [],
            activeABC: '',

            exercises,
            exercise: sampleArray(exercises),

            showStaveABC: false,
            showGrandStave: false
        };

        this.matcher = new NotesMatcher(this.state.exercise.system);

        this.matcher.matchEvent.on(this.match.bind(this));
        this.matcher.missEvent.on(this.miss.bind(this));
    }

    handleActiveNotes(activeNotes) {
        this.matcher.setActiveNotes(activeNotes);

        const activeABC = this.matcher.activeNotesAsABC(activeNotes);
        this.setState({
            activeNotes: activeNotes,
            activeABC: activeABC
        });


        if (activeNotes.length === 0 && this.nextExerciseAwaits) {
            this.nextExercise();
        }
    }

    handleMidiConnect(input) {
        if (input) {
            const notes = this.notes;
            input.onmidimessage = notes.handleMidiMessage.bind(notes);
        }
    }

    handleLessonChange(lesson) {
        const exercises = lesson.createExercises();
        const exercise = sampleArray(exercises);

        const state = {
            lesson,
            exercise,
            exercises
        };

        this.setState(state);

        this.matcher.reset(exercise.system);

        this._hit = 0;
        this._miss = 0;
    }

    match() {
        if (!this.nextExerciseAwaits) {
            this._hit ++;
            this.nextExerciseAwaits = true;
        }
    }

    miss() {
        if (!this.nextExerciseAwaits) {
            this._miss ++;
        }
    }

    nextExercise() {
        this.nextExerciseAwaits = false;
        const exercise = sampleArray(this.state.exercises);
        this.setState({exercise});
        this.matcher.reset(exercise.system);
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
                    &nbsp;<input
                        type="checkbox"
                        onChange={e => {this.setState({showGrandStave:e.target.checked});}}></input>
                        &nbsp;<label>Show Grand Stave</label>
                </div>

                <LessonsList selectedLesson={this.state.lesson} lessons={LESSONS}
                    onSelect={this.handleLessonChange.bind(this)} />

                <Stave
                    activeABC={this.state.activeABC}
                    activeAbcFill={this.nextExerciseAwaits ? "#30C72C" : "#3AC8DA"}
                    grandStave={this.state.lesson.grandStave || this.state.showGrandStave}
                    system={this.state.exercise.system}
                    renderABC={this.state.showStaveABC}/>

                <div>
                    <button style={{"width": "100px"}} onClick={this.nextExercise.bind(this)} >Skip</button>
                </div>

                <PianoKeyboard width={1600}
                    activeNotes={this.state.activeNotes}
                    playNote={bindLast(this.notes.handleKeyboard, this.notes, false)}
                    stopNote={bindLast(this.notes.handleKeyboard, this.notes, true)}
                />
            </div>
        )
    }
}
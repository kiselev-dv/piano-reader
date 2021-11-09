import React from 'react'

import PianoKeyboard from './PianoKeyboard';
import MidiSelector from './MidiSelector';
import LessonsList from './LessonsList';
import Stave from './Stave';

import { LESSONS } from '../lessons/lessons';

import NotesState from '../util/Notes';
import NotesMatcher from '../util/NotesMatcher';

function bindLast(fn, that, ...args) {
    return function(...callArgs) {
        fn.call(that, ...callArgs, ...args);
    }
}

function sampleArray(array, skip) {
    const result = array[Math.floor(Math.random() * array.length)];

    if (skip && array.length > 1 && result === skip) {
        return sampleArray(array, skip);
    }

    return result;
}

export default class Game extends React.Component {

    constructor(props) {
        super(props);
        this.notes = new NotesState();
        this.notes.stateChangeEvent.on(this.handleActiveNotes.bind(this));

        this.state = {
            activeNotes: [],
            activeABC: '',

            lesson: null,
            exercise: null,
            exercises: null,

            showStaveABC: false,
            showGrandStave: false
        };

        this.matcher = new NotesMatcher();

        this.matcher.matchEvent.on(this.handleMatch.bind(this));
        this.matcher.missEvent.on(this.handleMiss.bind(this));

        this.setExercises = this.setExercises.bind(this);
        this.nextExercise = this.nextExercise.bind(this);
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

    handleMatch() {
        if (!this.nextExerciseAwaits) {
            this.nextExerciseAwaits = true;
        }
    }

    handleMiss() {
    }

    setExercises(exercises) {
        this.nextExerciseAwaits = false;

        const exercise = sampleArray(exercises, this.state.exercise);
        this.setState({exercise, exercises});

        this.matcher.reset(exercise.system);
    }

    nextExercise() {
        this.nextExerciseAwaits = false;

        const exercise = sampleArray(this.state.exercises, this.state.exercise);

        this.setState({exercise});
        this.matcher.reset(exercise.system);
    }

    render() {
        return (
            <div id="game">
                <MidiSelector notes={ this.notes }/>
                <div>
                    &nbsp;<input
                        type="checkbox"
                        onChange={e => {this.setState({showStaveABC: e.target.checked});}}></input>
                    &nbsp;<label>Show stave ABC</label>
                    &nbsp;<input
                        type="checkbox"
                        onChange={e => {this.setState({showGrandStave: e.target.checked});}}></input>
                        &nbsp;<label>Show Grand Stave</label>
                    &nbsp;
                    <button
                        style={{"width": "100px"}}
                        onClick={this.nextExercise} >
                            Skip exercise
                    </button>
                </div>

                <LessonsList onExercisesUpdate={this.setExercises} />

                { this.state.exercise &&
                <Stave
                    activeABC={this.state.activeABC}
                    activeAbcFill={ "#30C72C" }
                    grandStave={(this.state.lesson && this.state.lesson.grandStave) || this.state.showGrandStave}
                    system={this.state.exercise.system}
                    renderABC={this.state.showStaveABC}/>
                }

                <PianoKeyboard width={1600}
                    activeNotes={this.state.activeNotes}
                    playNote={bindLast(this.notes.handleKeyboard, this.notes, false)}
                    stopNote={bindLast(this.notes.handleKeyboard, this.notes, true)}
                />
            </div>
        )
    }
}
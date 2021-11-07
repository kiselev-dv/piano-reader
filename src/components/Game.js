import React, { useEffect, useRef, useState } from 'react'

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

function sampleArray(array, except) {
    let result = array[Math.floor(Math.random() * array.length)];

    if (except && array.length > 1 && result === except) {
        return sampleArray(array, except);
    }

    return result;
}

const notes = new NotesState();
const matcher = new NotesMatcher();

let nextExerciseAwaits = false;

export default function Game() {
    const [activeNotes, setActiveNotes] = useState();
    const [activeABC, setActiveABC] = useState('');

    const _lesson = LESSONS[0];
    const _exercises = _lesson.createExercises();

    const [lesson, setLesson] = useState(_lesson);
    const [exercises, setExercises] = useState(_exercises);
    const [exercise, setExercise] = useState(sampleArray(_exercises));

    const [showStaveABC, setShowStaveABC] = useState(false);
    const [showGrandStave, setShowGrandStave] = useState(false);

    const hitRef = useRef(0);
    const missRef = useRef(0);

    useEffect(() => {
        matcher.reset(exercise.system);
    }, [exercise])

    useEffect(() => {
        notes.stateChangeEvent.on(handleActiveNotes);
        matcher.matchEvent.on(handleMatch);
        matcher.missEvent.on(handleMiss);
    }, []);

    function handleMidiConnect(input) {
        input.onmidimessage = notes.handleMidiMessage.bind(notes);
    }

    function handleActiveNotes(activeNotes) {
        matcher.setActiveNotes(activeNotes);

        const activeABC = matcher.activeNotesAsABC(activeNotes);

        setActiveNotes(activeNotes);
        setActiveABC(activeABC);

        if (activeNotes.length === 0 && nextExerciseAwaits) {
            nextExercise();
        }
    }

    function handleLessonChange(lesson) {

        const exercises = lesson.createExercises();
        const exercise = sampleArray(exercises, exercise);

        setLesson(lesson);
        setExercises(exercises);
        setExercise(exercise);

        matcher.reset(exercise.system);

        hitRef.current = 0;
        missRef.current = 0;
    }

    function handleMatch() {
        if (!nextExerciseAwaits) {
            hitRef.current ++;
            nextExerciseAwaits = true;
        }
    }

    function handleMiss() {
        if (!nextExerciseAwaits) {
            missRef.current ++;
        }
    }

    function nextExercise() {
        nextExerciseAwaits = false;
        const exercise = sampleArray(exercises);
        setExercise(exercise);
        matcher.reset(exercise.system);
    }

    return (
        <div id="game">
            <MidiSelector onConnect={handleMidiConnect}/>
            <div>
                Hit: {hitRef.current}, Miss: {missRef.current},
                &nbsp;<input
                    type="checkbox"
                    onChange={e => { setShowStaveABC(e.target.checked); }}></input>
                &nbsp;<label>Show stave ABC</label>
                &nbsp;<input
                    type="checkbox"
                    onChange={e => { setShowGrandStave(e.target.checked);}}></input>
                    &nbsp;<label>Show Grand Stave</label>
            </div>

            <LessonsList selectedLesson={lesson} lessons={ LESSONS }
                onSelect={handleLessonChange} />

            <Stave
                activeABC={activeABC}
                activeAbcFill={nextExerciseAwaits ? "#30C72C" : "#3AC8DA"}
                grandStave={(lesson && lesson.grandStave) || showGrandStave}
                system={exercise.system}
                renderABC={showStaveABC}/>

            <div>
                <button style={{"width": "100px"}} onClick={nextExercise} >Skip</button>
            </div>

            <PianoKeyboard width={1600}
                activeNotes={ activeNotes }
                playNote={bindLast(notes.handleKeyboard, notes, false)}
                stopNote={bindLast(notes.handleKeyboard, notes, true)}
            />
        </div>
    )
}

/*
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
*/

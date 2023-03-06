import React, { useCallback, useEffect, useRef, useState } from 'react'

import PianoKeyboard from './PianoKeyboard';
import MidiSelector from './MidiSelector';
import LessonsList from './LessonsList';
import Stave from './Stave';

import NotesState from '../util/Notes';
import NotesMatcher from '../util/NotesMatcher';
import useSingleton from '../hooks/useSingleton';
import useRefCallback from '../hooks/useRefCallback';

function sampleArray(array, skip) {
    const result = array[Math.floor(Math.random() * array.length)];

    if (skip && array.length > 1 && result === skip) {
        return sampleArray(array, skip);
    }

    return result;
}

export default function Game() {
    const notes = useSingleton(new NotesState());
    const matcher = useSingleton(new NotesMatcher());

    const [activeNotes, setActiveNotes] = useState([]);
    const [activeABC, setActiveABC] = useState();

    const [lesson, setLesson] = useState();
    const [exercise, setExercise] = useState();
    const [exercises, setExercises] = useState();

    const [showStaveABC, setShowStaveABC] = useState(false);
    const [showGrandStave, setShowGrandStave] = useState(false);

    const excerciseMatchedRef = useRef(false);
    const excerciseRef = useRef(exercise);

    const handleActiveNotes = useRefCallback(newNotes => {
        matcher.setActiveNotes(newNotes);
        const newActiveABC = matcher.activeNotesAsABC(newNotes);

        setActiveNotes(newNotes);
        setActiveABC(newActiveABC);
    });

    const handleExercisesUpdate = useCallback((exercises, lesson) => {
        excerciseMatchedRef.current = false;

        const newExercise = sampleArray(exercises, excerciseRef.current);
        setLesson(lesson);
        setExercises(exercises);
        setExercise(newExercise);

        matcher.reset(newExercise.system);
    }, [excerciseRef, matcher]);

    const nextExercise = useCallback(() => {
        excerciseMatchedRef.current = false;

        const newExercise = sampleArray(exercises, exercise);

        setExercise(newExercise);
        matcher.reset(newExercise.system);
    }, [exercises, exercise, matcher]);

    const handleMiss = useCallback(() => {

    }, []);

    const handleMatch = useCallback(() => {
        excerciseMatchedRef.current = true;
    }, [excerciseMatchedRef]);

    // Register events callback for non react components
    useEffect(() => {
        console.log('Register events');
        notes.stateChangeEvent.on(handleActiveNotes);
        matcher.matchEvent.on(handleMatch);
        matcher.missEvent.on(handleMiss);
    }, [notes.stateChangeEvent, matcher.matchEvent, matcher.missEvent, handleActiveNotes, handleMatch, handleMiss]);

    useEffect(() => {
        if( excerciseMatchedRef.current && activeNotes.length === 0) {
            nextExercise();
        }
    }, [activeNotes.length, nextExercise]);

    const handleScreenKeyboardNoteOn = useCallback(note => {
        notes.handleKeyboard(note, false);
    }, [ notes ]);

    const handleScreenKeyboardNoteOff = useCallback(note => {
        notes.handleKeyboard(note, true);
    }, [ notes ]);

    const activeABCFillColor = excerciseMatchedRef.current ? "#30C72C" : "#3AC8DA";

    return (
        <div id="game">
            <MidiSelector notes={ notes }/>
            <div>
                &nbsp;<input
                    type="checkbox"
                    onChange={e => {setShowStaveABC(e.target.checked);}}></input>
                &nbsp;<label>Show stave ABC</label>
                &nbsp;<input
                    type="checkbox"
                    onChange={e => {setShowGrandStave(e.target.checked);}}></input>
                    &nbsp;<label>Show Grand Stave</label>
                &nbsp;
                <button
                    style={{"width": "100px"}}
                    onClick={nextExercise} >
                        Skip exercise
                </button>
            </div>

            <LessonsList onExercisesUpdate={handleExercisesUpdate} />

            { exercise &&
            <Stave
                activeABC={activeABC}
                activeAbcFill={ activeABCFillColor }
                grandStave={(lesson && lesson.grandStave) || showGrandStave}
                system={exercise.system}
                debugABC={showStaveABC}/>
            }

            <PianoKeyboard width={1600}
                activeNotes={activeNotes}
                playNote={handleScreenKeyboardNoteOn}
                stopNote={handleScreenKeyboardNoteOff}
            />
        </div>
    )
}

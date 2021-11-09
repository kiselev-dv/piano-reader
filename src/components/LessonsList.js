import React, {  useEffect, useState } from 'react';
import { LESSONS } from '../lessons/lessons';

import './Lessons.css'

function LessonListItem({lesson, selected, onClick}) {
    return (
    <div className={`lesson ${selected ? "selected" : ""}`}
        onClick={() => {onClick(lesson)}}>

        <div className="wrapper">
            <h4>{lesson.heder}</h4>
            <div>{lesson.subtitle}</div>
        </div>
    </div>
    );
}

export default function LessonsList({ onExercisesUpdate }) {

    const [selectedLesson, setSelectedLesson] = useState(LESSONS[0]);

    useEffect(() => {
        onExercisesUpdate(selectedLesson.createExercises(), selectedLesson);
    }, [selectedLesson, onExercisesUpdate]);

    const $lessons = LESSONS.map((lesson, index) =>

        <LessonListItem key={index}
            lesson={lesson}
            selected={lesson === selectedLesson}
            onClick={() => { setSelectedLesson(lesson); }} />

    );

    return (
        <div className="lessons">
            {$lessons}
        </div>
    );
}

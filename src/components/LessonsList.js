import React, { useEffect, useState } from 'react';

import { LESSONS } from '../lessons/lessons';

import './Lessons.css'

/**
 * Lesson representation,
 * without any options
 */
function SimpleLessonListItem({selected, onChange, onClick, lesson}) {
    useEffect(() => {
        selected && onChange(lesson.exercises, lesson);
    }, [selected, lesson, lesson.exercises, onChange]);

    return (
    <div className={`lesson ${selected ? "selected" : ""}`} onClick={onClick}>
        <div className="wrapper">
            <h4>{lesson.heder}</h4>
            <div>{lesson.subtitle}</div>
        </div>
    </div>
    );
}

export default function LessonsList({ onExercisesUpdate }) {

    const [lessonKey, setLessonKey] = useState(LESSONS[0].key);

    return (
        <div className="lessons">
            {LESSONS.map(lesson =>
            <SimpleLessonListItem
                key={lesson.key}
                lesson={lesson}
                selected={lessonKey === lesson.key}
                onClick={() => {setLessonKey(lesson.key);}}
                onChange={onExercisesUpdate}
            />)
            }
        </div>
    );
}

import React from 'react';

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

export default function LessonsList({selectedLesson, lessons, onSelect}) {

    const $lessons = lessons.map((lesson, index) =>

        <LessonListItem key={index}
            lesson={lesson}
            selected={lesson === selectedLesson}
            onClick={() => {onSelect(lesson);}} />

    );

    return (
        <div className="lessons">
            {$lessons}
        </div>
    );
}

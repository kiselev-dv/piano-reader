import React from 'react';
import './Lessons.css'
import {generateOneClefClasses} from '../util/ClassesGenerator'

export default class Lessons extends React.Component {

    constructor(props) {
        super(props);

        this.lessons = [{
            heder: "Treble clef",
            subtitle: "(Only markers)",
            generator: generateOneClefClasses.bind(null, "C G c g c' C, G,")
        }, {
            heder: "Bass clef",
            subtitle: "(Only markers)",
            generator: generateOneClefClasses.bind(null, "C,, F,, C, F, C F c", 'bass')
        }];

        this.state = {
            lesson: null
        };

        this.renderLesson = this.renderLesson.bind(this);
    }

    handleClick(lesson) {
        this.setState({lesson});
        this.props.onSelect && this.props.onSelect(lesson);
    }

    renderLesson(lesson, index) {
        let className = 'lesson';
        if (this.state.lesson === lesson) {
            className += ' selected';
        }
        return (
            <div key={index} className={className}
                onClick={this.handleClick.bind(this, lesson)}>

                <div className="wrapper">
                    <h4>{lesson.heder}</h4>
                    <div>{lesson.subtitle}</div>
                </div>
            </div>
        );
    }

    renderLessons(lessons) {
        return lessons.map(this.renderLesson);
    }

    render() {
        return (
            <div className="lessons">
                {this.renderLessons(this.lessons)}
            </div>
        );
    }

}
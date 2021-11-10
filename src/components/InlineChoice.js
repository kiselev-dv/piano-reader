
import './InlineChoice.css'

export default function InlineChoice({ options, title, value, onChange}) {
    const $title = title ? <span>{title} </span> : null;

    const $options = Object.keys(options).map(key => {
        const className = `inline-choice-option ${key === value ? 'selected' : '' }`;
        return (
            <span className={className} key={key} onClick={() => {onChange(key);}}>{options[key]}</span>
        );
    });

    return(
        <div className="inline-choice">
            {$title}
            {$options}
        </div>
    );
}

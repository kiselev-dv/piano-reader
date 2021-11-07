import React from 'react';

class MidiSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: null,
            options: []
        };

        navigator.requestMIDIAccess().then(this.gainAccess.bind(this));
        this.handleChange = this.handleChange.bind(this);
        this.connect = this.connect.bind(this);
    }

    gainAccess(access) {
        this.setInputs(access.inputs);
        const self = this;
        access.onstatechange = function(e) {
            console.log(e.port.name, e.port.manufacturer, e.port.state);
            self.setInputs(access.inputs);
        };
    }

    setInputs(inputs) {
        this.inputs = inputs;

        const options = [];
        for (let input of inputs.values()) {
            options.push({
                key: input.id,
                value: input.id,
                text: input.name
            });
        }

        this.setState({options});
    }

    connect() {
        const input = this.getSelectedInput();
        this.props.onConnect && input && this.props.onConnect(input);
    }

    getSelectedInput() {
        for(let input of this.inputs.values()) {
            if(input.id === this.state.value) {
                return input;
            }
        }
        return null;
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    createSelectItems() {
        let items = [];
        this.state.options.forEach(opt => {
            items.push(<option key={opt.key} value={opt.value}>{opt.text}</option>);
        });
        return items;
    }

    render() {
        return (
            <div>
                <select defaultValue="label" onChange={this.handleChange}>
                    <option value="label" disabled>Select midi device</option>
                    {this.createSelectItems()}
                </select>
                <button onClick={this.connect}>Connect</button>
            </div>
        )
    }

}

export default MidiSelector;
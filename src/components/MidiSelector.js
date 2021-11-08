import React, { useCallback, useEffect, useState } from 'react';
import useLocalStorage from '../util/useLocalStorage';

function MidiSelector({ notes }) {
    const [inputs, setInputs] = useState();
    const [activeInput, setActiveInput] = useState();
    const [autoconnectInputIds] = useLocalStorage('autoconnect-midi-input-ids', []);

    useEffect(() => {
        navigator.requestMIDIAccess().then(access => {
            setInputs(access.inputs);

            access.onstatechange = (e) => {
                console.log(e.port.name, e.port.manufacturer, e.port.state);
                setInputs(access.inputs);
            };
        });
    }, []);

    useEffect(() => {
        if (activeInput && !inputs.has(activeInput.id)) {
            setActiveInput(null);
        }
    }, [inputs, activeInput]);

    useEffect(() => {
        if (!inputs) return;

        const auto = Array.from(inputs.values())
            .find(inp => autoconnectInputIds.includes(inp.id));

        auto && setActiveInput(auto);

    }, [inputs, autoconnectInputIds])

    const $inputs = Array.from(inputs ? inputs.values() : []).map(input =>
        <option key={input.id} value={input.id}>
            {input.name}
        </option>
    );

    const handleOptionSelect = useCallback((e) => {
        setActiveInput(inputs.get(e.target.value));
    }, [inputs]);

    useEffect(() => {
        if (!activeInput) return;

        activeInput.onmidimessage = notes.handleMidiMessage.bind(notes);

    }, [ activeInput, notes ]);

    return (
    <div>
        <select
            value={activeInput ? activeInput.id : 'label'}
            onChange={handleOptionSelect}>

            <option value="label" disabled>Select midi device</option>
            {$inputs}

        </select>
        &nbsp;
        <ActiveInputOptions activeInput={activeInput}></ActiveInputOptions>
    </div>
    );
}

function ActiveInputOptions({ activeInput }) {
    const [autoconnectInputIds, setAutoconnectInputIds] = useLocalStorage('autoconnect-midi-input-ids', []);
    const connected = activeInput && activeInput.onmidimessage;

    if (!activeInput) return null;

    function handleAutoconnectChange() {
        const autoconnect = !autoconnectInputIds.includes(activeInput.id);

        if (autoconnect) {
            if (autoconnectInputIds.includes(activeInput.id)) return;

            autoconnectInputIds.push(activeInput.id);
            setAutoconnectInputIds(autoconnectInputIds);
        }
        else {
            setAutoconnectInputIds(autoconnectInputIds.filter(id => id !== activeInput.id))
        }
    }

    return <span>
        <label className={connected ? 'connected' : ''}>connected</label>
        <label>
            &nbsp;
            autoconnect
            &nbsp;
            <input type="checkbox" checked={autoconnectInputIds.includes(activeInput.id)} onChange={handleAutoconnectChange} />
        </label>
    </span>
}

export default MidiSelector;
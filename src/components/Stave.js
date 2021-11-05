import React from 'react';
import Abcjs from 'react-abcjs';

import {activeNotesAsABC} from '../util/Notes'

function isDoubleVoices(voices) {
    return voices.some(v => v.clef === 'bass')
        && voices.some(v => (v.clef || 'treble') === 'treble' )
}

export default function(props) {

    let abc;
    let activeVoice;

    const {
        key,
        system
    } = props;

    let {clef, grandStave} = props;
    if (!clef && system.length === 1) {
        clef = system[0].clef || 'treble';
    }

    const bothClefs = isDoubleVoices(system);

    if (bothClefs) {
        grandStave = true;
    }

    const trebleVoice = system.find( v => (v.clef || clef) === 'treble' );
    const bassVoice = system.find( v => (v.clef || clef) === 'bass' );
    const voice = (trebleVoice || bassVoice);

    let activeAbc = props.activeABC || activeNotesAsABC(props.activeNotes);

    if (grandStave) {
        const activeTreble = clef === 'bass' ? '' : activeAbc;
        let trebleLine = trebleVoice ? trebleVoice.abc : '';
        if (trebleVoice && activeTreble) {
            trebleLine += '&';
            activeVoice = 1;
        }
        trebleLine += activeTreble;

        const activeBase = clef === 'bass' ? activeAbc : '';
        let bassLine = bassVoice ? bassVoice.abc : '';
        if (bassVoice && activeBase) {
            bassLine += '&';
            activeVoice = 2;
        }
        bassLine += activeBase;

        if (!activeAbc) {
            // Add empty overlay chord to have consistent placing
            // of elements, otherwise left padding changes,
            // when you have active notes
            bassLine += " & []"
        }

        abc = `
            K: ${key || ''} clef=${clef || 'treble'}
            L:1/4
            M:4/4
            %%staves {V1 V2}
            V: V1 clef=treble
            V: V2 clef=bass
            [V: V1]|| ${trebleLine}
            [V: V2]|| ${bassLine}
        `;
    }
    else {
        let line = voice ? voice.abc : '';
        if (line && activeAbc) {
            line += '&';
            activeVoice = 1;
        }
        line += activeAbc;

        if(!activeAbc) {
            line += ' & []';
        }

        abc = `
            K: ${key || ''} clef=${clef || 'treble'}
            L:1/4
            M:4/4
            || ${line}
        `;
    }

    const activeAbcFill = props.activeAbcFill || "#3AC8DA";

    return (
        <div className="stave-container">
            <style jsx="true">{`
                path.abcjs-note.abcjs-v${activeVoice} {
                    fill: ${activeAbcFill};
                }
            `}
            </style>
            <Abcjs
                abcNotation={abc}
                parserParams={{}}
                engraverParams={{ responsive: 'none', add_classes: true }}
                renderParams={{ viewportHorizontal: true }}
            />
            { props.renderABC && (<div style={{whiteSpace: 'pre'}}>{abc}</div>)}
        </div>
    )
}



export function abcMapper(opts) {
    return abc => {
        return {
            system: [{...opts, abc: abc}]
        }
    };
}

const TREBLE_CLEF_MARKERS = "C G c g c' G,";
const TREBLE_CLEF_SPACES = "G, B, D E F A c e g b";
const TREBLE_CLEF_LINES = "A, C E G B d f a c'";

const BASS_CLEF_MARKERS = "C,, F,, C, F, C F";
const BASS_CLEF_SPACES = "F,, A,, C, E, G, B, D";
const BASS_CLEF_LINES = "C,, E,, G,, B,, D, F, A, C E";

export function generateSingleNoteExercises(clef, subset) {
    let result = [];

    if (clef === "treble" || clef === "both") {
        if (subset === "markers" && subset !== "all") {
            result = result.concat(TREBLE_CLEF_MARKERS.split(' ').map(abcMapper({clef: 'treble'})));
        }

        if (subset === "spaces" || subset === "all") {
            result = result.concat(TREBLE_CLEF_SPACES.split(' ').map(abcMapper({clef: 'treble'})));
        }

        if (subset === "lines" || subset === "all") {
            result = result.concat(TREBLE_CLEF_LINES.split(' ').map(abcMapper({clef: 'treble'})));
        }
    }

    if (clef === "bass" || clef === "both") {
        if (subset === "markers" && subset !== "all") {
            result = result.concat(BASS_CLEF_MARKERS.split(' ').map(abcMapper({clef: 'bass'})));
        }

        if (subset === "spaces" || subset === "all") {
            result = result.concat(BASS_CLEF_SPACES.split(' ').map(abcMapper({clef: 'bass'})));
        }

        if (subset === "lines" || subset === "all") {
            result = result.concat(BASS_CLEF_LINES.split(' ').map(abcMapper({clef: 'bass'})));
        }
    }

    return result;
}

const LESSONS = [{
    key: "treble-markers",
    heder: "Markers",
    subtitle: "Treble clef",
    grandStave: false,
    exercises: TREBLE_CLEF_MARKERS.split(' ').map(abcMapper({clef: 'treble'}))
}, {
    key: "bass-markers",
    heder: "Markers",
    subtitle: "Bass clef",
    grandStave: false,
    exercises: BASS_CLEF_MARKERS.split(' ').map(abcMapper({clef: 'bass'}))
}, {
    key: "treble-spaces",
    heder: "Spaces",
    subtitle: "Treble clef",
    grandStave: false,
    exercises: TREBLE_CLEF_SPACES.split(' ').map(abcMapper({clef: 'treble'}))
}, {
    key: "bass-spaces",
    heder: "Spaces",
    subtitle: "Bass clef",
    grandStave: false,
    exercises: BASS_CLEF_SPACES.split(' ').map(abcMapper({clef: 'bass'}))
}, {
    key: "treble-lines",
    heder: "Lines",
    subtitle: "Treble clef",
    grandStave: false,
    exercises: TREBLE_CLEF_LINES.split(' ').map(abcMapper({clef: 'treble'}))
}, {
    key: "bass-lines",
    heder: "Lines",
    subtitle: "Bass clef",
    grandStave: false,
    exercises: BASS_CLEF_LINES.split(' ').map(abcMapper({clef: 'bass'}))
}, {
    key: "treble-all",
    heder: "Treble clef",
    subtitle: "All",
    grandStave: false,
    exercises: [
        ...TREBLE_CLEF_SPACES.split(' ').map(abcMapper({clef: 'treble'})),
        ...TREBLE_CLEF_LINES.split(' ').map(abcMapper({clef: 'treble'})), ]
}, {
    key: "bass-all",
    heder: "Bass clef",
    subtitle: "All",
    grandStave: false,
    exercises: [
        ...BASS_CLEF_SPACES.split(' ').map(abcMapper({clef: 'bass'})),
        ...BASS_CLEF_LINES.split(' ').map(abcMapper({clef: 'bass'})), ]
}, {
    key: "grand-stave",
    heder: "Grand Stave",
    subtitle: "All",
    grandStave: true,
    exercises: [
        ...TREBLE_CLEF_SPACES.split(' ').map(abcMapper({clef: 'treble'})),
        ...TREBLE_CLEF_LINES.split(' ').map(abcMapper({clef: 'treble'})),
        ...BASS_CLEF_SPACES.split(' ').map(abcMapper({clef: 'bass'})),
        ...BASS_CLEF_LINES.split(' ').map(abcMapper({clef: 'bass'})), ]
}, {
    key: "chords",
    heder: "Chords",
    subtitle: "",
    grandStave: false,
    exercises: ["[C E G]", "C E G", "[F A c]"].map(abcMapper({clef: 'treble'}))
}];

export { LESSONS }
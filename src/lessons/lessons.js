
function abcMapper(opts) {
    return abc => {
        return {
            system: [{...opts, abc: abc}]
        }
    };
}

const LESSONS = [{
    heder: "Treble clef",
    subtitle: "Markers (C G)",
    grandStave: false,
    createExercises: () => "C G c g c' G,".split(' ').map(abcMapper({clef: 'treble'}))
}, {
    heder: "Bass clef",
    subtitle: "Markers (C F)",
    grandStave: false,
    createExercises: () => "C,, F,, C, F, C F c".split(' ').map(abcMapper({clef: 'bass'}))
}, {
    heder: "Treble clef",
    subtitle: "Full",
    grandStave: false,
    createExercises: () => "G, A B C D E F G a b c d e f g'".split(' ').map(abcMapper({clef: 'treble'}))
}, {
    heder: "Chords",
    subtitle: "One Four Five",
    grandStave: false,
    createExercises: () => ["[C E G]", "C E G", "[F A c]"].map(abcMapper({clef: 'treble'}))
}];

export { LESSONS }
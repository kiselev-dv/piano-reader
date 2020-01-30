export function generateOneClefClasses(task, clef) {
    return task.split(' ').map(abc => {
        return {
            system: [{clef: clef || 'treble', abc: abc}]
        }
    });
}
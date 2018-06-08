function dateWithWeekday(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function round(num, scale) {
    // noinspection JSCheckFunctionSignatures
    return +(Math.round(num + "e+" + scale) + "e-" + scale);
}

function dateWithWeekday(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function weekDayNameShort(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function round(num, scale) {
    // noinspection JSCheckFunctionSignatures
    return +(Math.round(num + "e+" + scale) + "e-" + scale);
}

function capitalize(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}
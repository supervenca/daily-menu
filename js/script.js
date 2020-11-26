window.addEventListener('DOMContentLoaded', () => {
    const tabs = require('./modules/tabs'),
        modal = require('./modules/modal'),
        timer = require('./modules/timer'),
        calc = require('./modules/calc'),
        cards = require('./modules/cards'),
        slider = require('./modules/slider'),
        forms = require('./modules/forms');

    tabs();
    modal();
    timer();
    cards();
    calc();
    slider();
    forms();
});

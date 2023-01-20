// Create schuduler object
const scheduler = {
    currentDay: moment(),
};

// Capture HTML Elements using JQuery
let currentDayDisplay = $('#currentDay');

// Render Page
$(function () {
    currentDayDisplay.text(scheduler.currentDay.format('MMMM Do, YYYY'));
});
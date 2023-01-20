// Create schuduler object
const scheduler = {
    now: moment(),
    getCurrentDay (element, format) {
        element.text(this.now.format(format));
    },
    getDaysInMonth () {
        let currentMonthString = this.now.format().slice(0, 7);
        return moment(currentMonthString, "YYYY-MM").daysInMonth();
    },
    addToSchedule (element) {
        element.on('click', 'i', function () {
            const currentTime = $(this).parent().parent().children('p.hour').text();
            const textIn = $(this).parent().parent().children('textarea').val();

            if (JSON.parse(localStorage.getItem('items') === null)) {
                const items = {};
                items[currentTime] = textIn;
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                const items = JSON.parse(localStorage.getItem('items'));
                items[currentTime] = textIn;
                localStorage.setItem('items', JSON.stringify(items));
            }
        });

        // TODO: check input before storing

    },
    renderSchedule () {

        if (JSON.parse(localStorage.getItem('items') === null)) {
            console.log('No items in storage');
        } else {
            const items = JSON.parse(localStorage.getItem('items'));
            console.log(items);
            // TODO: build elements to render output
        }


    }
};

// Capture HTML Elements using JQuery
const currentDayDisplay = $('#currentDay');
const save = $('.description');



// Render Page
$(function () {
    scheduler.getCurrentDay(currentDayDisplay, 'MMMM Do, YYYY');
    scheduler.addToSchedule(save);
    scheduler.renderSchedule();
});
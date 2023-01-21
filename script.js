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
        // Event delegation
        element.on('click', 'i', function () {
            // Gets save button
            const currentTime = $(this).parent().parent().children('p.hour').text();
            // Gets textarea
            const textIn = $(this).parent().parent().children('textarea').val();

            // Check if items already in local storage

            if (JSON.parse(localStorage.getItem('items') === null)) {
                const items = {};
                // creates and object 
                for (let i = 0; i < 24; i++) {
                    let hour = moment().hour(0 + i).format('h A');
                    items[hour] = '';
                }
                // Add item to storage
                items[currentTime] = textIn.trim();
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // Get items from storage if already exist and adds new item
                const items = JSON.parse(localStorage.getItem('items'));
                items[currentTime] = textIn.trim();
                localStorage.setItem('items', JSON.stringify(items));
            }
        });

        // TODO: check input before storing

    },
    renderSchedule () {
        // If no data in local storage render blank schedule
        if (JSON.parse(localStorage.getItem('items') === null)) {
            this.createElements();
            let output = '';
            for (let i = 0; i < 3; i++) {
                let hour = moment().hour(0 + i).format('h A');

                // Create HTML elements
                output += `<div class="row">`;
                output += `<div class="col-12 d-flex description">`;
                output += `<p class="hour">${hour}</p>`;
                output += `<textarea type="text" class="past"></textarea>`;
                output += `<div class="saveBtn d-flex align-items-center justify-content-center">`;
                output += `<i class="fas fa-save" id="save-${i}"></i></div>`;
                output += `</div>`;
                output += `</div>`;

                $(output).appendTo(cont);
            }

        } else {
            // Render data from local storage
            const items = JSON.parse(localStorage.getItem('items'));

            let output = '';
            for (let i = 0; i < 24; i++) {

                // Set calendar color
                let hour = moment().hour(0 + i).format('h A');
                let currentHour = moment().hour();
                let calendarHour = Number(moment().hour(0 + i).format('H'));
                let hourColor = '';

                if (currentHour === calendarHour) {
                    hourColor = 'present';
                } else if (currentHour > calendarHour) {
                    hourColor = 'past';
                } else {
                    hourColor = 'future';
                }

                // Create HTML elements
                output += `<div class="row">`;
                output += `<div class="col-12 d-flex description">`;
                output += `<p class="hour">${hour}</p>`;
                output += `<textarea type="text" class="${hourColor}">${items[hour]}</textarea>`;
                output += `<div class="saveBtn d-flex align-items-center justify-content-center">`;
                output += `<i class="fas fa-save" id="save-${i}"></i></div>`;
                output += `</div>`;
                output += `</div>`;

            }

            $(output).appendTo(cont);
        }
    }
};

// Capture HTML Elements using JQuery
const currentDayDisplay = $('#currentDay');
const save = $('.calendar');
const cont = $('.container');



// Render Page
$(function () {
    scheduler.getCurrentDay(currentDayDisplay, 'MMMM Do, YYYY');
    scheduler.renderSchedule();
    scheduler.addToSchedule(save);
});

// let t1 = moment().hour();
// let t2 = moment().hour(13).format('H');
// console.log(t1, Number(t2));
// console.log(t1 > t2);


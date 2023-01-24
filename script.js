// Create schuduler object
const scheduler = {
    now: moment(),
    startOfDay: 9,
    hoursInDay: 17,
    getCurrentDay (element, format) {
        element.text(this.now.format(format));
    },
    getDaysInMonth () {
        let currentMonthString = this.now.format().slice(0, 7);
        return moment(currentMonthString, "YYYY-MM").daysInMonth();
    },
    removeFromStorage (name) {
        localStorage.removeItem(name);
    },
    getFromLocalStorage (name) {
        return JSON.parse(localStorage.getItem(name));
    },
    saveStartOfDay (st = 9, hrs = 17) {
        localStorage.setItem('startOfDay', JSON.stringify({ start: st, hours: hrs }));
    },
    addToSchedule (element) {
        // Event delegation
        element.on('click', 'i', function () {
            // Gets current time
            const currentTime = $(this).parent().parent().children('p.hour').text();
            // Gets textarea value
            const textIn = $(this).parent().parent().children('textarea').val();
            // Gets data from storage        
            const items = JSON.parse(localStorage.getItem('items'));

            // Adds new item to storage
            items[currentTime] = textIn.trim();
            localStorage.setItem('items', JSON.stringify(items));

            // Save feedback
            $(this).attr('class', 'check fa fa-check');
            setTimeout(() => {
                $(this).attr('class', 'fas fa-save');
            }, 2000);
        });
    },

    colorCalender (offset) {
        let currentHour = moment().hour();
        let calendarHour = Number(moment().hour(0 + offset).format('H'));

        if (currentHour === calendarHour) {
            return 'present';
        }
        else if (currentHour > calendarHour) {
            return 'past';
        } else {
            return 'future';
        }
    },
    createElements () {
        const items = JSON.parse(localStorage.getItem('items'));
        const startOfDay = this.startOfDay;
        const hoursInDay = this.hoursInDay + 1;

        let output = '';
        for (let i = startOfDay; i < hoursInDay; i++) {
            let hour = moment().hour(0 + i).format('h A');
            // Call method to add color to Calendar
            let hourColor = this.colorCalender(i);
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
        $(output).appendTo(calendarDiv);
    },
    renderSchedule () {

        // Save start of day to local storage
        let startDayItems = this.getFromLocalStorage('startOfDay');

        if (startDayItems === null) {
            this.saveStartOfDay();
        } else {
            this.startOfDay = startDayItems.start;
            this.hoursInDay = startDayItems.hours;
        }

        // If no data in local storage render blank schedule
        let calendarItems = this.getFromLocalStorage('items');
        if (JSON.parse(calendarItems === null)) {
            const items = {};
            // creates an object 
            for (let i = 0; i < 24; i++) {
                let hour = moment().hour(0 + i).format('h A');
                items[hour] = '';
            }
            // Add item to storage
            localStorage.setItem('items', JSON.stringify(items));

            // render elements from local storage
            this.createElements();

        } else {
            // Render elements from local storage
            this.createElements();
        };



    }
};


// HTML Elements
const currentDayDisplay = $('#currentDay');
const save = $('.calendar');
const calendarDiv = $('.calendar');



// Render Page
$(function () {
    scheduler.getCurrentDay(currentDayDisplay, 'MMMM Do, YYYY');
    scheduler.renderSchedule();
    scheduler.addToSchedule(save);



    const items = {};
    // creates an object 
    for (let i = 0; i < 24; i++) {
        let hour = moment().hour(0 + i).format('h A');
        items[hour] = '';
    }
    startTimes = Object.keys(items);

    startTimes.forEach(hour => {
        let option = $('<option>');
        option.attr('value', hour);
        option.text(hour);
        $(option).appendTo($('#startOfDay'));

    });

    startTimes.filter(hour => {
        if (startTimes.indexOf(hour) > 0) {
            let option = $('<option>');
            option.attr('value', startTimes.indexOf(hour));
            option.text(startTimes.indexOf(hour));
            $(option).appendTo($('#hoursInDay'));
        }

    });


    $('#startOfDay').on('mouseleave', function () {
        let selectedTime = $(this).val();
        let startHour = startTimes.indexOf(selectedTime);
        let hoursRemaining = 23 - startHour + 1;

        $('#hoursInDay').html('');

        for (let i = 1; i < hoursRemaining + 1; i++) {
            if (i === 24) {
                break;
            } else {
                let option = $('<option>');
                option.attr('value', i);
                option.text(i);
                $(option).appendTo($('#hoursInDay'));
            }
        };

    });

    $('form').on('submit', function (event) {
        event.preventDefault();
        let st = startTimes.indexOf($('#startOfDay').val());
        let hrs = Number($('#hoursInDay').val()) + Number(st);
        scheduler.saveStartOfDay(st, hrs);
        location.reload();
    });

    $('#clearSchedule').on('click', function () {
        scheduler.removeFromStorage('items');
        scheduler.removeFromStorage('startOfDay');
        location.reload();
    });


});
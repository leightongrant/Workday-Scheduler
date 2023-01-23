// Create schuduler object
const scheduler = {
    now: moment(),
    startOfDay: 9,
    endOfDay: 17,
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
        const endOfDay = this.endOfDay + 1;

        let output = '';
        for (let i = startOfDay; i < endOfDay; i++) {
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
        // If no data in local storage render blank schedule
        if (JSON.parse(localStorage.getItem('items') === null)) {
            const items = {};
            // creates and object 
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
});


Object.keys(JSON.parse(localStorage.getItem('items'))).forEach(element => {
    let option = $('<option>');
    option.attr('value', element);
    option.text(element);
    $(option).appendTo($('#startOfDay'));
});

$('#startOfDay').on('mouseup', function () {

    let times = Object.keys(JSON.parse(localStorage.getItem('items')));
    let ndx = times.indexOf($(this).val());

    for (let i = ndx; i < times.length; i++) {
        let option = $('<option>');
        option.attr('value', times[i]);
        option.text(times[i]);
        $(option).appendTo($('#endOfDay'));
    }

});

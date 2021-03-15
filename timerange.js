const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

let clinicOpeningHour = 
{
    "1" : [
        {
            "start_time": "10:00 AM",
            "end_time": "02:00 PM"
        },
        {
            "start_time": "04:00 PM",
            "end_time": "08:00 PM"
        }
    ],
    "2" : [
        {
            "start_time": "09:00 AM",
            "end_time": "12:00 PM"
        },
        {
            "start_time": "03:00 PM",
            "end_time": "07:00 PM"
        }
    ]
}




// get sessions in weekday
  var now = new Date();

const opening_hour = clinicOpeningHour[now.getDay()]

const testing = moment(now)

const matched = opening_hour.some( function(timeObj) {
    const start_time = moment(timeObj["start_time"], 'HH:mm a')
    const end_time = moment(timeObj["end_time"], 'HH:mm a')
    const range = moment.range(start_time, end_time)
    return range.contains(testing)
})


console.log(matched)



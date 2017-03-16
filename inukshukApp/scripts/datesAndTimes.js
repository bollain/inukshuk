// Array of months as strings
var monthArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Convert a month index to a month name
export function toMonth(index, isShort) {
  return (isShort ? monthArray[index].substring(0,3) : monthArray[index]);
}

// Array of weekdays as strings
var weekdayArray = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Convert a day index to a weekday name
export function toWeekday(index, isShort) {
  return (isShort ? weekdayArray[index].substring(0,3) : weekdayArray[index]);
}

// Format time with zeros where needed
export function padTime(num) {
  return "00".substring(0, 2 - num.toString().length) + num.toString();
}

// Return array of hours and minutes given a string formatted AM/PM time
export function toTwentyFour(time) {
  var hours = Number(time.match(/^(\d+)/)[1]);
  var minutes = Number(time.match(/:(\d+)/)[1]);
  var AMPM = time.match(/\s(.*)$/)[1];
  if(AMPM == "PM" && hours<12) hours = hours+12;
  if(AMPM == "AM" && hours==12) hours = hours-12;
  return [hours, minutes];
}

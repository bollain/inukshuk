/**
 * Created by paul on 29/03/17.
 */
var tripEnd = "Reminder to end your trip if you have finished. Your emergency contact will be contacted in 30 minutes unless you end your trip.";
// var changed = "Your changes to the trip have been successfully made.";
// var canceled = "Your trip has been ended or canceled and your emergency contact has been sent an appropriate notification.";
// var createdTrip = "Inukshuk will send you a notification 30 minutes before the entered end time of your trip";

//creates a notification using the trip id and the trip return time
export function createNotification(id, date, message) {
    console.log(date);
    let newDate = new Date(Date.parse(date) - (30 * 60000)); // 30 minutes before end
    console.log(newDate);
    return({
        id: id,
        message: message, // (required)
        date: newDate,
        autoCancel: false,
    });
}

//cancels the notification and lets the user know that has happened
export function cancelNotification(id) {
    return id;
}

//deletes the old notification, creates a new notification using the new end time
export function modifyNotification(id, date) {
    cancelNotification(id);
    return createNotification(id, date, tripEnd);
}

//creates the notification for trip ending in 30 minutes and an immediate notification sayin it did that
export function createEndOfTripNotification(id, date) {
    return createNotification(id, date, tripEnd);
}

//creates basically immediate notifications
export function immediateNotification(message) {
    var date = new Date(Date.now() + (5 * 1000));
    return({
        message: message,
        date: date,
        autoCancel: false,
    });
}
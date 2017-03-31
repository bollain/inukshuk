var PushNotification = require('react-native-push-notification');
var tripEnd = "Reminder to end your trip if you have finished. Your emergency contact will be contacted in 30 minutes unless you end your trip.";
// var changed = "Your changes to the trip have been successfully made.";
// var canceled = "Your trip has been ended or canceled and your emergency contact has been sent an appropriate notification.";
// var createdTrip = "Inukshuk will send you a notification 30 minutes before the entered end time of your trip";

//creates a notification using the trip id and the trip return time
export function createNotification(id, date, message) {
    console.log(date);
    let newDate = new Date(date - (30 * 60000)); // 30 minutes before end
    console.log(newDate);
    PushNotification.localNotificationSchedule({
        id: id.toString(),
        message: message, // (required)
        userInfo: {
          id: id.toString(),
        },
        date: newDate,
        autoCancel: false,
    });
}

//cancels the notification and lets the user know that has happened
export function cancelNotification(id) {
    PushNotification.cancelLocalNotifications({id: id.toString()});
}

//deletes the old notification, creates a new notification using the new end time
export function modifyNotification(id, date) {
    cancelNotification(id);
    createNotification(id, date, tripEnd);
}

//creates the notification for trip ending in 30 minutes and an immediate notification sayin it did that
export function createEndOfTripNotification(id, date) {
    createNotification(id, date, tripEnd);
}

//creates basically immediate notifications
export function immediateNotification(message) {
    var date = new Date(Date.now() + (5 * 1000));
    PushNotification.localNotificationSchedule({
        message: message,
        date: date,
        autoCancel: false,
    });
}

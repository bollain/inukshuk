'use strict'

var twilioClient = require('../utils/twilioClient');
var scheduler = require('node-schedule')


module.exports.createSMSAlert = function(alertId, phoneNumber, triggerTime){
  //var testNumber = '+17785583029';
  var message = "Your friend is in the woods";
  console.log(alertId, phoneNumber, triggerTime)
  var papa = new Date(2017, 2, 2, 15, 0, 0);
  console.log(triggerTime)
  console.log(papa)
  console.log("Schedulign text")
  var job = scheduler.scheduleJob(alertId, papa, function(){
    console.log("Triggering!")
    twilioClient.sendSms(phoneNumber, message)
  });
};

module.exports.cancelAlert = function(alertId){
  var alert = scheduler.scheduledJobs[alertId];
  alert.cancel();
}

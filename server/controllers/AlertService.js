'use strict'

var twilioClient = require('../utils/twilioClient')
var scheduler = require('node-schedule')

module.exports.createSMSAlert = function (alertId, phoneNumber, triggerTime) {
  // var testNumber = '+17785583029';
  var message = 'Your friend is in the woods'
  console.log(alertId, phoneNumber, triggerTime)
  console.log('Scheduling text')
  var job = scheduler.scheduleJob(alertId, triggerTime, function () {
    console.log('Triggering!')
    twilioClient.sendSms(phoneNumber, message)
  })
  if (!job) {
    console.log('Job was not created!!')
  }
}

module.exports.cancelAlert = function (alertId) {
  var alert = scheduler.scheduledJobs[alertId]
  // if alert is null there was nothing scheduled
  if (alert) {
    console.log('The sms was cancelled')
    alert.cancel()
  }
}

module.exports.sendReturnedSafeSMS = function (phoneNumber) {
  var safeMessage = 'Your friend has checked in back from his hike!'
  twilioClient.sendSms(phoneNumber, safeMessage)
}

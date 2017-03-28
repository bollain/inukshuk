'use strict'

var twilioClient = require('../utils/twilioClient')
var scheduler = require('node-schedule')
var nodemailer = require('nodemailer')
var config = require('config')
var staticmap = require('../utils/staticmap')
var Trip = require('../models/Trip')
var Messages = require('../resources/messages')
var GoogleURL = require('google-url')
var googleUrl = new GoogleURL({key: config.GOOGLE_API_TOKEN})

var transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 587,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PWD
  }
})

module.exports.confirmEmergencyContactSMS = function (trip, user) {
  var messageForContact = 'You have been chosen as an emergency contact for ' +
                          user.firstName + ', who is going on a hike. 🏃 ' +
                          'They are planning to return at ' + trip.returnTime + ' We\'ll let you know ' +
                          'when they return'
  twilioClient.sendSms(trip.contactPhone, messageForContact)
}

module.exports.confirmAlertsWithUser = function (user) {
  var messageForUser = 'We have sent a message to your emergency contact letting them know ' +
                      'you are going on a hike. Have fun!😀'
  twilioClient.sendSms(user.phoneNumber, messageForUser)
}

module.exports.confirmEmergencyContactEmail = function (trip, user) {
  // setup email data with unicode symbols
  var mailOptions = Messages.generateConfirmContactEmail(trip, user)

// send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
  })
}

module.exports.createSMSAlert = function (alertId, phoneNumber, triggerTime, tripID) {
  console.log('Scheduling text')
  var job = scheduler.scheduleJob(alertId, triggerTime, function () {
    console.log('Triggering!')
    Trip.findById(tripID, (err, trip) => {
      if (err) { console.log(err) }
      // Grab the crumbs
      var longAssURL = staticmap.generateStaticMapURL(trip)
      // Shorten the URL
      googleUrl.shorten(longAssURL, (err, shortMapURL) => {
        if (err) {
          console.log(err)
        }
        var message = Messages.generateEmergencyText(shortMapURL)
        // Format the text message and off it goes
        twilioClient.sendSms(phoneNumber, message)
      })
    })
  })
  if (!job) {
    console.log('Job was not created!!')
  }
}

module.exports.createEmailAlert = function (alertId, emailAddress, triggerTime, tripID) {
  console.log('Scheduling email')
  var emailJob = scheduler.scheduleJob(alertId, triggerTime, function () {
    console.log('Triggering email')
    Trip.findById(tripID, (err, trip) => {
      if (err) { console.log(err) }
      // Grab the crumbs
      var longAssURL = staticmap.generateStaticMapURL(trip)
      // Shorten that URL
      googleUrl.shorten(longAssURL, function (err, shortMapURL) {
        if (err) {
          console.log(err)
        }
        // Format your email and send it off.
        var mailOptions = Messages.generateEmergencyEmail(shortMapURL, emailAddress)
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error)
          }
          console.log('Message %s sent: %s', info.messageId, info.response)
        })
      })
    })
  })
  if (!emailJob) {
    console.log('Email alert not created!')
  }
}

module.exports.sendCancelSMS = function (phoneNumber) {
  var cancelMessage = 'Your friend has canceled the hike! 😢'
  twilioClient.sendSms(phoneNumber, cancelMessage)
}

module.exports.sendCancelEmail = function (emailAddress) {
  // setup email data with unicode symbols
  var mailOptions = Messages.generateCancelEmail(emailAddress)
// send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
  })
}

module.exports.cancelAlert = function (alertId) {
  var alert = scheduler.scheduledJobs[alertId]
  // if alert is null there was nothing scheduled
  if (alert) {
    console.log('The alert was cancelled')
    alert.cancel()
  }
}

module.exports.sendReturnedSafeSMS = function (phoneNumber) {
  var safeMessage = 'Your friend has checked in back from the hike!'
  twilioClient.sendSms(phoneNumber, safeMessage)
}

module.exports.updateEmergencyContactSMS = function (trip) {
  var message = 'We just wanted to let you know your friend has extended' +
                    ' their trip. Their new return time is ' + trip.returnTime
  twilioClient.sendSms(trip.contactPhone, message)
}

module.exports.updateEmergencyContactEmail = function (trip) {
  var mailOptions = Messages.generateUpdateContactEmail(trip)
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
  })
}

module.exports.sendReturnedSafeEmail = function (emailAddress) {
  // setup email data with unicode symbols
  var mailOptions = Messages.generateReturnedSafeEmail(emailAddress)
// send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
  })
}

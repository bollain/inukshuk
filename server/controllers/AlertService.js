'use strict'

var twilioClient = require('../utils/twilioClient')
var scheduler = require('node-schedule')
var nodemailer = require('nodemailer')
var config = require('config')

var transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 587,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PWD
  }
})

module.exports.confirmEmergencyContactSMS = function (contactPhone, user) {
  var messageForContact = 'You have been chosen as an emergency contact for ' +
                          user.firstName + ', who is going on a hike. 🏃 We\'ll let you know ' +
                          'when they return'
  var messageForUser = 'We have sent a message to your emergency contact letting them know ' +
                      'you are going on a hike. Have fun!😀'
  twilioClient.sendSms(contactPhone, messageForContact)
  twilioClient.sendSms(user.phoneNumber, messageForUser)
}

module.exports.createSMSAlert = function (alertId, phoneNumber, triggerTime) {
  // var testNumber = '+17785583029';
  var message = 'Your friend is in the woods'
  console.log('Scheduling text')
  var job = scheduler.scheduleJob(alertId, triggerTime, function () {
    console.log('Triggering!')
    twilioClient.sendSms(phoneNumber, message)
  })
  if (!job) {
    console.log('Job was not created!!')
  }
}

module.exports.createEmailAlert = function (alertId, emailAddress, triggerTime) {
  var mailOptions = {
    from: '"Inukshuk 👻" <inukshuk@inukshuk.me>', // sender address
    to: emailAddress, // list of receivers
    subject: '❌ Your friend has not checked-in from their hike ❌', // Subject line
    text: 'We just wanted to let you know your friend has ' +
    'not checked-in from their hike. Please try and reach out to them. If you \n' +
    'are unable to reach them, consider contacting Search and Rescue',
    html: '<b>Hello,</b>' +
          '<p>We just wanted to let you know your friend has ' +
          'not checked-in from their hike. Please try and reach out to them. If you' +
          ' are unable to reach them, consider contacting Search and Rescue.</p>' +
          '<b>Thanks for being the emergency contact!</b>'

  }
  console.log('Scheduling email')
  var emailJob = scheduler.scheduleJob(alertId, triggerTime, function () {
    console.log('Triggering email')
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message %s sent: %s', info.messageId, info.response)
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
  var mailOptions = {
    from: '"Inukshuk 👻" <inukshuk@inukshuk.me>', // sender address
    to: emailAddress, // list of receivers
    subject: 'Your friend has canceled their hike 😢', // Subject line
    text: 'We just wanted to let you know your friend has ' +
    'canceled the hike!\n' +
    'Thanks for being the emergency contact!', // plain text body
    html: '<b>Hello,</b>' +
          '<p>We just wanted to let you know your friend has ' +
          'canceled the hike!</p>' +
          '<b>Thanks for being the emergency contact!</b>'
  }

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
  var safeMessage = 'Your friend has checked in back from his hike!'
  twilioClient.sendSms(phoneNumber, safeMessage)
}

module.exports.sendReturnedSafeEmail = function (emailAddress) {
  // setup email data with unicode symbols
  var mailOptions = {
    from: '"Inukshuk 👻" <inukshuk@inukshuk.me>', // sender address
    to: emailAddress, // list of receivers
    subject: 'Your friend has completed their hike ✅', // Subject line
    text: 'We just wanted to let you know your friend has ' +
    'returned safely from the hike!\n' +
    'Thanks for being the emergency contact!', // plain text body
    html: '<b>Hello,</b>' +
          '<p>We just wanted to let you know your friend has ' +
          'returned safely from the hike!</p>' +
          '<b>Thanks for being the emergency contact!</b>'
  }

// send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
  })
}

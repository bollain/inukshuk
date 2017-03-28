'use strict'

var twilioClient = require('../utils/twilioClient')
var scheduler = require('node-schedule')
var nodemailer = require('nodemailer')
var config = require('config')
var staticmap = require('../utils/staticmap')
var Trip = require('../models/Trip')
var GoogleURL = require('google-url')
var googleUrl = new GoogleURL({key: 'AIzaSyBZJqGZTs5u6r9Nxt4_hx8oQQcUUwZIrXc'})

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
  var mailOptions = {
    from: '"Inukshuk 👻" <inukshuk@inukshuk.me>', // sender address
    to: trip.contactEmail, // list of receivers
    subject: 'You are the chosen one! 👏', // Subject line
    text: 'You have been chosen as an emergency contact for ' +
          user.firstName + ', who is going on a hike. 🏃 ' +
          'They are planning to return at ' + trip.returnTime + ' We\'ll let you know ' +
          'when they return', // plain text body
    html: '<b>Hello,</b>' +
          '<p>You have been chosen as an emergency contact for ' +
          user.firstName + ', who is going on a hike. 🏃 </p>' +
          '<p>They are planning to return at ' + trip.returnTime + '. We\'ll let you know ' +
          'when they return.</p>'
  }

// send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
  })
}

module.exports.createSMSAlert = function (alertId, phoneNumber, triggerTime) {
  // var testNumber = '+17785583029';
  var message = 'Your friend has not checked in from the hike! Please try and contact' +
                ' them. If you can\'t consider reaching out to search and rescue.'
  console.log('Scheduling text')
  var job = scheduler.scheduleJob(alertId, triggerTime, function () {
    console.log('Triggering!')
    twilioClient.sendSms(phoneNumber, message)
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
      var longAssURL = staticmap.generateStaticMapURL(trip.breadCrumbs)
      //Shorten that URL
      googleUrl.shorten(longAssURL, function (err, shortMapURL) {
        if (err) {
          console.log(err)
        }
        //Format your email and send it off.
        var mailOptions = generateEmergencyEmail(shortMapURL, emailAddress)
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
  var safeMessage = 'Your friend has checked in back from the hike!'
  twilioClient.sendSms(phoneNumber, safeMessage)
}

module.exports.updateEmergencyContactSMS = function (trip) {
  var message = 'We just wanted to let you know your friend has extended' +
                    ' their trip. Their new return time is ' + trip.returnTime
  twilioClient.sendSms(trip.contactPhone, message)
}

module.exports.updateEmergencyContactEmail = function (trip) {
  var mailOptions = {
    from: '"Inukshuk 👻" <inukshuk@inukshuk.me>', // sender address
    to: trip.contactEmail,
    subject: 'Your friend has extended their hike 💪', // Subject line
    text: 'We just wanted to let you know your friend has ' +
    'extended their hike\n' +
    'Their new return time is: ' + trip.returnTime, // plain text body
    html: '<b>Hello,</b>' +
          '<p>We just wanted to let you know your friend has ' +
            'extended their hike.</p>\n' +
            '<p>Their new return time is: ' + trip.returnTime + '</p>' // html  body
  }

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

// Generate Did not return email with map link
var generateEmergencyEmail = function (staticURL, emailAddress) {
  var message = {
    from: '"Inukshuk 👻" <inukshuk@inukshuk.me>', // sender address
    to: emailAddress, // list of receivers
    subject: '❌ Your friend has not checked-in from their hike ❌', // Subject line
    text: 'We just wanted to let you know your friend has ' +
  'not checked-in from their hike. Please try and reach out to them. If you \n' +
  'are unable to reach them, consider contacting Search and Rescue\n' +
  'Here is a map of their last know locations ' + staticURL,
    html: '<b>Hello,</b>' +
        '<p>We just wanted to let you know your friend has ' +
        'not checked-in from their hike. Please try and reach out to them. If you' +
        ' are unable to reach them, consider contacting Search and Rescue.</p>' +
        '<p>Here is a map of their last know locations ' + staticURL + '</p>' +
        '<b>Thanks for being the emergency contact!</b>'

  }
  return message
}

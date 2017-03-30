'use-strict'

module.exports.generateEmergencyEmail = function (staticURL, emailAddress) {
  var email = {
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
        '<p>Here is a map of their last know locations: ' + staticURL + '</p>' +
        '<b>Thanks for being the emergency contact!</b>'

  }
  return email
}

module.exports.generateCancelEmail = function (emailAddress) {
  var email = {
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
  return email
}

module.exports.generateConfirmContactEmail = function (trip, user, mapURL) {
  var email = {
    from: '"Inukshuk 👻" <inukshuk@inukshuk.me>', // sender address
    to: trip.contactEmail, // list of receivers
    subject: 'You are the chosen one! 👏', // Subject line
    text: 'You have been chosen as an emergency contact for ' +
          user.firstName + ' ' + user.lastName + ', who is going on a hike. 🏃 ' +
          'They are planning to return at ' + trip.returnTime + '. ' +
          'This map shows their planned start and end: ' + mapURL +
          'They also have sent this note to you: ' + trip.note + '\n' +
          'We\'ll let you know when they return', // plain text body
    html: '<b>Hello,</b>' +
          '<p>You have been chosen as an emergency contact for ' +
          user.firstName + ' ' + user.lastName + ', who is going on a hike. 🏃 </p>' +
          '<p>They are planning to return at ' + trip.returnTime + '. ' +
          'This map shows their planned start and end: ' + mapURL +
          ' They also have sent this note to you: ' + trip.note + '</p>' +
          '<p>We\'ll let you know when they return.</p>'
  }
  return email
}

module.exports.generateUpdateContactEmail = function (trip) {
  var email = {
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
  return email
}

module.exports.generateReturnedSafeEmail = function (emailAddress) {
  var email = {
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
  return email
}

module.exports.generateEmergencyText = function (staticURL) {
  var message = 'Your friend has not checked in from the hike! Please try and contact' +
                ' them. If you can\'t consider reaching out to search and rescue. ' +
                'Here is a map of their last known locations: ' + staticURL
  return message
}

module.exports.generateConfirmContactSMS = function (trip, user, mapURL) {
  var messageForContact = 'You have been chosen as an emergency contact for ' +
                          user.firstName + ' ' + user.lastName + ', who is going on a hike. 🏃 ' +
                          'They are planning to return at ' + trip.returnTime +
                          'This map shows their planned start and end: ' + mapURL +
                          ' They also have sent this note to you: ' + trip.note +
                          ' We\'ll let you know when they return'
  return messageForContact
}

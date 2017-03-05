var config = require('config')
var client = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)

module.exports.sendSms = function (to, message) {
  client.messages.create({
    body: message,
    to: to,
    from: config.TWILIO_NUMBER
  }, function (err, data) {
    if (err) {
      console.error('Could not notify ')
      console.error(err)
    } else {
      console.log('message sent')
    }
  })
}

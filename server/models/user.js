var mongoose = require('mongoose')
var Schema = mongoose.Schema
var autoIncrement = require('mongoose-auto-increment')
var findOrCreate = require('mongoose-findorcreate')
var validator = require('validator')

var connection = mongoose.createConnection('mongodb://localhost/inukshukdatabase')

// This is to make IDs start at 0 and increment
// when new user created...good for MVP but perhaps good
// idea to revert to original IDs if we go to prod
autoIncrement.initialize(connection)

var LOCALE = 'en-CA'
// Helper to validate phones
var validatePhone = function (phoneNumber) {
  return validator.isMobilePhone(phoneNumber, LOCALE)
}

var userSchema = new Schema({
  userName: {type: String, required: true, unique: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'Please fill a valid email address']
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: [validatePhone, 'Bad phone']
  },
  trips: [{
    type: Number,
    ref: 'Trip'
  }],
  created_at: Date,
  updated_at: Date
})

userSchema.methods.removeTrip = function (tripId) {
  var index = this.trips.indexOf(tripId)
  this.trips.splice(index, 1)
}

// Add any user methods here!

userSchema.pre('save', function (next) {
  // Get the current Date
  var currentDate = new Date()

  // Changed the updated_at field
  this.updated_at = currentDate

  // if created_at doesnt exist, start it!
  if (!this.created_at) {
    this.created_at = currentDate
  }

  next()
})

userSchema.plugin(autoIncrement.plugin, 'User')
userSchema.plugin(findOrCreate)
var User = mongoose.model('User', userSchema)
module.exports = User

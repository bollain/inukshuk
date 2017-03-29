var mongoose = require('mongoose')
var Schema = mongoose.Schema
var autoIncrement = require('mongoose-auto-increment')
var findOrCreate = require('mongoose-findorcreate')
var validator = require('validator')
var config = require('config')
var bcrypt = require('bcrypt-nodejs')

var connection = mongoose.createConnection(config.DBHost)

// This is to make IDs start at 0 and increment
// when new user created...good for MVP but perhaps good
// idea to revert to original IDs if we go to prod
autoIncrement.initialize(connection)

var LOCALE = 'en-CA'
// Helper to validate phones
var validatePhone = function (phoneNumber) {
  return validator.isMobilePhone(phoneNumber, LOCALE)
}

var validateEmail = function (email) {
  return validator.isEmail(email)
}

var userSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  password: {type: String, required: true},
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validateEmail, 'Please fill a valid email address']
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

userSchema.methods.comparePassword = function(pw, cb) {
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

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

  var user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err)
        }
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

userSchema.plugin(autoIncrement.plugin, 'User')
userSchema.plugin(findOrCreate)
var User = mongoose.model('User', userSchema)
module.exports = User

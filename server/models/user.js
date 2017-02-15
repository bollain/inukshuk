var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
  userName: {type: String, required: true, unique: true },
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  phoneNumber: {type: String, required: true},
  created_at: Date,
  updated_at: Date
});


//Add any user methods here!

userSchema.pre('save', function(next) {
  //Get the current Date
  var currentDate = new Date();
  console.log("I did dates")

  //Changed the updated_at field
  this.updated_at = currentDate;

  //if created_at doesnt exist, start it!
  if(!this.created_at) {
    this.created_at = currentDate;
  }

  next();
})

var User = mongoose.model('User', userSchema);
module.exports = User;

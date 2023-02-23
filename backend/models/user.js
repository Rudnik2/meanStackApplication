const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  Imie: {type:String, required: true},
  Nazwisko: {type:String, required: true},
  email: {type:String, required: true, unique: true},
  password: {type:String, required: true},
  imagePath: {type:String, required: true},
  followers: {type:Array,default:[]},
  followings: {type:Array,default:[]},
  summaryType: {type:String, required: true},
  summaryNotificationDate: {type:Date, required: true},
  status: {
    type: String,
    enum: ['Pending', 'Active'],
    default: 'Pending'
  },
  confirmationCode: {
    type: String,
    unique: true },
});

userSchema.plugin(uniqueValidator);

module.exports =  mongoose.model('User',userSchema);

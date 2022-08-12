const mongoose = require("mongoose");

const goalSchema = mongoose.Schema({
  title: {type:String, required: true},

  Poziom3: {type:String, required: true},
  Poziom3Date: {type:Number, required: true},

  Poziom2: {type:String, required: true},
  Poziom2Date: {type:Number, required: true},

  Poziom1: {type:String, required: true},
  Poziom1Date: {type:Number, required: true},

  Inspiration: {type:String, required: true},
  reasonWhy: {type:String, required: true},
  Failure: {type:String, required: true},

  creator: {type:mongoose.Schema.Types.ObjectId,ref:"User" ,required: true}
});

module.exports =  mongoose.model('Goal',goalSchema);

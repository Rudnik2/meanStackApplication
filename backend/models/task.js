const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  title: {type:String, required: true},

  content: {type:String, required: true},

  plannedDate: {type:Date, required: true},

  creator: {type:mongoose.Schema.Types.ObjectId,ref:"User" ,required: true}
});

module.exports =  mongoose.model('Task',taskSchema);

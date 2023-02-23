const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  title: {type:String, required: true},

  content: {type:String, required: true},

  plannedDate: {type:Date, required: true},

  creator: {type:mongoose.Schema.Types.ObjectId,ref:"User" ,required: true},

  isDone: {type:Boolean,required:true},

  taskComplitionDate: {type:Date},
  repeatable:{type:Boolean}
});

module.exports =  mongoose.model('Task',taskSchema);

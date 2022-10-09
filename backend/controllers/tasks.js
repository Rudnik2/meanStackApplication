const Task = require("../models/task");

exports.createTask = (req,res,next)=>{

  const task = new Task({
    title: req.body.title,
    content:req.body.content,
    plannedDate:req.body.plannedDate,
    creator: req.userData.userId
  });

  task.save().then(createdTask=>{
    res.status(201).json({
      message:"Post added!",
      taskId: createdTask._id
    });
  }).catch(error=>{
    console.log(error);
    res.status(500).json({
      message:"Creating a task failed! "
    });
  });
};

exports.updateTask = (req,res,next)=>{
  const task = new Task({
    _id: req.body.id,
    title:req.body.title,
    content:req.body.content,
    plannedDate:req.body.plannedDate,
    creator:req.userData.userId
  });

  Task.updateOne({_id:req.params.id,creator:req.userData.userId},task).then(result=>{
    if(result.matchedCount>0){
      res.status(200).json({message:"Update Succesfull"});
    }else{
      res.status(401).json({message:"Not authorized!"});
    }
  }).catch(error=>{
    res.status(500).json({
      message:"Couldn't update post"
    });
  });
};

exports.getAllTasks = (req,res,next)=>{
  Task.find()
  .then(documents=>{
    //console.log(documents);
      res.status(200).json({
      message:'Posts fetched succesfully',
      tasks:documents
    });
  }).catch(error=>{
    res.status(500).json({message:"Fetching posts failed"});
  });
};

exports.getTask = (req,res,next)=>{
  Task.findById(req.params.id).then(task=>{
    if(task){
      res.status(200).json(task);
    }else{
      res.status(404).json({message:"Post not found"});
    }
  }).catch(error=>{
    res.status(500).json({message:"Fetching post failed"});
  });
};

exports.deleteTask = (req,res,next)=>{
  Task.deleteOne({_id:req.params.id,creator:req.userData.userId}).then(result =>{
    if(result.deletedCount>0){
      res.status(200).json({message:"Post deleted!"});
    }else{
      res.status(401).json({message:"Not authorized!"});
    }
  }).catch(error=>{
    res.status(500).json({message:"Fetching post failed"});
  });
};

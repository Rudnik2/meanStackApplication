const Goal = require("../models/goal");

exports.createGoal = (req,res,next)=>{
  console.log(req.body.Poziom2Date); // == Poziom3Date
  console.log(req.body.Poziom3Date);
  const goal = new Goal({
    title: req.body.title,

    Poziom3: req.body.Poziom3,
    Poziom3Date:req.body.Poziom3Date,

    Poziom2:req.body.Poziom2,
    Poziom2Date:req.body.Poziom2Date,

    Poziom1:req.body.Poziom1,
    Poziom1Date:req.body.Poziom1Date,

    Inspiration:req.body.Inspiration,
    reasonWhy:req.body.reasonWhy,
    Failure:req.body.Failure,

    creator: req.userData.userId
  });

  goal.save().then(createdGoal=>{
    res.status(201).json({
      message:"Post added!",
      goalId: createdGoal._id
    });
  }).catch(error=>{
    res.status(500).json({
      message:"Creating a post failed! "
    });
  });
};

exports.updateGoal = (req,res,next)=>{
  const goal = new Goal({
    _id: req.body.id,
    title:req.body.title,

    Poziom3:req.body.Poziom3,
    Poziom3Date:req.body.Poziom3Date,

    Poziom2:req.body.Poziom2,
    Poziom2Date:req.body.Poziom2Date,

    Poziom1:req.body.Poziom1,
    Poziom1Date:req.body.Poziom1Date,

    Inspiration:req.body.Inspiration,
    reasonWhy:req.body.reasonWhy,
    Failure:req.body.Failure,

    creator:req.userData.userId
  });

  Goal.updateOne({_id:req.params.id,creator:req.userData.userId},goal).then(result=>{
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

exports.getAllGoals = (req,res,next)=>{
  Goal.find()
  .then(documents=>{
    //console.log(documents);
      res.status(200).json({
      message:'Posts fetched succesfully',
      goals:documents
    });
  }).catch(error=>{
    res.status(500).json({message:"Fetching posts failed"});
  });
};

exports.getGoal = (req,res,next)=>{
  Goal.findById(req.params.id).then(goal=>{
    if(goal){
      res.status(200).json(goal);
    }else{
      res.status(404).json({message:"Post not found"});
    }
  }).catch(error=>{
    res.status(500).json({message:"Fetching post failed"});
  });
};

exports.deleteGoal = (req,res,next)=>{
  Goal.deleteOne({_id:req.params.id,creator:req.userData.userId}).then(result =>{
    if(result.deletedCount>0){
      res.status(200).json({message:"Post deleted!"});
    }else{
      res.status(401).json({message:"Not authorized!"});
    }
  }).catch(error=>{
    res.status(500).json({message:"Fetching post failed"});
  });
};

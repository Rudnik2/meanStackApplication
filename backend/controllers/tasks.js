const Task = require("../models/task");
const User = require("../models/user");
const paginate = require("jw-paginate");

exports.createTask = (req, res, next) => {
  const task = new Task({
    title: req.body.title,
    content: req.body.content,
    plannedDate: req.body.plannedDate,
    creator: req.userData.userId,
    isDone: req.body.isDone,
    taskComplitionDate: req.body.taskComplitionDate,
    repeatable: req.body.repeatable,
  });

  task
    .save()
    .then((createdTask) => {
      //console.log(createdTask._id); id się tworzy
      res.status(200).json({
        message: "Post added!",
        taskId: createdTask._id,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Creating a task failed! ",
      });
    });
};

exports.updateTask = (req, res, next) => {
  const task = new Task({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    plannedDate: req.body.plannedDate,
    creator: req.userData.userId,
    isDone: req.body.isDone,
    taskComplitionDate: req.body.taskComplitionDate,
    repeatable: req.body.repeatable,
  });

  Task.updateOne({ _id: req.params.id, creator: req.userData.userId }, task)
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Update Succesfull" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update post",
      });
    });
};

exports.getAllTasks = (req, res, next) => {
  Task.find()
    .then((documents) => {
      //console.log(documents);
      res.status(200).json({
        message: "Posts fetched succesfully",
        tasks: documents,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching posts failed" });
    });
};

exports.getAllTasksScroll = async (req, res) => {
  try {
    //console.log(req.params.id); // id usera, co wysłał zapytanie
    let tasks = await Task.find();

    // deleting our own tasks and tasks that aren't completed yet
    for (var i = 0; i < tasks.length; i++) {
      task = tasks[i];
      if (task.creator.equals(req.params.id) || task.isDone == false) {
        tasks.splice(i, 1);
        i--;
      }
    }

    const user = await User.findById(req.params.id);

    //deleting tasks from creators that are not in our followings list
    for (var i = 0; i < tasks.length; i++) {
      task = tasks[i];
      if (!user.followings.includes(task.creator.toString())) {
        tasks.splice(i, 1);
        i--;
      }
    }

    const page = parseInt(req.query.page);
    const pageSize = 10;

    const pager = paginate(tasks.length, page, pageSize);

    // get page of items from items array
    const pageOfItems = tasks.slice(pager.startIndex, pager.endIndex + 1);

    res.status(200).json({ pager, pageOfItems });
  } catch (e) {
    console.log("Error", e);
    res.status(500).send({
      data: null,
    });
  }
};

exports.getTask = (req, res, next) => {
  Task.findById(req.params.id)
    .then((task) => {
      if (task) {
        res.status(200).json(task);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching post failed" });
    });
};

exports.deleteTask = (req, res, next) => {
  Task.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post deleted!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching post failed" });
    });
};

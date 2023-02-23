const express = require('express');

const router = express.Router();
const checkAuth = require("../middleware/chech-auth");
const TaskController = require("../controllers/tasks");

router.post("",checkAuth,TaskController.createTask);


router.get('',TaskController.getAllTasks);
router.get('/scroll/:id',TaskController.getAllTasksScroll);

router.put("/:id",checkAuth,TaskController.updateTask);

router.get("/:id",TaskController.getTask);

router.delete("/:id",checkAuth,TaskController.deleteTask);

module.exports = router;

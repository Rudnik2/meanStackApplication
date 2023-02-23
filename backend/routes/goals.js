const express = require('express');

const router = express.Router();
const checkAuth = require("../middleware/chech-auth");
const GoalController = require("../controllers/goals");


router.post("",checkAuth,GoalController.createGoal);


router.get('',GoalController.getAllGoals);

router.put("/:id",checkAuth,GoalController.updateGoal);

router.get("/:id",GoalController.getGoal);

router.delete("/:id",checkAuth,GoalController.deleteGoal);

module.exports = router;

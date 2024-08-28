var express = require("express");
const taskController = require("./controller");
const taskMiddleware = require("./middleware");
const { validationResultMiddleware } = require("../../errors/validation");
const { validateTokenMiddleware } = require("../../authentication/token");
var router = express.Router();

router.post(
  "/add",
  validateTokenMiddleware,
  taskMiddleware.validateAddTaskData,
  validationResultMiddleware,
  taskController.addTask
);
router.get("/get/user", validateTokenMiddleware, taskController.getTasks);
router.get("/get", taskController.getAllTasks);
router.delete(
  "/delete/:id",
  validateTokenMiddleware,
  taskController.removeTask
);
router.patch(
  "/update/:id",
  validateTokenMiddleware,
  taskMiddleware.validateUpdateTaskData,
  validationResultMiddleware,
  taskController.updateTask
);
module.exports = router;

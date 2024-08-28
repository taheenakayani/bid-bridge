var express = require("express");
const jobController = require("./controller");
const jobMiddleware = require("./middleware");
const { validationResultMiddleware } = require("../../errors/validation");
const { validateTokenMiddleware } = require("../../authentication/token");
var router = express.Router();

// router.get(
//   "/jobs",
//   jobMiddleware.validateAddJobData,
//   validationResultMiddleware,
//   jobController.registerUser
// );
router.post(
  "/add",
  validateTokenMiddleware,
  jobMiddleware.validateAddJobData,
  validationResultMiddleware,
  jobController.addJob
);
router.get("/get/user", validateTokenMiddleware, jobController.getJobs);
router.get("/get", jobController.getAllJobs);
router.delete("/delete/:id", validateTokenMiddleware, jobController.removeJob);
router.patch(
  "/update/:id",
  validateTokenMiddleware,
  jobMiddleware.validateUpdateJobData,
  validationResultMiddleware,
  jobController.updateJob
);
module.exports = router;

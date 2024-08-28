var express = require("express");
const jobApplicationController = require("./controller");
const { pdfUpload } = require("../../libs/upload/multer");
const { validateTokenMiddleware } = require("../../authentication/token");
var router = express.Router();

router.post(
  "/add",
  validateTokenMiddleware,
  // jobApplicationMiddleware.validateAddJobApplicationData,
  // validationResultMiddleware,
  pdfUpload.single("applicantCV"),
  jobApplicationController.addJobApplication
);
router.get(
  "/get",
  validateTokenMiddleware,
  jobApplicationController.getJobApplicationsByUser
);
router.get(
  "/get/:jobIds",
  validateTokenMiddleware,
  jobApplicationController.getJobApplicationsByJobIds
);
module.exports = router;

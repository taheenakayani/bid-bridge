var express = require("express");
const userController = require("./controller");
const userMiddleware = require("./middleware");
const { validationResultMiddleware } = require("../../errors/validation");
const { imageUpload, pdfUpload } = require("../../libs/upload/multer");
var router = express.Router();
const passport = require("passport");
const { validateTokenMiddleware } = require("../../authentication/token");

router.get("/details", validateTokenMiddleware, userController.getUserDetails);

router.get("/freelancers", userController.getFreelancers);
router.get("/employers", userController.getEmployers);

router.post(
  "/register",
  userMiddleware.validateRegisterUserData,
  validationResultMiddleware,
  userController.registerUser
);

router.post(
  "/login",
  userMiddleware.validateLoginUserData,
  validationResultMiddleware,
  userController.loginUser
);

router.post(
  "/verify/:userId",
  userController.verifyUser
);

router.post(
  "/update/avatar",
  // userMiddleware.validateLoginUserData,
  // validationResultMiddleware,
  validateTokenMiddleware,
  pdfUpload.single("avatar"),
  userController.updateUserAvatar
);

router.post(
  "/update/resume",
  // userMiddleware.validateLoginUserData,
  // validationResultMiddleware,
  validateTokenMiddleware,
  pdfUpload.single("resume"),
  userController.updateUserResume
);

router.post(
  "/update/cover",
  // userMiddleware.validateLoginUserData,
  // validationResultMiddleware,
  validateTokenMiddleware,
  pdfUpload.single("cover"),
  userController.updateUserCoverLetter
);

router.post(
  "/update/notifications/status",
  // userMiddleware.validateLoginUserData,
  // validationResultMiddleware,
  validateTokenMiddleware,
  userController.updateNotificationsStatus
);

router.delete(
  "/remove/resume",
  // userMiddleware.validateLoginUserData,
  // validationResultMiddleware,
  validateTokenMiddleware,
  userController.removeUserResume
);

router.delete(
  "/remove/cover",
  // userMiddleware.validateLoginUserData,
  // validationResultMiddleware,
  validateTokenMiddleware,
  userController.removeUserCoverLetter
);

router.post(
  "/update",
  // userMiddleware.validateLoginUserData,
  // validationResultMiddleware,
  validateTokenMiddleware,
  userController.updateUser
);

router.post(
  "/forget-password",
  userController.forgetPassword
);

router.post(
  "/reset-password",
  userController.resetPassword
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  userController.loginUserGoogle
);

module.exports = router;

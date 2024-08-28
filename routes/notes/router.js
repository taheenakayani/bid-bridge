var express = require("express");
const NotesController = require("./controller");
const { validateTokenMiddleware } = require("../../authentication/token");
var router = express.Router();

router.post("/add", validateTokenMiddleware, NotesController.addNote);
router.delete(
  "/delete/:id",
  validateTokenMiddleware,
  NotesController.removeNote
);
router.get("/get", validateTokenMiddleware, NotesController.getNotes);
module.exports = router;

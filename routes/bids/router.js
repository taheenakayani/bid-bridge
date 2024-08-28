var express = require("express");
const BidsController = require("./controller");
const { validateTokenMiddleware } = require("../../authentication/token");
var router = express.Router();

router.post("/add", validateTokenMiddleware, BidsController.addBid);
router.delete("/delete/:id", validateTokenMiddleware, BidsController.removeBid);
router.get("/get", validateTokenMiddleware, BidsController.getBidsByUser);
router.get(
  "/get/:taskIds",
  validateTokenMiddleware,
  BidsController.getBidsByTaskIds
);
router.patch("/update/:id", BidsController.updateBid);
module.exports = router;

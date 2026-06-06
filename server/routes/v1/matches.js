const express = require("express");
const matchController = require("../../controllers/matchController");
const authMiddleware = require("../../middleware/auth");
const router = express.Router();

router.get("/:customerId", authMiddleware, matchController.getMatches);
router.post("/send", authMiddleware, matchController.sendMatch);

module.exports = router;
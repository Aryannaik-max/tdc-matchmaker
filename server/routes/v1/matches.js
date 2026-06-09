const express = require("express");
const matchController = require("../../controllers/matchController");
const authMiddleware = require("../../middleware/auth");
const router = express.Router();

router.get("/:customerId", authMiddleware, matchController.getMatches);
router.post("/send", authMiddleware, matchController.sendMatch);
router.get('/:customerId/sent', authMiddleware, matchController.getSentMatches);
router.get('/pool/:profileId', authMiddleware, matchController.getPoolProfile);

module.exports = router;
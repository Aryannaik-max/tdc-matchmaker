const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const customerRoutes = require("./customers");
const matchRoutes = require("./matches");

router.use("/auth", authRoutes);
router.use("/customers", customerRoutes);
router.use("/matches", matchRoutes);

module.exports = router;
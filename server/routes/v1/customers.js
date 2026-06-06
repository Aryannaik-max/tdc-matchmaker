const express = require("express");
const customerController = require("../../controllers/customerController");
const authMiddleware = require("../../middleware/auth");
const router = express.Router();

router.get("/", authMiddleware , customerController.getAllCustomers);

router.get("/:customerId", authMiddleware, customerController.getCustomerById);

module.exports = router;
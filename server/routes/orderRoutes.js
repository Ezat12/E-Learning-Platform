const express = require("express");
const { getCheckoutSession } = require("../controllers/order-controller");
const { protectAuth } = require("../controllers/auth-controller");
const router = express.Router();

router.get("/checkout-session/:courseId", protectAuth, getCheckoutSession);

module.exports = router;

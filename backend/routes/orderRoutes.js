const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");

router.post("/checkout", auth, orderController.checkout);
router.get("/me", auth, orderController.listForUser);
router.get("/stats/sales", orderController.salesStats);

module.exports = router;

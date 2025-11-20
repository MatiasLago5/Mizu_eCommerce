const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminController = require("../controllers/adminController");

router.use(auth, auth.requiereRol("admin"));

router.get("/stats", adminController.getStats);

router.get("/users", adminController.listUsers);
router.put("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);

router.get("/orders", adminController.listOrders);
router.put("/orders/:id/status", adminController.updateOrderStatus);

router.get("/refuges", adminController.listRefuges);
router.post("/refuges", adminController.createRefuge);
router.put("/refuges/:id", adminController.updateRefuge);
router.delete("/refuges/:id", adminController.deleteRefuge);

module.exports = router;

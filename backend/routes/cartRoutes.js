const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const auth = require("../middleware/auth");

// Todas las rutas del carrito requieren autenticación
router.use(auth);

// Obtener carrito del usuario
router.get("/", cartController.getCart);

// Agregar producto al carrito
router.post("/items", cartController.addItem);

// Actualizar cantidad de un item
router.put("/items/:itemId", cartController.updateItem);

// Eliminar item del carrito
router.delete("/items/:itemId", cartController.removeItem);

// Vaciar carrito
router.delete("/", cartController.clearCart);

module.exports = router;

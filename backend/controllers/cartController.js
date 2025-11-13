const { Cart, CartItem, Product } = require("../models");

// Obtener el carrito del usuario autenticado
async function getCart(req, res) {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'imageUrl', 'stock', 'isActive'],
            },
          ],
        },
      ],
    });

    if (!cart) {
      cart = await Cart.create({ userId });
      cart.items = [];
    }

    const total = await cart.getTotal();
    const itemCount = await cart.getItemCount();

    res.json({
      message: "Carrito obtenido exitosamente",
      data: {
        ...cart.toJSON(),
        total,
        itemCount,
      },
    });
  } catch (error) {
    console.error('Error en getCart:', error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

async function addItem(req, res) {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: "El ID del producto es requerido",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        error: "La cantidad debe ser al menos 1",
      });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        error: "El producto no está disponible",
      });
    }

    // Verificar stock
    if (product.stock < quantity) {
      return res.status(400).json({
        error: `Stock insuficiente. Disponible: ${product.stock}`,
      });
    }

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          error: `Stock insuficiente. Disponible: ${product.stock}, en carrito: ${cartItem.quantity}`,
        });
      }

      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
      });
    }

    const updatedItem = await CartItem.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'imageUrl', 'stock', 'isActive'],
        },
      ],
    });

    res.status(201).json({
      message: "Producto agregado al carrito exitosamente",
      data: updatedItem,
    });
  } catch (error) {
    console.error('Error en addItem:', error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

async function updateItem(req, res) {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        error: "La cantidad debe ser al menos 1",
      });
    }

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(404).json({
        error: "Carrito no encontrado",
      });
    }

    const cartItem = await CartItem.findOne({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: [
        {
          model: Product,
          as: 'product',
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({
        error: "Item no encontrado en el carrito",
      });
    }

    if (cartItem.product.stock < quantity) {
      return res.status(400).json({
        error: `Stock insuficiente. Disponible: ${cartItem.product.stock}`,
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({
      message: "Cantidad actualizada exitosamente",
      data: cartItem,
    });
  } catch (error) {
    console.error('Error en updateItem:', error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

async function removeItem(req, res) {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(404).json({
        error: "Carrito no encontrado",
      });
    }

    const cartItem = await CartItem.findOne({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        error: "Item no encontrado en el carrito",
      });
    }

    await cartItem.destroy();

    res.json({
      message: "Item eliminado del carrito exitosamente",
    });
  } catch (error) {
    console.error('Error en removeItem:', error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

async function clearCart(req, res) {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(404).json({
        error: "Carrito no encontrado",
      });
    }

    await CartItem.destroy({
      where: { cartId: cart.id },
    });

    res.json({
      message: "Carrito vaciado exitosamente",
    });
  } catch (error) {
    console.error('Error en clearCart:', error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};

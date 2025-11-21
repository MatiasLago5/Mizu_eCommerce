const { Cart, CartItem, Product } = require("../models");

const toCurrency = (value) => {
  const numeric = Number.parseFloat(value ?? 0);
  return Number.isFinite(numeric) ? Number(numeric.toFixed(2)) : 0;
};

function calculateDiscountedPrice(product) {
  const basePrice = toCurrency(product?.price ?? 0);
  if (basePrice <= 0) {
    return 0;
  }

  const discount = Number(product?.discountPercentage ?? 0);
  if (discount > 0) {
    const discounted = basePrice * (1 - discount / 100);
    return toCurrency(discounted);
  }

  return basePrice;
}

function buildCartItemPayload(cartItem) {
  if (!cartItem) return null;

  const raw = typeof cartItem.toJSON === "function" ? cartItem.toJSON() : { ...cartItem };
  const product = raw.product || cartItem.product || null;

  const originalPrice = toCurrency(product?.price ?? raw.originalPrice ?? raw.price ?? 0);
  const finalPrice = toCurrency(raw.price ?? originalPrice);
  const discountPercentage = Number(product?.discountPercentage ?? raw.discountPercentage ?? 0);
  const hasDiscount = discountPercentage > 0 && originalPrice > 0 && finalPrice <= originalPrice;

  return {
    ...raw,
    price: finalPrice,
    originalPrice,
    finalPrice,
    discountPercentage: hasDiscount ? discountPercentage : 0,
    hasDiscount,
  };
}

async function syncCartItemPrices(cart) {
  if (!cart?.items?.length) {
    return;
  }

  await Promise.all(
    cart.items.map(async (item) => {
      if (!item.product) return;

      const finalPrice = calculateDiscountedPrice(item.product);
      const storedPrice = parseFloat(item.price);

      if (!Number.isFinite(storedPrice) || storedPrice !== finalPrice) {
        item.price = finalPrice;
        await item.save();
      }
    })
  );
}

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
              attributes: ['id', 'name', 'imageUrl', 'stock', 'isActive', 'price', 'discountPercentage'],
            },
          ],
        },
      ],
    });

    if (!cart) {
      cart = await Cart.create({ userId });
      cart.items = [];
    }

    await syncCartItemPrices(cart);

    const total = await cart.getTotal();
    const itemCount = await cart.getItemCount();

    const cartJson = cart.toJSON();
    cartJson.items = (cart.items || []).map((item) => buildCartItemPayload(item));

    res.json({
      message: "Carrito obtenido exitosamente",
      data: {
        ...cartJson,
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

    const finalPrice = calculateDiscountedPrice(product);

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          error: `Stock insuficiente. Disponible: ${product.stock}, en carrito: ${cartItem.quantity}`,
        });
      }

      cartItem.quantity = newQuantity;
      cartItem.price = finalPrice;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        price: finalPrice,
      });
    }

    const updatedItem = await CartItem.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'imageUrl', 'stock', 'isActive', 'price', 'discountPercentage'],
        },
      ],
    });

    res.status(201).json({
      message: "Producto agregado al carrito exitosamente",
      data: buildCartItemPayload(updatedItem),
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

    const finalPrice = calculateDiscountedPrice(cartItem.product);

    cartItem.quantity = quantity;
    cartItem.price = finalPrice;
    await cartItem.save();

    res.json({
      message: "Cantidad actualizada exitosamente",
      data: buildCartItemPayload(cartItem),
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

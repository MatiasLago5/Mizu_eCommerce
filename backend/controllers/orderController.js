const { sequelize, Cart, CartItem, Order, OrderItem, Product } = require("../models");

async function checkout(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price", "stock", "imageUrl"],
            },
          ],
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: "Tu carrito está vacío",
      });
    }

    const totals = cart.items.reduce(
      (acc, item) => {
        const price = Number(item.price);
        acc.totalItems += item.quantity;
        acc.totalAmount += price * item.quantity;
        return acc;
      },
      { totalItems: 0, totalAmount: 0 }
    );

    // Esto maneja la cantidad de productos vendidos para definir cuántos productos van a ser donados

    const totalItemsSoldBefore =
      (await Order.sum("totalItems", { transaction })) || 0;
    const totalDonationsBefore = Math.floor(totalItemsSoldBefore / 3);
    const totalItemsSoldAfter = totalItemsSoldBefore + totals.totalItems;
    const totalDonationsAfter = Math.floor(totalItemsSoldAfter / 3);
    const donationCount = totalDonationsAfter - totalDonationsBefore;

    for (const item of cart.items) {
      if (!item.product) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Uno de los productos ya no está disponible",
        });
      }

      if (item.product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Stock insuficiente para ${item.product.name}. Disponible: ${item.product.stock}`,
        });
      }
    }

    const order = await Order.create(
      {
        userId,
        totalItems: totals.totalItems,
        totalAmount: totals.totalAmount,
        donationCount,
        status: "pagado",
      },
      { transaction }
    );

    for (const item of cart.items) {
      const price = Number(item.price);
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: price,
          subtotal: price * item.quantity,
        },
        { transaction }
      );

      await Product.update(
        { stock: item.product.stock - item.quantity },
        { where: { id: item.productId }, transaction }
      );
    }

    await CartItem.destroy({ where: { cartId: cart.id }, transaction });

    await transaction.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "imageUrl"],
            },
          ],
        },
      ],
    });

    return res.status(201).json({
      message: "Checkout realizado exitosamente",
      order: fullOrder,
    });
  } catch (error) {
    console.error("Error en checkout:", error);
    if (transaction) {
      await transaction.rollback();
    }
    return res.status(500).json({
      error: "No pudimos procesar el checkout. Intentá nuevamente.",
    });
  }
}

async function listForUser(req, res) {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "imageUrl"],
            },
          ],
        },
      ],
    });

    res.json({ data: orders });
  } catch (error) {
    console.error("Error al listar órdenes del usuario:", error);
    res.status(500).json({ error: "No pudimos obtener tus pedidos" });
  }
}

async function salesStats(_req, res) {
  try {
    const totalProductsSold = (await Order.sum("totalItems")) || 0;
    const totalDonations = (await Order.sum("donationCount")) || 0;
    const totalOrders = await Order.count();

    res.json({
      totalOrders,
      totalProductsSold,
      totalDonations,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas de ventas:", error);
    res.status(500).json({ error: "No pudimos calcular las estadísticas" });
  }
}

module.exports = {
  checkout,
  listForUser,
  salesStats,
};

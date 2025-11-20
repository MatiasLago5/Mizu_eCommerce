const { fn, col, literal } = require("sequelize");
const {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  Refuge,
} = require("../models");

const ORDER_STATUS_VALUES = ["pendiente", "pagado", "cancelado"];
const USER_ROLES = ["usuario", "admin"];

function toPlain(instance) {
  return instance?.toJSON ? instance.toJSON() : instance;
}

async function getStats(_req, res) {
  try {
    const [totalSales, totalOrders, totalProducts, totalUsers, productsDonated, activeRefuges] =
      await Promise.all([
        Order.sum("totalAmount", { where: { status: "pagado" } }),
        Order.count(),
        Product.count(),
        User.count(),
        Order.sum("donationCount"),
        Refuge.count({ where: { isActive: true } }),
      ]);

    const recentOrders = await Order.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    const topProductsRaw = await OrderItem.findAll({
      attributes: [
        "productId",
        [fn("SUM", col("quantity")), "sold"],
        [fn("SUM", col("subtotal")), "revenue"],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "imageUrl"],
        },
      ],
      group: ["productId", "product.id"],
      order: [[literal("sold"), "DESC"]],
      limit: 3,
    });

    const stats = {
      totalSales: Number(totalSales || 0),
      totalOrders,
      totalProducts,
      totalUsers,
      productsDonated: Number(productsDonated || 0),
      activeRefuges,
    };

    res.json({
      stats,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customer: order.user?.name || "Cliente",
        total: Number(order.totalAmount),
        status: order.status,
        date: order.createdAt,
      })),
      topProducts: topProductsRaw.map((item) => ({
        id: item.productId,
        name: item.product?.name || "Producto",
        sold: Number(item.get("sold") || 0),
        revenue: Number(item.get("revenue") || 0),
        imageUrl: item.product?.imageUrl || null,
      })),
    });
  } catch (error) {
    console.error("Error al obtener estadísticas de admin:", error);
    res.status(500).json({ error: "No pudimos obtener las estadísticas" });
  }
}

async function listUsers(_req, res) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    res.json({ data: users });
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "No pudimos obtener los usuarios" });
  }
}

async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!USER_ROLES.includes(role)) {
      return res.status(400).json({ error: "Rol inválido" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (user.role === "admin" && role !== "admin") {
      const adminCount = await User.count({ where: { role: "admin" } });
      if (adminCount <= 1) {
        return res.status(400).json({ error: "Debe existir al menos un administrador" });
      }
    }

    await user.update({ role });
    res.json({ message: "Rol actualizado", user: user.toSafeObject() });
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    res.status(500).json({ error: "No pudimos actualizar el rol" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (user.role === "admin") {
      const adminCount = await User.count({ where: { role: "admin" } });
      if (adminCount <= 1) {
        return res.status(400).json({ error: "No se puede eliminar el último administrador" });
      }
    }

    await user.destroy();
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "No pudimos eliminar el usuario" });
  }
}

async function listOrders(_req, res) {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
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
      order: [["createdAt", "DESC"]],
    });

    res.json({ data: orders.map(toPlain) });
  } catch (error) {
    console.error("Error al listar pedidos:", error);
    res.status(500).json({ error: "No pudimos obtener los pedidos" });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ORDER_STATUS_VALUES.includes(status)) {
      return res.status(400).json({ error: "Estado de pedido inválido" });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    await order.update({ status });
    res.json({ message: "Estado actualizado", order: toPlain(order) });
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    res.status(500).json({ error: "No pudimos actualizar el pedido" });
  }
}

async function listRefuges(_req, res) {
  try {
    const refuges = await Refuge.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ data: refuges });
  } catch (error) {
    console.error("Error al listar refugios:", error);
    res.status(500).json({ error: "No pudimos obtener los refugios" });
  }
}

async function createRefuge(req, res) {
  try {
    const { name, location, contactEmail, phone, description, capacity, needs, isActive } = req.body;

    if (!name || !location || !contactEmail) {
      return res.status(400).json({ error: "Nombre, ubicación y email de contacto son requeridos" });
    }

    const refuge = await Refuge.create({
      name,
      location,
      contactEmail,
      phone: phone || null,
      description: description || null,
      capacity: capacity ?? null,
      needs: needs || null,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    res.status(201).json({ message: "Refugio creado", data: refuge });
  } catch (error) {
    console.error("Error al crear refugio:", error);
    res.status(500).json({ error: "No pudimos crear el refugio" });
  }
}

async function updateRefuge(req, res) {
  try {
    const { id } = req.params;
    const refuge = await Refuge.findByPk(id);

    if (!refuge) {
      return res.status(404).json({ error: "Refugio no encontrado" });
    }

    const { name, location, contactEmail, phone, description, capacity, needs, isActive } = req.body;

    await refuge.update({
      name: name ?? refuge.name,
      location: location ?? refuge.location,
      contactEmail: contactEmail ?? refuge.contactEmail,
      phone: phone ?? refuge.phone,
      description: description ?? refuge.description,
      capacity: capacity ?? refuge.capacity,
      needs: needs ?? refuge.needs,
      isActive: typeof isActive === "boolean" ? isActive : refuge.isActive,
    });

    res.json({ message: "Refugio actualizado", data: refuge });
  } catch (error) {
    console.error("Error al actualizar refugio:", error);
    res.status(500).json({ error: "No pudimos actualizar el refugio" });
  }
}

async function deleteRefuge(req, res) {
  try {
    const { id } = req.params;
    const refuge = await Refuge.findByPk(id);

    if (!refuge) {
      return res.status(404).json({ error: "Refugio no encontrado" });
    }

    await refuge.destroy();
    res.json({ message: "Refugio eliminado" });
  } catch (error) {
    console.error("Error al eliminar refugio:", error);
    res.status(500).json({ error: "No pudimos eliminar el refugio" });
  }
}

module.exports = {
  getStats,
  listUsers,
  updateUserRole,
  deleteUser,
  listOrders,
  updateOrderStatus,
  listRefuges,
  createRefuge,
  updateRefuge,
  deleteRefuge,
};

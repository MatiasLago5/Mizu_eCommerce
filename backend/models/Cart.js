const { Model, DataTypes } = require("sequelize");

class Cart extends Model {
  static initModel(sequelize) {
    Cart.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
      },
      {
        sequelize,
        modelName: "Cart",
        tableName: "Carts",
        timestamps: true,
      }
    );

    return Cart;
  }

  static associate(models) {
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Cart.hasMany(models.CartItem, {
      foreignKey: 'cartId',
      as: 'items',
    });
  }

  // Método para calcular el total del carrito
  async getTotal() {
    const { CartItem } = require("./index");
    const items = await CartItem.findAll({
      where: { cartId: this.id },
    });

    return items.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);
  }

  // Método para obtener la cantidad total de items
  async getItemCount() {
    const { CartItem } = require("./index");
    const items = await CartItem.findAll({
      where: { cartId: this.id },
    });

    return items.reduce((count, item) => count + item.quantity, 0);
  }
}

module.exports = Cart;

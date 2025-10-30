const { Model, DataTypes } = require("sequelize");

class CartItem extends Model {
  static initModel(sequelize) {
    CartItem.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        cartId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'Carts',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'Products',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          validate: {
            min: 1,
          },
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "CartItem",
        tableName: "CartItems",
        timestamps: true,
      }
    );

    return CartItem;
  }

  static associate(models) {
    CartItem.belongsTo(models.Cart, {
      foreignKey: 'cartId',
      as: 'cart',
    });

    CartItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }

  // Método para calcular el subtotal del item
  getSubtotal() {
    return parseFloat(this.price) * this.quantity;
  }
}

module.exports = CartItem;

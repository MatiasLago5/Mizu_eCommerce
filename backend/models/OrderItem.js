const { Model, DataTypes } = require("sequelize");

class OrderItem extends Model {
  static initModel(sequelize) {
    OrderItem.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "Orders",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "Products",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
          },
        },
        unitPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        subtotal: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "OrderItem",
        tableName: "OrderItems",
        timestamps: true,
      }
    );

    return OrderItem;
  }
}

module.exports = OrderItem;

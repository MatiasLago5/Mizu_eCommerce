const { Model, DataTypes } = require("sequelize");

class UserAddress extends Model {
  static initModel(sequelize) {
    UserAddress.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        fullName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        street: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        department: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        postalCode: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        reference: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "Uruguay",
        },
      },
      {
        sequelize,
        modelName: "UserAddress",
        tableName: "UserAddresses",
        timestamps: true,
      }
    );

    return UserAddress;
  }
}

module.exports = UserAddress;

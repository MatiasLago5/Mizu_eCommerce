const { Model, DataTypes } = require("sequelize");

class Refuge extends Model {
  static initModel(sequelize) {
    Refuge.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        location: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        contactEmail: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true,
          },
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        capacity: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            min: 0,
          },
        },
        needs: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: "Refuge",
        tableName: "Refuges",
        timestamps: true,
      }
    );

    return Refuge;
  }
}

module.exports = Refuge;

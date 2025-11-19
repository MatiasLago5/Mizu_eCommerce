const { Model, DataTypes } = require("sequelize");

class Product extends Model {
  static initModel(sequelize) {
    Product.init(
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
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            min: 0,
          }
        },
        categoryId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'ProductsCategories',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        subcategoryId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'ProductsSubcategories',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: 0,
          }
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        discountPercentage: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
          defaultValue: 0.0,
          validate: {
            min: 0,
            max: 100,
          }
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Product",
        tableName: "Products",
        timestamps: true,
      },
    );

    return Product;
  }

  async getCategory() {
    const { Category } = require("./index");
    return await Category.findByPk(this.categoryId);
  }

  async getSubcategory() {
    if (!this.subcategoryId) return null;
    const { Subcategory } = require("./index");
    return await Subcategory.findByPk(this.subcategoryId);
  }

  hasStock(quantity = 1) {
    return this.stock >= quantity;
  }

  async reduceStock(quantity) {
    if (!this.hasStock(quantity)) {
      throw new Error('Stock insuficiente');
    }
    this.stock -= quantity;
    await this.save();
    return this;
  }

  async increaseStock(quantity) {
    this.stock += quantity;
    await this.save();
    return this;
  }
}

module.exports = Product;

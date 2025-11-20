const { Sequelize } = require("sequelize");

let sequelize;
if (process.env.DB_CONNECTION === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || 'dev.sqlite',
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_CONNECTION,
      logging: false, // Para que no aparezcan mensajes en consola.
    },
  );
}

// Requerir todos los modelos:
const User = require("./User");
const Product = require("./Products");
const Category = require("./Category");
const Subcategory = require("./Subcategory");
const Cart = require("./Cart");
const CartItem = require("./CartItem");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Refuge = require("./Refuge");
const UserAddress = require("./UserAddress");

// Inicializar todos los modelos:
User.initModel(sequelize);
Product.initModel(sequelize);
Category.initModel(sequelize);
Subcategory.initModel(sequelize);
Cart.initModel(sequelize);
CartItem.initModel(sequelize);
Order.initModel(sequelize);
OrderItem.initModel(sequelize);
Refuge.initModel(sequelize);
UserAddress.initModel(sequelize);

// Definir las relaciones entre los modelos:
Category.hasMany(Subcategory, {
  foreignKey: 'categoryId',
  as: 'subcategories',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Relaciones de Subcategory
Subcategory.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Subcategory.hasMany(Product, {
  foreignKey: 'subcategoryId',
  as: 'products',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

// Relaciones de Product
Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Product.belongsTo(Subcategory, {
  foreignKey: 'subcategoryId',
  as: 'subcategory',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

// Relaciones de Cart
User.hasOne(Cart, {
  foreignKey: 'userId',
  as: 'cart',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Cart.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Cart.hasMany(CartItem, {
  foreignKey: 'cartId',
  as: 'items',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Relaciones de CartItem
CartItem.belongsTo(Cart, {
  foreignKey: 'cartId',
  as: 'cart',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CartItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

User.hasOne(UserAddress, {
  foreignKey: 'userId',
  as: 'shippingAddress',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

UserAddress.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Relaciones de Order
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  as: 'orderItems',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

module.exports = {
  sequelize,
  User,
  Product,
  Category,
  Subcategory,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Refuge,
  UserAddress,
};

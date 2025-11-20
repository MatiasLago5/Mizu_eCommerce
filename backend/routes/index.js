const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const subcategoryRoutes = require("./subcategoryRoutes");
const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");
const adminRoutes = require("./adminRoutes");

module.exports = (app) => {
  app.use("/users", userRoutes);
  app.use("/products", productRoutes);
  app.use("/categories", categoryRoutes);
  app.use("/subcategories", subcategoryRoutes);
  app.use("/cart", cartRoutes);
  app.use("/orders", orderRoutes);
  app.use("/admin", adminRoutes);
};

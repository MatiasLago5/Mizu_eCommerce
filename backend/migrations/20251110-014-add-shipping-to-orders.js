"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Orders", "shippingMethod", {
      type: Sequelize.ENUM("delivery", "pickup"),
      allowNull: false,
      defaultValue: "delivery",
    });

    await queryInterface.addColumn("Orders", "shippingCost", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn("Orders", "shippingAddress", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Orders", "shippingAddress");
    await queryInterface.removeColumn("Orders", "shippingCost");
    await queryInterface.removeColumn("Orders", "shippingMethod");

    const dialect = queryInterface.sequelize.getDialect();
    if (dialect === "postgres") {
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_Orders_shippingMethod";'
      );
    }
  },
};

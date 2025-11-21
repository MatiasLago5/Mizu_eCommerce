"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "role", {
      type: Sequelize.ENUM("usuario", "admin"),
      allowNull: false,
      defaultValue: "usuario",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Users", "role");
  },
};

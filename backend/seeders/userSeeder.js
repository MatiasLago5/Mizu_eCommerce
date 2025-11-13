const faker = require("@faker-js/faker").fakerES;
const { User } = require("../models");

module.exports = async () => {
  const users = [];

  // Usuario administrador
  users.push({
    name: "Admin Mizu",
    email: "admin@mizu.com",
    password: "admin123",
    role: "admin",
  });

  for (let i = 0; i < 100; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    users.push({
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }),
      password: "password123",
      role: "usuario",
    });
  }

  await User.destroy({ where: {} });
  await User.bulkCreate(users, { individualHooks: true });
  console.log("Se corrió el seeder de Users");
};

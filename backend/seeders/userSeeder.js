const faker = require("@faker-js/faker").fakerES;
const { User } = require("../models");

module.exports = async () => {
  const users = [];

  // Admin
  users.push({
    name: "Admin Mizu",
    email: "admin@mizu.com",
    password: "admin123",
    role: "admin",
    address: faker.location.streetAddress(),
    phone: faker.number.int({ min: 900000000, max: 999999999 }),
  });

  for (let i = 0; i < 100; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    users.push({
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }),
      password: "password123",
      role: "usuario",
      address: faker.helpers.maybe(
        () => faker.location.streetAddress(),
        { probability: 0.6 }
      ) || null,
      phone: faker.helpers.maybe(
        () => faker.number.int({ min: 200000000, max: 999999999 }),
        { probability: 0.7 }
      ) || null,
    });
  }

  await User.destroy({ where: {} });
  await User.bulkCreate(users, { individualHooks: true });
  console.log("Se corrió el seeder de Users");
};

const fs = require("fs");
const user = require("../models/users.model");

const jsonData = fs.readFileSync("./data/users.json", "utf-8");
const usersData = JSON.parse(jsonData);

async function seedUser() {
  try {
    for (const userData of usersData) {
      const newUser = new user({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        status: userData.status,
      });
      //   console.log(newUser);
      await newUser.save();
    }
    console.log("User data successfully seeded.");
  } catch (error) {
    console.log("Error seeding data:", error);
  }
}
module.exports = { seedUser };

const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();

const { seedUser } = require("./seedData/usersSeeding");
// seedUser();

const express = require("express");
const cors = require("cors");

const adminRoutes = require("./controllers/admin.controller"); // ✅ changed path
const { PORT } = require("./config/env");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

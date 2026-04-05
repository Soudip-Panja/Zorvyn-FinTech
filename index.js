const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();

const { seedUser } = require("./seedData/usersSeeding");
// seedUser();

const { seedFinanceRecord } = require("./seedData/financeRecordSeeding");
// seedFinanceRecord()

const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/env");

const app = express();

app.use(express.json());
app.use(cors());

const adminRoutes = require("./controllers/admin.controller");
const financeRecordRoutes = require("./routes/financeRecord.routes");

app.use("/admin", adminRoutes);
app.use("/finance", financeRecordRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

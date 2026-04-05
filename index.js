const express = require("express");
require("dotenv").config();
const app = express();

app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;

app.post("/admin/login", (req, res) => {
  const { secret } = req.body;
  if (secret === SECRET_KEY) {
    res.json({ message: "Access Granted" });
  } else {
    res.json({ message: "Invalid Secret" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

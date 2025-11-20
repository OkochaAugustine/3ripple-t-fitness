const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // important for frontend requests

app.post("/register", (req, res) => {
  const data = req.body;
  console.log("📥 New Registration:", data);

  let db = [];
  if (fs.existsSync("database.json")) {
    db = JSON.parse(fs.readFileSync("database.json", "utf-8"));
  }

  db.push(data);
  fs.writeFileSync("database.json", JSON.stringify(db, null, 2));

  res.json({ status: "success" });
});

app.get("/all", (req, res) => {
  if (!fs.existsSync("database.json")) return res.json([]);
  const db = JSON.parse(fs.readFileSync("database.json", "utf-8"));
  res.json(db);
});

app.listen(5000, () => console.log("Server running on port 5000"));

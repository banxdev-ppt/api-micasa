const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const { configCors } = require("./config/cors");
const authRoute = require("./routers/authRoute");
const { db } = require("./config/database");
const path = require("path");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(configCors);
app.use("/auth", authRoute);

app.use("/profiles", express.static(path.join(__dirname, "uploads/profiles")));

app.get("/", (req, res) => {
  res.send("server is running!");
});

const port = process.env.PORT || 3001;
db.getConnection((err, connection) => {
  if (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  } else {
    console.log("Database connected successfully");
    connection.release();
    app.listen(port, () =>
      console.log(`Server is running on http://localhost:${port}`)
    );
  }
});

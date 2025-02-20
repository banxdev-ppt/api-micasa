const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { configCors } = require("./config/cors");
const { db } = require("./config/database");

const authRoute = require("./routers/authRoute");
const familyRoute = require("./routers/familyRoute.js");

const swaggerUi = require("swagger-ui-express");
const { swaggerSetup } = require("./config/swagger/swagger.js");

const app = express();
dotenv.config();

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(configCors);

//** routes */
// uploads
app.use("/profiles", express.static(path.join(__dirname, "uploads/profiles")));
app.use("/families", express.static(path.join(__dirname, "uploads/families")));

// routers
app.use("/api/swagger", swaggerUi.serve, swaggerSetup);
app.use("/auth", authRoute);
app.use("/family", familyRoute);

app.get("/", (req, res) => res.send("server is running!"));

const port = process.env.PORT;
db.getConnection((err, connection) => {
  if (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  } else {
    console.log("Database connected successfully");
    connection.release();
    app.listen(port);
  }
});

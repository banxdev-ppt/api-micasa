const { Router } = require("express");
const {
  loginController,
} = require("../controllers/authenticate/login.controller");
const {
  registerController,
} = require("../controllers/authenticate/register.controller");
const router = Router();
router.post("/login", loginController);
router.post("/register", registerController);

module.exports = router;

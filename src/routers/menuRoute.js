const { Router } = require("express");
const {
  CreateMenuController,
} = require("../controllers/menu/create.controller");
const { ReadMenuController } = require("../controllers/menu/read.controller");
const { uploadMiddleware } = require("../middleware/uploadMiddleware");

const router = Router();
const upload = uploadMiddleware().single("menu_image");

router.post("/create", upload, CreateMenuController);
router.post("/", ReadMenuController);

module.exports = router;

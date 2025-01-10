const { Router } = require("express");
const { uploadMiddleware } = require("../middleware/uploadMiddleware");
const {
  createFamilyController,
} = require("../controllers/family/create.controller");
const {
  joinFamilyController,
} = require("../controllers/family/join.controller");

const router = Router();
const upload = uploadMiddleware().single("famImg");

router.post("/create", upload, createFamilyController);
router.post("/join", joinFamilyController);

module.exports = router;

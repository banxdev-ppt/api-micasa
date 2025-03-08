const { Router } = require("express");
const { uploadMiddleware } = require("../middleware/uploadMiddleware");
const {
  CreateActivityController,
} = require("../controllers/activity/create.controller");
const {
  ReadActivityController,
} = require("../controllers/activity/read.controller");
const {
  UpdateController,
} = require("../controllers/activity/update.controller");
const {
  ReadActivityByIdController,
} = require("../controllers/activity/readById.controller");

const router = Router();
const upload = uploadMiddleware().single();

router.post("/create", upload, CreateActivityController);
router.post("/update=:act_id", upload, UpdateController);
router.get("/read=:fam_id", ReadActivityController);
router.get("/read_id=:act_id", ReadActivityByIdController);

module.exports = router;

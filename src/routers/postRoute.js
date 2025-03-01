const { Router } = require("express");
const {
  CreatePostController,
} = require("../controllers/post/create.controller");
const { GetByIdController } = require("../controllers/post/getById.controller");
const { GetAllController } = require("../controllers/post/getAll.controller");
const { UpdateController } = require("../controllers/post/update.controller");
const { uploadMiddleware } = require("../middleware/uploadMiddleware");
const {
  UpdateLikeController,
} = require("../controllers/post/updateLike.controller");

const router = Router();
const upload = uploadMiddleware().single("post_images");

// like
router.post("/:post_id/like", UpdateLikeController);

// post
router.post("/create", upload, CreatePostController);
router.post("/update", UpdateController);
router.get("/:user_id", GetByIdController);
router.get("/", GetAllController);

module.exports = router;

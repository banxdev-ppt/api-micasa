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
const {
  UpdateCommentController,
} = require("../controllers/post/updateComment.controller");
const {
  DeletePostController,
} = require("../controllers/post/delete.controller");

const router = Router();
const upload = uploadMiddleware().single("post_images");

// comment
router.post("/:post_id/comment", UpdateCommentController);

// like
router.post("/:post_id/like", UpdateLikeController);

// post
router.post("/create", upload, CreatePostController);
router.post("/:post_id/update", upload, UpdateController);
router.post("/delete/:post_id", DeletePostController);
router.post("/:user_id", GetByIdController);
router.post("/", GetAllController);

module.exports = router;

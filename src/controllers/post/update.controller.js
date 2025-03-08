const { db } = require("../../config/database");
const { formatFilename } = require("../../helper/mangeFile");
const path = require("path");
const fs = require("fs");

exports.UpdateController = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { user_id, post_desc } = req.body;
    const file = req.file;

    if (!post_id || !user_id) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "Missing post_id or user_id",
      });
    }

    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM posts WHERE id = ? AND JSON_UNQUOTE(JSON_EXTRACT(user, '$.user_id')) = ?",
        [post_id, user_id]
      );

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "ไม่พบโพสต์",
      });
    }

    let post_images = JSON.parse(rows[0].post_images || "[]");

    if (post_images.length > 0) {
      const oldImagePath = path.join(
        __dirname,
        "../../uploads/posts",
        post_images[0].images
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    if (file) {
      const post_image_name = await formatFilename(file.originalname, "posts");

      const uploadPath = path.join(
        __dirname,
        "../../uploads/posts",
        post_image_name
      );
      fs.writeFileSync(uploadPath, file.buffer);

      post_images = [{ images: post_image_name }];
    }

    const updatePost = {
      post_desc,
      post_images: JSON.stringify(post_images),
      updated_at: new Date().toISOString(),
    };

    await db
      .promise()
      .query(
        "UPDATE posts SET ? WHERE id = ? AND JSON_UNQUOTE(JSON_EXTRACT(user, '$.user_id')) = ?",
        [updatePost, post_id, user_id]
      );

    res.status(201).json({
      statusCode: 201,
      taskStatus: true,
      message: "อัพเดทโพสต์สำเร็จ",
      data: { post_id, post_desc, post_images },
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
};

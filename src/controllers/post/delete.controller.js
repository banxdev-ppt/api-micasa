const { db } = require("../../config/database");

exports.DeletePostController = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { user_id } = req.body;

    const [post] = await db
      .promise()
      .query(
        "SELECT * FROM posts WHERE id = ? AND JSON_UNQUOTE(JSON_EXTRACT(user, '$.user_id')) = ?",
        [post_id, user_id]
      );
    if (!post.length) {
      return res.status(404).json({
        statusCode: 404,
        taskStatus: false,
        message: "Post not found",
      });
    }

    await db
      .promise()
      .query(
        "DELETE FROM posts WHERE id = ? AND JSON_UNQUOTE(JSON_EXTRACT(user, '$.user_id')) = ?",
        [post_id, user_id]
      );

    res.status(200).json({
      statusCode: 200,
      taskStatus: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
};

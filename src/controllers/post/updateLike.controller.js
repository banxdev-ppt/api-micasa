const { db } = require("../../config/database");

exports.UpdateLikeController = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { userId } = req.body;

    if (!post_id || !userId) {
      return res.status(400).json({
        statusCode: 400,
        taskStatus: false,
        message: "post_id and userId are required",
      });
    }

    const [rows] = await db
      .promise()
      .query("SELECT post_likes FROM posts WHERE id = ?", [post_id]);

    let likes = rows[0]?.post_likes ? JSON.parse(rows[0].post_likes) : [];

    const userIndex = likes.findIndex((like) => like.user_id === userId);

    if (userIndex === -1) {
      likes.push({ user_id: userId });
    } else {
      likes.splice(userIndex, 1);
    }

    const updatedLikes = likes.length ? JSON.stringify(likes) : null;

    await db
      .promise()
      .query("UPDATE posts SET post_likes = ? WHERE id = ?", [
        updatedLikes,
        post_id,
      ]);

    res.json({
      statusCode: 200,
      taskStatus: true,
      message: "Like updated",
      post_likes: likes,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
};

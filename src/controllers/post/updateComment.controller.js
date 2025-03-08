const { db } = require("../../config/database");

exports.UpdateCommentController = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { user_id, user_name, user_profile, comment_text } = req.body;

    if (!post_id || !user_id || !comment_text) {
      return res.status(400).json({
        statusCode: 400,
        taskStatus: false,
        message: "post_id, user_id, and comment_text are required",
      });
    }

    const [rows] = await db
      .promise()
      .query("SELECT post_comments FROM posts WHERE id = ?", [post_id]);

    let comments = rows[0]?.post_comments
      ? JSON.parse(rows[0].post_comments)
      : [];

    const newComment = {
      user_id,
      user_name,
      user_profile,
      comment_text,
      created_at: new Date().toISOString(),
    };

    comments.push(newComment);
    comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const [commentUpdate] = await db
      .promise()
      .query("UPDATE posts SET post_comments = ? WHERE id = ?", [
        JSON.stringify(comments),
        post_id,
      ]);

    if (commentUpdate.affectedRows === 0) {
      return res.status(500).json({
        statusCode: 500,
        taskStatus: false,
        message: "อัพเดตข้อมูลไม่สำเร็จ",
      });
    }

    res.status(200).json({
      statusCode: 200,
      taskStatus: true,
      message: "Comment updated successfully",
      comments,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
};

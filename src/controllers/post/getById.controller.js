const { db } = require("../../config/database");

exports.GetByIdController = async (req, res) => {
  try {
    const { user_id } = req.params;
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM posts WHERE JSON_UNQUOTE(JSON_EXTRACT(user, '$.user_id')) = ? ORDER BY created_at DESC",
        [user_id]
      );

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "คุณยังไม่ได้สร้างโพสต์",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const posts = rows.map((data) => ({
      id: data.id,
      user: JSON.parse(data.user),
      post_type: data.post_type,
      post_desc: data.post_desc,
      post_images: data.post_images
        ? JSON.parse(data.post_images).map((img) => ({
            images: `${baseUrl}/posts/${img.images}`,
          }))
        : [],
      post_likes: data.post_likes ? JSON.parse(data.post_likes) : [],
      post_comments: data.post_comments ? JSON.parse(data.post_comments) : [],
      created_at: data.created_at,
    }));

    return res.status(200).json({
      statusCode: 200,
      taskStatus: true,
      message: `พบข้อมูลโพสต์จำนวน ${posts.length} รายการ`,
      data: posts,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
};

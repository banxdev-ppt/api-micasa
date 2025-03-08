const { uploadFile, formatFilename } = require("../../helper/mangeFile");
const { db } = require("../../config/database");
const path = require("path");
const fs = require("fs");

exports.CreatePostController = async (req, res) => {
  try {
    console.log(req.body);
    const { user_id, user_name, user_profile, post_type, post_desc } = req.body;
    const file = req.file;

    if (!user_id || !user_name || !user_profile || !post_type) {
      return res
        .status(400)
        .json({ statusCode: 400, taskStatus: false, message: "ไม่พบข้อมูล" });
    }

    let postImg = null;
    let fileName = null;

    if (file) {
      fileName = await formatFilename(file.originalname ?? "", "posts");
      const folderPath = path.join(__dirname, "../../uploads/posts");
      const filePath = path.join(folderPath, fileName);

      if (fs.existsSync(filePath)) {
        postImg = null;
      } else {
        postImg = fileName;
      }
    }

    const userData = JSON.stringify({
      user_id: user_id,
      user_name: user_name,
      user_profile: user_profile,
    });
    const imgArray = JSON.stringify([{ images: postImg }]);
    const query =
      "INSERT INTO posts (user, post_type, post_desc, post_images) VALUES (?, ?, ?, ?)";
    const values = [userData, post_type, post_desc, imgArray];
    const [result] = await db.promise().query(query, values);

    const data = { userData, post_type, post_desc, imgArray };

    if (result && file && postImg) {
      const upload_state = await uploadFile("posts", fileName, file.buffer);
      if (!upload_state) {
        return res.status(200).json({
          statusCode: 200,
          taskStatus: false,
          message: "ไม่สามารถอัพโหลดไฟล์ภาพได้",
        });
      }
      return res.status(201).json({
        statusCode: 201,
        taskStatus: true,
        message: "สร้างโพสต์สำเร็จ",
        data,
      });
    } else if (result) {
      return res.status(201).json({
        statusCode: 201,
        taskStatus: true,
        message: "สร้างโพสต์สำเร็จ",
        data,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
};

const { db } = require("../../config/database");

exports.CreateActivityController = async (req, res) => {
  try {
    const {
      user_id,
      fam_id,
      fam_mem_id,
      fam_mem_nickName,
      fam_mem_image,
      menu_id,
      menu_title,
      menu_images,
      menu_category,
      purchase_type,
      status_type,
    } = req.body;

    if (
      !user_id ||
      !fam_id ||
      !fam_mem_id ||
      !menu_id ||
      !purchase_type ||
      !status_type
    ) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message:
          "user_id, fam_id, fam_mem_id, menu_id, purchase_tye, status_type are required",
      });
    }

    const menuData = JSON.stringify({
      menu_id,
      menu_title,
      menu_images,
      menu_category,
    });

    const memberData = JSON.stringify({
      fam_mem_id,
      fam_mem_nickName,
      fam_mem_image,
    });

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO purchases (user_id, fam_id, menu, member, purchase_type, status_type) VALUES (?, ?, ?, ?, ?, ?)",
        [user_id, fam_id, menuData, memberData, purchase_type, status_type]
      );

    if (result.affectedRows > 0) {
      return res.status(201).json({
        statusCode: 201,
        taskStatus: true,
        message: "สร้างกิจกรรมสำเร็จ",
        activity_id: result.insertId,
      });
    } else {
      throw new Error("สร้างกิจกรรมไม่สำเร็จ");
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
};

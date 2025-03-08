const { db } = require("../../config/database");
const { uploadFile, formatFilename } = require("../../helper/mangeFile");
const path = require("path");
const fs = require("fs");

exports.CreateMenuController = async (req, res) => {
  try {
    const { menu_title, menu_category } = req.body;
    const file = req.file;

    if (!menu_title || !menu_category) {
      return res.status(400).json({
        statusCode: 400,
        taskStatus: false,
        message: "ไม่พบ menu_title หรือ menu_category",
      });
    }

    const [existingMenuTitle] = await db
      .promise()
      .query("SELECT * FROM menus WHERE menu_title = ?", [menu_title]);

    if (existingMenuTitle.length > 0) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "ชื่อเมนูนี้ถูกใช้งานแล้ว",
      });
    }

    let menu_image = null;
    let menu_image_name = null;

    if (file) {
      menu_image_name = await formatFilename(file.originalname ?? "", "menus");
      const folderPath = path.join(__dirname, "../../uploads/menus");
      const filePath = path.join(folderPath, menu_image_name);

      if (fs.existsSync(filePath)) {
        menu_image = null;
      } else {
        menu_image = menu_image_name;
      }
    }

    const query =
      "INSERT INTO menus (menu_title, menu_category, menu_image) VALUES (?, ?, ?)";
    const values = [menu_title, menu_category, menu_image];
    const [result] = await db.promise().query(query, values);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        statusCode: 500,
        taskStatus: false,
        message: "สร้างเมนูไม่สำเร็จ",
      });
    }

    const data = { menu_title, menu_category, menu_image };

    if (result && file && menu_image_name) {
      const upload_state = await uploadFile(
        "menus",
        menu_image_name,
        file.buffer
      );
      if (!upload_state) {
        return res.status(200).json({
          statusCode: 200,
          taskStatus: false,
          message: "ไม่สามารถอัพโหลดไฟล์ได้",
        });
      }

      return res.status(201).json({
        statusCode: 201,
        taskStatus: true,
        message: "สร้างเมนูสำเร็จ",
        data,
      });
    } else if (result) {
      return res.status(201).json({
        statusCode: 201,
        taskStatus: true,
        message: "สร้างเมนูสำเร็จ",
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

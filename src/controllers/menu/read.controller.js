const { db } = require("../../config/database");

exports.ReadMenuController = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM menus ORDER BY created_at DESC");

    if (rows.length === 0) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "ไม่มีเมนูในระบบ",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const menus = rows.map((data) => ({
      id: data.id,
      menu_title: data.menu_title,
      menu_category: data.menu_category,
      menu_image: data.menu_image
        ? `${baseUrl}/menus/${data.menu_image}`
        : null,
      created_at: data.created_at,
    }));

    return res.status(200).json({
      statusCode: 200,
      taskStatus: true,
      message: `พบข้อมูลเมนูจำนวน ${menus.length} รายการ`,
      data: menus,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
};

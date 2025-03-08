const { db } = require("../../config/database");

exports.ReadActivityController = async (req, res) => {
  try {
    const { fam_id } = req.params;
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM purchases WHERE fam_id = ? ORDER BY status_type = 1 DESC, created_at DESC",
        [fam_id]
      );

    if (rows.length === 0) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "ไม่พบกิจกรรมในระบบ",
      });
    }

    const activities = rows.map((data) => ({
      id: data.id,
      user_id: data.user_id,
      fam_id: data.fam_id,
      menu: JSON.parse(data.menu),
      member: JSON.parse(data.member),
      purchase_type: data.purchase_type,
      status_type: data.status_type,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }));

    return res.status(200).json({
      statusCode: 200,
      taskStatus: true,
      message: `พบข้อมูลเมนูจำนวน ${activities.length} รายการ`,
      data: activities,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
};

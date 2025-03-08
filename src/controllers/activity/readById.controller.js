const { db } = require("../../config/database");

exports.ReadActivityByIdController = async (req, res) => {
  try {
    const { act_id } = req.params;
    if (!act_id) {
      return res.status(400).json({
        statusCode: 400,
        taskStatus: false,
        message: "act_id is required",
      });
    }

    const [rows] = await db
      .promise()
      .query("SELECT * FROM purchases WHERE id = ?", [act_id]);

    if (rows.length === 0) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "ไม่พบกิจกรรมในระบบ",
      });
    }

    const data = rows[0];

    let menu = null;
    let member = null;
    try {
      menu = data.menu ? JSON.parse(data.menu) : null;
      member = data.member ? JSON.parse(data.member) : null;
    } catch (error) {
      console.error("JSON Parse Error:", error);
    }

    const activity = {
      id: data.id,
      user_id: data.user_id,
      fam_id: data.fam_id,
      menu,
      member,
      purchase_type: data.purchase_type,
      status_type: data.status_type,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return res.status(200).json({
      statusCode: 200,
      taskStatus: true,
      message: "พบข้อมูลกิจกรรม",
      data: activity,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      statusCode: 500,
      taskStatus: false,
      message: error.message,
    });
  }
};

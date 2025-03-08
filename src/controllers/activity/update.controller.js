const { db } = require("../../config/database");

exports.UpdateController = async (req, res) => {
  try {
    const { act_id } = req.params;
    const { completed_at, status_type } = req.body;

    if (!act_id) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "Missing act_id",
      });
    }

    if (!["2", "3"].includes(status_type)) {
      return res.status(400).json({
        statusCode: 400,
        taskStatus: false,
        message: "Invalid status_type value",
      });
    }

    const [rows] = await db
      .promise()
      .query("SELECT * FROM purchases WHERE id = ?", [act_id]);

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "ไม่พบกิจกรรมในระบบ",
      });
    }

    const updateActivity = {
      completed_at: completed_at || new Date().toISOString(),
      status_type: status_type,
    };

    await db
      .promise()
      .query("UPDATE purchases SET ? WHERE id =?", [updateActivity, act_id]);

    res.status(201).json({
      statusCode: 201,
      taskStatus: true,
      message: "บันทึกกิจกรรมสำเร็จ",
      data: updateActivity,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
};

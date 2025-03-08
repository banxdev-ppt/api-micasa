const { db } = require("../../config/database");

exports.joinFamilyController = async (req, res) => {
  try {
    console.log(req.body);
    const { famCode, usrId, nickName, roleId, usrImg } = req.body;

    if (!famCode || !usrId || !nickName || !roleId || !usrImg) {
      return res.status(400).json({
        statusCode: 400,
        taskStatus: false,
        message: "ข้อมูลไม่ครบถ้วน",
      });
    }

    const [rows] = await db
      .promise()
      .query("SELECT famMember FROM families WHERE famCode = ?", [famCode]);

    if (rows.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        taskStatus: false,
        message: "ไม่พบครอบครัว",
      });
    }

    const query = `
      UPDATE families
      SET famMember = JSON_ARRAY_APPEND(famMember, '$', JSON_OBJECT('id', ?, 'roleId', ?, 'nickName', ?, 'usrImg', ?))
      WHERE famCode = ?;
    `;
    const values = [usrId, roleId, nickName, usrImg, famCode];
    const [result] = await db.promise().query(query, values);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        statusCode: 500,
        taskStatus: false,
        message: "เข้าร่วมครอบครัวไม่สำเร็จ",
      });
    }

    const [queryUpdate] = await db
      .promise()
      .query("UPDATE users SET nickName = ?, famCode = ? WHERE id = ?", [
        nickName,
        famCode,
        usrId,
      ]);

    if (queryUpdate.affectedRows === 0) {
      return res.status(500).json({
        statusCode: 500,
        taskStatus: false,
        message: "อัพเดตข้อมูลไม่สำเร็จ",
      });
    }

    return res.status(201).json({
      statusCode: 201,
      taskStatus: true,
      message: "เข้าร่วมครอบครัวสำเร็จ",
      data: { famCode },
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
};

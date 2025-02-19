const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("../../config/database");

async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const [row] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (row.length === 0) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "ไม่พบบัญชีผู้ใช้งาน",
      });
    }

    const data = row[0];
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const profileUrl = data.usrImg
      ? `${baseUrl}/profiles/${data.usrImg}`
      : null;

    const user = {
      id: data.id,
      email: data.email,
      fName: data.fName,
      lName: data.lName,
      nickName: data.nickName,
      gender: data.gender,
      roleId: data.roleId,
      profile: profileUrl,
      famCode: data.famCode,
      created_at: data.created_at,
    };

    const hash = data.password;
    const check_password = await bcrypt.compare(password, hash);

    if (!check_password) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "รหัสผ่านไม่ถูกต้อง",
      });
    }

    const token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: "1d" });
    return res.status(200).json({
      statusCode: 200,
      taskStatus: true,
      message: "เข้าสู่ระบบสำเร็จ",
      data: { user, token },
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
}

module.exports = { loginController };

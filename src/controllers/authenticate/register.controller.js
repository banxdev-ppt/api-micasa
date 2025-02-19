const { formatFilename } = require("../../helper/convertFilename");
const { uploadFile } = require("../../helper/uploadFile");
const path = require("path");
const fs = require("fs");
const { db } = require("../../config/database");
const bcrypt = require("bcryptjs");

async function registerController(req, res) {
  try {
    const { fName, lName, gender, roleId, email, password } = req.body;
    const file = req.file;

    if (!fName || !lName || !gender || !roleId || !email || !password) {
      return res
        .status(200)
        .json({ statusCode: 200, taskStatus: false, message: "ไม่พบข้อมูล" });
    }

    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ? ", [email]);
    if (existingUser.length > 0) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "อีเมลนี้ถูกใช้งานแล้ว",
      });
    }

    const hash_password = await bcrypt.hash(password, 10);

    if (!hash_password) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "ไม่สามารถใช้รหัสผ่านนี้ได้",
      });
    } else {
      let profile = null;
      let fileName = null;

      if (file) {
        fileName = await formatFilename(file.originalname ?? "", "profiles");
        const folderPath = path.join(__dirname, "../../uploads/profiles");
        const filePath = path.join(folderPath, fileName);

        if (fs.existsSync(filePath)) {
          profile = null;
        } else {
          profile = fileName;
        }
      }

      const query =
        "INSERT INTO users (fName, lName, gender, roleId, email, password, usrImg) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [
        fName,
        lName,
        gender,
        roleId,
        email,
        hash_password,
        profile,
      ];
      const [result] = await db.promise().query(query, values);

      const data = { email, password };

      if (result && file && profile) {
        const upload_state = await uploadFile(
          "profiles",
          fileName,
          file.buffer
        );
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
          message: "สมัครสมาชิกสำเร็จ",
          data,
        });
      } else if (result) {
        return res.status(201).json({
          statusCode: 201,
          taskStatus: true,
          message: "สมัครสมาชิกสำเร็จ",
          data,
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
}

module.exports = { registerController };

const { formatFilename } = require("../../helper/convertFilename");
const { uploadFile } = require("../../helper/uploadFile");
const path = require("path");
const fs = require("fs");
const { db } = require("../../config/database");

const generateFamCode = async (db) => {
  const yearLastDigit = new Date().getFullYear().toString().slice(-2);

  const randomLetters = Array(4)
    .fill(null)
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join("");

  const [lastFam] = await db
    .promise()
    .query("SELECT famCode FROM families ORDER BY id DESC LIMIT 1");

  let runningNumber = 1;
  if (lastFam.length > 0) {
    const lastCode = lastFam[0].famCode;
    const lastRunningNumber = parseInt(lastCode.slice(-4), 10);
    runningNumber = lastRunningNumber + 1;
  }

  const formattedRunningNumber = String(runningNumber).padStart(4, "0");

  return `${yearLastDigit}${randomLetters}${formattedRunningNumber}`;
};

async function createFamilyController(req, res) {
  try {
    const { famName, nickName, usrId } = req.body;
    const file = req.file;

    if (!famName || !nickName || !usrId) {
      return res
        .status(400)
        .json({ statusCode: 400, taskStatus: false, message: "ไม่พบข้อมูล" });
    }

    console.log(usrId);
    const [userRows] = await db
      .promise()
      .query("SELECT id, nickName, roleId, usrImg FROM users WHERE id = ?", [
        usrId,
      ]);

    console.log(userRows);
    if (userRows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        taskStatus: false,
        message: "ไม่พบผู้ใช้งาน",
      });
    }

    const userData = userRows[0];

    const [existingFamName] = await db
      .promise()
      .query("SELECT * FROM families WHERE famName = ?", [famName]);

    if (existingFamName.length > 0) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "ชื่อครอบครัวถูกใช้งานแล้ว",
      });
    }

    let profile = null;
    let fileName = null;

    if (file) {
      fileName = await formatFilename(file.originalname ?? "", "families");
      const folderPath = path.join(__dirname, "../../uploads/families");
      const filePath = path.join(folderPath, fileName);

      if (fs.existsSync(filePath)) {
        profile = null;
      } else {
        profile = fileName;
      }
    }

    const famCode = await generateFamCode(db);

    const insert =
      "INSERT INTO families (famName, famCode, famProfile, usrId, famMember) VALUES(?, ?, ?, ?, ?)";
    const values = [
      famName,
      famCode,
      profile,
      usrId,
      JSON.stringify([userData]),
    ];
    const [result] = await db.promise().query(insert, values);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        statusCode: 500,
        taskStatus: false,
        message: "สร้างครอบครัวไม่สำเร็จ",
      });
    }

    const famId = result.insertId;

    await db
      .promise()
      .query(
        "UPDATE users SET nickName = ?, famCode = ?, famId = ? WHERE id = ?",
        [userData.nickName, famCode, famId, usrId]
      );

    const data = { famId, famName, famCode, usrId, userData };

    if (result && file && profile) {
      const upload_state = await uploadFile("families", fileName, file.buffer);
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
        message: "สร้างครอบครัวสำเร็จ",
        data,
      });
    } else if (result) {
      return res.status(201).json({
        statusCode: 201,
        taskStatus: true,
        message: "สร้างครอบครัวสำเร็จ",
        data,
      });
    }

    console.log(user, userData, famName, famCode, nickName);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
}

module.exports = { createFamilyController };
